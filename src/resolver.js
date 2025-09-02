// Consolidated exports for Forge handlers used in manifest
const api = require('@forge/api');
const { route, storage } = require('@forge/api');
const { randomUUID } = require('crypto');

// --- Chat history utilities ---
const HISTORY_MAX = 20; // cap persisted messages per session

async function getSessionHistory(sessionId) {
    if (!sessionId) return [];
    const key = `chat:session:${sessionId}`;
    const hist = await storage.get(key);
    return Array.isArray(hist) ? hist : [];
}

async function setSessionHistory(sessionId, history) {
    if (!sessionId) return;
    const key = `chat:session:${sessionId}`;
    const trimmed = Array.isArray(history) ? history.slice(-HISTORY_MAX) : [];
    await storage.set(key, trimmed);
}

async function appendHistory(sessionId, entry) {
    if (!sessionId) return;
    const hist = await getSessionHistory(sessionId);
    hist.push(entry);
    await setSessionHistory(sessionId, hist);
}

async function linkCorrelation(correlationId, sessionId, messageId) {
    if (!correlationId || !sessionId) return;
    await storage.set(`chat:index:${correlationId}`, {
        sessionId,
        messageId: messageId || null,
        at: new Date().toISOString(),
    });
}

async function getCorrelationLink(correlationId) {
    if (!correlationId) return null;
    return await storage.get(`chat:index:${correlationId}`);
}

function trimHistoryForAutomation(history = []) {
    // Keep the last 8 messages for context; redacts heavy payloads
    const last = history.slice(-8);
    return last.map(m => ({
        role: m.role,
        text: typeof m.text === 'string' ? m.text : null,
        followUp: typeof m.followUp === 'string' ? m.followUp : null,
        cards: Array.isArray(m.cards) ? m.cards.slice(0, 2).map(c => ({
            type: c.type,
            key: c.key || c.outageKey || null,
            summary: c.summary || c.title || null,
            severity: c.severity || null,
        })) : null,
        at: m.at,
        correlationId: m.correlationId || null,
        messageId: m.messageId || null,
    }));
}

// --- Jira search helpers (copied to ensure resolver exports are self-contained) ---
async function getFieldIdByName(name) {
    try {
        const res = await api.asUser().requestJira(route`/rest/api/3/field`);
        if (res.status !== 200) {
            console.warn('getFieldIdByName: field list status', res.status);
            return null;
        }
        const fields = await res.json();
        const match = Array.isArray(fields) ? fields.find(f => String(f.name).toLowerCase() === String(name).toLowerCase()) : null;
        return match ? match.id : null;
    } catch (e) {
        console.warn('getFieldIdByName error:', e?.message || String(e));
        return null;
    }
}

async function fetchOutages(params = {}){
    const { jql = 'project = NO and issuetype = "outage incident" ORDER BY updated DESC', maxResults = 25 } = params;
    console.log('fetchOutages[resolver] jql:', jql, 'maxResults:', maxResults);
    try {
        const servicesFieldId = await getFieldIdByName('Services Impacted');
        const response = await api.asUser().requestJira(route`/rest/api/3/search/jql`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ jql, maxResults, fields: ['summary','status','updated','issuetype','priority'].concat(servicesFieldId ? [servicesFieldId] : []) })
        });
        if (response.status !== 200) {
            const t = await response.text();
            return { ok: false, error: `API Error: ${response.status} - ${t}` };
        }
        const data = await response.json();
        const issues = Array.isArray(data.issues) ? data.issues : [];
        const items = issues.map(issue => {
            let servicesImpacted = null;
            if (servicesFieldId && issue.fields && Object.prototype.hasOwnProperty.call(issue.fields, servicesFieldId)) {
                const raw = issue.fields[servicesFieldId];
                if (typeof raw === 'number' && Number.isFinite(raw)) servicesImpacted = raw;
                else if (typeof raw === 'string') {
                    const digits = raw.replace(/[^0-9]/g, '');
                    servicesImpacted = digits ? parseInt(digits, 10) : null;
                }
            }
            return {
                id: issue.id,
                key: issue.key,
                summary: issue.fields?.summary,
                status: issue.fields?.status?.name,
                updated: issue.fields?.updated,
                type: issue.fields?.issuetype?.name,
                priority: issue.fields?.priority?.name,
                location: issue.fields?.customfield_issuelocation || null,
                servicesImpacted,
            };
        });
        return { ok: true, total: items.length, items, isLast: !!data.isLast };
    } catch (error) {
        console.error('fetchOutages[resolver] error:', error);
        return { ok: true, total: 0, items: [] };
    }
}

