import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const { cleanId, pageId, pageContext, activeSeconds, localDay } = require('../js/atlas-meten.js');
const source = readFileSync(new URL('../js/atlas-meten.js', import.meta.url), 'utf8');
const accountSource = readFileSync(new URL('../js/atlas-account.js', import.meta.url), 'utf8');
const data = { window: {} };
vm.runInNewContext(readFileSync(new URL('../js/atlas-data.js', import.meta.url), 'utf8'), data);
const courses = data.window.ATLAS_VAKKEN;
const plain = value => JSON.parse(JSON.stringify(value));
const settled = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

function browser({ href = 'https://fmatlas.nl/huisvesting-flashcards.html', user = null, storage = {}, pending = false, dataset = {} } = {}) {
  let now = new Date(2026, 10, 9, 12).getTime();
  let current = pending ? undefined : user;
  const events = () => {
    const handlers = new Map();
    return {
      addEventListener(type, listener) {
        if (!handlers.has(type)) handlers.set(type, []);
        handlers.get(type).push(listener);
      },
      dispatchEvent(event) { for (const listener of handlers.get(event.type) || []) listener(event); }
    };
  };
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  class CustomEvent {
    constructor(type, { detail } = {}) { this.type = type; this.detail = detail; }
  }
  const calls = [], logs = [], intervals = [], timeouts = [];
  const localStorage = {
    getItem: key => Object.hasOwn(storage, key) ? storage[key] : null,
    setItem: (key, value) => { storage[key] = String(value); },
    key: index => Object.keys(storage)[index] || null,
    get length() { return Object.keys(storage).length; }
  };
  const document = { ...events(), body: { dataset }, hidden: false };
  const window = {
    ...events(), document, localStorage, location: new URL(href), ATLAS_VAKKEN: courses,
    AtlasAccount: { get currentUser() { return current; } },
    fetch(url, options) { calls.push({ url, ...options, payload: JSON.parse(options.body) }); return Promise.resolve({ ok: true }); },
    console: { debug: (...args) => logs.push(args) },
    setInterval: callback => { intervals.push(callback); return intervals.length; }
  };
  const globals = {
    window, document, localStorage, location: window.location, Date: FakeDate, URL, CustomEvent,
    navigator: { onLine: true },
    setTimeout: callback => { timeouts.push(callback); return timeouts.length; }, clearTimeout() {}
  };
  const context = vm.createContext(globals);
  return {
    window, document, calls, logs, storage, context,
    load() { vm.runInContext(source, context); },
    account(value) { current = value; window.dispatchEvent(new CustomEvent('atlas:account')); },
    event(type, detail) { window.dispatchEvent(new CustomEvent(type, { detail })); },
    advance(milliseconds) { now += milliseconds; },
    tick() { now += 15000; intervals.forEach(callback => callback()); },
    hidden(value) { document.hidden = value; document.dispatchEvent(new CustomEvent('visibilitychange')); },
    day() { return localDay(new Date(now)); },
    get activity() { return calls.filter(call => call.payload.writes[0].update); }
  };
}
const student = uid => ({ uid, getIdToken: async () => 'token-' + uid });
const transforms = call => call.payload.writes.flatMap(write => write.updateTransforms || write.transform.fieldTransforms);
const delta = (call, path) => Number(transforms(call).find(transform => transform.fieldPath === path)?.increment?.integerValue || 0);

