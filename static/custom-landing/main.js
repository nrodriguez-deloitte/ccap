// Minimal vanilla JS landing screen with full-page gradient background
(function(){

  // Sample outage data (shared across views)
  const outagesData = [
      {
        id: 'INC20485',
        type: 'Major',
        location: 'NYC',
        consumers: 90000,
        stages: [
          {
            name: 'Stage 1',
            time: '19:00 01/02/2025',
            consumers: 90000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Website', status: 'Updated', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
          {
            name: 'Stage 2',
            time: '19:00 01/02/2025',
            consumers: 300000,
            comms: [
              { channel: 'Email comms', status: 'Exceed', icon: 'exclaim' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
          {
            name: 'Stage 3',
            time: '21:00 01/02/2025',
            consumers: 90000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
          {
            name: 'Stage 4',
            time: '23:00 01/02/2025',
            consumers: 90000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ]
      },
      {
        id: 'INC20486',
        type: 'Minor',
        location: 'LA',
        consumers: 12000,
        stages: [
          {
            name: 'Stage 1',
            time: '20:00 01/02/2025',
            consumers: 12000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ],
      },
      {
        id: 'INC20487',
        type: 'Major',
        location: 'NYC',
        consumers: 145000,
        stages: [
          {
            name: 'Stage 1',
            time: '22:00 01/02/2025',
            consumers: 145000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Website', status: 'Updated', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ],
      },
      {
        id: 'INC20488',
        type: 'Minor',
        location: 'LA',
        consumers: 18000,
        stages: [
          {
            name: 'Stage 1',
            time: '23:30 01/02/2025',
            consumers: 18000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ],
      },
      {
        id: 'INC20489',
        type: 'Major',
        location: 'NYC',
        consumers: 210000,
        stages: [
          {
            name: 'Stage 1',
            time: '07:45 02/02/2025',
            consumers: 210000,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Website', status: 'Updated', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ],
      },
      {
        id: 'INC20490',
        type: 'Minor',
        location: 'LA',
        consumers: 9500,
        stages: [
          {
            name: 'Stage 1',
            time: '09:10 02/02/2025',
            consumers: 9500,
            comms: [
              { channel: 'Email comms', status: 'Sent', icon: 'tick' },
              { channel: 'SMS comms', status: 'Sent', icon: 'tick' },
              { channel: 'Spatial Buzz', status: 'Sent', icon: 'tick' },
              { channel: 'ServiceNow', status: 'Sent', icon: 'tick' },
            ],
          },
        ],
      },
    ];
  const $ = (sel, parent=document) => parent.querySelector(sel);

  const actions = [
    { key: 'ai', label: 'AI Search', icon: svgIcon('bolt') },
    { key: 'map', label: 'Map', icon: svgIcon('pin') },
    { key: 'outages', label: 'Outages', icon: svgIcon('alert') },
    { key: 'records', label: 'Records', icon: svgIcon('doc') },
    { key: 'templates', label: 'Templates', icon: svgIcon('template') },
    { key: 'create', label: 'Create comms', icon: svgIcon('plus') },
  ];

  const root = document.createElement('div');
  root.className = 'container';
  $('#app').appendChild(root);

  function renderTopActions(){
    const el = document.createElement('div');
    el.className = 'top-actions';
    el.innerHTML = actions.map(a => `
      <div class="action" data-key="${a.key}">
        <button aria-label="${a.label}">${a.icon}</button>
        <div>${a.label}</div>
      </div>
    `).join('');
    el.addEventListener('click', (e) => {
      const a = e.target.closest('.action');
      if (!a) return;
      const key = a.getAttribute('data-key');
      switch (key) {
        case 'map':
          renderMapView();
          break;
        case 'outages':
          renderOutagesView();
          break;
        case 'create':
          renderCreateView();
          break;
        case 'ai':
          renderAiSearch();
          break;
        case 'templates':
          renderTemplatesView();
          break;
        case 'records':
          renderRecordsView();
          break;
        default:
          renderHome();
          const label = actions.find(x => x.key === key)?.label || '';
          const s = $('#section');
          if (s) s.textContent = label;
      }
    });
    return el;
  }

  function renderHome(){
    root.innerHTML = '';
    root.appendChild(renderTopActions());
    const hero = document.createElement('div');
    hero.className = 'hero';
    hero.innerHTML = `
      <div class="orb"></div>
      <h1>Explore network outages</h1>
      <p>Use AI to find details on both open and resolved outages, along with associated communication notifications.</p>
      <div class="search">
        <input id="q" placeholder="Ask anything about network outages" />
        <button id="go" aria-label="Search">${svgIcon('search')}</button>
      </div>
      <div class="section-title" id="section"></div>
      <details id="diagBox" class="diag">
        <summary>Diagnostics</summary>
        <pre id="diagPre" style="max-height:220px;overflow:auto;background:#0b1a2a;color:#d6e7ff;border-radius:8px;padding:10px"></pre>
      </details>
    `;
    root.appendChild(hero);
    $('#go').addEventListener('click', async () => {
      const v = $('#q').value.trim();
      if (!v) return;
      renderAiSearch(v);
    });
    // Allow Enter key to start search from Home input
    const homeInput = $('#q');
    homeInput?.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') {
      const v = homeInput.value.trim(); if (!v) return; renderAiSearch(v);
    }});

  }

  // simple helpers
  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
  }
  function clsBySeverity(sev){
    if (/critical/i.test(sev)) return 'sev-critical';
    if (/major/i.test(sev)) return 'sev-major';
    if (/significant/i.test(sev)) return 'sev-significant';
    if (/minor/i.test(sev)) return 'sev-minor';
    return '';
  }

  function outageCard(it){
    const sevClass = clsBySeverity(it.priority || it.acma || '');
    const chips = [it.priority, ...(it.labels||[])].filter(Boolean).map(c => `<span class="chip">${escapeHtml(c)}</span>`).join(' ');
    const impacted = (typeof it.servicesImpacted === 'number' && it.servicesImpacted>0) ? `${it.servicesImpacted.toLocaleString()} services impacted` : '';
    return `
      <div class="outage-card" data-key="${escapeHtml(it.key)}">
        <div class="oc-title">${escapeHtml(it.summary || it.key || 'Outage')}</div>
        <div class="oc-sub"><span class="lozenge ${sevClass}">${escapeHtml(it.priority || '')}</span> ${chips} ${it.location ? ' · '+escapeHtml(it.location) : ''}</div>
        <div class="oc-meta">Created ${it.created ? new Date(it.created).toLocaleDateString() : ''} ${impacted?`<span class="right">${impacted}</span>`:''}</div>
        <div class="oc-desc">${escapeHtml(it.description || '')}</div>
        <div class="oc-actions"><button class="btn" data-open="${escapeHtml(it.key)}">Open details</button></div>
      </div>`;
  }

  function cardHtml(c){
    return `<div class="card" role="button" tabindex="0" aria-label="Open outage ${c.incidentId}">
      <h4>${c.title} <span class="lozenge">${cap(c.type)}</span></h4>
      <div class="meta">${c.when}</div>
      <div><span class="pill">${c.stage}</span> ${c.affected}</div>
    </div>`;
  }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function renderAiSearch(initialQuery = ''){
    root.innerHTML = '';
    root.appendChild(renderTopActions());

  const wrap = document.createElement('div');
    wrap.className = 'ai-view';
    wrap.innerHTML = `
      <div class="ai-header">
        <div class="crumbs">CCAP › Search</div>
        <button class="btn" id="btnHome">${svgIcon('home')} Home</button>
        <button class="btn" id="btnNew">${svgIcon('plus')} New search</button>
      </div>
      <div class="ai-body">
        <div id="chat" class="chat" aria-live="polite" aria-label="AI search conversation"></div>
      </div>
      <div class="ai-input">
        <input id="qAi" placeholder="Ask anything about network outages" />
        <button id="sendAi" aria-label="Send">${svgIcon('send')}</button>
      </div>
    `;
    root.appendChild(wrap);

  const chat = wrap.querySelector('#chat');
    const input = wrap.querySelector('#qAi');
    const send = wrap.querySelector('#sendAi');
    let lastItems = [];
  let variantToggle = 0; // 0 = outage cards, 1 = comms card (alternates)

    // persistence helpers
    const CHAT_KEY = 'aiChatStateV1';
    const SESS_KEY = 'aiChatSessionIdV1';
    const nowStr = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const loadState = () => { try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '{"messages":[]}'); } catch { return { messages: [] }; } };
    const saveState = (state) => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(state)); } catch {} };
    const getSessionId = () => {
      try {
        let id = localStorage.getItem(SESS_KEY);
        if (!id) {
          const rnd = Math.random().toString(36).slice(2, 8);
          id = `s-${Date.now()}-${rnd}`;
          localStorage.setItem(SESS_KEY, id);
        }
        return id;
      } catch {
        return `s-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      }
    };
    const newMessageId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const sessionId = getSessionId();
    let pollGuard = 0; // increments per send to cancel older polls

    // nav
  wrap.querySelector('#btnHome')?.addEventListener('click', renderHome);
  // New search returns to Home so the user can type a fresh query
  wrap.querySelector('#btnNew')?.addEventListener('click', ()=>{ saveState({ messages: [] }); renderHome(); });

    // chat helpers
    const addUserMsg = (text, ts = nowStr()) => {
      const div = document.createElement('div');
      div.className = 'msg user reveal';
      div.innerHTML = `
        <div class="stack right">
          <div class="bubble">${escapeHtml(text)}</div>
          <div class="ts">${escapeHtml(ts)}</div>
        </div>
        <div class="avatar user">${svgIcon('user')}</div>`;
      chat.appendChild(div); chat.scrollTop = chat.scrollHeight;
    };
    const addThinking = () => {
      const div = document.createElement('div');
      div.className = 'msg bot thinking reveal';
      div.innerHTML = `
        <div class="avatar bot">${svgIcon('bot')}</div>
        <div class="stack">
          <div class="bubble"><span class="spinner"><span class="spin"></span></span> Thinking…</div>
        </div>`;
      chat.appendChild(div); chat.scrollTop = chat.scrollHeight; return div;
    };

  // Progressive thinking UI (checklist) – kept for reference but not used now
    const addThinkingProgress = (steps) => {
      const defaultSteps = steps && steps.length ? steps : [
        'Understanding your query',
        'Calling the agent',
        'Retrieving results',
        'Synthesising answer',
        'Final touch-ups'
      ];
      const wrap = document.createElement('div');
      wrap.className = 'msg bot thinking reveal';
      const id = `ps-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      const stepHtml = defaultSteps.map((s, i) => `
        <div class="p-step" data-idx="${i}" style="display:flex;align-items:center;gap:8px;margin:6px 0;">
          <span class="dot" style="width:8px;height:8px;border-radius:999px;background:${i===0?'#2563eb':'#94a3b8'};display:inline-block;"></span>
          <span class="lbl" style="color:#0f2946;">${escapeHtml(s)}</span>
          <span class="loader" style="margin-left:6px;${i===0?'display:inline-flex;':'display:none;'}"><span class="spinner"><span class="spin"></span></span></span>
        </div>`).join('');
      wrap.innerHTML = `
        <div class="avatar bot">${svgIcon('bot')}</div>
        <div class="stack">
          <div class="bubble" aria-live="polite">
            <div class="progress-steps" id="${id}">
              ${stepHtml}
            </div>
          </div>
        </div>`;
      chat.appendChild(wrap); chat.scrollTop = chat.scrollHeight;
      let current = 0; let disposed = false; let lastSetTs = Date.now();
      const getSteps = () => Array.from(wrap.querySelectorAll(`#${id} .p-step`));
      const setActive = (idx) => {
        if (disposed) return; current = Math.max(0, Math.min(defaultSteps.length-1, idx)); lastSetTs = Date.now();
        const stepsEls = getSteps();
        stepsEls.forEach((el, i) => {
          const dot = el.querySelector('.dot'); const loader = el.querySelector('.loader');
          if (!dot || !loader) return;
          if (i < current) { dot.style.background = '#16a34a'; loader.style.display = 'none'; }
          else if (i === current) { dot.style.background = '#2563eb'; loader.style.display = 'inline-flex'; }
          else { dot.style.background = '#94a3b8'; loader.style.display = 'none'; }
        });
      };
      const advance = () => setActive(current + 1);
      const done = () => { disposed = true; wrap.remove(); };
      // Gentle auto-progress nudge if nothing changed for a while
      const tick = setInterval(() => {
        if (disposed) { clearInterval(tick); return; }
        const elapsed = Date.now() - lastSetTs;
        if (elapsed > 8000 && current < defaultSteps.length - 1) {
          advance();
        }
      }, 2000);
      return { element: wrap, set: setActive, advance, done };
    };

    // New: Single-line spinner with evenly-timed status updates
    const addThinkingStatus = (opts) => {
      // Keep the last status as "Retrieving results" and do not loop
      const statuses = (opts && opts.statuses) || [
        'Understanding your query',
        'Calling the agent',
        'Retrieving results'
      ];
      const stepMs = (opts && opts.stepMs) || 6000; // 6 seconds per stage
      const bubble = document.createElement('div');
      bubble.className = 'msg bot thinking reveal';
      const id = `ts-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      bubble.innerHTML = `
        <div class="avatar bot">${svgIcon('bot')}</div>
        <div class="stack">
          <div class="bubble" aria-live="polite">
            <span class="spinner" style="margin-right:8px;"><span class="spin"></span></span>
            <span id="${id}">${escapeHtml(statuses[0])}</span>
          </div>
        </div>`;
      chat.appendChild(bubble); chat.scrollTop = chat.scrollHeight;
      const label = () => bubble.querySelector(`#${id}`);
      let i = 0, disposed = false, lastManual = 0;
      const setIdx = (idx) => {
        if (disposed) return; i = Math.max(0, Math.min(statuses.length-1, idx));
        const el = label(); if (el) el.textContent = statuses[i]; lastManual = Date.now();
      };
      const setText = (text) => { if (disposed) return; const el = label(); if (el) el.textContent = text; lastManual = Date.now(); };
      // Progress forward once per step until we reach the final stage; then hold
      const timer = setInterval(() => {
        if (disposed) { clearInterval(timer); return; }
        if (Date.now() - lastManual < 1400) return;
        if (i < statuses.length - 1) {
          i += 1;
          const el = label(); if (el) el.textContent = statuses[i];
        } else {
          // On final stage; stop auto-advancing and wait for completion
          clearInterval(timer);
        }
      }, stepMs);
      const done = () => { disposed = true; try { clearInterval(timer); } catch {} bubble.remove(); };
      return { element: bubble, set: setIdx, setText, done };
    };
    const addBotPrompt = (text, ts = nowStr()) => {
      const div = document.createElement('div');
      div.className = 'msg bot reveal';
      div.innerHTML = `
        <div class="avatar bot">${svgIcon('bot')}</div>
        <div class="stack">
          <div class="bubble">${escapeHtml(text)}</div>
          <div class="ts">${escapeHtml(ts)}</div>
        </div>`;
      chat.appendChild(div); chat.scrollTop = chat.scrollHeight;
    };
    const addOutageCards = (items=[]) => {
      const wrap = document.createElement('div');
      wrap.className = 'msg bot reveal';
      wrap.innerHTML = `
        <div class="avatar bot">${svgIcon('bot')}</div>
        <div class="stack">
          <div class="bubble">
            <div class="result-cards">${items.map(outageCard).join('')}</div>
          </div>
          <div class="ts">${nowStr()}</div>
        </div>`;
      chat.appendChild(wrap);
      const cardsHost = wrap.querySelector('.result-cards');
      if (cardsHost) {
        [...cardsHost.children].forEach((el, i) => { el.classList.add('reveal'); el.style.animationDelay = `${i*60}ms`; });
      }
      chat.scrollTop = chat.scrollHeight;
    };

    // Render a simple generic card for Rovo-provided cards
    const addRovoCard = (card = {}) => {
      const wrap = document.createElement('div');
      wrap.className = 'rovo-card reveal';
      const title = escapeHtml(card.title || card.name || 'Card');
      const subtitle = escapeHtml(card.subtitle || card.type || '');
      let content = '';
      if (Array.isArray(card.fields) && card.fields.length) {
        content = `<ul class="kv">${card.fields.map(f => `<li><span>${escapeHtml(f.label || f.name || '')}</span><span class="muted">${escapeHtml(f.value ?? '')}</span></li>`).join('')}</ul>`;
      } else if (typeof card.description === 'string' && card.description.trim()) {
        content = `<div class="muted">${escapeHtml(card.description.trim())}</div>`;
      } else {
        // Fallback: compact JSON preview
        try {
          const pretty = JSON.stringify(card, null, 2);
          const trimmed = pretty.length > 800 ? pretty.slice(0, 800) + '\n…' : pretty;
          content = `<pre class="muted" style="white-space:pre-wrap;">${escapeHtml(trimmed)}</pre>`;
        } catch { content = ''; }
      }
      wrap.innerHTML = `
        <div class="msg bot">
          <div class="avatar bot">${svgIcon('bot')}</div>
          <div class="stack">
            <div class="bubble">
              <div class="card">
                <h4 style="margin:0 0 6px 0;">${title}</h4>
                ${subtitle ? `<div class="muted" style="margin-bottom:8px;">${subtitle}</div>` : ''}
                ${content}
              </div>
            </div>
            <div class="ts">${nowStr()}</div>
          </div>
        </div>`;
      chat.appendChild(wrap);
      chat.scrollTop = chat.scrollHeight;
      return card;
    };

    // Render a single large "Comms record" sample card
    const addCommsCard = (rec) => {
      const defaults = {
        outageId: 'INC20485',
        updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stages: [
          { title: 'Stage 1', time: '19:00 01/02/2025', consumers: '190,000', status: 'ok', checks: [
            { name: 'Email comms', status: 'Sent' },
            { name: 'SMS comms', status: 'Sent' },
            { name: 'Website', status: 'Updated' },
            { name: 'ServiceNow', status: 'Sent' },
          ]},
          { title: 'Stage 2', time: '19:00 01/02/2025', consumers: '300,000', status: 'warn', checks: [
            { name: 'Email comms', status: 'Exceed', warn: true },
            { name: 'SMS comms', status: 'Exceed', warn: true },
            { name: 'Spatial Buzz', status: 'Sent' },
            { name: 'ServiceNow', status: 'Sent' },
          ]},
          { title: 'Stage 4', time: '19:00 01/02/2025', consumers: '190,000', status: 'progress', checks: [
            { name: 'Email comms', status: 'Sent' },
            { name: 'SMS comms', status: 'Sent' },
            { name: 'Spatial Buzz', status: 'Sent' },
            { name: 'ServiceNow', status: 'Sent' },
          ]},
          { title: 'Stage 4', time: '19:00 01/02/2025', consumers: '190,000', status: 'idle', checks: [
            { name: 'Email comms', status: 'Sent' },
            { name: 'SMS comms', status: 'Sent' },
            { name: 'Spatial Buzz', status: 'Sent' },
            { name: 'ServiceNow', status: 'Sent' },
          ]},
        ]
      };
      const data = {
        outageId: rec?.outageId || defaults.outageId,
        updated: rec?.updated || defaults.updated,
        stages: Array.isArray(rec?.stages) && rec.stages.length ? rec.stages : defaults.stages,
      };
      const wrapDiv = document.createElement('div');
      wrapDiv.className = 'comms-card reveal';
      const markers = (s) => {
        const cls = s==='ok'?'ok': s==='warn'?'warn': s==='progress'?'prog':'idle';
        return `<div class="s-marker ${cls}"></div>`;
      };
      wrapDiv.innerHTML = `
        <div class="comms-header">
          <div class="title">Comms record for Outage ${data.outageId}</div>
          <div class="sub">Last updated ${data.updated}</div>
        </div>
        <div class="stages">
          ${data.stages.map(st => `
            <div class="stage">
              ${markers(st.status)}
              <div class="s-title">${st.title}</div>
              <div class="s-time">${st.time}</div>
              <div class="tag">Stage ${st.consumers} consumers</div>
              <div class="s-block">
                <div class="s-head">Comms compliance</div>
                <ul class="s-list">
                  ${st.checks.map(c => `
                    <li><span>${c.name}</span><span class="muted">${c.status}</span>${c.warn? iconWarn() : iconCheck()}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      chat.appendChild(wrapDiv);
      chat.scrollTop = chat.scrollHeight;
  return data;
    };

    const sendQuery = async () => {
      const text = input.value.trim();
      if (!text) return; input.value='';
      const messageId = newMessageId();
      addUserMsg(text);
      // persist user message
      const st = loadState();
      st.messages.push({ role: 'user', type: 'text', text, time: Date.now(), sessionId, messageId });
      saveState(st);
  // Progressive feedback while we wait for the agent (single-line spinner)
  const thinking = addThinkingStatus();
      const myToken = ++pollGuard;
      try {
        if (window.forgeInvoke) {
          // 1) Ask backend to start the Rovo flow via Jira Automation webhook
          let rovoResult = null;
          try {
            const start = await window.forgeInvoke('startRovo', { query: text, sessionId, messageId });
            thinking.set(1); // Calling the agent
            if (start && start.ok && start.correlationId) {
              const corr = start.correlationId;
              let delay = 1000; // start with 1s
              // Wait until the web trigger callback stores a result
              while (true) {
                if (myToken !== pollGuard) { return; }
                const pol = await window.forgeInvoke('getRovoResult', { correlationId: corr });
                if (pol && pol.ok && pol.status === 'done' && pol.result) {
                  rovoResult = pol.result;
                  break;
                }
                await new Promise(r => setTimeout(r, delay));
                if (delay < 5000) delay += 500; // gentle backoff up to 5s
              }
            }
          } catch (e) {
            // fall through and show a friendly error below
          }

          const res = rovoResult;
          if (myToken !== pollGuard) { return; }
          thinking.setText('Synthesising answer');
          // brief polish step for better UX
          await new Promise(r => setTimeout(r, 400));
          thinking.done();
          if (res) {
            // Prefer Rovo-provided cards first
            let cards = Array.isArray(res.cards) ? res.cards : (Array.isArray(res.result?.cards) ? res.result.cards : []);
            const items = Array.isArray(res.items) ? res.items : (Array.isArray(res.result?.items) ? res.result.items : []);
            const rovoResponse = res.rovoResponse || (res.result && res.result.rovoResponse) || null;
            const kpis = res.kpis || (res.result && res.result.kpis) || null;

            // 1) Render any outage-type cards using our outage card UI
            if (!cards.length) {
              // Fallback: parse embedded JSON from raw data on the client if backend didn't extract
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
              const rawDataStr = res?.raw?.data || res?.result?.raw?.data || null;
              const embedded = rawDataStr ? tryParseEmbedded(rawDataStr) : null;
              if (embedded && Array.isArray(embedded.cards)) {
                cards = embedded.cards;
                try { console.log('[AI] Parsed embedded cards on client:', cards.length); } catch {}
              }
            }
            // 0) If Rovo provided a general response, show it first
            if (typeof rovoResponse === 'string' && rovoResponse.trim()) {
              addBotPrompt(rovoResponse.trim());
              const st0 = loadState();
              st0.messages.push({ role: 'bot', type: 'text', text: rovoResponse.trim(), time: Date.now(), sessionId });
              saveState(st0);
            }

            // 0.5) Optionally surface KPIs inline
            if (kpis && (typeof kpis.outageCount === 'number' || typeof kpis.servicesImpactedTotal === 'number')) {
              const parts = [];
              if (typeof kpis.outageCount === 'number') parts.push(`${kpis.outageCount.toLocaleString()} outages`);
              if (typeof kpis.servicesImpactedTotal === 'number') parts.push(`${kpis.servicesImpactedTotal.toLocaleString()} services impacted`);
              if (parts.length) {
                addBotPrompt(parts.join(' • '));
                const stk = loadState();
                stk.messages.push({ role: 'bot', type: 'text', text: parts.join(' • '), time: Date.now(), sessionId });
                saveState(stk);
              }
            }

            if (cards.length) {
              try { console.log('[AI] Rovo cards received:', cards.length); } catch {}
              const isOutageCard = (c) => {
                const t = String(c?.type || c?.kind || c?.category || '').toLowerCase();
                if (['outage','incident','outage-incident','outage_card','outagecard'].includes(t)) return true;
                const hasKeys = !!(c && (c.key || c.incidentId));
                const hasSeverity = !!(c && (c.severity || c.acma || c.priority));
                const hasTitle = !!(c && (c.title || c.summary));
                return hasKeys && hasSeverity && hasTitle;
              };
              const outageCards = cards.filter(isOutageCard);
              if (outageCards.length) {
                const mapped = outageCards.map(c => ({
                  key: c.key || c.incidentId || '—',
                  summary: c.summary || c.title || 'Outage',
                  status: c.status || '',
                  updated: c.updated || new Date().toISOString(),
                  created: c.created || null,
                  type: 'Incident',
                  priority: c.severity || c.acma || 'Significant',
                  location: c.location || '',
                  servicesImpacted: typeof c.servicesImpacted === 'number' ? c.servicesImpacted : 0,
                  description: c.description || '',
                  labels: Array.isArray(c.labels) ? c.labels : [],
                }));
                if (mapped.length) {
                  lastItems = mapped;
                  addOutageCards(mapped);
                  const st2a = loadState();
                  st2a.messages.push({ role: 'bot', type: 'cards', items: mapped, time: Date.now() });
                  saveState(st2a);
                }
              } else {
                // Fallback: render first card generically if mapping produced none
                const usedFallback = addRovoCard(cards[0]);
                const stfb = loadState();
                stfb.messages.push({ role: 'bot', type: 'rovoCard', card: usedFallback, time: Date.now() });
                saveState(stfb);
              }
              // 2) Render any non-outage cards generically
              const otherCards = cards.filter(c => String(c?.type || '').toLowerCase() !== 'outage');
              if (otherCards.length) {
                const used = addRovoCard(otherCards[0]);
                const stc = loadState();
                stc.messages.push({ role: 'bot', type: 'rovoCard', card: used, time: Date.now() });
                saveState(stc);
              }
            }
            // Optional diagnostics bubble when enabled via ?diag=1
            if ((!cards || !cards.length) && (!items || !items.length) && (window.FORGE_DIAG === true)) {
              addBotPrompt('Diagnostics: No cards/items found in Rovo response.');
            }
            // 3) If backend provided items separately, render them as outage cards too
            if (items.length) {
              try { console.log('[AI] Items received:', items.length); } catch {}
              lastItems = items;
              addOutageCards(items);
              const st2 = loadState();
              st2.messages.push({ role: 'bot', type: 'cards', items, time: Date.now() });
              saveState(st2);
            }

            // Finally, show the follow-up text at the end of the message
            const follow = res.followUp || (res.result && res.result.followUp) || res.text;
            if (follow) {
              addBotPrompt(follow);
              const st1 = loadState();
              st1.messages.push({ role: 'bot', type: 'text', text: follow, time: Date.now(), sessionId });
              saveState(st1);
            }
          } else {
            addBotPrompt('Sorry, I could not process that.');
            const st3 = loadState();
            st3.messages.push({ role: 'bot', type: 'text', text: 'Sorry, I could not process that.', time: Date.now(), sessionId });
            saveState(st3);
          }
        } else {
          thinking.done();
          addBotPrompt('Bridge not available.');
          const st4 = loadState();
          st4.messages.push({ role: 'bot', type: 'text', text: 'Bridge not available.', time: Date.now(), sessionId });
          saveState(st4);
        }
      } catch (e) {
        try { console.error('aiSearch error:', e); } catch {}
        thinking.done();
        addBotPrompt('Something went wrong.');
        const st5 = loadState();
        st5.messages.push({ role: 'bot', type: 'text', text: 'Something went wrong.', time: Date.now(), sessionId });
        saveState(st5);
      }
    };

    // wire events
    send?.addEventListener('click', sendQuery);
    input?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendQuery(); });
    chat.addEventListener('click', (e) => {
      const btn = e.target.closest('.outage-card .oc-actions .btn');
      if (!btn) return;
      const oc = btn.closest('.outage-card');
      const key = btn.getAttribute('data-open') || oc?.getAttribute('data-key');
      const it = (lastItems||[]).find(x => String(x.key) === String(key));
      if (!it) return;
      // Map AI item to the side panel data shape
      const svc = (typeof it.servicesImpacted === 'number') ? it.servicesImpacted : 0;
      const mapped = {
        title: it.summary || 'Outage',
        incidentId: it.key,
        location: it.location || '—',
        severity: it.priority || it.type || 'Significant',
        stage: 'Stage 1',
        affected: svc > 0 ? `${svc.toLocaleString()} services impacted` : '—',
        when: `Updated ${new Date(it.updated || Date.now()).toLocaleString()}`,
        type: 'major',
        lastUpdated: new Date(it.updated || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: it.description || '',
        servicesImpacted: svc,
        compliance: [
          { name: 'Email comms', status: '—' },
          { name: 'SMS comms', status: '—' },
          { name: 'Spatial Buzz', status: '—' },
          { name: 'ServiceNow', status: '—' },
        ],
        timeline: [
          { title: 'Outage identified', badge: it.priority || 'Significant', time: new Date(it.created || Date.now()).toLocaleString(), stage: 'Stage 1', consumers: '—' },
        ],
      };
      openOutagePanel(mapped);
    });

    // restore previous chat
    const restore = () => {
      const st = loadState();
      if (!st || !Array.isArray(st.messages)) return;
      st.messages.forEach(m => {
        const ts = m.time ? new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : nowStr();
        if (m.type === 'text') {
          if (m.role === 'user') addUserMsg(m.text, ts); else addBotPrompt(m.text, ts);
        } else if (m.type === 'cards' && Array.isArray(m.items)) {
          lastItems = m.items; addOutageCards(m.items);
        } else if (m.type === 'comms' && m.data) {
          addCommsCard(m.data);
        } else if (m.type === 'rovoCard' && m.card) {
          addRovoCard(m.card);
        }
      });
      chat.scrollTop = chat.scrollHeight;
    };
    restore();

    if (initialQuery) { saveState({ messages: [] }); input.value = initialQuery; sendQuery(); }
  }

  function renderMapView(){
    root.innerHTML = '';
    root.appendChild(renderTopActions());

    const wrap = document.createElement('div');
    wrap.className = 'map-view';
    wrap.innerHTML = `
      <div class="map-header">
        <div class="map-title">Current unplanned outages</div>
        <div class="map-updated">Last updated at 1:35pm</div>
      </div>
      <div class="kpi-row">
        ${kpiBox('<span id="kpiOutageCount">—</span>', 'Total outage incidents')}
        ${kpiBox('<span id="kpiImpacted">—</span>', 'Services impacted')}
        ${kpiBox('3,120', 'Current unplanned outages')}
        ${kpiBox('52', 'Compliance risk')}
      </div>
      <div class="map-panel">
        <img id="mapImage" class="map-image" alt="Australia outage map" />
        <div id="leafletMap" role="region" aria-label="Australia map"></div>
        <div class="map-canvas" aria-label="Australia map">
          <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet" class="svg-map">
            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stop-color="#33556b"/>
                <stop offset="100%" stop-color="#2b3a49"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
            <path d="M180,280 C220,180 360,120 480,160 C560,200 620,260 600,320 C560,420 320,420 220,360 Z" fill="#3a5568" opacity="0.9"/>
            <circle cx="560" cy="220" r="8" fill="#ef4444"><title>Sydney</title></circle>
            <circle cx="520" cy="260" r="8" fill="#22d3ee"><title>Melbourne</title></circle>
            <circle cx="600" cy="200" r="8" fill="#fde047"><title>Brisbane</title></circle>
            <circle cx="140" cy="240" r="8" fill="#22d3ee"><title>Perth</title></circle>
            <circle cx="420" cy="260" r="8" fill="#ef4444"><title>Adelaide</title></circle>
          </svg>
        </div>
        <div class="map-label">AUSTRALIA</div>
        <div class="map-fallback-hint" id="mapFallbackHint" hidden>Showing built-in map (add assets/map-screenshot.png to replace)</div>
        <div class="legend">
          <div class="row"><span class="dot d-red"></span> Compliance risk</div>
          <div class="row"><span class="dot d-cyan"></span> Regional</div>
          <div class="row"><span class="dot d-yellow"></span> Remote</div>
          <div class="scale">
            <div class="key"><span class="bubble"></span><span>&lt; 10,000</span></div>
            <div class="key"><span class="bubble l"></span><span>10,000–50,000</span></div>
            <div class="key"><span class="bubble xl"></span><span>50,000+</span></div>
          </div>
        </div>
      </div>
      <div class="tabs" id="tabs">
        ${tabBtn('all', 'All unplanned ACMA outages (<span id="tabAllCount">—</span>)', true)}
        ${tabBtn('major', 'Major (<span id="tabMajorCount">—</span>)')}
        ${tabBtn('significant', 'Significant (<span id="tabSignificantCount">—</span>)')}
        ${tabBtn('compliance', 'Compliance risk (<span id="tabComplianceCount">—</span>)')}
      </div>
      <div class="cards" id="cards"></div>
    `;
    root.appendChild(wrap);

    // Prefer the local screenshot; if it fails, show the SVG fallback with a hint
    const img = wrap.querySelector('#mapImage');
    const svg = wrap.querySelector('.map-canvas');
    const hint = wrap.querySelector('#mapFallbackHint');
    const lDiv = wrap.querySelector('#leafletMap');
    if (lDiv) lDiv.style.opacity = '0';
    let mapRef = null;

    const showSVG = () => { if (svg) svg.style.display = 'block'; if (lDiv) lDiv.hidden = true; if (hint) hint.hidden = false; };
    const showLeaflet = () => {
      if (svg) svg.style.display = 'none';
      if (lDiv) { lDiv.style.opacity = '1'; }
      if (hint) hint.hidden = true;
      if (mapRef) { setTimeout(()=> mapRef.invalidateSize(true), 0); }
    };

    // Initialize Leaflet only if the library is present locally
    function tryInitLeaflet() {
      if (!window.L || !lDiv) return false;
      try {
        const map = L.map(lDiv, {
          zoomControl: true,
          attributionControl: true,
          minZoom: 3,
          maxZoom: 12,
        }).setView([-25.27, 133.77], 4);
        mapRef = map;

        // Dynamic OSM tiles (requires egress allowlist in manifest)
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: 'abc',
          attribution: '&copy; OpenStreetMap contributors',
        });
        let tilesLoaded = false;
        tiles.on('load', () => { tilesLoaded = true; showLeaflet(); });
        tiles.on('tileerror', () => { /* handled below if nothing loads */ });
        tiles.addTo(map);

        // Add sample markers similar to the cards
        const mk = (lat, lng, color, label) => {
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<span style="display:inline-block;width:12px;height:12px;border-radius:999px;background:${color};box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>`,
            iconSize: [12,12]
          });
          L.marker([lat, lng], { icon }).addTo(map).bindTooltip(label);
        };
        mk(-33.8688, 151.2093, '#ef4444', 'Sydney');
        mk(-37.8136, 144.9631, '#22d3ee', 'Melbourne');
        mk(-27.4698, 153.0251, '#fde047', 'Brisbane');
        mk(-31.9505, 115.8605, '#22d3ee', 'Perth');
        mk(-34.9285, 138.6007, '#ef4444', 'Adelaide');

        // If tiles don’t load within a short window, fallback to screenshot/SVG
        setTimeout(() => {
          if (!tilesLoaded) {
            map.remove();
            if (img) {
              const ver2 = (window && window.FORGE_STATIC_VER) ? window.FORGE_STATIC_VER : Date.now();
              img.addEventListener('load', () => { if (svg) svg.style.display = 'none'; img.style.display = 'block'; if (hint) hint.hidden = true; });
              img.addEventListener('error', () => { img.style.display = 'none'; showSVG(); });
              img.src = `./assets/map-screenshot.png?v=${ver2}`;
            } else {
              showSVG();
            }
          }
        }, 1500);
        // Invalidate on resize to avoid partial tiling
        window.addEventListener('resize', () => { if (mapRef) mapRef.invalidateSize(); });
        return true;
      } catch (e) {
        return false;
      }
    }

    let leafletReady = false;
    if (window.L) leafletReady = tryInitLeaflet();

    if (!leafletReady) {
      // Fallback to image or SVG if Leaflet not available
      if (svg) svg.style.display = 'none';
      if (img) {
        img.addEventListener('load', () => { if (svg) svg.style.display = 'none'; img.style.display = 'block'; if (hint) hint.hidden = true; });
        img.addEventListener('error', () => { img.style.display = 'none'; showSVG(); });
        const ver = (window && window.FORGE_STATIC_VER) ? window.FORGE_STATIC_VER : Date.now();
        img.src = `./assets/map-screenshot.png?v=${ver}`;
      } else {
        showSVG();
      }
    }

    // Data for the cards under the map; start empty and show a spinner while fetching Jira
    let data = [];
    let loading = true;
    const spinnerHtml = (text = 'Loading outages…') => `<div class="spinner" role="status" aria-live="polite"><span class="spin"></span>${text}</div>`;
    // Helper: coerce possible numeric-like values to a number
    const numFromAny = (v) => {
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string') {
        const digits = v.replace(/[^0-9]/g, '');
        return digits ? parseInt(digits, 10) : 0;
      }
      return 0;
    };
    
    const setTab = (filter) => {
      if (loading) {
        $('#cards').innerHTML = spinnerHtml();
      } else if (!data || data.length === 0) {
        $('#cards').innerHTML = `<div class="empty">No outages found.</div>`;
      } else {
        $('#cards').innerHTML = data
          .filter(c => filter==='all' ? true : c.type===filter)
          .map(cardHtml).join('');
      }
      [...$('#tabs').children].forEach(ch => ch.classList.toggle('active', ch.getAttribute('data-key')===filter));
      updateTabCounts();
    };

    const updateTabCounts = () => {
      try {
        const allEl = document.getElementById('tabAllCount');
        const majorEl = document.getElementById('tabMajorCount');
        const sigEl = document.getElementById('tabSignificantCount');
        const compEl = document.getElementById('tabComplianceCount');
        const all = (data?.length || 0);
        const major = (data || []).filter(it => String(it.type).toLowerCase() === 'major').length;
        const significant = (data || []).filter(it => String(it.type).toLowerCase() === 'significant').length;
        const compliance = (data || []).filter(it => String(it.type).toLowerCase() === 'compliance').length;
        if (allEl) allEl.textContent = all.toLocaleString();
        if (majorEl) majorEl.textContent = major.toLocaleString();
        if (sigEl) sigEl.textContent = significant.toLocaleString();
        if (compEl) compEl.textContent = compliance.toLocaleString();
      } catch {}
    };

    const updateKpis = () => {
      try {
        const outageEl = document.getElementById('kpiOutageCount');
        const impactedEl = document.getElementById('kpiImpacted');
        if (outageEl) outageEl.textContent = String((data?.length || 0).toLocaleString());
        const impacted = (data || []).reduce((sum, it) => {
          // Prefer the Services Impacted field when available
          if (typeof it.servicesImpacted === 'number') return sum + it.servicesImpacted;
          // Secondary explicit numeric fields if present
          if (typeof it.impacted === 'number') return sum + it.impacted;
          if (typeof it.customers === 'number') return sum + it.customers;
          if (typeof it.services === 'number') return sum + it.services;
          // Fallback: parse from affected string like "120,000 services impacted/affected"
          return sum + numFromAny(it.affected);
        }, 0);
        if (impactedEl) impactedEl.textContent = impacted > 0 ? impacted.toLocaleString() : '—';
      } catch {}
    };
    // Load live Jira issues to replace sample cards
    (async () => {
      try {
        if (window.forgeInvoke) {
          // Pass through maxResults and optional JQL override
          const payload = { maxResults: 12 };
          if (window.FORGE_JQL) payload.jql = String(window.FORGE_JQL);
          
          const res = await window.forgeInvoke('fetchOutages', payload);
          
          if (res && res.ok && Array.isArray(res.items) && res.items.length) {
            // Map Jira items to the card schema used by UI
            const toType = (sev) => {
              const s = String(sev||'').toLowerCase();
              if (s.includes('major')) return 'major';
              if (s.includes('significant')) return 'significant';
              return 'major';
            };
            data = res.items.map(it => {
              const svc = (typeof it.servicesImpacted === 'number') ? it.servicesImpacted
                : (typeof it.services === 'number') ? it.services
                : (typeof it.customers === 'number') ? it.customers
                : numFromAny(it.affected);
              return {
                title: it.summary || 'Outage',
                incidentId: it.key,
                location: it.location || it.summary || 'Location TBA',
                severity: it.priority || it.type || 'Significant',
                stage: 'Stage 1',
                // Reflect Services Impacted count on the card when available
                affected: svc > 0 ? `${svc.toLocaleString()} services impacted` : '—',
                when: `Updated ${new Date(it.updated).toLocaleString()}`,
                type: toType(it.priority || it.type),
                lastUpdated: new Date(it.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: it.summary || '',
                // Keep the numeric value for KPI calculations
                servicesImpacted: svc,
                compliance: [
                  { name: 'Email comms', status: '—' },
                  { name: 'SMS comms', status: '—' },
                  { name: 'Spatial Buzz', status: '—' },
                  { name: 'ServiceNow', status: '—' },
                ],
                timeline: [
                  { title: 'Outage identified', badge: it.priority || 'Significant', time: new Date(it.updated).toLocaleString(), stage: 'Stage 1', consumers: '—' },
                ],
              }});
      // Re-render current tab with live data
          loading = false;
      updateKpis();
      updateTabCounts();
          const activeKey = [...$('#tabs').children].find(ch => ch.classList.contains('active'))?.getAttribute('data-key') || 'all';
          setTab(activeKey);
        } else {
          // No results; stop loading and show empty state
          loading = false;
      updateKpis();
      updateTabCounts();
          setTab('all');
        }
      }
    } catch (e) {
      console.error('Error fetching live outages:', e);
      // Stop loading, keep empty list on error
      loading = false;
    updateKpis();
    updateTabCounts();
      setTab('all');
    }
  })();
    $('#tabs').addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (!t) return;
      setTab(t.getAttribute('data-key'));
    });
  setTab('all');

    // open detail panel on card click
    $('#cards').addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const idx = [...$('#cards').children].indexOf(card);
      const filtered = [...data].filter(c => {
        const activeKey = [...$('#tabs').children].find(ch => ch.classList.contains('active'))?.getAttribute('data-key') || 'all';
        return activeKey==='all' ? true : c.type===activeKey;
      });
      const item = filtered[idx];
      if (item) openOutagePanel(item);
    });
  }

  function renderOutagesView(){
    root.innerHTML = '';
    root.appendChild(renderTopActions());

    const wrap = document.createElement('div');
    wrap.className = 'outages-view';
    wrap.innerHTML = `
      <div class="records-header">
        <div>
          <h2>Outage Communication Records</h2>
          <div class="sub">Filter, find and extract notification records sent to customers during an outage</div>
        </div>
      </div>
      <div class="records-card">
        <div class="filters" id="filters">
          <div class="filter-row">
            <input type="text" id="qText" placeholder="Search by outage, location" />
            <input type="text" id="qId" placeholder="Filter by outage ID..." />
            <select id="qAcma">
              <option value="">All Outages</option>
              <option>Critical</option>
              <option>Major outage</option>
              <option>Significant</option>
              <option>Minor</option>
            </select>
            <select id="qRegion">
              <option value="">All Locations</option>
              <option>NSW</option>
              <option>VIC</option>
              <option>QLD</option>
              <option>WA</option>
              <option>SA</option>
              <option>ACT</option>
              <option>TAS</option>
            </select>
            <input type="date" id="qStart" placeholder="Start date" />
            <input type="date" id="qEnd" placeholder="End date" />
            <button id="applyFilters">Apply filters</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="records-table" id="recordsTable" aria-label="Outage records">
            <thead>
              <tr>
                <th class="col-select" aria-label="Select row"></th>
                <th data-key="incidentId" class="sortable">Incident ID</th>
                <th data-key="region" class="sortable">Region</th>
                <th data-key="acma" class="sortable">ACMA</th>
                <th data-key="cause" class="sortable">Cause of outage</th>
                <th data-key="comms" class="sortable">Comms records</th>
                <th data-key="identifiedAt" class="sortable">Identified</th>
                <th data-key="status" class="sortable">Status</th>
              </tr>
            </thead>
            <tbody id="recordsBody"></tbody>
          </table>
        </div>
        <div class="table-footer" id="tableFooter">
          <div class="left" id="selCount">0 of 0 row(s) selected.</div>
          <div class="right">
            <button class="pager" id="prev" disabled>Previous</button>
            <button class="pager" id="next" disabled>Next</button>
          </div>
        </div>
      </div>
    `;
    root.appendChild(wrap);

    // Live data setup: start with spinner, then fetch Jira items
    let rows = [];
    let loading = true;
    const setBody = (html) => { const tb = $('#recordsBody'); if (tb) tb.innerHTML = html; const sc = $('#selCount'); if (sc) sc.textContent = '0 of 0 row(s) selected.'; };
    setBody(`<tr><td colspan="8"><div class="spinner"><span class="spin"></span>Loading records…</div></td></tr>`);

    // Fetch live Jira outages via backend
    (async () => {
      try {
        if (window.forgeInvoke) {
          const res = await window.forgeInvoke('fetchOutages', { maxResults: 50 });
          loading = false;
          if (res && res.ok && Array.isArray(res.items)) {
            // Map Jira items to our table shape (best-effort)
            rows = res.items.map(it => ({
              incidentId: it.key,
              region: it.location || it.summary || '—',
              acma: it.priority || it.type || '—',
              cause: it.summary || '—',
              comms: 'View comms record',
              identifiedAt: it.updated,
              status: it.status || '—',
            }));
            if (rows.length) {
              renderRows(applySort(rows));
            } else {
              setBody(`<tr><td colspan="8"><div class="empty">No records found.</div></td></tr>`);
            }
          } else {
            setBody(`<tr><td colspan="8"><div class="empty">No records found.</div></td></tr>`);
          }
        } else {
          loading = false;
          setBody(`<tr><td colspan="8"><div class="empty">Live data unavailable.</div></td></tr>`);
        }
      } catch (e) {
        loading = false;
        setBody(`<tr><td colspan="8"><div class="empty">Error loading records.</div></td></tr>`);
        try { console.error('Outages fetch error:', e); } catch {}
      }
    })();

    let sortKey = 'identifiedAt';
    let sortDir = 'desc';
    let selectedIdx = -1;

    const renderRows = (data) => {
      const tbody = $('#recordsBody');
      tbody.innerHTML = data.map((r, idx) => `
        <tr data-idx="${idx}" class="${idx===selectedIdx ? 'selected':''}">
          <td class="col-select"><span class="radio ${idx===selectedIdx ? 'on':''}" aria-label="Select row" role="radio" aria-checked="${idx===selectedIdx}"></span></td>
          <td>${r.incidentId}</td>
          <td>${r.region}</td>
          <td>${r.acma}</td>
          <td>${r.cause}</td>
          <td><button class="link-btn" data-action="comms">${r.comms}</button></td>
          <td>${fmtDate(r.identifiedAt)}</td>
          <td>${r.status}</td>
        </tr>
      `).join('');
      $('#selCount').textContent = `${selectedIdx>=0?1:0} of ${data.length} row(s) selected.`;
    };

    const fmtDate = (iso) => {
      const d = new Date(iso);
      const pad = (n)=> String(n).padStart(2,'0');
      return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${pad(d.getFullYear())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const applySort = (arr) => arr.slice().sort((a,b)=>{
      const va = a[sortKey];
      const vb = b[sortKey];
      let cmp = 0;
      if (sortKey === 'identifiedAt') {
        cmp = new Date(va) - new Date(vb);
      } else {
        cmp = String(va).localeCompare(String(vb), undefined, { numeric:true, sensitivity:'base' });
      }
      return sortDir==='asc' ? cmp : -cmp;
    });

    const applyFilters = () => {
      if (loading) return;
      const qText = $('#qText').value.trim().toLowerCase();
      const qId = $('#qId').value.trim().toLowerCase();
      const qAcma = $('#qAcma').value;
      const qRegion = $('#qRegion').value;
      const qStart = $('#qStart').value ? new Date($('#qStart').value) : null;
      const qEnd = $('#qEnd').value ? new Date($('#qEnd').value) : null;
      let filtered = rows.filter(r => {
        const matchesText = !qText || [r.incidentId, r.region, r.cause, r.status].some(v => v.toLowerCase().includes(qText));
        const matchesId = !qId || r.incidentId.toLowerCase().includes(qId);
        const matchesAcma = !qAcma || String(r.acma || '').toLowerCase().includes(qAcma.toLowerCase());
        const matchesRegion = !qRegion || r.region.endsWith(qRegion);
        const t = new Date(r.identifiedAt);
        const afterStart = !qStart || t >= qStart;
        const beforeEnd = !qEnd || t <= new Date(qEnd.getTime()+86399999);
        return matchesText && matchesId && matchesAcma && matchesRegion && afterStart && beforeEnd;
      });
      filtered = applySort(filtered);
      selectedIdx = -1; // reset selection on filter
      renderRows(filtered);
    };

  // initial render handled by spinner above; rows will render after fetch

    // events
    $('#applyFilters').addEventListener('click', applyFilters);
    $('#recordsTable').addEventListener('click', (e)=>{
      const th = e.target.closest('th.sortable');
      if (th) {
        const key = th.getAttribute('data-key');
        if (key) {
          if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            sortKey = key; sortDir = 'asc';
          }
          applyFilters();
          return;
        }
      }
      const rd = e.target.closest('tr');
      if (rd && rd.parentElement.id === 'recordsBody') {
        selectedIdx = Number(rd.getAttribute('data-idx'));
        // re-render to update radio visuals
        applyFilters();
        return;
      }
      const link = e.target.closest('button.link-btn');
      if (link) {
        // placeholder action
        alert('Comms record viewer coming soon');
      }
    });
  }

  function renderTemplatesView() {
    root.innerHTML = '';
    root.appendChild(renderTopActions());
    const wrap = document.createElement('div');
    wrap.className = 'templates-view';
    wrap.innerHTML = `
      <div class="records-header">
        <div>
          <h2>Templates Management</h2>
          <div class="sub">Manage notification and outage templates. Submit edit requests for approval.</div>
        </div>
      </div>
      <div class="records-card">
        <div class="filters" id="templateFilters">
          <div class="filter-row">
            <input type="text" id="tplName" placeholder="Search by template name" />
            <select id="tplType">
              <option value="">All Types</option>
              <option>Email</option>
              <option>Confluence Page</option>
            </select>
            <select id="tplStatus">
              <option value="">All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select id="tplEditReq">
              <option value="">All Edit Requests</option>
              <option value="open">Edit Pending</option>
              <option value="none">No Edit Request</option>
            </select>
            <button id="applyTplFilters" class="btn-dark">Apply filters</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="records-table" id="templatesTable" aria-label="Templates">
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Type</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Edit Request</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="templatesBody"></tbody>
          </table>
        </div>
      </div>
    `;
    root.appendChild(wrap);

    // Sample data
    const templates = [
      {
        id: 'TPL-001',
        name: 'B2B Customer Notification',
        type: 'Email',
        lastUpdated: '2025-08-19 14:32',
        status: 'Published',
        editRequest: null,
        version: 'v3.2',
      },
      {
        id: 'TPL-002',
        name: 'Crisis Outage Alert',
        type: 'Confluence Page',
        lastUpdated: '2025-08-18 09:15',
        status: 'Published',
        editRequest: 'REQ-1045',
        version: 'v2.7',
      },
      {
        id: 'TPL-003',
        name: 'General Notification',
        type: 'Email',
        lastUpdated: '2025-08-17 11:00',
        status: 'Published',
        editRequest: null,
        version: 'v1.9',
      },
    ];

    let filtered = templates.slice();

    function renderRows(data) {
      const tbody = wrap.querySelector('#templatesBody');
      tbody.innerHTML = data.map(tpl => `
        <tr>
          <td>${escapeHtml(tpl.name)}</td>
          <td>${escapeHtml(tpl.type)}</td>
          <td>${escapeHtml(tpl.lastUpdated)}</td>
          <td><span class="lozenge ${tpl.status === 'Published' ? 'sev-major' : ''}">${escapeHtml(tpl.status)}</span></td>
          <td>${tpl.editRequest
            ? `<span class="badge badge-pending">Edit Pending (${escapeHtml(tpl.editRequest)})</span>`
            : '<span class="muted">—</span>'}
          </td>
          <td>${escapeHtml(tpl.version)}</td>
          <td>
            <button class="btn" ${tpl.editRequest ? 'disabled' : ''}>
              ${tpl.editRequest ? 'Edit Locked' : 'Request Edit'}
            </button>
          </td>
        </tr>
      `).join('');
    }

    function applyFilters() {
      const name = wrap.querySelector('#tplName').value.trim().toLowerCase();
      const type = wrap.querySelector('#tplType').value;
      const status = wrap.querySelector('#tplStatus').value;
      const editReq = wrap.querySelector('#tplEditReq').value;
      filtered = templates.filter(tpl => {
        const matchesName = !name || tpl.name.toLowerCase().includes(name);
        const matchesType = !type || tpl.type === type;
        const matchesStatus = !status || tpl.status === status;
        const matchesEdit = editReq === '' || (editReq === 'open' ? !!tpl.editRequest : !tpl.editRequest);
        return matchesName && matchesType && matchesStatus && matchesEdit;
      });
      renderRows(filtered);
    }

    wrap.querySelector('#applyTplFilters').addEventListener('click', applyFilters);
    renderRows(filtered);
  }

  function kpiBox(val, lbl){
    return `<div class="kpi"><div class="val">${val}</div><div class="lbl">${lbl}</div></div>`;
  }
  function marker(xpct, ypct, cls){
    return `<div class="marker ${cls}" style="left:${xpct}%; top:${ypct}%;"></div>`;
  }
  function tabBtn(key, lbl, active){
    return `<div class="tab ${active? 'active':''}" data-key="${key}">${lbl}</div>`;
  }

  function openOutagePanel(item){
    // create overlay and panel
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    overlay.addEventListener('click', close);

    const panel = document.createElement('aside');
    panel.className = 'side-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','panelTitle');
    panel.innerHTML = `
      <div class="panel-inner">
        <div class="panel-header">
          <div>
            <div class="panel-title" id="panelTitle">Outage ${item.incidentId}</div>
            <div class="panel-sub">Last updated ${item.lastUpdated}</div>
          </div>
          <div class="panel-actions">
            <button class="btn btn-dark" id="btnComms">${iconMail()} View comms records</button>
            <button class="btn" id="btnJira">${iconExternal()} Open in Jira</button>
            <button class="btn-icon" id="btnClose" aria-label="Close">${iconClose()}</button>
          </div>
        </div>
        <div class="panel-section card">
          <div class="row-top">
            <span class="lozenge ${clsBySeverity(item.severity)}">${item.severity}</span>
            <span class="pill">${item.stage}</span>
            <span class="muted">${item.location}</span>
          </div>
          <div class="row-meta">
            <div class="muted">${item.incidentId}</div>
            <div class="muted">${item.affected}</div>
          </div>
          <div class="desc">${item.description}</div>
          <div class="compliance">
            <div class="label">Compliance review</div>
            <ul>${item.compliance.map(c=>`<li><span>${c.name}</span><span class="status ${c.warn?'warn':''}">${c.status}</span>${c.warn?iconWarn():iconCheck()}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="panel-section card">
          <div class="section-title">Outage timeline</div>
          <div class="muted small">${item.when}</div>
          <div class="timeline">
            ${item.timeline.map(t=>timelineItem(t)).join('')}
          </div>
        </div>
      </div>
    `;

    function close(){
      panel.classList.remove('open');
      overlay.classList.remove('open');
      setTimeout(()=>{ panel.remove(); overlay.remove(); }, 180);
    }

    panel.querySelector('#btnClose')?.addEventListener('click', close);
    panel.querySelector('#btnComms')?.addEventListener('click', ()=> alert('Comms record viewer coming soon'));
    panel.querySelector('#btnJira')?.addEventListener('click', ()=> alert('Open in Jira action coming soon'));
    document.addEventListener('keydown', function onEsc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', onEsc);} });

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    requestAnimationFrame(()=>{ overlay.classList.add('open'); panel.classList.add('open'); panel.querySelector('#btnClose')?.focus(); });
  }

  function timelineItem(t){
    const comp = t.complianceTimes ? `
      <div class="tl-compliance">
        <div class="label">Comms compliance</div>
        <ul>
          ${Object.entries(t.complianceTimes).map(([k,v])=>`<li><span>${k}</span><span class="muted">${v}</span>${iconCheck()}</li>`).join('')}
        </ul>
      </div>` : '';
    return `
      <div class="tl-item">
        <div class="tl-marker ok"></div>
        <div class="tl-content">
          <div class="tl-title">${t.title} <span class="lozenge ${clsBySeverity(t.badge)}">${t.badge}</span></div>
          <div class="muted">${t.time}</div>
          <div class="pill">${t.stage}</div>
          <div class="muted">${t.consumers || ''}</div>
          ${comp}
        </div>
      </div>`;
  }

  // inline icons
  function iconCheck(){
    return `<svg class="ic ic-ok" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7.8 14.3L3.5 10l1.4-1.4 2.9 2.9 7.3-7.3 1.4 1.4z"/></svg>`;
  }
  function iconWarn(){
    return `<svg class="ic ic-warn" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 2l8 14H2L10 2zm0 12a1 1 0 110 2 1 1 0 010-2zm-1-7h2v5H9V7z"/></svg>`;
  }
  function iconMail(){
    return `<svg class="ic ic-mail" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;
  }
  function iconExternal(){
    return `<svg class="ic ic-ext" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path fill="currentColor" d="M5 5h7v2H7v10h10v-5h2v7H5z"/></svg>`;
  }
  function iconClose(){
    return `<svg class="ic ic-close" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.18 12 2.89 5.71 4.3 4.29l6.29 6.29 6.3-6.29z"/></svg>`;
  }
  // added for Records timeline visuals
  function iconCross(){
    return `<svg class="ic ic-cross" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M11.41 10l4.3-4.29-1.42-1.42L10 8.59 5.71 4.29 4.29 5.71 8.59 10l-4.3 4.29 1.42 1.42L10 11.41l4.29 4.3 1.42-1.42z"/></svg>`;
  }
  function iconCircle(){
    return `<svg class="ic ic-circle" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  function iconSendPaper(){
    return `<svg class="ic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4l17.9-7.7c.9-.4.9-1.6 0-2L3.4 3.1c-.8-.3-1.6.4-1.4 1.2l1.8 6.1c.1.3.3.6.6.7l7.4 2-7.4 2c-.3.1-.5.4-.6.7L2 19.2c-.2.8.6 1.5 1.4 1.2z"/></svg>`;
  }
  function iconBigCheck(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M7 12l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  }

  function renderCreateView() {
    // Remove any old page-scoped styles that might remain
    ['co-styles','co-layout'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });

    root.innerHTML = '';
    root.appendChild(renderTopActions());

    const wrap = document.createElement('div');
    wrap.className = 'templates-view create-view';

    // Inject minimal styles for process timeline and selection highlighting
  if (!document.getElementById('co-styles')) {
      const st = document.createElement('style');
      st.id = 'co-styles';
  st.textContent = `
        /* Process timeline */
    .co-process{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
    .co-step{display:flex;align-items:center;gap:10px;position:relative}
    .co-dot{width:28px;height:28px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:#0f2946;background:#eef2f7;border:2px solid #dbe6f5}
    .co-step.active .co-dot{border-color:#0f2946;box-shadow:0 0 0 3px rgba(15,41,70,0.12)}
    .co-step.done .co-dot{background:#0f2946;color:#fff;border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,0.18)}
    .co-tick{display:none;font-size:15px;line-height:1}
        .co-step.done .co-num{display:none}
        .co-step.done .co-tick{display:inline}
    .co-lbl{font-weight:600;color:#0f2946;display:flex;align-items:center;gap:8px}
    .co-sub{font-size:12px;color:#16a34a;margin-left:0}
    .co-bar{width:56px;height:2px;background:#e2e8f0;border-radius:2px}
    .co-bar.done{background:linear-gradient(90deg,#a7f3d0,#86efac)}
        /* Left list selections */
    .outage-item,.tpl-card{transition:box-shadow .15s ease,border-color .15s ease,background .15s ease;position:relative}
    .outage-item.selected,.tpl-card.selected{border-color:#93c5fd;box-shadow:0 0 0 3px rgba(37,99,235,.12), inset 4px 0 0 #0f2946;background:linear-gradient(0deg,#f8fbff, #ffffff)}
    .badge{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:#eef2f7;color:#0f2946;font-weight:600;font-size:12px}
    .badge.warn{background:#fff7ed;color:#b45309}
    .badge.green{background:#ecfdf5;color:#047857}
    .chip-sm{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:#f1f5f9;color:#0f2946;font-size:12px}
    .kv-inline{display:flex;gap:8px;flex-wrap:wrap}
    .codebox{white-space:pre-wrap;background:#fbfdff;border:1px solid #eef4fb;padding:12px;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:13px}
    .muted-2{color:#64748b}
    .tip-box{background:#f8fafc;border:1px dashed #e2e8f0;border-radius:8px;padding:10px;color:#0f2946}
    .right-chip{display:inline-flex;align-items:center;gap:6px}
  /* Review & Submitted panes */
  .co-grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .kv{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:auto 1fr;row-gap:10px;column-gap:16px}
  .kv li{display:contents}
  .kv li span:first-child{color:#64748b}
  .loz{display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:999px;background:#eef2f7;color:#0f2946;font-weight:600;font-size:12px}
  .status-pill{display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:999px;background:#0f172a0f;color:#0f2946;font-weight:700;font-size:12px}
  .success-wrap{background:#fff;border:1px solid #eef2f7;border-radius:16px;padding:40px 26px;text-align:center}
  .success-icon{width:72px;height:72px;border-radius:999px;background:#ecfdf5;color:#047857;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
  .success-icon svg{width:36px;height:36px}
  .next-steps{background:#eff6ff;border:1px solid #dbeafe;border-radius:12px;padding:16px;text-align:left;color:#1e3a8a}
      `;
      document.head.appendChild(st);
    }

    // Process timeline + three-column layout
    wrap.innerHTML = `
      <div class="records-header">
        <div>
          <h2>Outage Communication Management</h2>
          <div class="sub">Select an outage, choose a template, generate and submit communications.</div>
        </div>
      </div>
      <div style="margin:12px 0 20px;">
        <div id="coProgress" class="co-process" aria-label="Progress steps">
          <div class="co-step" data-step="1">
            <div class="co-dot"><span class="co-num">1</span><span class="co-tick">✓</span></div>
            <div class="co-lbl">Select Outage & Template <span class="co-sub" hidden>Complete</span></div>
          </div>
          <div class="co-bar"></div>
          <div class="co-step" data-step="2">
            <div class="co-dot"><span class="co-num">2</span><span class="co-tick">✓</span></div>
            <div class="co-lbl">Generate Draft <span class="co-sub" hidden>Complete</span></div>
          </div>
          <div class="co-bar"></div>
          <div class="co-step" data-step="3">
            <div class="co-dot"><span class="co-num">3</span><span class="co-tick">✓</span></div>
            <div class="co-lbl">Review Draft <span class="co-sub" hidden>Complete</span></div>
          </div>
          <div class="co-bar"></div>
          <div class="co-step" data-step="4">
            <div class="co-dot"><span class="co-num">4</span><span class="co-tick">✓</span></div>
            <div class="co-lbl">Submit Comms <span class="co-sub" hidden>Complete</span></div>
          </div>
        </div>
      </div>

      <div id="coBody">
      <div class="records-card" style="padding:0;">
        <div style="display:grid;grid-template-columns:320px 1fr 360px;gap:20px;padding:20px;align-items:start;">
          <!-- LEFT: Outage list + templates -->
          <div>
            <div class="card" style="margin-bottom:12px;">
              <div style="font-weight:700;margin-bottom:8px;">Select Outage</div>
              <input id="cSearch" placeholder="Search by outage, location or cause..." style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:10px;" />
              <div id="outageList" style="max-height:360px;overflow:auto;display:flex;flex-direction:column;gap:8px;"></div>
            </div>

            <div class="card">
              <div style="font-weight:700;margin-bottom:8px;">Communication Templates</div>
              <div id="templateList" style="display:flex;flex-direction:column;gap:8px;max-height:320px;overflow:auto;"></div>
            </div>
          </div>

          <!-- CENTER: Template preview -->
          <div>
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-weight:700;display:flex;align-items:center;gap:8px;"><span id="tplTitle">Template Preview</span> <span id="tplTitleTag" class="chip-sm" hidden>—</span></div>
                <select id="cChannel" style="min-width:180px;padding:6px;border:1px solid #e5e7eb;border-radius:6px;">
                  <option value="">Channel (Email/SMS/Website)</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Website">Website</option>
                </select>
              </div>
              <div style="margin-top:10px;">
                <div class="muted-2" style="margin-bottom:6px;">Template Variables:</div>
                <div id="tplVars" class="kv-inline"></div>
              </div>
              <div class="muted-2" style="margin-top:10px;">Preview:</div>
              <div id="templatePreview" class="codebox">Select a template to preview its content with outage data.</div>
              <div id="notePreview" class="muted-2" style="display:none;margin-top:8px;">• Preview populated with selected outage data</div>
              <div id="previewStatus" style="margin-top:10px;color:#16a34a;display:none;">Ready to generate: Template and outage data are selected.</div>
              <div style="margin-top:12px;text-align:right;"><button id="btnGenerate" class="btn btn-dark" disabled>Generate Draft</button></div>
            </div>
          </div>

          <!-- RIGHT: Generated draft -->
          <div>
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <div style="font-weight:700;">Generated Communication Draft</div>
                <div class="right-chip"><span id="draftStatusChip" class="badge green" hidden>Generated</span><span id="draftCounts" class="muted">&nbsp;</span></div>
              </div>
              <div id="draftMeta" class="muted" style="margin-bottom:8px;">No draft generated</div>
              <textarea id="draftArea" style="width:100%;min-height:360px;padding:12px;border:1px solid #e5e7eb;border-radius:6px;box-sizing:border-box;"> </textarea>
              <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
                <button id="btnSave" class="btn">Save draft</button>
                <button id="btnSubmit" class="btn btn-dark" disabled>Submit for Approval</button>
              </div>
              <div id="draftTip" class="tip-box" style="margin-top:10px;display:none;">💡 Tip: You can edit this draft if needed. Any modifications will require a reason for the change.</div>
              <div class="muted-2" style="margin-top:12px;">
                <div style="font-weight:700;margin-bottom:6px;">Guidelines:</div>
                <ul style="margin:0;padding-left:18px;line-height:1.6;">
                  <li>Ensure all customer impact details are accurate</li>
                  <li>Include timeline and next steps</li>
                  <li>Use clear, concise language</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    `;

    root.appendChild(wrap);

    // Data and rendering helpers
    const outageListEl = wrap.querySelector('#outageList');
    const templateListEl = wrap.querySelector('#templateList');
    const previewEl = wrap.querySelector('#templatePreview');
    const tplVarsEl = wrap.querySelector('#tplVars');
    const tplTitle = wrap.querySelector('#tplTitle');
    const tplTitleTag = wrap.querySelector('#tplTitleTag');
    const notePreview = wrap.querySelector('#notePreview');
    const previewStatus = wrap.querySelector('#previewStatus');
    const draftArea = wrap.querySelector('#draftArea');
    const draftMeta = wrap.querySelector('#draftMeta');
    const btnGenerate = wrap.querySelector('#btnGenerate');
    const btnSave = wrap.querySelector('#btnSave');
    const btnSubmit = wrap.querySelector('#btnSubmit');
  const draftStatusChip = wrap.querySelector('#draftStatusChip');
    const draftCounts = wrap.querySelector('#draftCounts');
    const draftTip = wrap.querySelector('#draftTip');
    const channelSel = wrap.querySelector('#cChannel');
    const searchInput = wrap.querySelector('#cSearch');
  const coBody = wrap.querySelector('#coBody');

    // Simple templates sample
    const templates = [
      { id: 'TPL-001', name: 'Initial Outage Notification (Email)', channel: 'Email', body: 'Subject: Service Outage Notification - {{outageId}}\n\nDear Valued Customer,\n\nWe are currently experiencing a service outage in the {{location}} area affecting approximately {{consumers}} customers.\n\nRegards,\nCustomer Service Team' },
      { id: 'TPL-002', name: 'SMS Alert - Service Interruption', channel: 'SMS', body: 'SERVICE ALERT: We\'re experiencing an outage in {{location}} affecting ~{{consumers}} customers. Ref: {{outageId}}' },
      { id: 'TPL-003', name: 'Website Banner Notification', channel: 'Website', body: 'SERVICE UPDATE: We are currently experiencing service issues in {{location}}. Incident: {{outageId}}' }
    ];

  // Render outages (use outagesData)
    let selectedOutage = null;
    function renderOutages(filter) {
      outageListEl.innerHTML = outagesData.filter(o => {
        if (!filter) return true;
        return (o.id||'').toLowerCase().includes(filter) || (o.location||'').toLowerCase().includes(filter);
      }).map(o => `
        <button class="outage-item" data-id="${o.id}" style="text-align:left;padding:12px;border:1px solid #eef4fb;border-radius:8px;background:#fff;">\
          <div style="display:flex;justify-content:space-between;align-items:center;">\
            <div style="font-weight:700;display:flex;align-items:center;gap:8px;">${escapeHtml(o.id)} <span class="chip-sm">STAGE 1</span></div>\
            <div class="muted">${(o.consumers||0).toLocaleString()} customers</div>\
          </div>\
          <div class="muted" style="font-size:13px;margin-top:6px;">${escapeHtml(o.location)}</div>\
          <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">\
            <span class="badge warn">${escapeHtml(o.type)} outage</span>\
            <span class="muted-2" style="font-size:12px;">Identified: ${escapeHtml(o.stages?.[0]?.time || '')}</span>\
          </div>\
        </button>
      `).join('');
    }
    renderOutages();

    // Render templates list
    let selectedTemplate = null;
    function extractVars(body) {
      const out = new Set();
      String(body||'').replace(/{{\s*(\w+)\s*}}/g, (_, k) => { out.add(k); return ''; });
      return Array.from(out);
    }
    function renderTemplates() {
      templateListEl.innerHTML = templates.map(t => {
        const vars = extractVars(t.body).length;
        return `
        <button class="tpl-card" data-tpl="${t.id}" style="text-align:left;padding:12px;border:1px solid #eef4fb;border-radius:8px;background:#fff;">\
          <div style="display:flex;justify-content:space-between;align-items:center;">\
            <div style="font-weight:700;">${escapeHtml(t.name)}</div>\
            <span class="chip-sm">${escapeHtml(t.channel)}</span>\
          </div>\
          <div class="muted" style="font-size:12px;margin-top:6px;">${escapeHtml(t.id)} · Variables: ${vars}</div>\
        </button>`;
      }).join('');
    }
    renderTemplates();

    // Simple placeholder replacer
  function fillTemplate(body, outage) {
      const data = {
        outageId: outage?.id || '',
        location: outage?.location || '',
        consumers: outage && typeof outage.consumers === 'number' ? outage.consumers.toLocaleString() : (outage?.consumers || '')
      };
      return String(body || '').replace(/{{\s*(\w+)\s*}}/g, (_, k) => data[k] !== undefined ? data[k] : '');
    }

    // Progress computation
    let generated = false; // draft generated at least once
    let reviewed = false;  // any edits/saves count as review
    let submitted = false; // submitted
    const progressEl = wrap.querySelector('#coProgress');

    function computeStepStates() {
      const step1 = !!(selectedOutage && selectedTemplate && (channelSel.value||'').trim());
      const step2 = step1 && !!generated;
      const step3 = step2 && (!!draftArea.value.trim() && reviewed);
      const step4 = step3 && submitted;
      return [step1, step2, step3, step4];
    }
    function updateProgressUI() {
      const states = computeStepStates();
      const steps = Array.from(progressEl.querySelectorAll('.co-step'));
      const bars = Array.from(progressEl.querySelectorAll('.co-bar'));
      const current = Math.max(0, states.indexOf(false)); // first incomplete
      steps.forEach((el, i) => {
        el.classList.toggle('done', !!states[i]);
        el.classList.toggle('active', i === (current===-1?3:current));
        const sub = el.querySelector('.co-sub');
        if (sub) sub.hidden = !states[i];
      });
      bars.forEach((b, i) => b.classList.toggle('done', !!states[i]));
    }

    // wire outage clicks
    outageListEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      const id = b.getAttribute('data-id');
      selectedOutage = outagesData.find(x => x.id === id) || null;
      // highlight selection
  [...outageListEl.children].forEach(ch => ch.classList.toggle('selected', ch.getAttribute('data-id')===id));
      updatePreview();
      updateProgressUI();
    });

    // wire template clicks
    templateListEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tpl]');
      if (!b) return;
      const id = b.getAttribute('data-tpl');
      selectedTemplate = templates.find(t => t.id === id) || null;
  [...templateListEl.children].forEach(ch => ch.classList.toggle('selected', ch.getAttribute('data-tpl')===id));
  // Default channel to template channel when chosen (user can still change)
  if (selectedTemplate?.channel && !channelSel.value) channelSel.value = selectedTemplate.channel;
      updatePreview();
      updateProgressUI();
    });

    // search
    searchInput.addEventListener('input', (e) => renderOutages(String(e.target.value || '').toLowerCase()));

    function updatePreview() {
      if (!selectedTemplate) { 
        tplTitle.textContent = 'Template Preview';
        tplTitleTag.hidden = true;
        tplVarsEl.innerHTML = '';
        previewEl.textContent = 'Select a template to preview its content with outage data.'; 
        notePreview.style.display = 'none';
        previewStatus.style.display='none'; btnGenerate.disabled = true; return; 
      }
      // header
      tplTitle.textContent = selectedTemplate.name;
      tplTitleTag.textContent = selectedTemplate.channel || '—';
      tplTitleTag.hidden = false;
      const vars = extractVars(selectedTemplate.body);
      tplVarsEl.innerHTML = vars.map(v => `<span class="chip-sm">${escapeHtml(v)}</span>`).join('');
      const filled = fillTemplate(selectedTemplate.body, selectedOutage);
      previewEl.textContent = filled || 'Preview populated with selected template.';
      const ready = selectedTemplate && selectedOutage && channelSel.value;
      notePreview.style.display = selectedOutage ? 'block' : 'none';
      previewStatus.style.display = ready ? 'block' : 'none';
      btnGenerate.disabled = !ready;
      updateProgressUI();
    }

    // channel change enables generate when outage+template selected
  channelSel.addEventListener('change', () => { updatePreview(); updateProgressUI(); });

    // Generate: populate draftArea
    btnGenerate.addEventListener('click', () => {
      if (!selectedOutage || !selectedTemplate) return alert('Please select outage and template');
      const txt = fillTemplate(selectedTemplate.body, selectedOutage);
      draftArea.value = txt;
      draftMeta.textContent = `Generated from ${selectedTemplate.id} for ${selectedOutage.id} (Channel: ${channelSel.value || '—'})`;
      btnSubmit.disabled = false;
      generated = true; reviewed = true; // user can now review
      draftStatusChip.hidden = false;
      const words = (txt.trim().match(/\S+/g) || []).length;
      draftCounts.textContent = `${words} words · ${txt.trim().length} characters`;
      draftTip.style.display = 'block';
      updateProgressUI();
    });

    // Save and Submit
    btnSave.addEventListener('click', () => {
      const payload = { id: `S-${Date.now()}`, outage: selectedOutage?.id || null, channel: channelSel.value || null, template: selectedTemplate?.id || null, draft: draftArea.value || '', status: 'Saved', created: new Date().toISOString() };
      const store = JSON.parse(localStorage.getItem('commsDraftsV1') || '[]');
      store.push(payload); localStorage.setItem('commsDraftsV1', JSON.stringify(store));
      alert('Draft saved locally');
      reviewed = true; updateProgressUI();
      const txt = draftArea.value || '';
      const words = (txt.trim().match(/\S+/g) || []).length;
      draftCounts.textContent = txt ? `${words} words · ${txt.trim().length} characters` : '';
    });

    btnSubmit.addEventListener('click', () => {
      // Open the Review screen rather than final submit immediately
      showReviewScreen();
    });

    // initial state
  previewEl.textContent = 'Select an outage and template to preview.';
  draftArea.value = '';
  // When user types into draft, consider it reviewed
  draftArea.addEventListener('input', () => { if (draftArea.value.trim()) { reviewed = true; updateProgressUI(); const txt = draftArea.value; const words = (txt.trim().match(/\S+/g) || []).length; draftCounts.textContent = `${words} words · ${txt.trim().length} characters`; } else { draftCounts.textContent=''; } });
    // Initial paint of progress timeline
  updateProgressUI();

    // ===== Review and Submitted screens =====
    let reviewMode = false;
    function showReviewScreen(){
      if (!selectedOutage || !selectedTemplate || !channelSel.value || !draftArea.value.trim()) {
        alert('Please select outage, template, channel and generate the draft before submitting.');
        return;
      }
      reviewMode = true;
      updateProgressUI();
      const txt = draftArea.value.trim();
      const words = (txt.match(/\S+/g) || []).length;
      const chars = txt.length;
      const vars = extractVars(selectedTemplate.body).length;
      coBody.innerHTML = `
        <div class="records-header" style="margin:0 0 10px 0;">
          <div>
            <h3 style="margin:0 0 4px 0;">Review and Submit for Approval</h3>
            <div class="sub">Review all details below before submitting your communication draft for approval.</div>
          </div>
        </div>
        <div class="co-grid2">
          <div class="card" style="padding:16px;">
            <div style="font-weight:700;margin-bottom:10px;">Outage Information</div>
            <ul class="kv">
              <li><span>Incident ID:</span><span style="text-align:right;font-weight:700;">${escapeHtml(selectedOutage.id)}</span></li>
              <li><span>Region:</span><span style="text-align:right;">${escapeHtml(selectedOutage.location)}</span></li>
              <li><span>Classification:</span><span style="text-align:right;"><span class="loz">${escapeHtml(selectedOutage.type)} Outage</span></span></li>
              <li><span>Customers Affected:</span><span style="text-align:right;">${(selectedOutage.consumers||0).toLocaleString()}</span></li>
              <li><span>Status:</span><span style="text-align:right;"><span class="status-pill">STAGE 1</span></span></li>
            </ul>
          </div>
          <div class="card" style="padding:16px;">
            <div style="font-weight:700;margin-bottom:10px;">Final Communication Draft</div>
            <div class="codebox" style="min-height:280px;">${escapeHtml(txt)}</div>
            <div class="muted-2" style="margin-top:8px;">${chars} characters · ${words} words</div>
          </div>
        </div>
        <div class="co-grid2" style="margin-top:16px;gap:20px;">
          <div class="card" style="padding:16px;">
            <div style="font-weight:700;margin-bottom:10px;">Communication Template</div>
            <ul class="kv">
              <li><span>Template:</span><span style="text-align:right;">${escapeHtml(selectedTemplate.name)}</span></li>
              <li><span>Type:</span><span style="text-align:right;"><span class="chip-sm">${escapeHtml(channelSel.value)}</span></span></li>
              <li><span>Variables:</span><span style="text-align:right;">${vars}</span></li>
            </ul>
          </div>
          <div></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:14px;">
          <button id="btnStartOver" class="btn">⟲ Start Over</button>
          <div style="flex:1"></div>
          <button id="btnFinalSubmit" class="btn btn-dark">${iconSendPaper()} Submit for Approval</button>
        </div>
        <div class="tip-box" style="margin-top:12px;display:flex;gap:8px;align-items:flex-start;">
          <span>📄</span>
          <div>
            <div style="font-weight:700;margin-bottom:4px;">Approval Process</div>
            <div class="muted-2">Once submitted, your communication will be reviewed by the communications team for accuracy, tone, and compliance. You'll receive an email notification when the review is complete.</div>
          </div>
        </div>
      `;
      // wire review page buttons
      coBody.querySelector('#btnStartOver')?.addEventListener('click', () => { renderCreateView(); });
      coBody.querySelector('#btnFinalSubmit')?.addEventListener('click', finalizeSubmit);
    }

    function finalizeSubmit(){
      const payload = { id: `D-${Date.now()}`, outage: selectedOutage?.id || null, channel: channelSel.value || null, template: selectedTemplate?.id || null, draft: draftArea.value || '', status: 'Pending approval', created: new Date().toISOString() };
      const store = JSON.parse(localStorage.getItem('commsDraftsV1') || '[]');
      store.push(payload); localStorage.setItem('commsDraftsV1', JSON.stringify(store));
      submitted = true; reviewMode = false; updateProgressUI();
      showSubmittedScreen();
    }

    function showSubmittedScreen(){
      coBody.innerHTML = `
        <div class="success-wrap">
          <div class="success-icon">${iconBigCheck()}</div>
          <h2 style="margin:0 0 6px 0;">Submitted for Approval</h2>
          <div class="muted-2" style="margin-bottom:18px;">Your communication draft has been submitted for approval and will be reviewed by the communications team.</div>
          <div class="next-steps">
            <div style="font-weight:700;display:flex;align-items:center;gap:8px;margin-bottom:8px;">⏱ Next Steps</div>
            <ul style="margin:0;padding-left:18px;line-height:1.7;">
              <li>Communications team will review within 15 minutes</li>
              <li>You'll receive an email notification when approved</li>
              <li>Draft will be sent to affected customers once approved</li>
            </ul>
          </div>
          <div style="margin-top:18px;">
            <button id="btnCreateAnother" class="btn btn-dark">Create Another Communication</button>
          </div>
        </div>
      `;
      coBody.querySelector('#btnCreateAnother')?.addEventListener('click', () => { renderCreateView(); });
    }

    // Make timeline reflect review mode
    const _origCompute = computeStepStates;
    computeStepStates = function(){
      const [s1,s2,s3,s4] = _origCompute();
      if (reviewMode && !submitted) { return [s1,s2,s3,false]; }
      return [s1,s2,s3,s4];
    };
  }


 function renderRecordsView() {
    // Build records screen to match the screenshot: filters + table + details grid
    root.innerHTML = '';
    root.appendChild(renderTopActions());
    const wrap = document.createElement('div');
    wrap.className = 'records-view';
    wrap.innerHTML = `
      <div class="records-header">
        <div>
          <h2>Comms Records</h2>
          <div class="sub">View stage-wise communication records for outages. Select an outage to see details.</div>
        </div>
      </div>
      <div class="records-card">
        <div class="filters" id="recordsFilters">
          <input type="text" id="fSearch" placeholder="Search by outage, location" />
          <input type="text" id="fId" placeholder="Filter by outage ID..." />
          <select id="fType">
            <option value="">All Outages</option>
            <option>Major</option>
            <option>Minor</option>
          </select>
          <select id="fLoc">
            <option value="">All Locations</option>
            <option>NYC</option>
            <option>LA</option>
          </select>
          <input type="date" id="fStart" placeholder="dd / mm / yyyy" />
          <input type="date" id="fEnd" placeholder="dd / mm / yyyy" />
          <button id="btnApplyFilters" class="btn-dark">Apply filters</button>
        </div>
        <div class="table-wrap">
          <table class="records-table" aria-label="Outage records">
            <thead>
              <tr>
                <th>Outage ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Consumers</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="recBody"></tbody>
          </table>
        </div>
        <div class="table-footer" style="justify-content:space-between;">
          <div id="pageInfo" class="muted">0–0 of 0</div>
          <div class="right">
            <button class="pager" id="btnPrev" disabled>Previous</button>
            <button class="pager" id="btnNext" disabled>Next</button>
          </div>
        </div>
        <div style="text-align:center;margin:10px 0;">
          <span class="pill" id="detailsPill">Details</span>
        </div>
        <div class="timeline-panel" id="details"></div>
      </div>
    `;
    root.appendChild(wrap);

    // Use the shared outagesData above as our mock dataset
    const allRows = outagesData.map(o => ({
      id: o.id,
      type: o.type,
      location: o.location,
      consumers: o.consumers,
      date: (o.stages?.[0]?.time) || '01/02/2025',
      stages: o.stages || [],
    }));

    // State
    let filtered = allRows.slice();
    let page = 0;
    const pageSize = 5;
    let selectedId = filtered[0]?.id || null;

    // Render table rows for current page
    function renderTable() {
      const body = wrap.querySelector('#recBody');
      if (!filtered.length) {
        body.innerHTML = `<tr><td colspan="6"><div class="empty">No records found.</div></td></tr>`;
        wrap.querySelector('#pageInfo').textContent = '0–0 of 0';
        wrap.querySelector('#btnPrev').disabled = true;
        wrap.querySelector('#btnNext').disabled = true;
        renderDetails(null);
        return;
      }
      const start = page * pageSize;
      const end = Math.min(start + pageSize, filtered.length);
      const pageRows = filtered.slice(start, end);
      body.innerHTML = pageRows.map(r => `
        <tr data-id="${r.id}" class="${r.id===selectedId?'selected':''}">
          <td>${escapeHtml(r.id)}</td>
          <td>${escapeHtml(r.type)}</td>
          <td>${escapeHtml(r.location)}</td>
          <td>${escapeHtml(r.date)}</td>
          <td>${(r.consumers||0).toLocaleString()}</td>
          <td><button class="link-btn" data-view="${escapeHtml(r.id)}">View</button></td>
        </tr>
      `).join('');
      wrap.querySelector('#pageInfo').textContent = `${start+1}–${end} of ${filtered.length}`;
      wrap.querySelector('#btnPrev').disabled = page === 0;
      wrap.querySelector('#btnNext').disabled = end >= filtered.length;

      // bind click
      body.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', (e)=>{
        selectedId = btn.getAttribute('data-view');
        renderTable();
        const row = filtered.find(x=>x.id===selectedId) || null;
        renderDetails(row);
      }));
    }

    function iconForStageIdx(idx, maxDone = 2) {
      // first two done as per screenshot; others idle
      if (idx < maxDone) return '<span class="icon-tick"></span>';
      if (idx === maxDone) return '<span class="icon-circle"></span>';
      return '<span class="icon-circle"></span>';
    }

    function renderDetails(row) {
      const host = wrap.querySelector('#details');
      if (!row) { host.innerHTML = '<div class="muted">Select an outage to view details.</div>'; return; }
      const updated = new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' }).toLowerCase();
      const stages = row.stages || [];

      // Inject lightweight styles once for the details layout
      if (!document.getElementById('cr-styles')) {
        const st = document.createElement('style');
        st.id = 'cr-styles';
        st.textContent = `
          .cr-wrap{background:#fff;border-radius:14px;padding:18px 22px;border:1px solid #eef2f7}
          .cr-top h3{margin:0 0 4px 0;font-size:22px}
          .cr-top .muted{color:#64748b}
          .cr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:14px}
          @media (max-width: 980px){.cr-grid{grid-template-columns:repeat(2,1fr)}}
          @media (max-width: 640px){.cr-grid{grid-template-columns:1fr}}
          .cr-stage .s-head{display:flex;align-items:center;gap:10px;color:#94a3b8;margin:6px 0 10px}
          .cr-dot{width:18px;height:18px;border-radius:999px;border:2px solid #22c55e;display:inline-flex;align-items:center;justify-content:center}
          .cr-dot.warn{border-color:#f59e0b}
          .cr-line{height:2px;background:#e2e8f0;flex:1;border-radius:2px}
          .cr-title{font-weight:700;margin:6px 0 2px 0}
          .cr-time{color:#64748b;margin-bottom:6px}
          .cr-pill{display:inline-flex;align-items:center;gap:8px;margin:8px 0 12px 0}
          .cr-badge{background:#eef2f7;border-radius:9999px;padding:3px 10px;font-weight:600;color:#0f2946}
          .cr-cons{color:#64748b}
          .cr-ctitle{font-weight:700;margin:8px 0}
          .cr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
          .cr-list li{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center}
          .cr-list .muted{color:#64748b}
          .cr-ok svg,.cr-warn svg{width:18px;height:18px}
          .cr-warn svg{color:#f59e0b}
          .cr-ok svg{color:#3b82f6}
        `;
        document.head.appendChild(st);
      }

      const stageStatus = (s) => (s.comms || []).some(c => c.icon==='exclaim' || c.icon==='cross') ? 'warn' : 'ok';
      const pctFor = (s) => stageStatus(s)==='ok' ? '100%' : '98%';

      host.innerHTML = `
        <div class="cr-wrap">
          <div class="cr-top">
            <h3>Comms record for Outage ${escapeHtml(row.id)}</h3>
            <div class="muted">Last updated ${escapeHtml(updated)}</div>
          </div>
          <div class="cr-grid">
            ${stages.map((st, i) => {
              const warn = stageStatus(st) === 'warn';
              return `
                <div class="cr-stage">
                  <div class="s-head"><span class="cr-dot ${warn?'warn':''}"></span><span class="cr-line"></span></div>
                  <div class="cr-title">${escapeHtml(st.name)}</div>
                  <div class="cr-time">${escapeHtml(st.time)}</div>
                  <div class="cr-pill">
                    <span class="cr-badge">${pctFor(st)}</span>
                    <span class="cr-cons">${(st.consumers || row.consumers || 0).toLocaleString()} consumers</span>
                  </div>
                  <div class="cr-ctitle">Comms compliance</div>
                  <ul class="cr-list">
                    ${(st.comms||[]).map(c => `
                      <li>
                        <span>${escapeHtml(c.channel)}</span>
                        <span class="muted">${escapeHtml(c.status)}</span>
                        <span class="${c.icon==='exclaim'?'cr-warn':'cr-ok'}">${c.icon==='exclaim'?iconWarn():iconCheck()}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    function applyFilters() {
      const q = (wrap.querySelector('#fSearch').value || '').trim().toLowerCase();
      const qId = (wrap.querySelector('#fId').value || '').trim().toLowerCase();
      const t = wrap.querySelector('#fType').value;
      const loc = wrap.querySelector('#fLoc').value;
      const d1 = wrap.querySelector('#fStart').value ? new Date(wrap.querySelector('#fStart').value) : null;
      const d2 = wrap.querySelector('#fEnd').value ? new Date(wrap.querySelector('#fEnd').value) : null;
      filtered = allRows.filter(r => {
        const matchesText = !q || r.id.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
        const matchesId = !qId || r.id.toLowerCase().includes(qId);
        const matchesType = !t || r.type === t;
        const matchesLoc = !loc || r.location === loc;
        let matchesDate = true;
        // Parse dd/mm/yyyy or ISO-like strings in r.date
        const parseDate = (s) => {
          const m = String(s).match(/(\d{2})\/(\d{2})\/(\d{4})/);
          if (m) return new Date(Number(m[3]), Number(m[2])-1, Number(m[1]));
          const d = new Date(s); return isNaN(d) ? null : d;
        };
        const rd = parseDate(r.date);
        if (d1 && rd) matchesDate = matchesDate && rd >= d1;
        if (d2 && rd) matchesDate = matchesDate && rd <= new Date(d2.getTime()+86399999);
        return matchesText && matchesId && matchesType && matchesLoc && matchesDate;
      });
      page = 0;
      selectedId = filtered[0]?.id || null;
      renderTable();
      renderDetails(filtered.find(x=>x.id===selectedId) || null);
    }

    // Wire events
    wrap.querySelector('#btnApplyFilters').addEventListener('click', applyFilters);
    wrap.querySelector('#btnPrev').addEventListener('click', () => { if (page>0) { page--; renderTable(); } });
    wrap.querySelector('#btnNext').addEventListener('click', () => { if ((page+1)*pageSize < filtered.length) { page++; renderTable(); } });

    // Initial paint
    renderTable();
    renderDetails(filtered[0] || null);
  }

  // initial view
  renderHome();

  function svgIcon(name){
    switch(name){
      case 'bolt': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>`;
  case 'send': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  case 'home': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>`;
      case 'user': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      case 'bot': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>`;
      case 'pin': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 5-9 12-9 12S3 15 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
      case 'alert': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      case 'doc': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>`;
      case 'template': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>`;
      case 'plus': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#0f2946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      case 'search': return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      default: return '';
    }
  }
})();