// Rovo Agent action function (for manifest action handler)
export const outageSearch = async (payload) => {
    const q = payload?.inputs?.query || '';
    const normalized = String(q).trim();
    if (!normalized) {
        return 'Please provide a short question, for example: "Show major outages in NSW identified today"';
    }
    const example = [
        { incidentId: 'IM1830485', severity: 'Major', location: 'Parramatta, NSW', identified: '6 hours ago' },
        { incidentId: 'IM2047001', severity: 'Significant', location: 'Sydney CBD, NSW', identified: '2 hours ago' },
    ];
    return `Here are two sample results for: "${normalized}"\n` +
        example.map((e) => `• ${e.incidentId} — ${e.severity} — ${e.location} — identified ${e.identified}`).join('\n');
};

// Resolver entry for Custom UI bridge
export const handler = async (event, context) => {
    const payload = event?.call?.payload || event?.payload;
    if (!payload || !payload.action) {
        return { ok: true };
    }
    const { action, params } = payload;
    if (action === 'fetchOutages') return await fetchOutages(params);
    if (action === 'aiSearch') return await aiSearchMock(params);
    if (action === 'startRovo') return await startRovo(params, event, context);
    if (action === 'getRovoResult') return await getRovoResult(params);
    return { ok: false, error: 'Unknown action' };
};

// Mocked AI search results to support rich UI cards in the frontend
async function aiSearchMock(params = {}){
    const query = String(params?.query || '').trim();
    console.log('aiSearchMock query:', query);
    // Simple mock: return two Port Lincoln outages similar to the prototype
    const now = new Date();
    const base = {
        location: 'Port Lincoln, SA',
        acma: 'Significant',
    };
    const items = [
        {
            key: 'INC20385',
            summary: 'Port Lincoln Outage INC20385',
            status: 'Resolved',
            updated: new Date(now.getTime() - 1000*60*60*24*3).toISOString(),
            created: '2025-02-02T09:00:00.000Z',
            type: 'Incident',
            priority: 'Significant',
            location: base.location,
            servicesImpacted: 3500,
            description: 'Multiple SIP KPI rate increased and observed 17K VOLTE calls failures (17% from 3.5%) traversing towards Rochedale vSBG, NAT Trunk configuration between cisco switch rdl4cr2.nx and mobile core PE’s got modified during change C301384',
            labels: ['Regional','Resolved'],
        },
        {
            key: 'INC20397',
            summary: 'Port Lincoln Outage INC20397',
            status: 'Resolved',
            updated: new Date(now.getTime() - 1000*60*60*24*2).toISOString(),
            created: '2025-02-08T11:00:00.000Z',
            type: 'Incident',
            priority: 'Non-ACMA',
            location: base.location,
            servicesImpacted: 745,
            description: 'Power outage triggered a system failure and required a restart.',
            labels: ['Regional','Resolved'],
        }
    ];
    return {
        ok: true,
        followUp: 'There were two outages in Port Lincoln around 7 months ago, which one were you referring to?',
        items,
    };
}

// --- Rovo Integration via Jira Automation + Web Trigger ---

