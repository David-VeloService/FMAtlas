/* FMAtlas — gedeelde helpers: icons, streak, XP, zoek, header-render */

/* ─── Line icons (inline SVG injector) ─────────── */
const FA_ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/>',
  flame:  '<path d="M12 2c1 4-3 5-3 9a5 5 0 0 0 10 0c0-2-1-4-3-5 1 4-2 4-2 7a2 2 0 1 1-4 0c0-2 2-3 2-5 0-4 0-6 0-6Z"/>',
  bolt:   '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  play:   '<path d="M6 4v16l14-8L6 4Z"/>',
  arrow:  '<path d="M5 12h14"/><path d="m13 5 7 7-7 7"/>',
  arrowL: '<path d="M19 12H5"/><path d="m11 19-7-7 7-7"/>',
  book:   '<path d="M4 4h12a4 4 0 0 1 4 4v12"/><path d="M4 4v16h14a2 2 0 0 0 2-2"/>',
  cards:  '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v12"/>',
  check:  '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  coffee: '<path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M7 3v2M11 3v2"/>',
  send:   '<path d="m4 12 16-8-6 16-2.5-6.5L4 12Z"/><path d="m11 13 4-4"/>',
  trophy: '<path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 4H3v2a3 3 0 0 0 3 3"/><path d="M18 4h3v2a3 3 0 0 1-3 3"/><path d="M12 14v4"/><path d="M8 20h8"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  event:  '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/>',
  mic:    '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  cart:   '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h3l2.5 12h10L21 7H6"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  chart:  '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  coin:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h5a2 2 0 0 1 0 4H9"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
  scope:  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat:   '<path d="M4 4h16v12H8l-4 4V4Z"/>',
  close:  '<path d="M6 6l12 12M18 6l-6 6-6 6"/>',
  home:   '<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z"/>',
  x:      '<path d="M6 6l12 12M6 18l12-12"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
};

function faIcon(name, { size = 18, stroke = 2, color = 'currentColor' } = {}) {
  const body = FA_ICONS[name] || '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function faRenderIcons(root = document) {
  root.querySelectorAll('[data-fa-icon]').forEach(el => {
    if (el.dataset.faRendered === '1') return;
    const name = el.dataset.faIcon;
    const size = parseInt(el.dataset.faSize || '18', 10);
    const stroke = parseFloat(el.dataset.faStroke || '2');
    el.innerHTML = faIcon(name, { size, stroke });
    el.dataset.faRendered = '1';
  });
}

/* ─── FMAtlas Logo SVG (inline string) ─────────── */
const FA_LOGO = `
<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="FMAtlas logo">
  <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#1a2024" stroke-width="2"/>
  <path d="M16 7 L20 16 L16 15 Z" fill="#ef5a3f" stroke="#1a2024" stroke-width="1" stroke-linejoin="round"/>
  <path d="M16 25 L12 16 L16 17 Z" fill="#f1ece2" stroke="#1a2024" stroke-width="1" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="1.4" fill="#1a2024"/>
</svg>`;

/* ─── Header rendering ─────────── */
function faRenderHeader({ homeUrl = 'index.html', user = null, breadcrumb = null } = {}) {
  const header = document.createElement('header');
  header.className = 'fa-header';
  const streak = faGetStreak();
  const xp = faGetXP();
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';
  const avatarContent = user?.photoURL
    ? `<img src="${user.photoURL}" alt="" referrerpolicy="no-referrer"/>`
    : initials;

  header.innerHTML = `
    <a class="fa-brand" href="${homeUrl}">
      ${FA_LOGO}
      <span class="fa-brand-name">FMAtlas</span>
      <span class="fa-brand-tag">· studiehulp FM</span>
    </a>
    <div class="fa-search" onclick="faOpenSearch()" role="button" tabindex="0">
      ${faIcon('search', { size: 16, color: '#8a9299' })}
      <span>Zoek samenvattingen, begrippen, flashcards…</span>
      <span class="fa-kbd" style="margin-left:auto">⌘K</span>
    </div>
    <div class="fa-header-right">
      <div class="fa-pill" title="Dagen op rij gestudeerd">
        ${faIcon('flame', { size: 15, color: '#ef5a3f' })}
        <span>${streak}</span>
      </div>
      <div class="fa-pill" title="Totaal XP">
        ${faIcon('bolt', { size: 15, color: '#d4a017' })}
        <span>${xp.toLocaleString('nl-NL').replace(',', ' ')}</span>
      </div>
      <div class="fa-avatar" title="${user?.displayName || 'Jij'}" onclick="faLogout()">${avatarContent}</div>
    </div>
  `;
  return header;
}