test('vak en onderdeel: bestandsnaam plus query, inclusief alle gevraagde pagina’s', () => {
  const cases = [
    ['huisvesting-flashcards.html', 'huisvesting', 'flashcards'],
    ['begrippentoets.html?vak=huisvesting', 'huisvesting', 'begrippentoets'],
    ['huisvesting-oefentoets-5.html', 'huisvesting', 'oefentoets'],
    ['vak.html?v=huisvesting', 'huisvesting', 'vak'],
    ['index.html', '_site', 'home'],
    ['/', '_site', 'home'],
    ['huisvesting-samenvatting.html', 'huisvesting', 'samenvatting'],
    ['huisvesting-begrippen.html', 'huisvesting', 'begrippen'],
    ['huisvesting-video.html', 'huisvesting', 'video'],
    ['begrippentoets.html?vak=inkoop', 'facilitaire-inkoop', 'begrippentoets'],
    ['evenementenlogistiek-oefentoets-2.html?from=projectvaardigheden', 'projectvaardigheden', 'oefentoets'],
    ['evenementenlogistiek-oefentoets-2.html', 'evenementenlogistiek', 'oefentoets'],
    ['huisvesting-toetsing.html', 'huisvesting', 'overig'],
    ['onbekend.html', '_site', 'overig'],
    ['vak.html?v=onbekend', '_site', 'vak']
  ];
  for (const [href, vak, onderdeel] of cases) {
    assert.deepEqual(pageContext(href, courses), { vak, onderdeel }, href);
  }
});

test('onderdeel komt uit bestandsnaam of icoon, nooit uit titel', () => {
  const fake = [{ key: 'test-vak', leren: [
    ['Video', 'les.html?b=2&a=1', 'cards'], ['Flashcards', 'anders.html', 'play']
  ] }];
  assert.deepEqual(pageContext('les.html?a=1&b=2', fake), { vak: 'test-vak', onderdeel: 'flashcards' });
  assert.equal(pageContext('anders.html', fake).onderdeel, 'video');
});

test('actieve tik: zichtbaarheid, recent/oud, venstergrenzen en video', () => {
  assert.equal(activeSeconds(true, 95000, 100000, 'flashcards'), 15);
  assert.equal(activeSeconds(false, 95000, 100000, 'flashcards'), 0);
  assert.equal(activeSeconds(true, 40000, 100000, 'flashcards'), 15);
  assert.equal(activeSeconds(true, 39999, 100000, 'flashcards'), 0);
  assert.equal(activeSeconds(true, 0, 900000, 'video'), 15);
  assert.equal(activeSeconds(true, 0, 900001, 'video'), 0);
  assert.equal(activeSeconds(false, 0, 100000, 'video'), 0);
  assert.equal(activeSeconds(true, 100001, 100000, 'video'), 0);
});

test('pagina-id: beide vakqueries, geen andere query, lowercase, opschonen en max 80', () => {
  assert.equal(pageId('/'), 'index');
  assert.equal(pageId('vak.html?v=huisvesting'), 'vak~huisvesting');
  assert.equal(pageId('begrippentoets.html?vak=huisvesting'), 'begrippentoets~huisvesting');
  assert.equal(pageId('/map/Toets.HTML?from=test#anker'), 'toets');
  assert.equal(cleanId('A_B./é %~<-123'), 'ab~-123');
  assert.equal(cleanId('....'), 'onbekend');
  assert.equal(cleanId('a'.repeat(100)).length, 80);
  assert.equal(localDay(new Date(2026, 0, 2, 0, 1)), '2026-01-02');
});

test('anoniem: alleen veldtransforms, bezoeker eenmaal per dag, pagina per opening', () => {
  const storage = {};
  const a = browser({ storage }); a.load();
  assert.equal(a.calls.length, 2);
  assert.equal(delta(a.calls[0], 'bezoekers'), 1);
  assert.equal(delta(a.calls[1], 'n'), 1);
  assert.match(a.calls[1].payload.writes[0].transform.document, /paginas\/huisvesting-flashcards$/);
  const b = browser({ storage }); b.load();
  assert.equal(b.calls.length, 1);
  for (const call of [...a.calls, ...b.calls]) {
    assert.equal(call.method, 'POST');
    assert.equal(call.keepalive, true);
    assert.equal(call.headers.Authorization, undefined);
    assert.equal(Object.keys(call.payload.writes[0]).join(), 'transform');
  }
});

