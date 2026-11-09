/* FM Atlas, nieuwe stijl: topbalk, zoeken, vakkenoverzicht en vakpagina.
 * Data komt uit js/atlas-data.js. Account en kaartvoortgang via atlas-account.js.
 */
(function () {
  'use strict';
  const VAKKEN = window.ATLAS_VAKKEN;
  const HUIDIG = window.ATLAS_HUIDIG;
  const accountScript = new URL('atlas-account.js', document.currentScript.src).href;
  const measurementScript = new URL('atlas-meten.js', document.currentScript.src).href;
  const accountReady = window.AtlasAccount ? Promise.resolve(window.AtlasAccount) : new Promise(resolve => {
    const script = document.createElement('script');
    script.src = accountScript;
    script.onload = () => resolve(window.AtlasAccount || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  accountReady.then(() => {
    if (window.AtlasMeten) return;
    const script = document.createElement('script');
    script.src = measurementScript;
    document.head.appendChild(script);
  });

  // ── Iconen (24×24, lijn) ──
  const P = {
    logo: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="m12 12 8-4.5M12 12v9M12 12 4 7.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    play: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/>',
    cards: '<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v11"/>',
    check: '<path d="M9 11.5 11.5 14 16 9"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
    quiz: '<path d="M9 4h6M8 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><path d="M8 11h8M8 15h5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    building: '<path d="M4 21V5l8-2v18M12 7l8 2v12M2 21h20"/><path d="M8 8v.01M8 12v.01M8 16v.01M16 12v.01M16 16v.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M4 4v4h4M20 20v-4h-4"/>',
    scope: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
    event: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    cart: '<path d="M3 4h2l2.4 11h11L21 8H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    shift: '<path d="M4 7h12l-3-3M20 17H8l3 3"/>',
  };
  function icon(name, size) {
    const s = size || 20;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.book}</svg>`;
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const periodLabel = (y, p) => `Jaar ${y} · Periode ${p}`;
  const periodsLabel = v => v.periods.length > 1 ? `P${v.periods.join(' + P')}` : `Periode ${v.periods[0]}`;
  const vakUrl = v => `vak.html?v=${encodeURIComponent(v.key)}`;
  const vakImg = v => `media/vakken/${v.key}.webp`;
  const allItems = v => [...v.leren, ...v.oefenen, ...v.toetsen];

  // ── Thema ──
  function getTheme() { try { return localStorage.getItem('atlas-theme'); } catch (_) { return null; } }
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  applyTheme(getTheme());
  function isDark() {
    const t = document.documentElement.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ── Topbalk ──
  function renderTopbar(crumbs) {
    const el = document.getElementById('topbar');
    if (!el) return;
    if (!document.getElementById('atlas-account-style')) {
      const style = document.createElement('style');
      style.id = 'atlas-account-style';
      style.textContent = `
        .topbar-inner { flex-wrap: wrap; }
        .topbar-inner .search { flex: 1; min-width: 120px; max-width: 340px; width: auto; }
        .topbar-inner .crumbs { flex: 1; flex-wrap: wrap; color: var(--ink); }
        .topbar-inner .crumbs .sep { color: var(--ink); }
        .topbar-inner .search input { height: 44px; }
        .topbar-inner .search input::placeholder, .topbar-inner .search > svg,
        .topbar-inner .results-empty { color: var(--ink); }
        .topbar-inner .icon-btn { width: 44px; height: 44px; }
        .atlas-account { position: relative; flex: none; }
        .account-trigger { min-height: 44px; max-width: 150px; padding: 10px 18px; border-radius: var(--r-pill); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .account-trigger:disabled { cursor: wait; }
        .account-menu, .account-message { position: absolute; top: calc(100% + 12px); right: 0; padding: 8px; border-radius: var(--r-md); background: var(--glass-strong); color: var(--ink); }
        .account-menu { min-width: 144px; }
        .account-menu button { min-height: 44px; width: 100%; padding: 10px 16px; border-radius: var(--r-sm); text-align: left; }
        .account-menu button:hover { background: var(--glass-hover); }
        .account-message { width: min(256px, calc(100vw - 80px)); padding: 16px; font-size: 14px; }
        .atlas-account [hidden] { display: none; }
        .atlas-card-progress { margin-bottom: 24px; }
        .atlas-card-progress p { margin-bottom: 10px; }
        .atlas-card-progress .card-meter { height: 6px; border-radius: var(--r-pill); overflow: hidden; background: var(--glass-strong); }
        .atlas-card-progress .card-meter span { display: block; height: 100%; background: var(--accent); }
        @media (max-width: 760px) {
          .topbar-inner { display: grid; grid-template-columns: minmax(0, 1fr) auto 44px; gap: 8px; border-radius: var(--r-md); padding: 8px 12px; }
          .topbar-inner .brand { grid-area: 1 / 1; }
          .topbar-inner .brand-name { display: inline; }
          .topbar-inner .atlas-account { grid-area: 1 / 2; }
          .topbar-inner .icon-btn { grid-area: 1 / 3; }
          .topbar-inner .crumbs { grid-area: 2 / 1 / 3 / -1; font-size: 14px; }
          .topbar-inner .search { grid-area: 2 / 1 / 3 / -1; width: 100%; max-width: none; margin: 0; }
          .topbar-inner.has-crumbs .search { grid-row: 3; }
          .account-trigger { max-width: 128px; padding-inline: 14px; }
        }`;
      document.head.appendChild(style);
    }
    const crumbHtml = crumbs ? `<nav class="crumbs" aria-label="Kruimelpad">${crumbs}</nav>` : '';
    el.innerHTML = `
      <div class="topbar-inner glass${crumbs ? ' has-crumbs' : ''}">
        <a class="brand" href="index.html" aria-label="FM Atlas, naar alle vakken">
          <span class="brand-name">FM Atlas</span>
        </a>
        ${crumbHtml}
        <div class="search" role="search">
          ${icon('search', 16)}
          <input id="q" type="search" placeholder="Zoek een vak of onderdeel" autocomplete="off" aria-label="Zoeken" aria-controls="results"/>
          <div class="results glass" id="results" role="listbox" hidden></div>
        </div>
        <div class="atlas-account" id="atlas-account"><button class="account-trigger glass" type="button">Inloggen</button></div>
        <button class="icon-btn" id="theme-btn" type="button" aria-label="Licht of donker"></button>
      </div>`;
    const tb = document.getElementById('theme-btn');
    const paint = () => { tb.innerHTML = icon(isDark() ? 'sun' : 'moon', 18); };
    paint();
    tb.onclick = () => {
      const next = isDark() ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('atlas-theme', next); } catch (_) {}
      paint();
    };
    accountReady.then(account => {
      const slot = document.getElementById('atlas-account');
      if (account) account.mount(slot);
      else if (slot) {
        slot.querySelector('button').onclick = () => {
          slot.querySelector('button').textContent = 'Geen verbinding';
        };
      }
    });
    setupSearch();
  }

  // ── Zoeken: vakken en hun onderdelen ──
  function setupSearch() {
    const q = document.getElementById('q');
    const box = document.getElementById('results');
    const index = [];
    VAKKEN.forEach(v => {
      index.push({ title: v.title, sub: `Vak · ${periodLabel(v.year, v.periods[0])}`, url: vakUrl(v), ico: v.icon, hay: `${v.title} ${v.code || ''} ${v.sub}`.toLowerCase() });
      allItems(v).forEach(([label, url, ico]) => {
        index.push({ title: label, sub: v.title, url, ico, hay: `${label} ${v.title}`.toLowerCase() });
      });
    });
    let active = -1, hits = [];
    const close = () => { box.hidden = true; active = -1; };
    const paint = () => {
      box.innerHTML = hits.length
        ? hits.map((h, i) => `<a class="result${i === active ? ' active' : ''}" role="option" href="${esc(h.url)}"><span class="result-title">${esc(h.title)}</span><span class="result-in">${esc(h.sub)}</span></a>`).join('')
        : '<div class="results-empty">Niets gevonden.</div>';
    };
    q.addEventListener('input', () => {
      const terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (!terms.length) return close();
      hits = index.filter(r => terms.every(t => r.hay.includes(t))).slice(0, 12);
      active = hits.length ? 0 : -1;
      paint(); box.hidden = false;
    });
    q.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'ArrowDown') { active = Math.min(active + 1, hits.length - 1); paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { active = Math.max(active - 1, 0); paint(); e.preventDefault(); }
      else if (e.key === 'Enter' && hits[active]) { location.href = hits[active].url; }
      else if (e.key === 'Escape') { close(); q.blur(); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.search')) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== q && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
    });
  }

  // ── Startpagina: kies een periode, zie de vakken ──
  function renderHome() {
    renderTopbar('');
    const years = [...new Set(VAKKEN.map(v => v.year))].sort((a, b) => b - a);
    const tabs = years.map(y => ({
      year: y,
      periods: [...new Set(VAKKEN.filter(v => v.year === y).flatMap(v => v.periods))].sort(),
    }));
    const parse = h => { const m = /^#j(\d)p(\d)$/.exec(h); return m ? { year: +m[1], period: +m[2] } : null; };

    const bar = document.getElementById('periods');
    bar.innerHTML = tabs.map((t, i) => `
      ${i ? '<span class="divider"></span>' : ''}
      <span class="group-label">Jaar ${t.year}</span>
      ${t.periods.map(p => {
        const now = t.year === HUIDIG.year && p === HUIDIG.period;
        return `<button class="period-btn" role="tab" data-y="${t.year}" data-p="${p}">P${p}${now ? '<span class="now-dot" title="Huidige periode"></span>' : ''}</button>`;
      }).join('')}`).join('');

    function show(sel) {
      bar.querySelectorAll('.period-btn').forEach(b => b.setAttribute('aria-selected', String(+b.dataset.y === sel.year && +b.dataset.p === sel.period)));
      const list = VAKKEN.filter(v => v.year === sel.year && v.periods.includes(sel.period));
      const now = sel.year === HUIDIG.year && sel.period === HUIDIG.period;
      document.getElementById('section-title').textContent = periodLabel(sel.year, sel.period);
      document.getElementById('vakken').innerHTML = list.map(v => `
          <a class="vak-card glass" href="${vakUrl(v)}">
            <span class="vak-img"><span class="vak-img-fallback">${icon(v.icon, 40)}</span><img src="${vakImg(v)}" alt="" loading="lazy" decoding="async" onerror="this.remove()"/></span>
            <h3 class="vak-title">${esc(v.title)}</h3>
          </a>`).join('');
    }

    bar.addEventListener('click', e => {
      const b = e.target.closest('.period-btn'); if (!b) return;
      const sel = { year: +b.dataset.y, period: +b.dataset.p };
      history.replaceState(null, '', `#j${sel.year}p${sel.period}`);
      show(sel);
    });
    show(parse(location.hash) || HUIDIG);
  }

  // ── Vakpagina: drie kolommen, alles in één oogopslag ──
  function renderVak() {
    const key = new URLSearchParams(location.search).get('v');
    const v = VAKKEN.find(x => x.key === key);
    if (!v) { location.replace('index.html'); return; }
    const p = v.periods[0];
    renderTopbar(`
      <span class="sep">/</span>
      <a class="crumb-mid" href="index.html#j${v.year}p${p}">${esc(periodLabel(v.year, p))}</a>
      <span class="sep crumb-mid">/</span>
      <span class="here">${esc(v.title)}</span>`);
    document.title = `${v.title} · FM Atlas`;

    const col = (title, items) => `
      <section class="col glass" aria-label="${title}">
        <h2 class="col-title">${title}</h2>
        ${items.map(([label, url]) => `
          <a class="item" href="${esc(url)}">
            <span class="item-label">${esc(label)}</span>
            <span class="chev">${icon('chev', 16)}</span>
          </a>`).join('')}
      </section>`;

    const cols = [['Leren', v.leren], ['Oefenen', v.oefenen], ['Toetsen', v.toetsen]].filter(c => c[1].length);
    const peers = VAKKEN.filter(x => x.year === v.year && x.periods.includes(p));
    const i = peers.indexOf(v);
    const prev = peers[i - 1], next = peers[i + 1];

    document.getElementById('vak').innerHTML = `
      <div id="vak-kaarten" hidden></div>
      ${cols.length
        ? `<div class="cols" style="--n:${cols.length}">${cols.map(c => col(c[0], c[1])).join('')}</div>`
        : '<div class="notice glass">De stof voor dit vak komt eraan.</div>'}
      <nav class="neighbors" aria-label="Andere vakken in deze periode">
        ${prev ? `<a class="neighbor glass" href="${vakUrl(prev)}">${icon('back', 16)}<span>${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="neighbor glass" href="${vakUrl(next)}"><span>${esc(next.title)}</span>${icon('chev', 16)}</a>` : '<span></span>'}
      </nav>`;
    accountReady.then(account => {
      if (!account) return;
      const paintCards = () => {
        const slot = document.getElementById('vak-kaarten');
        if (!slot) return;
        const state = account.read(key);
        const total = state.totaal;
        if (!total || !Object.keys(state.kaarten).length) { slot.hidden = true; return; }
        const count = Math.min(total, account.known(state));
        slot.className = 'atlas-card-progress';
        slot.innerHTML = `<p id="vak-kaarten-label">Flashcards: ${count} van ${total} gekend</p>
          <div class="card-meter" role="progressbar" aria-labelledby="vak-kaarten-label" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${count}"><span style="width:${count / total * 100}%"></span></div>`;
        slot.hidden = false;
      };
      paintCards();
      window.addEventListener('atlas:kaarten', event => { if (event.detail.key === key) paintCards(); });
    });
  }

  window.Atlas = { renderHome, renderVak, topbar: renderTopbar, icon, esc, accountReady };
})();