function faRenderBreadcrumb(items = []) {
  if (!items.length) return null;
  const wrap = document.createElement('nav');
  wrap.className = 'fa-breadcrumb';
  wrap.innerHTML = items.map((it, i) => {
    const last = i === items.length - 1;
    if (last) return `<span class="current">${it.label}</span>`;
    return `<a href="${it.href}">${it.label}</a><span>›</span>`;
  }).join(' ');
  return wrap;
}

/* ─── Streak + XP (localStorage) ─────────── */
function faToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function faYesterday() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function faGetStreakData() {
  try { return JSON.parse(localStorage.getItem('fa_streak') || '{"count":0,"last":null}'); }
  catch { return { count: 0, last: null }; }
}
function faGetStreak() { return faGetStreakData().count; }

function faMarkActiveToday() {
  const s = faGetStreakData();
  const today = faToday();
  if (s.last === today) return s.count;
  if (s.last === faYesterday()) s.count++;
  else s.count = 1;
  s.last = today;
  localStorage.setItem('fa_streak', JSON.stringify(s));
  return s.count;
}

function faGetXP() {
  const n = parseInt(localStorage.getItem('fa_xp') || '0', 10);
  return isNaN(n) ? 0 : n;
}
function faAddXP(amount) {
  const next = faGetXP() + amount;
  localStorage.setItem('fa_xp', String(next));
  // update on-page pills if present
  document.querySelectorAll('[data-fa-xp]').forEach(el => {
    el.textContent = next.toLocaleString('nl-NL').replace(',', ' ');
  });
  return next;
}

/* ─── Voortgang per vak ─────────── */
function faGetProgress() {
  try { return JSON.parse(localStorage.getItem('fa_progress') || '{}'); }
  catch { return {}; }
}
function faSetProgress(vakKey, pct) {
  const all = faGetProgress();
  all[vakKey] = Math.max(all[vakKey] || 0, Math.min(100, Math.round(pct)));
  localStorage.setItem('fa_progress', JSON.stringify(all));
}
function faGetVakProgress(vakKey) {
  return faGetProgress()[vakKey] || 0;
}

/* ─── Laatst bekeken ─────────── */
function faMarkLastSeen(vakKey, label, url) {
  localStorage.setItem('fa_last', JSON.stringify({ key: vakKey, label, url, at: Date.now() }));
}
function faGetLastSeen() {
  try { return JSON.parse(localStorage.getItem('fa_last') || 'null'); }
  catch { return null; }
}

/* ─── Logout ─────────── */
function faLogout() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    if (firebase.auth().currentUser) {
      faClearLocalUser();
      try { sessionStorage.removeItem('fa-guest'); } catch(_) {}
      firebase.auth().signOut();
    } else {
      window.location.href = 'index.html';
    }
  }
}

