/* FM Atlas: kaartvoortgang, beste toetsscores en optionele Google-login, Firebase compat 10.12.0. */
(function () {
  'use strict';
  const PREFIX = 'atlas-kaarten-';
  const TEST_PREFIX = 'atlas-toets-';
  const SESSION = 'atlas-account-actief';
  // Zelfde publieke webconfiguratie als FIREBASE_CONFIG in fmatlas-vakken/build.py.
  const firebaseConfig = {
    apiKey: 'AIzaSyBB397Wk2eqpBjic8E7aGV1mTgIjhQ21a8',
    authDomain: 'fmkompas-ff8bc.firebaseapp.com',
    projectId: 'fmkompas-ff8bc',
    storageBucket: 'fmkompas-ff8bc.firebasestorage.app',
    messagingSenderId: '487972024689',
    appId: '1:487972024689:web:712c3117080745d14746d0'
  };
  const memory = new Map();
  const testMemory = new Map();
  const scripts = new Map();
  const mounts = new Set();
  let auth = null, db = null, user = null, boot = null, busy = false, message = '';
  let syncTimer = null, syncing = false, resync = false, revision = 0, generation = 0;

  const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const timestamp = value => {
    const n = typeof value === 'number' ? value : Date.parse(value);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  function today(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function cardId(card) {
    if (card.id !== undefined && card.id !== null && String(card.id)) return String(card.id);
    let hash = 2166136261;
    for (const char of String(card.term).normalize('NFC').trim()) {
      hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
    }
    return 'term-' + (hash >>> 0).toString(16).padStart(8, '0');
  }
  function normalise(value) {
    const data = record(value);
    const kaarten = Object.create(null), historie = Object.create(null);
    Object.entries(record(data.kaarten)).forEach(([id, value]) => {
      const c = record(value), bak = Number(c.bak);
      if (![1, 2, 3].includes(bak)) return;
      kaarten[id] = { bak, volgende: timestamp(c.volgende), laatst: timestamp(c.laatst) };
    });
    Object.entries(record(data.historie)).forEach(([day, n]) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isInteger(n) && n >= 0) historie[day] = n;
    });
    return { kaarten, historie, totaal: Number.isInteger(data.totaal) && data.totaal >= 0 ? data.totaal : 0 };
  }
  const known = state => Object.values(state.kaarten).filter(c => c.bak === 3).length;
  const latest = state => Math.max(0, ...Object.values(state.kaarten).map(c => c.laatst));
  function merge(left, right) {
    const a = normalise(left), b = normalise(right);
    const newer = latest(a) > latest(b) ? a : b;
    const older = newer === a ? b : a;
    const result = normalise({
      kaarten: a.kaarten,
      historie: { ...older.historie, ...newer.historie },
      totaal: newer.totaal || older.totaal
    });
    Object.entries(b.kaarten).forEach(([id, card]) => {
      const old = result.kaarten[id];
      // Gelijke tijdstippen krijgen op elk apparaat dezelfde uitkomst.
      if (!old || card.laatst > old.laatst ||
          (card.laatst === old.laatst && JSON.stringify(card) > JSON.stringify(old))) result.kaarten[id] = card;
    });
    return result;
  }
  function readDisk(key) {
    try { return JSON.parse(localStorage.getItem(PREFIX + key) || 'null'); } catch (_) { return null; }
  }
  function forAccount(value) {
    const data = record(value);
    if (user && data.eigenaar && data.eigenaar !== user.uid) return normalise(record(data.bewaard)[user.uid]);
    return normalise(data);
  }
  function read(key) {
    return merge(forAccount(readDisk(key)), forAccount(memory.get(key)));
  }
  function envelope(key, state) {
    const previous = [record(readDisk(key)), record(memory.get(key))];
    const owner = user?.uid || previous.find(data => data.eigenaar)?.eigenaar || null;
    const saved = Object.create(null);
    previous.forEach(data => {
      Object.entries(record(data.bewaard)).forEach(([uid, value]) => { saved[uid] = merge(saved[uid], value); });
      if (typeof data.eigenaar === 'string' && data.eigenaar !== owner) {
        saved[data.eigenaar] = merge(saved[data.eigenaar], data);
      }
    });
    if (owner) delete saved[owner];
    // Eén sleutel per vak. Een ander account krijgt zijn eigen kaarten, zonder offline werk te wissen.
    return { ...normalise(state), eigenaar: owner, bewaard: saved };
  }
  function signature(state) {
    return JSON.stringify([state.totaal, Object.entries(state.kaarten).sort(), Object.entries(state.historie).sort()]);
  }
  function persist(key, value) {
    const state = normalise(value);
    const changed = signature(read(key)) !== signature(state);
    const stored = envelope(key, state);
    memory.set(key, stored);
    try { localStorage.setItem(PREFIX + key, JSON.stringify(stored)); } catch (_) {}
    if (changed) window.dispatchEvent(new CustomEvent('atlas:kaarten', { detail: { key } }));
    return normalise(state);
  }
  function save(key, value) {
    const state = merge(read(key), value);
    state.totaal = value.totaal || state.totaal;
    state.historie[today()] = known(state);
    revision++;
    persist(key, state);
    queueSync();
    return normalise(state);
  }
  function courseKeys() {
    const keys = new Set(memory.keys());
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) keys.add(key.slice(PREFIX.length));
      }
    } catch (_) {}
    return [...keys];
  }
  function normaliseTest(value) {
    const data = record(value);
    if (!Number.isInteger(data.goed) || !Number.isInteger(data.totaal) ||
        data.totaal < 1 || data.goed < 0 || data.goed > data.totaal) return null;
    return { goed: data.goed, totaal: data.totaal, laatst: timestamp(data.laatst) };
  }
  function mergeTest(left, right) {
    const a = normaliseTest(left), b = normaliseTest(right);
    if (!a) return b;
    if (!b) return a;
    if (a.totaal !== b.totaal) return a.laatst >= b.laatst ? a : b;
    return a.goed > b.goed || (a.goed === b.goed && a.laatst >= b.laatst) ? a : b;
  }
  function readTestDisk(key) {
    try { return JSON.parse(localStorage.getItem(TEST_PREFIX + key) || 'null'); } catch (_) { return null; }
  }
  function testForAccount(value) {
    const data = record(value);
    if (user && data.eigenaar && data.eigenaar !== user.uid) return normaliseTest(record(data.bewaard)[user.uid]);
    return normaliseTest(data);
  }
  function readTest(key) {
    return mergeTest(testForAccount(readTestDisk(key)), testForAccount(testMemory.get(key)));
  }
  function testEnvelope(key, state) {
    const previous = [record(readTestDisk(key)), record(testMemory.get(key))];
    const owner = user?.uid || previous.find(data => data.eigenaar)?.eigenaar || null;
    const saved = Object.create(null);
    previous.forEach(data => {
      Object.entries(record(data.bewaard)).forEach(([uid, value]) => { saved[uid] = mergeTest(saved[uid], value); });
      if (typeof data.eigenaar === 'string' && data.eigenaar !== owner) saved[data.eigenaar] = mergeTest(saved[data.eigenaar], data);
    });
    if (owner) delete saved[owner];
    return { ...normaliseTest(state), eigenaar: owner, bewaard: saved };
  }
  function persistTest(key, value) {
    const state = normaliseTest(value);
    if (!state) return null;
    const changed = JSON.stringify(readTest(key)) !== JSON.stringify(state);
    const stored = testEnvelope(key, state);
    testMemory.set(key, stored);
    try { localStorage.setItem(TEST_PREFIX + key, JSON.stringify(stored)); } catch (_) {}
    if (changed) window.dispatchEvent(new CustomEvent('atlas:toetsen', { detail: { key } }));
    return state;
  }
  function saveTest(key, value) {
    if (typeof key !== 'string' || !key || !normaliseTest(value)) return null;
    const state = persistTest(key, mergeTest(readTest(key), value));
    revision++;
    queueSync();
    return state;
  }
  function testKeys() {
    const keys = new Set(testMemory.keys());
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(TEST_PREFIX)) keys.add(key.slice(TEST_PREFIX.length));
      }
    } catch (_) {}
    return [...keys];
  }
  function queueSync() {
    if (!user) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 500);
  }
  async function sync() {
    if (!user || !db || navigator.onLine === false) return;
    if (syncing) { resync = true; return; }
    syncing = true;
    const version = revision, session = generation;
    const ref = db.collection('voortgang').doc(user.uid);
    try {
      // Een transactie voorkomt dat een gelijktijdig antwoord op een ander apparaat verdwijnt.
      const merged = await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(ref);
        if (generation !== session || !user) throw new Error('account-changed');
        const document = record(snapshot.exists ? snapshot.data() : {});
        const cloud = record(document.kaarten);
        const keys = new Set([...Object.keys(cloud), ...courseKeys()]);
        const patch = Object.create(null), result = Object.create(null);
        keys.forEach(key => {
          const state = merge(cloud[key], read(key));
          if (!Object.keys(state.kaarten).length) return;
          state.historie[today()] = known(state);
          result[key] = state;
          if (signature(state) !== signature(normalise(cloud[key]))) patch[key] = state;
        });
        const testCloud = record(document.toetsen);
        const testPatch = Object.create(null), testResult = Object.create(null);
        new Set([...Object.keys(testCloud), ...testKeys()]).forEach(key => {
          const state = mergeTest(testCloud[key], readTest(key));
          if (!state) return;
          testResult[key] = state;
          if (JSON.stringify(state) !== JSON.stringify(normaliseTest(testCloud[key]))) testPatch[key] = state;
        });
        const update = Object.create(null);
        if (Object.keys(patch).length) update.kaarten = patch;
        if (Object.keys(testPatch).length) update.toetsen = testPatch;
        // Velden van de vorige site worden niet meer gebruikt: wis ze (zie privacy.html).
        ['progress', 'streak', 'last'].forEach(field => {
          if (field in document) update[field] = window.firebase.firestore.FieldValue.delete();
        });
        if (Object.keys(update).length) transaction.set(ref, update, { merge: true });
        return { kaarten: result, toetsen: testResult };
      });
      if (generation !== session) return;
      Object.entries(merged.kaarten).forEach(([key, state]) => {
        const current = merge(state, read(key));
        current.historie[today()] = known(current);
        persist(key, current);
      });
      Object.entries(merged.toetsen).forEach(([key, state]) => persistTest(key, mergeTest(state, readTest(key))));
    } catch (_) {
      // Lokaal blijft alles bewaard. Opnieuw proberen bij online komen of terugkeren naar de tab.
    } finally {
      syncing = false;
      if (resync || (revision !== version && generation === session)) {
        resync = false;
        queueSync();
      }
    }
  }
  function loadSDK(part) {
    if (scripts.has(part)) return scripts.get(part);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.gstatic.com/firebasejs/10.12.0/firebase-${part}-compat.js`;
      const timer = setTimeout(() => { script.remove(); reject(new Error('network-timeout')); }, 12000);
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('network-error')); };
      document.head.appendChild(script);
    });
    scripts.set(part, promise);
    promise.catch(() => scripts.delete(part));
    return promise;
  }
  function sessionMarker(active) {
    // Onthoud ook expliciet uitloggen: een achtergebleven IndexedDB is dan geen loginbewijs.
    try { localStorage.setItem(SESSION, active ? '1' : '0'); } catch (_) {}
  }
  async function connectStore(session) {
    try {
      if (!window.firebase.firestore) await loadSDK('firestore');
      if (generation !== session || !user) return;
      db = window.firebase.firestore();
      await sync();
    } catch (_) {}
  }
  function initialise() {
    if (boot) return boot;
    boot = (async () => {
      if (navigator.onLine === false) throw new Error('offline');
      if (!window.firebase || window.firebase._stub) await loadSDK('app');
      if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
      if (!window.firebase.auth) await loadSDK('auth');
      auth = window.firebase.auth();
      auth.languageCode = 'nl';
      auth.onAuthStateChanged(current => {
        user = current;
        generation++;
        sessionMarker(!!user);
        message = '';
        paintAll();
        courseKeys().forEach(key => window.dispatchEvent(new CustomEvent('atlas:kaarten', { detail: { key, account: true } })));
        testKeys().forEach(key => window.dispatchEvent(new CustomEvent('atlas:toetsen', { detail: { key, account: true } })));
        if (user) connectStore(generation);
      }, () => { message = 'Inloggen lukt nu niet. Je kunt verder oefenen.'; paintAll(); });
      auth.getRedirectResult().catch(() => {
        message = 'Inloggen is niet afgerond. Probeer het opnieuw.';
        paintAll();
      });
      return auth;
    })();
    boot.catch(() => { boot = null; });
    return boot;
  }
  async function login() {
    if (busy) return;
    busy = true; message = ''; paintAll();
    try {
      const currentAuth = await initialise();
      const provider = new window.firebase.auth.GoogleAuthProvider();
      try {
        await currentAuth.signInWithPopup(provider);
      } catch (error) {
        if (/popup-blocked|operation-not-supported|popup-closed-by-browser/.test(error.code || '')) {
          sessionMarker(true);
          await currentAuth.signInWithRedirect(provider);
        } else if (!/popup-closed-by-user|cancelled-popup-request/.test(error.code || '')) throw error;
      }
    } catch (_) {
      message = 'Inloggen lukt nu niet. Je kunt verder oefenen.';
    } finally {
      busy = false; paintAll();
    }
  }
  async function logout() {
    if (!auth || busy) return;
    busy = true; paintAll();
    // Rond een eventueel ingepland antwoord af voordat het account wordt afgemeld.
    clearTimeout(syncTimer);
    await sync();
    try { await auth.signOut(); }
    catch (_) { message = 'Uitloggen lukt nu niet. Probeer het opnieuw.'; }
    finally { busy = false; paintAll(); }
  }
  function paintAll() {
    mounts.forEach(slot => {
      if (!slot.isConnected) { mounts.delete(slot); return; }
      const trigger = slot.querySelector('.account-trigger');
      trigger.textContent = busy ? 'Even wachten' : user ? (user.displayName || 'Account').trim().split(/\s+/)[0] : 'Inloggen';
      trigger.disabled = busy;
      trigger.setAttribute('aria-expanded', 'false');
      if (user) trigger.setAttribute('aria-haspopup', 'menu');
      else trigger.removeAttribute('aria-haspopup');
      slot.querySelector('.account-menu').hidden = true;
      slot.querySelector('.account-message').textContent = message;
      slot.querySelector('.account-message').hidden = !message;
    });
  }
  function mount(slot) {
    if (!slot || mounts.has(slot)) return;
    mounts.add(slot);
    slot.innerHTML = '<button class="account-trigger glass" type="button" aria-expanded="false">Inloggen</button>' +
      '<div class="account-menu glass" role="menu" aria-label="Account" hidden><button type="button" role="menuitem">Uitloggen</button></div>' +
      '<p class="account-message glass" role="status" hidden></p>';
    const trigger = slot.querySelector('.account-trigger'), menu = slot.querySelector('.account-menu');
    const close = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
    trigger.addEventListener('click', () => {
      if (!user) { login(); return; }
      menu.hidden = !menu.hidden;
      trigger.setAttribute('aria-expanded', String(!menu.hidden));
      if (!menu.hidden) menu.querySelector('button').focus();
    });
    menu.querySelector('button').addEventListener('click', logout);
    document.addEventListener('click', event => { if (!slot.contains(event.target)) close(); });
    slot.addEventListener('keydown', event => {
      if (event.key === 'Escape') { close(); trigger.focus(); }
      if (event.key === 'Tab') close();
    });
    paintAll();
  }
  window.addEventListener('storage', event => {
    if (event.key && event.key.startsWith(PREFIX)) {
      const key = event.key.slice(PREFIX.length);
      let incoming = null;
      try { incoming = JSON.parse(event.newValue); } catch (_) {}
      memory.set(key, envelope(key, merge(read(key), forAccount(incoming))));
      revision++;
      window.dispatchEvent(new CustomEvent('atlas:kaarten', { detail: { key } }));
      queueSync();
    }
    if (event.key && event.key.startsWith(TEST_PREFIX)) {
      const key = event.key.slice(TEST_PREFIX.length);
      let incoming = null;
      try { incoming = JSON.parse(event.newValue); } catch (_) {}
      persistTest(key, mergeTest(readTest(key), testForAccount(incoming)));
      revision++;
      window.dispatchEvent(new CustomEvent('atlas:toetsen', { detail: { key } }));
      queueSync();
    }
  });
  function reconnect() {
    if (user) {
      if (db) sync();
      else connectStore(generation);
    } else {
      let active = false;
      try { active = localStorage.getItem(SESSION) === '1'; } catch (_) {}
      if (active) initialise().catch(() => {});
    }
  }
  window.addEventListener('online', reconnect);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) reconnect(); });
  window.AtlasAccount = { mount, login, logout, read, save, merge, cardId, today, known, readTest, saveTest };

  let restore = false, marker = null;
  try {
    marker = localStorage.getItem(SESSION);
    restore = marker === '1' || (marker !== '0' &&
      Object.keys(localStorage).some(key => key.startsWith('firebase:authUser:')));
  } catch (_) {}
  if (restore) initialise().catch(() => {});
  // Ook een bestaande login van de oude site kan in Firebase's IndexedDB staan.
  else if (marker !== '0' && window.indexedDB && typeof indexedDB.databases === 'function') {
    indexedDB.databases().then(databases => {
      if (databases.some(database => database.name === 'firebaseLocalStorageDb')) initialise().catch(() => {});
    }).catch(() => {});
  }
})();
