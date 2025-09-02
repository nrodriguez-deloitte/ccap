// Consolidated exports for Forge handlers used in manifest
const api = require('@forge/api');
const { route, storage } = require('@forge/api');
const { randomUUID } = require('crypto');

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

// Resolver-style handler for Custom UI invoke
export const handler = async (event, context) => {
	// Handle the correct event structure from Custom UI bridge
	const payload = event?.call?.payload || event?.payload;
	if (!payload || !payload.action) {
		return { ok: true };
	}
	
	const { action, params } = payload;
	
	if (action === 'fetchOutages') {
		return await fetchOutages(params);
	}
	if (action === 'aiSearch') {
		return await aiSearchMock(params);
	}
	if (action === 'startRovo') {
		return await startRovo(params, event, context);
	}
	if (action === 'getRovoResult') {
		return await getRovoResult(params);
	}
	return { ok: false, error: 'Unknown action' };
};

// ... existing code ...

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
	// Use a very broad query that should return any issues
	const { jql = 'project = NO and issuetype = "outage incident" ORDER BY updated DESC', maxResults = 25 } = params;
	console.log('fetchOutages called with jql:', jql, 'maxResults:', maxResults);
	
	try {
		// Try to find the custom field id for "Services Impacted" so we can include it
		const servicesFieldId = await getFieldIdByName('Services Impacted');
		if (servicesFieldId) console.log('Detected Services Impacted field id:', servicesFieldId);

		// Use enhanced JQL search endpoint (deprecated /search returns 410)
		const response = await api.asUser().requestJira(route`/rest/api/3/search/jql`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				jql,
				maxResults,
				// Include fields we need; dynamically add Services Impacted custom field if found
				fields: ['summary','status','updated','issuetype','priority'].concat(servicesFieldId ? [servicesFieldId] : [])
			})
		});
		
		console.log('Jira API response status:', response.status);
		
		if (response.status === 200) {
			const data = await response.json();
			const issues = Array.isArray(data.issues) ? data.issues : [];
			console.log('Jira API data issues:', issues.length, 'isLast:', data.isLast);
			
					const items = issues.map(issue => {
						// Extract Services Impacted value if the field was found and present
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
							// TODO: map location once the correct custom field id is confirmed
							location: issue.fields?.customfield_issuelocation || null,
							servicesImpacted,
						};
					});
			
			console.log('Returning items:', items.length, 'items');
			return { ok: true, total: items.length, items, isLast: !!data.isLast };
		} else {
			const errorText = await response.text();
			console.error('Jira API error:', response.status, errorText);
			return { ok: false, error: `API Error: ${response.status} - ${errorText}` };
		}
		
	} catch (error) {
		console.error('fetchOutages error:', error);
		
		// Return test data as fallback
		const testItems = [
			{
				id: '10001',
				key: 'DEMO-1',
				summary: 'Network Outage - Sydney CBD',
				status: 'In Progress',
				updated: new Date().toISOString(),
				type: 'Incident',
				priority: 'Major',
				location: 'Sydney CBD, NSW'
			},
			{
				id: '10002', 
				key: 'DEMO-2',
				summary: 'Fiber Disruption - Melbourne',
				status: 'Open',
				updated: new Date(Date.now() - 2*60*60*1000).toISOString(),
				type: 'Incident',
				priority: 'Significant',
				location: 'Melbourne, VIC'
			},
			{
				id: '10003',
				key: 'DEMO-3', 
				summary: 'Service Degradation - Brisbane',
				status: 'Resolved',
				updated: new Date(Date.now() - 6*60*60*1000).toISOString(),
				type: 'Incident',
				priority: 'Minor',
				location: 'Brisbane, QLD'
			}
		];
		
		console.log('API failed, returning demo items:', testItems.length, 'items');
		return { ok: true, total: testItems.length, items: testItems };
	}
}

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

	const correlationId = genCorrelationId();
	const createdAt = new Date().toISOString();
	// Mark pending in storage
	await storage.set(`rovo:${correlationId}`, {
		status: 'pending',
		createdAt,
		query,
	});

	// Compose payload expected by Automation rule
	const body = {
		correlationId,
		query,
		callbackUrl,
		callbackSecret,
		source: 'forge-outage-dashboard',
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
			'User-Agent': 'ForgeOutage/1.0'
		};
		// Include the Automation webhook token in the expected header; Jira Automation accepts either
		// X-Automation-Webhook-Token or Authorization: Bearer <token>. Send both for compatibility.
		if (automationSecret) {
			headers['X-Automation-Webhook-Token'] = automationSecret;
			headers['X-Webhook-Token'] = automationSecret; // legacy/alt header some setups expect
			headers['X-Webhook-Secret'] = automationSecret; // legacy/alt header used earlier
			headers['X-Authorization'] = automationSecret; // some Automation variants document this header
			headers['X-Atlassian-Token'] = 'no-check'; // harmless, avoids CSRF checks in some proxies
			headers['Authorization'] = `Bearer ${automationSecret}`;
			// Also include in body as a last-resort field for custom rules that read it
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
		console.error('startRovo: automation webhook non-2xx', status, text);
		return { ok: false, error: `Automation webhook error ${status}: ${text}` };
	} catch (err) {
		console.error('startRovo: fetch error', err);
		return { ok: false, error: 'Failed to call Automation webhook' };
	}
}