/* ─── Cloud-sync (Firestore) ─────────── */
// Wordt aangeroepen vanuit app.html en de subpagina's bij elke auth state change.
// Cloud is bij login de bron van waarheid: Firestore → localStorage.
// Bij allereerste login (nog geen doc) wordt huidige localStorage gepushed,
// zodat een gast die later inlogt zijn opgebouwde XP behoudt.
async function faSyncFromCloud(user, db) {
  if (!user || !db || typeof firebase === 'undefined') return;
  try {
    const ref = db.collection('scores').doc(user.uid);
    const snap = await ref.get();
    if (snap.exists) {
      const pts = snap.data().pts || 0;
      localStorage.setItem('fa_xp', String(pts));
      // Header-pil(len) bijwerken
      document.querySelectorAll('[data-fa-xp]').forEach(el => {
        el.textContent = pts.toLocaleString('nl-NL').replace(',', ' ');
      });
    } else {
      await ref.set({
        name: user.displayName || 'Anoniem',
        pts: faGetXP(),
        photoURL: user.photoURL || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (e) {
    console.warn('faSyncFromCloud:', e);
  }
}

// Wist alle gebruiker-gebonden lokale state. Wordt aangeroepen bij uitloggen
// zodat de volgende account op hetzelfde apparaat geen oude waarden erft.
function faClearLocalUser() {
  localStorage.removeItem('fa_xp');
  localStorage.removeItem('fa_progress');
  localStorage.removeItem('fa_streak');
  localStorage.removeItem('fa_last');
}

/* ─── Zoekindex + overlay ─────────── */
const FA_SEARCH_INDEX = [
  { title: 'Evenementenlogistiek', sub: 'Periode 4 · samenvatting', url: 'evenementenlogistiek.html', icon: 'event' },
  { title: 'Projectvaardigheden', sub: 'Periode 4 · samenvatting', url: 'projectvaardigheden.html', icon: 'mic' },
  { title: 'Eventmanagement 1', sub: 'Periode 3 · samenvatting', url: 'eventmanagement1.html', icon: 'book' },
  { title: 'Facilitaire Inkoop', sub: 'Periode 3 · samenvatting', url: 'facilitaire-inkoop.html', icon: 'cart' },
  { title: 'EM1 — Begrippen', sub: 'Eventmanagement 1', url: 'em1-begrippen.html', icon: 'book' },
  { title: 'EM1 — Flashcards', sub: 'Eventmanagement 1', url: 'em1-flashcards.html', icon: 'cards' },
  { title: 'EM1 — Oefentoets', sub: 'Eventmanagement 1', url: 'em1-oefentoets.html', icon: 'check' },
  { title: 'EM1 — Samenvatting', sub: 'Eventmanagement 1', url: 'em1-samenvatting.html', icon: 'book' },
  { title: 'Inkoop — Begrippen', sub: 'Facilitaire Inkoop', url: 'inkoop-begrippen.html', icon: 'cart' },
  { title: 'Inkoop — Flashcards', sub: 'Facilitaire Inkoop', url: 'inkoop-flashcards.html', icon: 'cards' },
  { title: 'Inkoop — Samenvatting', sub: 'Facilitaire Inkoop', url: 'inkoop-samenvatting.html', icon: 'book' },
  { title: 'Recht', sub: 'Verbintenissenrecht · vakhub', url: 'recht.html', icon: 'book' },
  { title: 'Recht — Begrippen', sub: 'Verbintenissenrecht', url: 'recht-begrippen.html', icon: 'book' },
  { title: 'Recht — Flashcards', sub: 'Verbintenissenrecht', url: 'recht-flashcards.html', icon: 'cards' },
  { title: 'Recht — Samenvatting', sub: 'Verbintenissenrecht', url: 'recht-samenvatting.html', icon: 'book' },
];

function faOpenSearch() {
  let overlay = document.getElementById('fa-search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'fa-search-overlay';
    overlay.className = 'fa-search-overlay';
    overlay.innerHTML = `
      <div class="fa-search-modal" onclick="event.stopPropagation()">
        <div class="fa-search-modal-input">
          ${faIcon('search', { size: 18, color: '#8a9299' })}
          <input id="fa-search-input" placeholder="Zoek in de hele site…" autocomplete="off"/>
          <button class="fa-btn fa-btn-ghost fa-btn-sm" onclick="faCloseSearch()">Esc</button>
        </div>
        <div id="fa-search-results" class="fa-search-results"></div>
      </div>
    `;
    overlay.addEventListener('click', faCloseSearch);
    document.body.appendChild(overlay);
    overlay.querySelector('#fa-search-input').addEventListener('input', faRunSearch);
  }
  overlay.classList.add('open');
  setTimeout(() => document.getElementById('fa-search-input').focus(), 50);
  faRunSearch();
}
function faCloseSearch() {
  const overlay = document.getElementById('fa-search-overlay');
  if (overlay) overlay.classList.remove('open');
}
function faRunSearch() {
  const q = (document.getElementById('fa-search-input')?.value || '').trim().toLowerCase();
  const results = q
    ? FA_SEARCH_INDEX.filter(e =>
        e.title.toLowerCase().includes(q) || e.sub.toLowerCase().includes(q))
    : FA_SEARCH_INDEX.slice(0, 8);
  const box = document.getElementById('fa-search-results');
  if (!box) return;
  if (!results.length) {
    box.innerHTML = `<div class="fa-search-empty">Geen resultaten voor "${q}"</div>`;
    return;
  }
  box.innerHTML = results.map(r => `
    <a class="fa-search-result" href="${r.url}">
      <span style="width:32px;height:32px;background:var(--surface-alt);border:1.5px solid var(--line);border-radius:8px;display:grid;place-items:center;color:var(--ink-soft);flex-shrink:0">${faIcon(r.icon, { size: 15 })}</span>
      <span style="flex:1;min-width:0">
        <span class="fa-search-result-title" style="display:block">${r.title}</span>
        <span class="fa-search-result-sub">${r.sub}</span>
      </span>
      ${faIcon('arrow', { size: 14, color: '#8a9299' })}
    </a>
  `).join('');
}

/* Global keybindings */
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    faOpenSearch();
  }
  if (e.key === 'Escape') faCloseSearch();
});

/* Auto-render icons on load */
document.addEventListener('DOMContentLoaded', () => faRenderIcons());
