/* FM Atlas — gedeelde helpers: icons, streak, XP, zoek, header-render */

/* Tekst veilig in innerHTML zetten */
function faEsc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
/* Alleen Google-profielfoto's tonen; al het andere valt terug op initialen */
function faSafePhoto(url) {
  return /^https:\/\/lh[0-9]\.googleusercontent\.com\//.test(url || '') ? url : '';
}
function faFormatXP(n) { return Number(n || 0).toLocaleString('nl-NL'); }

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
<svg width="28" height="28" viewBox="0 0 32 32" fill="none" role="img" aria-label="FM Atlas logo">
  <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#1a2024" stroke-width="2"/>
  <path d="M16 7 L20 16 L16 15 Z" fill="#ef5a3f" stroke="#1a2024" stroke-width="1" stroke-linejoin="round"/>
  <path d="M16 25 L12 16 L16 17 Z" fill="#f1ece2" stroke="#1a2024" stroke-width="1" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="1.4" fill="#1a2024"/>
</svg>`;

/* ─── Header rendering ─────────── */
function faRenderHeader({ homeUrl = 'app.html', user = null, breadcrumb = null } = {}) {
  const header = document.createElement('header');
  header.className = 'fa-header';
  const streak = faGetStreak();
  const xp = faGetXP();
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';
  const photo = faSafePhoto(user?.photoURL);
  const avatarContent = photo
    ? `<img src="${photo}" alt="" referrerpolicy="no-referrer"/>`
    : faEsc(initials);
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  header.innerHTML = `
    <a class="fa-brand" href="${homeUrl}">
      ${FA_LOGO}
      <span class="fa-brand-name">FM Atlas</span>
      <span class="fa-brand-tag">· studiehulp FM</span>
    </a>
    <button type="button" class="fa-search" onclick="faOpenSearch()" aria-label="Zoeken in FM Atlas">
      <span aria-hidden="true">${faIcon('search', { size: 16, color: '#6b7378' })}</span>
      <span>Zoek samenvattingen, begrippen, flashcards…</span>
      <span class="fa-kbd" style="margin-left:auto">${isMac ? '⌘K' : 'Ctrl K'}</span>
    </button>
    <div class="fa-header-right">
      <div class="fa-pill" title="Dagen op rij gestudeerd">
        ${faIcon('flame', { size: 15, color: '#ef5a3f' })}
        <span>${streak}</span>
      </div>
      <div class="fa-pill" title="Totaal XP">
        ${faIcon('bolt', { size: 15, color: '#d4a017' })}
        <span data-fa-xp>${faFormatXP(xp)}</span>
      </div>
      <div class="fa-account">
        <button type="button" class="fa-avatar" title="${faEsc(user?.displayName || 'Gast')}" aria-label="Accountmenu" aria-haspopup="true" aria-expanded="false" onclick="faToggleAccountMenu(this)">${avatarContent}</button>
        <div class="fa-account-menu" role="menu" hidden>
          <div class="fa-account-name">${faEsc(user?.displayName || 'Je bent niet ingelogd')}</div>
          ${user
            ? `<button type="button" role="menuitem" onclick="faLogout()">Uitloggen</button>`
            : `<a role="menuitem" href="app.html">Inloggen</a>`}
          <a role="menuitem" href="privacy.html">Privacy</a>
        </div>
      </div>
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
    if (last) return `<span class="current">${faEsc(it.label)}</span>`;
    return `<a href="${it.href}">${faEsc(it.label)}</a><span aria-hidden="true">›</span>`;
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

/* Een reeks loopt alleen door als je vandaag echt iets hebt geoefend (XP verdiend).
   Een pagina openen telt niet; dan wordt alleen een verbroken reeks op 0 gezet. */
function faMarkActiveToday({ studied = false } = {}) {
  const s = faGetStreakData();
  const today = faToday();
  if (s.last === today) return s.count;
  if (!studied) {
    if (s.last && s.last !== faYesterday() && s.count) {
      s.count = 0;
      localStorage.setItem('fa_streak', JSON.stringify(s));
    }
    return s.count;
  }
  s.count = s.last === faYesterday() ? s.count + 1 : 1;
  s.last = today;
  localStorage.setItem('fa_streak', JSON.stringify(s));
  faQueueCloudPush();
  return s.count;
}
function faStudiedToday() { return faGetStreakData().last === faToday(); }

function faGetXP() {
  const n = parseInt(localStorage.getItem('fa_xp') || '0', 10);
  return isNaN(n) ? 0 : n;
}
function faAddXP(amount) {
  const next = faGetXP() + amount;
  localStorage.setItem('fa_xp', String(next));
  faMarkActiveToday({ studied: true });
  document.querySelectorAll('[data-fa-xp]').forEach(el => { el.textContent = faFormatXP(next); });
  return next;
}