export const rovoCallback = async (event, context) => {
	// Web trigger receiving callback from Automation after Rovo agent completes
	const secretRequired = !!process.env.ROVO_CALLBACK_SECRET;
	const expectedSecret = process.env.ROVO_CALLBACK_SECRET || '';

	// Web trigger events provide raw body as string
	let bodyText = event?.body || '';
	// Some runtimes wrap payload under payload.body
	if (!bodyText && event?.payload?.body) {
		bodyText = event.payload.body;
	}
	let data;
	try {
		data = bodyText ? JSON.parse(bodyText) : {};
	} catch (e) {
		return {
			statusCode: 400,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
		};
	}

	const headerSecret = (event?.headers?.['x-rovo-secret'] || event?.headers?.['X-ROVO-SECRET'] || event?.headers?.['x-webhook-secret'] || '').trim();
	if (secretRequired && headerSecret !== expectedSecret) {
		return {
			statusCode: 401,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ok: false, error: 'Unauthorized' }),
		};
	}

	const correlationId = String(data?.correlationId || '').trim();
	if (!correlationId) {
		return {
			statusCode: 400,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ok: false, error: 'Missing correlationId' }),
		};
	}

	// Extract followUp from embedded JSON possibly present in `data` (often wrapped in ```json fences)
	const tryParseEmbedded = (s) => {
		if (typeof s !== 'string' || !s.trim()) return null;
		let t = s.trim();
		t = t.replace(/^```[a-zA-Z]*\n?/i, '').replace(/```\s*$/i, '');
		t = t.replace(/^```json\s*\{/, '{');
		const first = t.indexOf('{');
		const last = t.lastIndexOf('}');
		if (first >= 0 && last > first) t = t.slice(first, last + 1);
		try { return JSON.parse(t); } catch { return null; }
	};
	let followUp = (typeof data?.followUp === 'string' && data.followUp.trim()) ? data.followUp.trim() : null;
	let itemsFromEmbedded = null;
	let cardsFromEmbedded = Array.isArray(data?.cards) ? data.cards : null;
	if (!followUp) {
		const embedded = typeof data?.data === 'string' ? tryParseEmbedded(data.data) : (typeof data?.data === 'object' && data?.data ? data.data : null);
		if (embedded && typeof embedded === 'object') {
			if (typeof embedded.followUp === 'string' && embedded.followUp.trim()) followUp = embedded.followUp.trim();
			if (Array.isArray(embedded.items)) itemsFromEmbedded = embedded.items;
			if (!cardsFromEmbedded && Array.isArray(embedded.cards)) cardsFromEmbedded = embedded.cards;
			try { console.log('rovoCallback[index]: embedded parsed. items:', Array.isArray(embedded.items)?embedded.items.length:0, 'cards:', Array.isArray(embedded.cards)?embedded.cards.length:0); } catch {}
		}
		if (!followUp && typeof bodyText === 'string') {
			const m = bodyText.match(/"followUp"\s*:\s*"([\s\S]*?)"\s*[},]/i);
			if (m && m[1]) followUp = m[1].trim();
		}
	}

	const result = {
		status: 'done',
		receivedAt: new Date().toISOString(),
		query: data?.query || null,
		// Result payload can include fields for the chat UI
		followUp: followUp || null,
		items: Array.isArray(data?.items) ? data.items : (Array.isArray(itemsFromEmbedded) ? itemsFromEmbedded : null),
		cards: Array.isArray(data?.cards) ? data.cards : (Array.isArray(cardsFromEmbedded) ? cardsFromEmbedded : null),
		// Avoid dumping entire body text if a friendly followUp exists
		text: followUp ? null : (typeof data?.text === 'string' ? data.text : null),
		raw: data,
	};

	await storage.set(`rovo:${correlationId}`, result);

	return {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ok: true }),
	};
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
