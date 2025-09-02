const Resolver = require('@forge/resolver');
const api = require('@forge/api');
const resolver = new Resolver();

// Allow posting to Jira Automation Incoming Webhook (default) and any extra hosts via env allowlist
const DEFAULT_ALLOWED_HOSTS = ['automation.atlassian.com', 'api-private.atlassian.com'];
const ALLOWED_WEBHOOK_HOSTS = (process.env.ALLOWED_WEBHOOK_HOSTS || '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

function isHostAllowed(urlStr) {
  try {
    const u = new URL(urlStr);
    return (
      u.protocol === 'https:' &&
      (DEFAULT_ALLOWED_HOSTS.includes(u.host) || ALLOWED_WEBHOOK_HOSTS.includes(u.host))
    );
  } catch (_) {
    return false;
  }
}

// callIncomingWebhook: safely POST to a Jira incoming webhook from backend (no CORS in browser)
// payload: { webhookUrl?: string, body?: any, headers?: Record<string,string>, method?: 'POST'|'PUT', timeoutMs?: number }
resolver.define('callIncomingWebhook', async ({ payload }) => {
  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const {
    webhookUrl = process.env.INCOMING_WEBHOOK_URL,
    body = {},
    headers = {},
    method = 'POST',
    timeoutMs = 8000,
  } = payload || {};

  if (!webhookUrl) {
    throw new Error('webhookUrl is required (or set INCOMING_WEBHOOK_URL variable)');
  }
  if (!isHostAllowed(webhookUrl)) {
    throw new Error('Webhook host not allowed. Add it to ALLOWED_WEBHOOK_HOSTS and manifest external.fetch');
  }

  // Compose headers: JSON by default, support optional bearer from env if not provided
  const finalHeaders = {
    'Content-Type': 'application/json',
  'X-Atlassian-Token': 'no-check',
    ...headers,
  };
  if (!finalHeaders.Authorization && process.env.INCOMING_WEBHOOK_BEARER) {
    finalHeaders.Authorization = `Bearer ${process.env.INCOMING_WEBHOOK_BEARER}`;
  }
  // Support secret header (e.g., X-Automation-Webhook-Token) configured via variables
  const secretHeaderName = process.env.INCOMING_WEBHOOK_HEADER_NAME || 'X-Automation-Webhook-Token';
  if (process.env.INCOMING_WEBHOOK_SECRET && !finalHeaders[secretHeaderName]) {
    finalHeaders[secretHeaderName] = process.env.INCOMING_WEBHOOK_SECRET;
  }

  // Prepare a request echo with redacted headers for diagnostics
  let reqEcho = undefined;
  try {
    const u = new URL(webhookUrl);
    const safeHeaders = Object.fromEntries(Object.entries(finalHeaders).map(([k,v])=>[
      k,
      (k || '').toLowerCase().includes('authorization') || (k || '').toLowerCase().includes('token') || (k || '').toLowerCase().includes('secret')
        ? '***redacted***'
        : v
    ]));
    reqEcho = {
      host: u.host,
      path: u.pathname,
      method,
      headers: safeHeaders,
      body: typeof body === 'string' ? body : body,
    };
  } catch(_) {}

  // Note: @forge/api fetch runs server-side, bypassing browser CORS
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), Math.max(1000, timeoutMs));
  try {
    // Debug logging (redacted)
    try {
      const u = new URL(webhookUrl);
      const safeHeaders = Object.fromEntries(Object.entries(finalHeaders).map(([k,v])=>[
        k,
        (k || '').toLowerCase().includes('authorization') || (k || '').toLowerCase().includes('token') || (k || '').toLowerCase().includes('secret')
          ? '***redacted***'
          : v
      ]));
      console.log('Webhook request', { traceId, host: u.host, path: u.pathname, method, headers: safeHeaders });
    } catch(_) {}
    const res = await api.fetch(webhookUrl, {
      method,
      headers: finalHeaders,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      signal: controller.signal,
    });
    const raw = await res.text();
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch {}
    const payload = parsed || raw;
    try {
      const snippet = typeof payload === 'string' ? payload.slice(0, 300) : payload;
      const hdrs = {};
      try { res.headers && res.headers.forEach && res.headers.forEach((v,k)=>{ hdrs[k] = v; }); } catch{}
      console.log('Webhook response', { traceId, status: res.status, statusText: res.statusText, headers: hdrs, body: snippet });
    } catch(_) {}
  // reqEcho prepared earlier
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body: payload,
      error: res.ok ? undefined : payload,
      request: reqEcho,
      traceId,
      responseHeaders: (()=>{ const o={}; try{ res.headers && res.headers.forEach && res.headers.forEach((v,k)=>o[k]=v);}catch{} return o; })(),
      debug: {
        traceId,
        request: reqEcho,
        responseHeaders: (()=>{ const o={}; try{ res.headers && res.headers.forEach && res.headers.forEach((v,k)=>o[k]=v);}catch{} return o; })(),
      }
    };
  } catch (err) {
    try { console.error('Webhook fetch error', { traceId, error: String(err && err.message ? err.message : err) }); } catch {}
    return {
      ok: false,
      status: 0,
      statusText: 'FETCH_ERROR',
      error: String(err && err.message ? err.message : err),
      traceId,
    };
  } finally {
    clearTimeout(to);
  }
});

// Minimal stub to satisfy manifest reference; replace with your actual Rovo action if used
exports.outageSearch = async () => ({ ok: true, message: 'outageSearch not implemented in this stub.' });

exports.handler = resolver.getDefinitions();