/* XP maar één keer toekennen per sleutel (vraag, bonus, kaart per dag).
   Voorkomt dat je punten verdient door een toets steeds opnieuw te starten. */
function faOnce(key) {
  try {
    const k = 'fa_once_' + key;
    if (localStorage.getItem(k)) return false;
    localStorage.setItem(k, '1');
    return true;
  } catch (_) { return true; }
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
  faQueueCloudPush();
}
function faGetVakProgress(vakKey) {
  return faGetProgress()[vakKey] || 0;
}

/* ─── Laatst bekeken ─────────── */
function faMarkLastSeen(vakKey, label, url) {
  localStorage.setItem('fa_last', JSON.stringify({ key: vakKey, label, url, at: Date.now() }));
  faQueueCloudPush();
}
function faGetLastSeen() {
  try { return JSON.parse(localStorage.getItem('fa_last') || 'null'); }
  catch { return null; }
}

/* ─── Accountmenu + logout ─────────── */
function faToggleAccountMenu(btn) {
  const menu = btn.parentElement.querySelector('.fa-account-menu');
  const open = menu.hidden;
  menu.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  if (open) {
    const close = e => {
      if (!btn.parentElement.contains(e.target)) {
        menu.hidden = true; btn.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }
}
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
// Voortgang, reeks en laatst geopend vak staan in een apart document in
// `voortgang/{uid}`, zodat ze niet publiek naast het leaderboard staan.
let _faCloud = null, _faPushTimer = null;
function faQueueCloudPush() {
  if (!_faCloud) return;
  clearTimeout(_faPushTimer);
  _faPushTimer = setTimeout(faPushStateToCloud, 1500);
}
async function faPushStateToCloud() {
  if (!_faCloud) return;
  try {
    await _faCloud.db.collection('voortgang').doc(_faCloud.uid).set({
      progress: faGetProgress(),
      streak: faGetStreakData(),
      last: faGetLastSeen(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (e) { console.warn('faPushStateToCloud:', e); }
}
async function faPullStateFromCloud(user, db) {
  try {
    const snap = await db.collection('voortgang').doc(user.uid).get();
    if (!snap.exists) return;
    const d = snap.data() || {};
    const local = faGetProgress();
    for (const [k, v] of Object.entries(d.progress || {})) local[k] = Math.max(local[k] || 0, v || 0);
    localStorage.setItem('fa_progress', JSON.stringify(local));
    const ls = faGetStreakData();
    if (d.streak && (!ls.last || (d.streak.last || '') > ls.last)) localStorage.setItem('fa_streak', JSON.stringify(d.streak));
    const ll = faGetLastSeen();
    if (d.last && (!ll || (d.last.at || 0) > (ll.at || 0))) localStorage.setItem('fa_last', JSON.stringify(d.last));
  } catch (e) { console.warn('faPullStateFromCloud:', e); }
}

async function faSyncFromCloud(user, db) {
  if (!user || !db || typeof firebase === 'undefined') return;
  _faCloud = { uid: user.uid, db };
  await faPullStateFromCloud(user, db);
  faQueueCloudPush();
  try {
    const ref = db.collection('scores').doc(user.uid);
    const snap = await ref.get();
    if (snap.exists) {
      const pts = snap.data().pts || 0;
      localStorage.setItem('fa_xp', String(pts));
      document.querySelectorAll('[data-fa-xp]').forEach(el => { el.textContent = faFormatXP(pts); });
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
  /* >>> jaar 2 (gegenereerd door fmatlas-vakken) */
  { title: 'Facilitaire bedrijfskunde', sub: 'J2 P1 · vakpagina · FACBDK01 · 7S-model · strategie, structuur, personeel en cultuur · ondernemingsrecht', url: 'facilitaire-bedrijfskunde.html', icon: 'chart' },
  { title: 'Facilitaire bedrijfskunde — Samenvatting', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-samenvatting.html', icon: 'book' },
  { title: 'Facilitaire bedrijfskunde — Begrippenlijst', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-begrippen.html', icon: 'book' },
  { title: 'Facilitaire bedrijfskunde — Flashcards', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-flashcards.html', icon: 'cards' },
  { title: 'Facilitaire bedrijfskunde — Oefentoets 1 · kennis en herkennen', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-oefentoets.html', icon: 'check' },
  { title: 'Facilitaire bedrijfskunde — Oefentoets 2 · casustoets 7S', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-oefentoets-2.html', icon: 'check' },
  { title: 'Facilitaire bedrijfskunde — Oefentoets 3 · casustoets met recht', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-oefentoets-3.html', icon: 'check' },
  { title: 'Facilitaire bedrijfskunde — Toetsing & beoordeling', sub: 'Facilitaire bedrijfskunde', url: 'facilitaire-bedrijfskunde-toetsing.html', icon: 'compass' },
  { title: 'FM Tech', sub: 'J2 P1 · vakpagina · FMTECH01 · Waarde-gedreven technologieadoptie · benchmark · workshops · technologieadvies', url: 'fm-tech.html', icon: 'bolt' },
  { title: 'FM Tech — Samenvatting', sub: 'FM Tech', url: 'fm-tech-samenvatting.html', icon: 'book' },
  { title: 'FM Tech — Begrippenlijst', sub: 'FM Tech', url: 'fm-tech-begrippen.html', icon: 'book' },
  { title: 'FM Tech — Flashcards', sub: 'FM Tech', url: 'fm-tech-flashcards.html', icon: 'cards' },
  { title: 'FM Tech — Kennisquiz FM Tech', sub: 'FM Tech', url: 'fm-tech-oefentoets.html', icon: 'check' },
  { title: 'FM Tech — Oefening adviesgesprek', sub: 'FM Tech', url: 'fm-tech-oefentoets-2.html', icon: 'check' },
  { title: 'FM Tech — Toetsing & beoordeling', sub: 'FM Tech', url: 'fm-tech-toetsing.html', icon: 'compass' },
  { title: 'Huisvesting', sub: 'J2 P1 · vakpagina · HUIVES01 · Organisatie- en mensgericht huisvesten · bouwkunde · PvE en ruimteplanning · MJOP', url: 'huisvesting.html', icon: 'building' },
  { title: 'Huisvesting — Samenvatting', sub: 'Huisvesting', url: 'huisvesting-samenvatting.html', icon: 'book' },
  { title: 'Huisvesting — Begrippenlijst', sub: 'Huisvesting', url: 'huisvesting-begrippen.html', icon: 'book' },
  { title: 'Huisvesting — Flashcards', sub: 'Huisvesting', url: 'huisvesting-flashcards.html', icon: 'cards' },
  { title: 'Huisvesting — Oefentoets 1 · week 1 t/m 3', sub: 'Huisvesting', url: 'huisvesting-oefentoets.html', icon: 'check' },
  { title: 'Huisvesting — Oefentoets 2 · week 4 t/m 7', sub: 'Huisvesting', url: 'huisvesting-oefentoets-2.html', icon: 'check' },
  { title: 'Huisvesting — Proeftentamen · hele stof', sub: 'Huisvesting', url: 'huisvesting-oefentoets-3.html', icon: 'check' },
  { title: 'Huisvesting — Toetsing & beoordeling', sub: 'Huisvesting', url: 'huisvesting-toetsing.html', icon: 'compass' },
  { title: 'Praktijkproject Business Management', sub: 'J2 P1 · vakpagina · PRJBUS01 · DMAGIC · procesverbetering bij een echte opdrachtgever · scrum-light · adviespresentatie (P1 + P2)', url: 'praktijkproject-business-management.html', icon: 'refresh' },
  { title: 'Praktijkproject Business Management — Samenvatting', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-samenvatting.html', icon: 'book' },
  { title: 'Praktijkproject Business Management — Begrippenlijst', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-begrippen.html', icon: 'book' },
  { title: 'Praktijkproject Business Management — Flashcards', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-flashcards.html', icon: 'cards' },
  { title: 'Praktijkproject Business Management — Kennisquiz · Define, Measure, Analyze', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-oefentoets.html', icon: 'check' },
  { title: 'Praktijkproject Business Management — Kennisquiz · Generate, Improve, Control', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-oefentoets-2.html', icon: 'check' },
  { title: 'Praktijkproject Business Management — Oefening vragen na de adviespresentatie', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-oefentoets-3.html', icon: 'check' },
  { title: 'Praktijkproject Business Management — Toetsing & beoordeling', sub: 'Praktijkproject Business Management', url: 'praktijkproject-business-management-toetsing.html', icon: 'compass' },
  { title: 'Praktijkproject Workplace Management', sub: 'J2 P1 · vakpagina · PRJWPM01 · Design thinking · stakeholders · design brief · huisvestingsveranderplan (P1 + P2)', url: 'praktijkproject-workplace-management.html', icon: 'compass' },
  { title: 'Praktijkproject Workplace Management — Samenvatting', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-samenvatting.html', icon: 'book' },
  { title: 'Praktijkproject Workplace Management — Begrippenlijst', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-begrippen.html', icon: 'book' },
  { title: 'Praktijkproject Workplace Management — Flashcards', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-flashcards.html', icon: 'cards' },
  { title: 'Praktijkproject Workplace Management — Kennisquiz design thinking en onderzoek', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-oefentoets.html', icon: 'check' },
  { title: 'Praktijkproject Workplace Management — Oefening eindgesprek', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-oefentoets-2.html', icon: 'check' },
  { title: 'Praktijkproject Workplace Management — Toetsing & beoordeling', sub: 'Praktijkproject Workplace Management', url: 'praktijkproject-workplace-management-toetsing.html', icon: 'compass' },
  /* <<< jaar 2 */
  { title: 'Basis van FM A', sub: 'P1 · vakpagina · FM-basisprincipes, dienstverlening, huisvesting, hospitality', url: 'basis-van-fm-a.html', icon: 'compass' },
  { title: 'Basis van FM A — Samenvatting', sub: 'Basis van FM A', url: 'bvfma-samenvatting.html', icon: 'book' },
  { title: 'Basis van FM A — Begrippenlijst', sub: 'Basis van FM A', url: 'bvfma-begrippen.html', icon: 'book' },
  { title: 'Basis van FM A — Flashcards', sub: 'Basis van FM A', url: 'bvfma-flashcards.html', icon: 'cards' },
  { title: 'Trendwatchers', sub: 'P1 · vakpagina · DESTEP, trends, risico, impact op FM', url: 'trendwatchers.html', icon: 'scope' },
  { title: 'Trendwatchers — Samenvatting', sub: 'Trendwatchers', url: 'trendwatchers-samenvatting.html', icon: 'book' },
  { title: 'Trendwatchers — Begrippenlijst', sub: 'Trendwatchers', url: 'trendwatchers-begrippen.html', icon: 'book' },
  { title: 'Trendwatchers — Flashcards', sub: 'Trendwatchers', url: 'trendwatchers-flashcards.html', icon: 'cards' },
  { title: 'Basis van FM B', sub: 'P2 · vakpagina · schoonmaak, catering, veiligheidszorg', url: 'basis-van-fm-b.html', icon: 'building' },
  { title: 'Basis van FM B — Samenvatting', sub: 'Basis van FM B', url: 'bvfmb-samenvatting.html', icon: 'book' },
  { title: 'Basis van FM B — Begrippenlijst', sub: 'Basis van FM B', url: 'bvfmb-begrippen.html', icon: 'book' },
  { title: 'Basis van FM B — Flashcards', sub: 'Basis van FM B', url: 'bvfmb-flashcards.html', icon: 'cards' },
  { title: 'Facilitaire Bedrijfseconomie', sub: 'P1–P2 · vakpagina · investeren, terugverdientijd, NCW, kostprijs', url: 'bedrijfseconomie.html', icon: 'coin' },
  { title: 'Facilitaire Bedrijfseconomie — Samenvatting', sub: 'Facilitaire Bedrijfseconomie', url: 'bedrijfseconomie-samenvatting.html', icon: 'book' },
  { title: 'Facilitaire Bedrijfseconomie — Begrippenlijst', sub: 'Facilitaire Bedrijfseconomie', url: 'bedrijfseconomie-begrippen.html', icon: 'book' },
  { title: 'Facilitaire Bedrijfseconomie — Flashcards', sub: 'Facilitaire Bedrijfseconomie', url: 'bedrijfseconomie-flashcards.html', icon: 'cards' },
  { title: 'Eventmanagement 1', sub: 'P3 · vakpagina · projectmanagement, Grit, fasering, EVM', url: 'eventmanagement1.html', icon: 'event' },
  { title: 'Eventmanagement 1 — Samenvatting', sub: 'Eventmanagement 1', url: 'em1-samenvatting.html', icon: 'book' },
  { title: 'Eventmanagement 1 — Begrippenlijst', sub: 'Eventmanagement 1', url: 'em1-begrippen.html', icon: 'book' },
  { title: 'Eventmanagement 1 — Flashcards', sub: 'Eventmanagement 1', url: 'em1-flashcards.html', icon: 'cards' },
  { title: 'Facilitaire Inkoop', sub: 'P3 · vakpagina · inkoopproces, Kraljic, contractmanagement', url: 'facilitaire-inkoop.html', icon: 'cart' },
  { title: 'Facilitaire Inkoop — Samenvatting', sub: 'Facilitaire Inkoop', url: 'inkoop-samenvatting.html', icon: 'book' },
  { title: 'Facilitaire Inkoop — Begrippenlijst', sub: 'Facilitaire Inkoop', url: 'inkoop-begrippen.html', icon: 'book' },
  { title: 'Facilitaire Inkoop — Flashcards', sub: 'Facilitaire Inkoop', url: 'inkoop-flashcards.html', icon: 'cards' },
  { title: 'Recht', sub: 'P3 · vakpagina · verbintenissenrecht, overeenkomst, wanprestatie', url: 'recht.html', icon: 'book' },
  { title: 'Recht — Samenvatting', sub: 'Recht', url: 'recht-samenvatting.html', icon: 'book' },
  { title: 'Recht — Begrippenlijst', sub: 'Recht', url: 'recht-begrippen.html', icon: 'book' },
  { title: 'Recht — Flashcards', sub: 'Recht', url: 'recht-flashcards.html', icon: 'cards' },
  { title: 'Evenementenlogistiek', sub: 'P4 · vakpagina · Eventmanagement 2, schillenmodel, site design', url: 'evenementenlogistiek.html', icon: 'event' },
  { title: 'Evenementenlogistiek — Samenvatting', sub: 'Evenementenlogistiek', url: 'evenementenlogistiek-samenvatting.html', icon: 'book' },
  { title: 'Evenementenlogistiek — Begrippenlijst', sub: 'Evenementenlogistiek', url: 'evenementenlogistiek-begrippen.html', icon: 'book' },
  { title: 'Evenementenlogistiek — Flashcards', sub: 'Evenementenlogistiek', url: 'evenementenlogistiek-flashcards.html', icon: 'cards' },
  { title: 'Projectvaardigheden', sub: 'P4 · vakpagina · Eventmanagement 2, observeren, interviewen', url: 'projectvaardigheden.html', icon: 'mic' },
  { title: 'Projectvaardigheden — Samenvatting', sub: 'Projectvaardigheden', url: 'projectvaardigheden-samenvatting.html', icon: 'book' },
  { title: 'Projectvaardigheden — Begrippenlijst', sub: 'Projectvaardigheden', url: 'projectvaardigheden-begrippen.html', icon: 'book' },
  { title: 'Projectvaardigheden — Flashcards', sub: 'Projectvaardigheden', url: 'projectvaardigheden-flashcards.html', icon: 'cards' },
  { title: 'Eventmanagement 1 — Oefentoets 1', sub: '80 juist/onjuist-vragen', url: 'em1-oefentoets.html', icon: 'check' },
  { title: 'Eventmanagement 1 — Oefentoets 4', sub: 'extra moeilijk, 50 meerkeuze', url: 'eventmanagement-1-oefentoets-4.html', icon: 'check' },
  { title: 'Eventmanagement 1 — Oefentoets 5', sub: 'tentamenformat, 80 meerkeuze', url: 'eventmanagement-1-oefentoets-5.html', icon: 'check' },
  { title: 'Eventmanagement 2 — Oefentoets 1', sub: 'Evenementenlogistiek', url: 'evenementenlogistiek-oefenvragen.html', icon: 'check' },
  { title: 'Eventmanagement 2 — Oefentoets 2', sub: 'logistiek + projectvaardigheden', url: 'eventmanagement-b-oefentoets-2.html', icon: 'check' },
  { title: 'Eventmanagement 2 — Oefentoets 3', sub: 'extra moeilijk', url: 'eventmanagement-b-oefentoets-3.html', icon: 'check' },
];

function faOpenSearch() {
  let overlay = document.getElementById('fa-search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'fa-search-overlay';
    overlay.className = 'fa-search-overlay';
    overlay.innerHTML = `
      <div class="fa-search-modal" role="dialog" aria-modal="true" aria-label="Zoeken" onclick="event.stopPropagation()">
        <div class="fa-search-modal-input">
          ${faIcon('search', { size: 18, color: '#8a9299' })}
          <input id="fa-search-input" placeholder="Zoek een vak, samenvatting, flashcards of oefentoets…" aria-label="Zoeken" autocomplete="off"/>
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
    : FA_SEARCH_INDEX.filter(e => e.sub.includes('vakpagina'));
  const box = document.getElementById('fa-search-results');
  if (!box) return;
  if (!results.length) {
    box.innerHTML = `<div class="fa-search-empty">Geen resultaten voor "${faEsc(q)}"</div>`;
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
  // Enter in het zoekveld opent het eerste resultaat
  if (e.key === 'Enter' && e.target && e.target.id === 'fa-search-input') {
    const first = document.querySelector('#fa-search-results a');
    if (first) window.location.href = first.getAttribute('href');
  }
});

/* Auto-render icons on load */
document.addEventListener('DOMContentLoaded', () => faRenderIcons());