test('uitsluitingen en pending accountherstel sturen niets, ook niet bij toetsen', async () => {
  for (const options of [
    { href: 'http://localhost/index.html' }, { href: 'http://127.0.0.1/index.html' },
    { href: 'file:///tmp/index.html' }, { storage: { fa_stats_uit: '1' } },
    { storage: { fa_stats_uit: '1', fa_meten_debug: '1' } },
    { user: student('EFkA4kexkLNjBKCGuKD9eiyUvfM2') },
    { dataset: { noStats: '' } }, { dataset: { noFeedback: '' } }, { pending: true }
  ]) {
    const b = browser(options); b.load();
    b.event('atlas:toets-ingeleverd', { key: 'test', goed: 2, totaal: 3 });
    for (let i = 0; i < 5; i++) b.tick();
    await b.window.AtlasMeten.flush();
    assert.equal(b.calls.length, 0, JSON.stringify(options));
    assert.equal(b.logs.length, 0);
  }
  const restored = browser({ pending: true }); restored.load();
  restored.account(student('EFkA4kexkLNjBKCGuKD9eiyUvfM2'));
  assert.equal(restored.calls.length, 0);
  const guest = browser({ pending: true }); guest.load(); guest.account(null);
  assert.equal(guest.calls.length, 2);
});

test('student: een bundel per minuut, correcte increments, token en servertijd', async () => {
  const b = browser({ user: student('alice') }); b.load(); await settled();
  for (let i = 0; i < 3; i++) b.tick();
  assert.equal(b.activity.length, 0);
  b.tick();
  assert.equal(b.activity.length, 1);
  const call = b.activity[0], write = call.payload.writes[0];
  assert.equal(write.update.name.split('/').pop(), 'alice_' + b.day());
  assert.equal(write.update.fields.uid.stringValue, 'alice');
  assert.equal(write.update.fields.dag.stringValue, b.day());
  assert.deepEqual(write.updateMask.fieldPaths, ['uid', 'dag']);
  assert.equal(call.headers.Authorization, 'Bearer token-alice');
  assert.equal(call.keepalive, true);
  assert.equal(delta(call, 'sec'), 60);
  assert.equal(delta(call, 'vakken.`huisvesting`.`flashcards`.open'), 1);
  assert.equal(delta(call, 'vakken.`huisvesting`.`flashcards`.sec'), 60);
  assert.equal(transforms(call).find(t => t.fieldPath === 'bijgewerkt').setToServerValue, 'REQUEST_TIME');
  await b.window.AtlasMeten.flush();
  b.tick(); // Interactie is inmiddels te oud: geen extra seconden, geen lege batch.
  await b.window.AtlasMeten.flush();
  assert.equal(b.activity.length, 1);
});

test('inloggen telt alleen de resterende activiteit, verbergen en uitloggen flushen', async () => {
  const b = browser(); b.load();
  b.tick();
  b.advance(10000);
  b.account(student('alice')); await settled();
  b.advance(5000);
  b.hidden(true);
  assert.equal(b.activity.length, 1);
  assert.equal(delta(b.activity[0], 'sec'), 0);
  assert.equal(delta(b.activity[0], 'vakken.`huisvesting`.`flashcards`.open'), 1);
  assert.equal(transforms(b.activity[0]).some(t => t.increment?.integerValue === '0'), false);
  b.tick();
  b.hidden(false);
  b.event('scroll');
  b.tick();
  b.account(null);
  assert.equal(b.activity.length, 2);
  assert.equal(delta(b.activity[1], 'sec'), 15);
  b.event('scroll'); b.tick(); await b.window.AtlasMeten.flush();
  assert.equal(b.activity.length, 2);
});

test('toetspogingen tellen ook bij lagere scores, nulpercentages blijven geldig', async () => {
  const b = browser({ user: student('alice') }); b.load(); await settled();
  for (const goed of [3, 1, 0]) b.event('atlas:toets-ingeleverd', { key: 'Toets_5', goed, totaal: 3 });
  b.event('atlas:toets-ingeleverd', { key: 'ongeldig', goed: 2, totaal: 0 });
  const attempts = b.calls.filter(call => call.payload.writes[0].transform?.document.includes('/toetsen/'));
  assert.deepEqual(attempts.map(call => delta(call, 'som')), [100, 33, 0]);
  assert.equal(attempts.length, 3);
  assert.match(attempts[0].payload.writes[0].transform.document, /toetsen\/toets5$/);
  await b.window.AtlasMeten.flush();
  assert.equal(delta(b.activity[0], 'toetsen.`toets5`.n'), 3);
  assert.equal(delta(b.activity[0], 'toetsen.`toets5`.som'), 133);
});