function genCorrelationId() {
    try {
        return randomUUID();
    } catch (e) {
        return `corr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }
}

async function startRovo(params = {}, event, context) {
    const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL;
    if (!webhookUrl) {
        return { ok: false, error: 'Missing AUTOMATION_WEBHOOK_URL environment variable' };
    }
    const automationSecret = process.env.AUTOMATION_WEBHOOK_SECRET || null;
    const callbackUrl = process.env.ROVO_CALLBACK_URL || null;
    if (!callbackUrl) {
        console.warn('startRovo: ROVO_CALLBACK_URL is not set; Automation will be unable to callback.');
    }
    const callbackSecret = process.env.ROVO_CALLBACK_SECRET || null;
    const query = String(params?.query || '').trim();
    if (!query) return { ok: false, error: 'Query is required' };

    console.log('startRovo[resolver] entered');

    // Session/message identity from UI (optional, improves multi-tab safety and history)
    const sessionId = (params && typeof params.sessionId === 'string' && params.sessionId.trim()) ? params.sessionId.trim() : null;
    const messageId = (params && typeof params.messageId === 'string' && params.messageId.trim()) ? params.messageId.trim() : null;

    const correlationId = genCorrelationId();
    const createdAt = new Date().toISOString();
    // Mark pending in storage
    await storage.set(`rovo:${correlationId}`, {
        status: 'pending',
        createdAt,
        query,
        sessionId: sessionId || null,
        messageId: messageId || null,
    });

    // Link correlation → (sessionId, messageId) to resolve on callback
    await linkCorrelation(correlationId, sessionId, messageId);

    // Append user message to session history
    if (sessionId) {
        await appendHistory(sessionId, {
            role: 'user',
            text: query,
            at: createdAt,
            correlationId,
            messageId: messageId || null,
        });
    }

    // Compose payload expected by Automation rule
    const history = sessionId ? trimHistoryForAutomation(await getSessionHistory(sessionId)) : [];
    const body = {
        correlationId,
        query,
        callbackUrl,
        callbackSecret,
        source: 'forge-outage-dashboard',
        sessionId,
        messageId,
        history,
        // Optional: pass limited user context if available for auditing
        user: {
            accountId: event?.context?.accountId || null,
        },
    };

    try {
        // Early high-visibility env log (no secrets)
        try {
            const host = (() => { try { return new URL(webhookUrl).host; } catch { return null; } })();
            console.error('startRovo env:', JSON.stringify({
                hasWebhookUrl: !!webhookUrl,
                hasAutomationSecret: !!automationSecret,
                webhookHost: host,
            }));
        } catch (_e0) { /* ignore */ }

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'ForgeOutage/1.0',
        };
        if (automationSecret) {
            headers['X-Automation-Webhook-Token'] = automationSecret;
            headers['X-Webhook-Token'] = automationSecret; // legacy/alt header some setups expect
            headers['X-Webhook-Secret'] = automationSecret; // legacy/alt header used earlier
            headers['X-Authorization'] = automationSecret; // some Automation variants document this header
            headers['X-Atlassian-Token'] = 'no-check'; // harmless, avoids CSRF checks in some proxies
            headers['Authorization'] = `Bearer ${automationSecret}`;
            // Include in body as last-resort for custom rules that read it
            body.token = automationSecret;
        }

        // Build request URL; include token as query param for maximum compatibility
        let requestUrl = webhookUrl;
        try {
            const u = new URL(webhookUrl);
            if (automationSecret && !u.searchParams.has('token')) {
                u.searchParams.set('token', automationSecret);
            }
            requestUrl = u.toString();
        } catch (_eurl) {
            // ignore malformed URL; fallback to original
        }

        // Safe diagnostics (no secrets): log URL, headers, body (redacted)
        try {
            const urlObj = (() => { try { return new URL(requestUrl); } catch { return null; } })();
            const redactedUrl = (() => {
                if (!urlObj) return '(invalid url)';
                if (urlObj.searchParams.has('token')) {
                    urlObj.searchParams.set('token', '***');
                }
                return urlObj.toString();
            })();
            const safeHeaders = Object.fromEntries(Object.entries(headers).map(([k, v]) => {
                const key = String(k).toLowerCase();
                if (key.includes('authorization') || key.includes('token') || key.includes('secret')) {
                    return [k, '***'];
                }
                return [k, v];
            }));
            const safeBody = (() => {
                const copy = { ...body };
                if (copy.token) copy.token = '***';
                if (copy.callbackSecret) copy.callbackSecret = '***';
                return copy;
            })();
            console.log('startRovo request preview:', JSON.stringify({
                url: redactedUrl,
                headers: safeHeaders,
                body: safeBody,
                env: {
                    hasAutomationSecret: !!automationSecret,
                    webhookHost: urlObj ? urlObj.host : null,
                }
            }));
        } catch (_edbg) { /* ignore */ }

        const res = await api.fetch(requestUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        const status = res.status;
        if (status >= 200 && status < 300) {
            // Store the Automation acknowledgement if any
            let ack = null;
            try { ack = await res.json(); } catch (_e) { /* ignore */ }
            if (ack) {
                await storage.set(`rovo:${correlationId}:ack`, { ack, at: new Date().toISOString() });
            }
            return { ok: true, correlationId };
        }
        const text = await res.text();
        // Some Incoming Webhook endpoints expect the token as a query param instead of header
        if (status === 400 && typeof text === 'string' && text.toLowerCase().includes('missing token') && automationSecret) {
            try {
                const url = new URL(webhookUrl);
                if (!url.searchParams.has('token')) {
                    url.searchParams.set('token', automationSecret);
                    const res2 = await api.fetch(url.toString(), {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(body),
                    });
                    if (res2.status >= 200 && res2.status < 300) {
                        let ack2 = null;
                        try { ack2 = await res2.json(); } catch (_e2) { /* ignore */ }
                        if (ack2) {
                            await storage.set(`rovo:${correlationId}:ack`, { ack: ack2, at: new Date().toISOString() });
                        }
                        return { ok: true, correlationId };
                    }
                }
            } catch (_eurl) { /* ignore */ }
        }
    console.error('startRovo[resolver]: automation webhook non-2xx', status, text);
        return { ok: false, error: `Automation webhook error ${status}: ${text}` };
    } catch (err) {
    console.error('startRovo[resolver]: fetch error', err);
        return { ok: false, error: 'Failed to call Automation webhook' };
    }
}

export const rovoCallback = async (event, _context) => {
    // 1) Header validation
    const headers = event?.headers || {};
    const getHeader = (name) => {
        const key = Object.keys(headers).find(k => String(k).toLowerCase() === String(name).toLowerCase());
        if (!key) return '';
        const v = headers[key];
        return Array.isArray(v) ? String(v[0] || '').trim() : String(v || '').trim();
    };
    // Safe request preview (redact secrets)
    try {
        const safeHeaders = Object.fromEntries(Object.entries(headers).map(([k, v]) => {
            const key = String(k).toLowerCase();
            if (key.includes('authorization') || key.includes('token') || key.includes('secret')) return [k, '***'];
            return [k, v];
        }));
        const bt = typeof (event?.body) === 'string' ? event.body : (event?.payload?.body || '');
        let safeBodyText = typeof bt === 'string' ? bt : String(bt || '');
        safeBodyText = safeBodyText
            .replace(/("token"\s*:\s*")[^"]+("?)/ig, '$1***$2')
            .replace(/("callbackSecret"\s*:\s*")[^"]+("?)/ig, '$1***$2');
        console.log('rovoCallback request preview:', JSON.stringify({
            headers: safeHeaders,
            hasBody: !!bt,
            contentType: getHeader('content-type') || null,
            body: safeBodyText,
        }));
    } catch (_e) { /* ignore */ }
    const corrFromHeader = getHeader('x-correlation-id');
    const secretFromHeader = getHeader('x-rovo-secret');
    const strict = String(process.env.ROVO_CALLBACK_STRICT || '').toLowerCase() === 'true';
    if (!!process.env.ROVO_CALLBACK_SECRET) {
        if (!secretFromHeader || secretFromHeader !== process.env.ROVO_CALLBACK_SECRET) {
            if (strict) {
                return { statusCode: 401, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'Unauthorized' }) };
            } else {
                try { console.warn('rovoCallback: WARNING - secret mismatch (continuing in non-strict mode)'); } catch {}
            }
        }
    }

    // 2) Strict JSON body parsing
    let bodyText = event?.body || event?.payload?.body || '';
    if (typeof bodyText !== 'string') bodyText = String(bodyText || '');
    let body;
    let salvage = false;
    try {
        body = bodyText.trim() ? JSON.parse(bodyText) : {};
    } catch (e) {
        salvage = true;
        body = {};
        try {
            const ct = getHeader('content-type') || null;
            let preview = typeof bodyText === 'string' ? bodyText : String(bodyText || '');
            preview = preview
                .replace(/("token"\s*:\s*")[^"]+("?)/ig, '$1***$2')
                .replace(/("callbackSecret"\s*:\s*")[^"]+("?)/ig, '$1***$2');
            if (preview.length > 1200) preview = preview.slice(0, 1200) + '…';
            console.warn('rovoCallback: JSON.parse failed:', (e && e.message) ? e.message : String(e));
            console.warn('rovoCallback: body preview (redacted):', preview);
            console.warn('rovoCallback: meta:', { length: (typeof bodyText === 'string' ? bodyText.length : 0), contentType: ct });
            console.warn('rovoCallback: Invalid JSON body; continuing in salvage mode using headers only');
        } catch {}
    }

    // 3) Correlation id: prefer header, fallback to body
    const correlationId = corrFromHeader || String(body?.correlationId || '').trim();
    if (!correlationId) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'Missing correlationId' }) };
    }
    try { console.log('rovoCallback: correlation header:', corrFromHeader || null, 'chosen:', correlationId, 'secret header present:', !!secretFromHeader); } catch {}

    // Helper: parse embedded `data` content that may be a string containing fenced JSON
    const parseEmbedded = (val) => {
        if (!val) return null;
        if (typeof val === 'object') return val;
        if (typeof val === 'string') {
            let s = val.trim();
            // Drop everything before first '{' and after last '}' to ignore fences or prose
            const first = s.indexOf('{');
            const last = s.lastIndexOf('}');
            if (first >= 0 && last > first) s = s.slice(first, last + 1);
            // Try up to two parses to handle double-encoded JSON
            try {
                const once = JSON.parse(s);
                if (typeof once === 'string') {
                    try { return JSON.parse(once); } catch { return null; }
                }
                return once;
            } catch {
                return null;
            }
        }
        return null;
    };

    // If salvage mode (body JSON invalid), attempt to extract fenced JSON from the raw body
    if (salvage) {
        const extractJsonFromRaw = (raw) => {
            if (typeof raw !== 'string' || !raw) return null;
            // Trim and drop leading code fence if present
            let s = raw;
            const fenceIdx = s.indexOf('```');
            if (fenceIdx >= 0) s = s.slice(fenceIdx + 3);
            // Find first '{'
            const start = s.indexOf('{');
            if (start < 0) return null;
            // Walk to find matching closing '}' with a simple brace counter; ignore braces in strings
            let depth = 0;
            let inStr = false;
            let esc = false;
            for (let i = start; i < s.length; i++) {
                const ch = s[i];
                if (inStr) {
                    if (esc) { esc = false; continue; }
                    if (ch === '\\') { esc = true; continue; }
                    if (ch === '"') { inStr = false; continue; }
                } else {
                    if (ch === '"') { inStr = true; continue; }
                    if (ch === '{') depth++;
                    else if (ch === '}') {
                        depth--;
                        if (depth === 0) {
                            const jsonSlice = s.slice(start, i + 1);
                            try { return JSON.parse(jsonSlice); } catch { return null; }
                        }
                    }
                }
            }
            return null;
        };

        const embedded = extractJsonFromRaw(bodyText);
        if (embedded && typeof embedded === 'object') {
            const followUp = (typeof embedded.followUp === 'string' && embedded.followUp.trim()) ? embedded.followUp.trim() : null;
            const items = Array.isArray(embedded.items) ? embedded.items : null;
            const cards = Array.isArray(embedded.cards) ? embedded.cards : null;
            const rovoResponse = (typeof embedded.rovoResponse === 'string' && embedded.rovoResponse.trim()) ? embedded.rovoResponse.trim() : null;
            const kpis = (embedded.kpis && typeof embedded.kpis === 'object') ? embedded.kpis : null;
            const filters = (embedded.filters && typeof embedded.filters === 'object') ? embedded.filters : null;
            // Try to resolve session/message for history append
            let sessionId = typeof embedded.sessionId === 'string' ? embedded.sessionId : null;
            let messageId = typeof embedded.messageId === 'string' ? embedded.messageId : null;
            if (!sessionId) {
                const link = await getCorrelationLink(correlationId);
                if (link && link.sessionId) {
                    sessionId = link.sessionId;
                    if (!messageId) messageId = link.messageId || null;
                }
            }
            const result = {
                status: 'done',
                receivedAt: new Date().toISOString(),
                query: null,
                followUp,
                items,
                cards,
                text: null,
                rovoResponse: rovoResponse || null,
                kpis: kpis || null,
                filters: filters || null,
                sessionId: sessionId || null,
                messageId: messageId || null,
                raw: { error: 'invalid-json-salvaged', embedded },
            };
            try { console.warn('rovoCallback: salvage parsed embedded JSON. cards:', Array.isArray(cards)?cards.length:0, 'items:', Array.isArray(items)?items.length:0); } catch {}
            // Append assistant reply to session history
            if (sessionId) {
                const assistantEntry = {
                    role: 'assistant',
                    followUp: result.followUp || null,
                    text: (result.rovoResponse || result.text || null),
                    cards: Array.isArray(result.cards) ? result.cards.slice(0, 3) : null,
                    at: result.receivedAt,
                    correlationId,
                    messageId: messageId || null,
                };
                try { await appendHistory(sessionId, assistantEntry); } catch (e) { console.warn('rovoCallback: appendHistory failed (salvage)', e?.message || String(e)); }
            }
            try { await storage.set(`rovo:${correlationId}`, result); } catch (e) { console.error('rovoCallback: salvage storage.set failed', e); }
            return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
        }

        // Last resort: store minimal stub so UI can stop polling
        const result = {
            status: 'done',
            receivedAt: new Date().toISOString(),
            query: null,
            followUp: null,
            items: null,
            cards: null,
            text: null,
            raw: { error: 'invalid-json', bodyText },
        };
        try { console.warn('rovoCallback: salvage store (no embedded JSON) for key:', `rovo:${correlationId}`); } catch {}
        try { await storage.set(`rovo:${correlationId}`, result); } catch (e) { console.error('rovoCallback: salvage storage.set failed', e); }
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    }

    const embedded = parseEmbedded(body?.data);
    const followUp = (embedded && typeof embedded.followUp === 'string' && embedded.followUp.trim())
        ? embedded.followUp.trim()
        : (typeof body?.followUp === 'string' && body.followUp.trim() ? body.followUp.trim() : null);
    const rovoResponse = (embedded && typeof embedded.rovoResponse === 'string' && embedded.rovoResponse.trim())
        ? embedded.rovoResponse.trim()
        : (typeof body?.rovoResponse === 'string' && body.rovoResponse.trim() ? body.rovoResponse.trim() : null);
    const cards = Array.isArray(embedded?.cards) ? embedded.cards : (Array.isArray(body?.cards) ? body.cards : []);
    const items = Array.isArray(embedded?.items) ? embedded.items : (Array.isArray(body?.items) ? body.items : []);
    const text = followUp ? null : (typeof body?.text === 'string' ? body.text : null);
    const kpis = (embedded && embedded.kpis && typeof embedded.kpis === 'object') ? embedded.kpis
        : (body && body.kpis && typeof body.kpis === 'object' ? body.kpis : null);
    const filters = (embedded && embedded.filters && typeof embedded.filters === 'object') ? embedded.filters
        : (body && body.filters && typeof body.filters === 'object' ? body.filters : null);

    // Resolve session/message for history append
    let sessionId = (typeof body?.sessionId === 'string' && body.sessionId) ? body.sessionId : null;
    let messageId = (typeof body?.messageId === 'string' && body.messageId) ? body.messageId : null;
    if (!sessionId) {
        const link = await getCorrelationLink(correlationId);
        if (link && link.sessionId) {
            sessionId = link.sessionId;
            if (!messageId) messageId = link.messageId || null;
        }
    }

    try {
        console.log('rovoCallback: parsed (clean). hasEmbedded:', !!embedded, 'followUp:', !!followUp, 'items:', items.length, 'cards:', cards.length);
    } catch {}
    const result = {
        status: 'done',
        receivedAt: new Date().toISOString(),
        query: body?.query || null,
        followUp,
        items: items.length ? items : null,
        cards: cards.length ? cards : null,
        text,
        rovoResponse: rovoResponse || null,
        kpis: kpis || null,
        filters: filters || null,
        sessionId: sessionId || null,
        messageId: messageId || null,
        raw: body,
    };

    // Append assistant reply to session history
    if (sessionId) {
        const assistantEntry = {
            role: 'assistant',
            followUp: result.followUp || null,
            text: (result.rovoResponse || result.text || null),
            cards: Array.isArray(result.cards) ? result.cards.slice(0, 3) : null,
            at: result.receivedAt,
            correlationId,
            messageId: messageId || null,
        };
        try { await appendHistory(sessionId, assistantEntry); } catch (e) { console.warn('rovoCallback: appendHistory failed', e?.message || String(e)); }
    }

    try {
    console.log('rovoCallback: storing result for key:', `rovo:${correlationId}`, '- followUp:', !!result.followUp, 'items:', Array.isArray(result.items)?result.items.length:0, 'cards:', Array.isArray(result.cards)?result.cards.length:0);
        await storage.set(`rovo:${correlationId}`, result);
    } catch (e) { console.error('rovoCallback: storage.set failed', e); }
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
};

async function getRovoResult(params = {}) {
    const correlationId = String(params?.correlationId || '').trim();
    if (!correlationId) return { ok: false, error: 'correlationId is required' };

    const existing = await storage.get(`rovo:${correlationId}`);
    if (!existing) {
        // Not yet available
        return { ok: true, status: 'pending' };
    }
    return { ok: true, status: existing.status || 'done', result: existing };
}
