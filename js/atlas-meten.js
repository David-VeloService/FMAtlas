/* FM Atlas: anonieme tellers en gebundelde activiteit per ingelogde student. */
(function (root) {
  'use strict';

  function cleanId(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9~-]/g, '').slice(0, 80) || 'onbekend';
  }
  function localDay(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function pageId(href) {
    const url = new URL(href, 'https://fmatlas.nl/');
    const name = (url.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '');
    const course = url.searchParams.get('v') || url.searchParams.get('vak');
    return cleanId(name + (course ? '~' + course : ''));
  }
  function pageContext(href, courses = []) {
    const url = new URL(href, 'https://fmatlas.nl/');
    const filename = url.pathname.split('/').pop() || 'index.html';
    if (filename === 'index.html') return { vak: '_site', onderdeel: 'home' };
    if (filename === 'vak.html') {
      const course = courses.find(course => course.key === url.searchParams.get('v'));
      return { vak: course ? course.key : '_site', onderdeel: 'vak' };
    }
    const signature = value => {
      const target = new URL(value, 'https://fmatlas.nl/');
      target.searchParams.sort();
      return (target.pathname.split('/').pop() || 'index.html') + target.search;
    };
    let match = null, icon = '';
    for (const course of courses) {
      const item = ['leren', 'oefenen', 'toetsen'].flatMap(key => course[key] || [])
        .find(item => signature(item[1]) === signature(href));
      if (item) { match = course; icon = item[2]; break; }
    }
    const types = ['begrippentoets', 'oefentoets', 'samenvatting', 'begrippen', 'flashcards', 'video'];
    const type = types.find(type => new RegExp('(^|-)' + type + '(-|\\.html$)').test(filename));
    const icons = { book: 'samenvatting', list: 'begrippen', play: 'video', cards: 'flashcards', check: 'begrippentoets', quiz: 'oefentoets' };
    return { vak: match ? match.key : '_site', onderdeel: type || icons[icon] || 'overig' };
  }
  function activeSeconds(visible, lastInteraction, now, part) {
    const age = now - lastInteraction;
    return visible && age >= 0 && age <= (part === 'video' ? 900000 : 60000) ? 15 : 0;
  }
  const helpers = { cleanId, localDay, pageId, pageContext, activeSeconds };
  if (typeof module !== 'undefined' && module.exports) module.exports = helpers;
  if (!root || !root.document || root.AtlasMeten) return;

  const doc = root.document;
  const ADMIN = 'EFkA4kexkLNjBKCGuKD9eiyUvfM2';
  const DB = 'projects/fmkompas-ff8bc/databases/(default)/documents';
  const ENDPOINT = `https://firestore.googleapis.com/v1/${DB}:commit?key=AIzaSyBB397Wk2eqpBjic8E7aGV1mTgIjhQ21a8`;
  const readStorage = key => { try { return root.localStorage.getItem(key); } catch (_) { return null; } };
  const debug = readStorage('fa_meten_debug') === '1';
  const context = pageContext(root.location.href, root.ATLAS_VAKKEN);
  const page = pageId(root.location.href);
  let session = null, anonymousStarted = false, debugDay = null;
  let lastInteraction = Date.now(), lastTick = Date.now();

  function enabled() {
    return readStorage('fa_stats_uit') !== '1' &&
      (debug || (!/^(localhost|127\.0\.0\.1)$/.test(root.location.hostname) && root.location.protocol !== 'file:')) &&
      doc.body?.dataset.noStats === undefined && doc.body?.dataset.noFeedback === undefined;
  }
  function currentUser() { return root.AtlasAccount?.currentUser; }
  function allowed() { return enabled() && currentUser() !== undefined && currentUser()?.uid !== ADMIN; }
  const integer = n => ({ integerValue: String(n) });
  const increment = (fieldPath, n) => ({ fieldPath, increment: integer(n) });
  // Firestore vraagt backticks rond veldnamen met bijvoorbeeld een '-' of '~'.
  const field = name => '`' + String(name).replace(/\\/g, '\\\\').replace(/`/g, '\\`') + '`';

  function send(body, token) {
    if (!enabled()) return Promise.resolve();
    if (debug) {
      root.console.debug('[meten]', body);
      return Promise.resolve();
    }
    try {
      return root.fetch(ENDPOINT, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        body: JSON.stringify(body)
      }).catch(() => {});
    } catch (_) { return Promise.resolve(); }
  }
  function anonymous(path, values) {
    if (!allowed()) return;
    return send({ writes: [{ transform: {
      document: `${DB}/${path}`,
      fieldTransforms: Object.entries(values).map(([key, value]) => increment(key, value))
    } }] });
  }
  function visitor(day) {
    try {
      if ((debug ? debugDay : readStorage('fa_stats_dag')) === day) return;
      if (debug) debugDay = day;
      else root.localStorage.setItem('fa_stats_dag', day);
      anonymous(`statistiek/${day}`, { bezoekers: 1 });
    } catch (_) {}
  }
  function startAnonymous() {
    if (anonymousStarted || !allowed()) return;
    anonymousStarted = true;
    const day = localDay();
    visitor(day);
    anonymous(`statistiek/${day}/paginas/${page}`, { n: 1 });
  }
  function add(day, path, n) {
    if (!session || !allowed() || !n) return;
    if (!session.days.has(day)) session.days.set(day, new Map());
    const deltas = session.days.get(day);
    deltas.set(path, (deltas.get(path) || 0) + n);
  }
  const partPath = `vakken.${field(context.vak)}.${field(context.onderdeel)}`;

  function refreshToken(target) {
    if (debug || target.refreshing) return target.refreshing || Promise.resolve();
    target.refreshing = Promise.resolve().then(() => target.account.getIdToken()).then(token => {
      target.token = token;
      target.tokenAt = Date.now();
    }).catch(() => {}).finally(() => { target.refreshing = null; });
    return target.refreshing;
  }
  function flushSession(target) {
    if (!target || !target.days.size || !enabled()) return Promise.resolve();
    if (!debug && (!target.token || Date.now() - target.tokenAt >= 3000000)) {
      return refreshToken(target).then(() =>
        target.token && Date.now() - target.tokenAt < 3000000 ? flushSession(target) : undefined);
    }
    const writes = [];
    for (const [day, deltas] of target.days) {
      if (!deltas.size) continue;
      const transforms = [...deltas].filter(([, n]) => n !== 0).map(([path, n]) => increment(path, n));
      if (!transforms.length) continue;
      // Initialiseer verplichte nulwaarden zonder eerder getelde seconden/scores te overschrijven.
      // Er gaat nooit een lege delta of losse initialisatie naar Firestore.
      const defaults = new Set(['sec']);
      for (const path of deltas.keys()) {
        if (path.startsWith('vakken.')) defaults.add(path.replace(/\.(open|sec)$/, '.sec'));
        if (path.startsWith('toetsen.')) defaults.add(path.replace(/\.(n|som)$/, '.som'));
      }
      defaults.forEach(path => {
        if (!deltas.has(path)) transforms.push({ fieldPath: path, maximum: integer(0) });
      });
      writes.push({
        update: { name: `${DB}/activiteit/${target.account.uid}_${day}`, fields: {
          uid: { stringValue: target.account.uid }, dag: { stringValue: day }
        } },
        updateMask: { fieldPaths: ['uid', 'dag'] },
        updateTransforms: [...transforms, { fieldPath: 'bijgewerkt', setToServerValue: 'REQUEST_TIME' }]
      });
    }
    if (!writes.length) return Promise.resolve();
    // Niet automatisch opnieuw versturen: een verbroken antwoord kan al zijn gecommit.
    target.days.clear();
    target.lastWrite = Date.now();
    return send({ writes }, target.token);
  }
  function flush() { return flushSession(session); }

  function accountChanged() {
    const account = currentUser();
    if (session && session.account.uid === account?.uid) return;
    if (session) flushSession(session);
    session = null;
    lastTick = Date.now();
    if (!allowed()) return;
    startAnonymous();
    if (!account) return;
    session = { account, days: new Map(), token: null, tokenAt: 0, refreshing: null, lastWrite: Date.now() };
    add(localDay(), `${partPath}.open`, 1);
    refreshToken(session);
  }

  root.AtlasMeten = { flush, ...helpers };
  if (!enabled()) return;
  root.addEventListener('atlas:account', accountChanged);
  root.addEventListener('atlas:toets-ingeleverd', event => {
    if (!allowed()) return;
    const { key, goed, totaal } = event.detail || {};
    if (typeof key !== 'string' || !key || !Number.isInteger(goed) || !Number.isInteger(totaal) ||
        totaal < 1 || goed < 0 || goed > totaal) return;
    const test = cleanId(key), day = localDay(), percentage = Math.round(100 * goed / totaal);
    visitor(day);
    anonymous(`statistiek/${day}/toetsen/${test}`, { n: 1, som: percentage });
    add(day, `toetsen.${field(test)}.n`, 1);
    add(day, `toetsen.${field(test)}.som`, percentage);
  });
  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(type => {
    root.addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true, capture: true });
  });
  doc.addEventListener('visibilitychange', () => {
    lastTick = Date.now();
    if (doc.hidden) flush();
  });
  root.addEventListener('pagehide', flush);
  root.addEventListener('pageshow', () => { lastTick = Date.now(); });
  root.setInterval(() => {
    const now = Date.now();
    if (!allowed()) { if (session) session.days.clear(); lastTick = now; return; }
    const day = localDay();
    if (!doc.hidden) visitor(day);
    if (session) {
      const seconds = now - lastTick >= 15000 ? activeSeconds(!doc.hidden, lastInteraction, now, context.onderdeel) : 0;
      add(day, 'sec', seconds);
      add(day, `${partPath}.sec`, seconds);
      if (now - session.tokenAt >= 300000) refreshToken(session);
      if (now - session.lastWrite >= 60000) flush();
    }
    lastTick = now;
  }, 15000);
  accountChanged();
})(typeof window === 'undefined' ? null : window);