test('debug werkt lokaal zonder fetch of tokenaanvraag en vervuilt dagmarkering niet', async () => {
  let tokenCalls = 0;
  const b = browser({ href: 'http://localhost/index.html', storage: { fa_meten_debug: '1' },
    user: { uid: 'alice', getIdToken() { tokenCalls++; return Promise.resolve('secret'); } } });
  b.load(); b.tick(); b.event('pagehide'); await settled();
  assert.equal(b.calls.length, 0);
  assert.equal(tokenCalls, 0);
  assert.equal(b.storage.fa_stats_dag, undefined);
  assert.equal(b.logs.length, 3);
  assert.equal(b.logs.every(log => log[0] === '[meten]'), true);
  assert.equal(JSON.stringify(b.logs).includes('secret'), false);
  assert.equal(b.logs[2][1].writes[0].updateTransforms.some(t => t.fieldPath === 'vakken.`_site`.`home`.open'), true);
});

test('tokens verversen in het geheugen en netwerkfouten blijven stil', async () => {
  let tokenCalls = 0;
  const b = browser({ user: { uid: 'alice', getIdToken: async () => 'token-' + (++tokenCalls) } });
  b.load(); await settled();
  b.advance(300000); b.tick(); await settled();
  assert.equal(tokenCalls, 2);
  b.event('scroll'); b.tick(); b.event('pagehide');
  assert.equal(b.activity.at(-1).headers.Authorization, 'Bearer token-2');
  b.window.fetch = () => Promise.reject(new Error('offline'));
  b.event('scroll'); b.tick();
  await assert.doesNotReject(b.window.AtlasMeten.flush());
  assert.equal(b.logs.length, 0);
});

test('account saveTest geeft bij iedere aanroep een event met de ingeleverde score', () => {
  const b = browser(), submitted = [], best = [];
  b.window.addEventListener('atlas:toets-ingeleverd', event => submitted.push(plain(event.detail)));
  b.window.addEventListener('atlas:toetsen', event => best.push(plain(event.detail)));
  vm.runInContext(accountSource, b.context);
  assert.equal(b.window.AtlasAccount.currentUser, null);
  const account = b.window.AtlasAccount;
  account.saveTest('toets', { goed: 3, totaal: 3, laatst: 100 });
  account.saveTest('toets', { goed: 1, totaal: 3, laatst: 200 });
  account.saveTest('toets', { goed: 1, totaal: 3, laatst: 200 });
  account.saveTest('', null);
  assert.deepEqual(submitted.slice(0, 3).map(item => item.goed), [3, 1, 1]);
  assert.equal(submitted.length, 4);
  assert.equal(best.length, 1);
  assert.equal(account.readTest('toets').goed, 3);
});

test('accountgetter en events volgen Firebase-login en logout zonder het Firebase-object te delen', async () => {
  const b = browser({ storage: { 'atlas-account-actief': '1' } });
  let changed;
  const accountEvents = [];
  b.window.addEventListener('atlas:account', event => accountEvents.push(event.detail.uid));
  b.window.firebase = { apps: [{}], auth: () => ({
    onAuthStateChanged(callback) { changed = callback; },
    getRedirectResult: () => Promise.resolve()
  }) };
  vm.runInContext(accountSource, b.context);
  assert.equal(b.window.AtlasAccount.currentUser, undefined);
  changed({ uid: 'alice', privateField: 'hidden', getIdToken: async () => 'firebase-token' });
  const current = b.window.AtlasAccount.currentUser;
  assert.equal(current.uid, 'alice');
  assert.deepEqual(Object.keys(current), ['uid', 'getIdToken']);
  assert.equal(await current.getIdToken(), 'firebase-token');
  changed(null);
  assert.equal(b.window.AtlasAccount.currentUser, null);
  assert.deepEqual(accountEvents, ['alice', null]);
});
