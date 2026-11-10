import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const D = require('../js/beheer-data.js');
const M = require('../js/atlas-meten.js');
const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../js/atlas-data.js', import.meta.url), 'utf8'), context);
const courses = JSON.parse(JSON.stringify(context.window.ATLAS_VAKKEN));
const index = D.makeIndex(courses);
const current = { year: 2, period: 2 };
const range = { start: '2026-11-01', end: '2026-11-10' };
const activities = [
  { uid: 'alice123', dag: '2026-11-09', sec: 1800, vakken: { huisvesting: { flashcards: { sec: 900, open: 2 }, oefentoets: { sec: 300, open: 1 } },
    'facilitair-verandermanagement': { samenvatting: { sec: 600, open: 1 } } }, toetsen: { 'huisvesting-oefentoets': { n: 2, som: 100 } } },
  { uid: 'alice123', dag: '2026-11-10', sec: 600, vakken: { huisvesting: { flashcards: { sec: 600, open: 1 } } }, toetsen: { 'huisvesting-oefentoets': { n: 1, som: 0 } } },
  { uid: 'bob456', dag: '2026-11-10', sec: 300, vakken: { huisvesting: { flashcards: { sec: 300, open: 1 } } } },
  { uid: 'outside', dag: '2026-10-01', sec: 9999, vakken: { huisvesting: { flashcards: { sec: 9999, open: 1 } } } },
  { uid: 'future', dag: '2026-11-11', sec: 9999 }
];
const statistics = [
  { day: '2026-11-09', bezoekers: 10, paginas: [{ id: 'huisvesting-flashcards', n: 5 }, { id: 'vak~huisvesting', n: 2 }], toetsen: [{ id: 'huisvesting-oefentoets', n: 3, som: 150 }] },
  { day: '2026-11-10', bezoekers: 7, paginas: [{ id: 'huisvesting-flashcards', n: 3 }], toetsen: [{ id: 'huisvesting-oefentoets', n: 1, som: 0 }, { id: 'fm-tech-oefentoets', n: 2, som: 50 }] },
  { day: '2026-10-31', bezoekers: 1000 }, { day: '2026-11-11', bezoekers: 1000 }
];
const aggregate = extra => D.aggregate({ courses, current, ...range, statistics, activities, ...extra });

test('page IDs and activity parts use exactly the measurement rules for every Atlas href', () => {
  for (const item of index.items) {
    assert.equal(D.pageId(item.href), M.pageId(item.href), item.href);
    const measurement = M.pageContext(item.href, courses);
    assert.equal(item.courseKey, measurement.vak, item.href);
    assert.equal(item.part, measurement.onderdeel, item.href);
    assert.ok(D.resolveActivity(item.courseKey, item.part, index).items.some(match => match.href === item.href));
  }
  assert.equal(D.cleanId('A_B./é %~<-123'), M.cleanId('A_B./é %~<-123'));
  assert.equal(D.pageId('/'), 'index');
  assert.equal(D.pageId('vak.html?v=huisvesting'), 'vak~huisvesting');
  assert.equal(D.pageId('begrippentoets.html?vak=inkoop'), 'begrippentoets~inkoop');
  assert.equal(D.resolvePage('begrippentoets~inkoop', index).courseKey, 'facilitaire-inkoop');
  assert.equal(D.resolvePage('vak~huisvesting', index).courseKey, 'huisvesting');
  assert.equal(D.resolveActivity('_site', 'home', index).course, null);
});

test('shared pages belong to the course without from; unknown keys are never attributed by a prefix guess', () => {
  const shared = D.resolvePage('evenementenlogistiek-oefentoets-2', index);
  assert.equal(shared.courseKey, 'evenementenlogistiek');
  assert.equal(shared.items.length, 1);
  assert.equal(shared.items[0].href, 'evenementenlogistiek-oefentoets-2.html');
  assert.equal(shared.shared, true);
  assert.equal(D.resolveTest('huisvesting-oefentoets', index).courseKey, 'huisvesting');
  assert.equal(D.resolveTest('huisvesting-made-up', index).courseKey, null);
  assert.equal(D.resolvePage('<img onerror=alert(1)>', index).items.length, 0);
});

test('practice score keys resolve test one and later tests through their page hrefs', () => {
  for (const [id, href, courseKey] of [
    ['huisvesting-oefentoets-1-20', 'huisvesting-oefentoets.html', 'huisvesting'],
    ['huisvesting-oefentoets-2-40', 'huisvesting-oefentoets-2.html', 'huisvesting'],
    ['em1-oefentoets-1-20', 'em1-oefentoets.html', 'eventmanagement1'],
    ['em1-oefentoets-2-40', 'em1-oefentoets-2.html', 'eventmanagement1']
  ]) {
    const match = D.resolveTest(M.cleanId(id), index);
    assert.equal(match.courseKey, courseKey, id);
    assert.equal(match.items[0].href, href, id);
    assert.equal(match.items[0].title, index.items.find(item => item.href === href).title, id);
  }
});

test('concept score keys resolve through the vak query, including stored aliases', () => {
  for (const [key, vak, courseKey] of [
    ['huisvesting', 'huisvesting', 'huisvesting'],
    ['eventmanagement1', 'em1', 'eventmanagement1'],
    ['facilitaire-inkoop', 'inkoop', 'facilitaire-inkoop']
  ]) {
    const match = D.resolveTest(`${key}-begrippentoets-20`, index);
    assert.equal(match.courseKey, courseKey);
    assert.equal(match.items[0].href, `begrippentoets.html?vak=${vak}`);
  }
  assert.equal(D.resolveTest('begrippentoets~huisvesting', index).courseKey, 'huisvesting');
});

test('every BT_VAKKEN storage key resolves to its indexed Atlas course and concept page', () => {
  const html = readFileSync(new URL('../begrippentoets.html', import.meta.url), 'utf8');
  const table = html.match(/const BT_VAKKEN\s*=\s*({[\s\S]*?^});/m);
  assert.ok(table, 'BT_VAKKEN table must be present and parseable');
  const entries = vm.runInNewContext('(' + table[1] + ')');
  assert.ok(Object.keys(entries).length > 0);
  for (const [vak, entry] of Object.entries(entries)) {
    const href = `begrippentoets.html?vak=${vak}`;
    const expectedCourses = courses.filter(course => ['leren', 'oefenen', 'toetsen'].some(group =>
      (course[group] || []).some(([, itemHref]) => itemHref === href)));
    assert.equal(expectedCourses.length, 1, href);
    const match = D.resolveTest(`${entry.key}-begrippentoets-20`, index);
    assert.equal(match.courseKey, expectedCourses[0].key, `${vak}: ${entry.key}`);
    assert.equal(match.items.length, 1, vak);
    assert.equal(match.items[0].href, href, vak);
  }
});

test('unknown score keys stay unlinked', () => {
  for (const id of ['unknown', 'huisvesting-oefentoets-99-20', 'huisvesting-made-up-20',
    'eventmanagement1-oefentoets-1-20', 'unknown-begrippentoets-20', 'huisvesting-oefentoets-0-20']) {
    assert.deepEqual(D.resolveTest(id, index), { courseKey: null, items: [], shared: false }, id);
  }
});

test('shared test scores prefer the course without from, regardless of item order', () => {
  for (const orderedCourses of [courses, courses.slice().reverse()]) {
    const orderedIndex = D.makeIndex(orderedCourses);
    for (const n of [2, 3]) {
      const page = `evenementenlogistiek-oefentoets-${n}`;
      for (const id of [page, page + '-40']) {
        const match = D.resolveTest(id, orderedIndex);
        assert.equal(match.courseKey, 'evenementenlogistiek', id);
        assert.equal(match.items.length, 1, id);
        assert.equal(match.items[0].href, page + '.html', id);
        assert.equal(match.shared, true, id);
      }
    }
  }
});

test('multiple remaining owner courses stay unlinked for pages and tests', () => {
  for (const suffixes of [['', ''], ['?from=one', '?from=two']]) {
    const ambiguous = D.makeIndex(suffixes.map((suffix, i) => ({
      key: 'course-' + i, oefenen: [['Shared test', 'shared-oefentoets.html' + suffix, 'quiz']]
    })));
    for (const match of [D.resolvePage('shared-oefentoets', ambiguous), D.resolveTest('shared-oefentoets-1-20', ambiguous)]) {
      assert.equal(match.courseKey, null);
      assert.equal(match.items.length, 2);
      assert.equal(match.shared, true);
    }
  }
});

test('shared score and page counters aggregate only under the owner course', () => {
  const result = aggregate({
    statistics: [{ day: '2026-11-10', paginas: [{ id: 'evenementenlogistiek-oefentoets-2', n: 7 }], toetsen: [
      { id: 'evenementenlogistiek-oefentoets-2-40', n: 2, som: 100 },
      { id: 'evenementenlogistiek-oefentoets-3-20', n: 1, som: 80 }
    ] }],
    activities: [{ uid: 'student', dag: '2026-11-10', toetsen: {
      'evenementenlogistiek-oefentoets-2-40': { n: 1, som: 50 },
      'evenementenlogistiek-oefentoets-3-20': { n: 1, som: 80 }
    } }]
  });
  const owner = result.courses.find(course => course.key === 'evenementenlogistiek');
  const other = result.courses.find(course => course.key === 'projectvaardigheden');
  assert.equal(owner.views, 7);
  assert.equal(owner.n, 3);
  assert.equal(owner.average, 60);
  assert.equal(owner.tests.size, 2);
  assert.equal(other.views, 0);
  assert.equal(other.n, 0);
  assert.equal(other.tests.size, 0);
  assert.ok(result.tests.every(row => row.courseKey === owner.key));
  assert.ok(result.students[0].results.every(row => row.courseKey === owner.key));
});

test('question counts merge per test page in totals, courses, content and daily student results', () => {
  const scores = [
    { id: 'huisvesting-oefentoets-1-20', n: 1, som: 20 },
    { id: 'huisvesting-oefentoets-1-40', n: 2, som: 100 },
    { id: 'huisvesting-oefentoets', n: 1, som: 80 },
    { id: 'huisvesting-oefentoets-2-20', n: 1, som: 50 },
    { id: 'huisvesting-oefentoets-2-40', n: 1, som: 70 },
    { id: 'huisvesting-begrippentoets-10', n: 1, som: 30 },
    { id: 'huisvesting-begrippentoets-20', n: 1, som: 90 },
    { id: 'unknown-20', n: 1, som: 0 }
  ];
  const result = aggregate({
    statistics: [{ day: '2026-11-09', toetsen: scores.slice(0, 1) }, { day: '2026-11-10', toetsen: scores.slice(1) }],
    activities: [
      { uid: 'student', dag: '2026-11-10', toetsen: Object.fromEntries(scores.map(({ id, n, som }) => [id, { n, som }])) },
      { uid: 'student', dag: '2026-11-09', toetsen: { 'huisvesting-oefentoets-1-20': { n: 1, som: 10 } } }
    ]
  });
  assert.equal(result.n, 9);
  assert.equal(result.average, 440 / 9);
  assert.equal(result.tests.length, 4);
  const course = result.courses.find(row => row.key === 'huisvesting');
  assert.equal(course.n, 8);
  assert.equal(course.average, 440 / 8);
  assert.equal(course.tests.size, 3);
  for (const [id, n, som] of [['huisvesting-oefentoets', 4, 200], ['huisvesting-oefentoets-2', 2, 120], ['begrippentoets~huisvesting', 2, 120]]) {
    const row = result.tests.find(row => row.id === id);
    assert.equal(row.n, n);
    assert.equal(row.som, som);
    assert.equal(row.average, som / n);
    assert.equal(course.tests.get(id).n, n);
    assert.equal(course.tests.get(id).average, som / n);
    const content = result.content.find(row => row.pageId === id);
    assert.equal(content.n, n);
    assert.equal(content.average, som / n);
    const student = result.students[0].results.find(row => row.id === id);
    assert.equal(student.n, n);
    assert.equal(student.average, som / n);
    assert.equal(student.courseKey, 'huisvesting');
  }
  assert.equal(result.students[0].results.length, 5);
  const previousDay = result.students[0].results.find(row => row.day === '2026-11-09');
  assert.equal(previousDay.id, 'huisvesting-oefentoets');
  assert.equal(previousDay.n, 1);
  assert.equal(previousDay.average, 10);
  assert.equal(result.tests.find(row => row.id === 'unknown-20').courseKey, null);
  assert.deepEqual(result.difficult.map(row => row.id), ['huisvesting-oefentoets']);
});

test('aggregates day, course and student totals with date bounds and no double counted scores', () => {
  const result = aggregate();
  assert.equal(result.visitors, 17);
  assert.equal(result.studentCount, 2);
  assert.equal(result.sec, 2700);
  assert.equal(result.n, 6); // Anonymous counters already include the logged-in submissions.
  assert.equal(result.average, 200 / 6);
  assert.deepEqual(result.days, [{ day: '2026-11-09', visitors: 10, sec: 1800 }, { day: '2026-11-10', visitors: 7, sec: 900 }]);
  const course = result.courses.find(row => row.key === 'huisvesting');
  assert.equal(course.views, 10);
  assert.equal(course.sec, 2100);
  assert.equal(course.opens, 5);
  assert.equal(course.studentCount, 2);
  assert.equal(course.minutesPerStudent, 17.5);
  assert.equal(course.n, 4);
  assert.equal(course.average, 37.5);
  assert.equal(course.current, false);
  assert.equal(result.courses.find(row => row.key === 'facilitair-verandermanagement').current, true);
  assert.equal(result.difficult.length, 1);
  const student = result.students.find(row => row.uid === 'alice123');
  assert.equal(student.label, 'Student alice1');
  assert.equal(student.sec, 2400);
  assert.equal(student.activeDays, 2);
  assert.equal(student.courseCount, 2);
  assert.equal(student.lastDay, '2026-11-10');
  assert.equal(student.year, 2);
  assert.deepEqual(student.retakes.map(course => course.key), ['huisvesting']);
  assert.equal(student.results[0].average, 0);
  assert.equal(student.results[1].average, 50);
});

test('content keeps individual views but marks activity shared across pages of a type', () => {
  const result = aggregate();
  const flashcards = result.content.find(item => item.href === 'huisvesting-flashcards.html');
  assert.equal(flashcards.views, 8);
  assert.equal(flashcards.sec, 1800);
  assert.equal(flashcards.opens, 4);
  assert.equal(flashcards.sharedActivity, false);
  const test = result.content.find(item => item.href === 'huisvesting-oefentoets.html');
  assert.equal(test.sec, 300);
  assert.equal(test.sharedActivity, true);
  assert.equal(test.average, 37.5);
  assert.equal(result.content.length, index.items.length);
  const shared = aggregate({ statistics: [{ day: '2026-11-09', paginas: [{ id: 'evenementenlogistiek-oefentoets-2', n: 7 }] }] });
  assert.equal(shared.courses.find(row => row.key === 'projectvaardigheden').views, 0);
  assert.equal(shared.courses.find(row => row.key === 'evenementenlogistiek').views, 7);
  assert.equal(shared.content.filter(row => row.pageId === 'evenementenlogistiek-oefentoets-2').every(row => row.sharedViews && row.views === 7), true);
});

test('derived year requires ten minutes and chooses the year with the most measured course time', () => {
  assert.equal(D.inferYear(new Map(), index).year, null);
  assert.equal(D.inferYear(new Map([['huisvesting', 599]]), index).year, null);
  assert.equal(D.inferYear(new Map([['huisvesting', 600]]), index).year, 2);
  assert.equal(D.inferYear(new Map([['huisvesting', 700], ['basis-van-fm-a', 1400]]), index).year, 1);
  assert.equal(D.inferYear(new Map([['huisvesting', 600], ['basis-van-fm-a', 600]]), index).year, null);
  assert.equal(D.inferYear(new Map([['unknown', 10000]]), index).year, null);
});

test('retake signals require fifteen minutes in an earlier year or fully elapsed periods of the inferred year', () => {
  const custom = D.makeIndex([
    { key: 'earlier', year: 1, periods: [3, 4] }, { key: 'now', year: 2, periods: [2] },
    { key: 'previous', year: 2, periods: [1] }, { key: 'future-year', year: 3, periods: [1] },
    { key: 'future-period', year: 2, periods: [3] },
    { key: 'multi', year: 2, periods: [1, 2] }, { key: 'gap', year: 2, periods: [1, 3] }
  ]);
  const times = new Map(custom.courses.map(course => [course.key, 900]));
  assert.deepEqual(D.inferRetakes(times, 2, current, custom).map(course => course.key), ['earlier', 'previous']);
  assert.deepEqual(D.inferRetakes(new Map([['earlier', 899]]), 2, current, custom), []);
  assert.deepEqual(D.inferRetakes(new Map([['previous', 900]]), 1, current, custom), []);
  assert.deepEqual(D.inferRetakes(new Map([['earlier', 900]]), null, current, custom), []);
  assert.deepEqual(D.inferRetakes(times, null, current, custom), []);
  assert.deepEqual(D.inferRetakes(times, 2, { year: 3, period: 4 }, custom).map(course => course.key),
    ['earlier', 'now', 'previous', 'future-period', 'multi', 'gap']);
});

test('empty input, zero score and invalid numbers produce no NaN or false data', () => {
  const empty = D.aggregate();
  assert.equal(empty.hasData, false);
  assert.equal(empty.average, null);
  assert.deepEqual(empty.students, []);
  assert.deepEqual(empty.days, []);
  const zeros = aggregate({ activities: [], statistics: [] });
  assert.equal(zeros.hasData, false);
  assert.equal(zeros.courses.every(course => course.sec === 0 && course.average === null && course.minutesPerStudent === 0), true);
  const bad = aggregate({ activities: [{ uid: 'x', dag: 'bad', sec: 9 }, { dag: '2026-11-09', sec: 10 }], statistics: [{ day: '2026-11-09', bezoekers: Infinity, paginas: [{ id: '__proto__', n: -5 }], toetsen: [{ id: 'unknown', n: 1, som: 0 }] }] });
  assert.equal(bad.studentCount, 0);
  assert.equal(bad.visitors, 0);
  assert.equal(bad.average, 0);
  assert.equal(bad.pages[0].views, 0);
});

test('sorts numbers, text and unknown values without mutating the source', () => {
  const rows = [{ value: 10 }, { value: null }, { value: 2 }];
  assert.deepEqual(D.sortRows(rows, 'value').map(row => row.value), [2, 10, null]);
  assert.deepEqual(D.sortRows(rows, 'value', 'desc').map(row => row.value), [10, 2, null]);
  assert.equal(rows[0].value, 10);
  assert.deepEqual(D.sortRows([{ title: 'Vak 10' }, { title: 'Vak 2' }], 'title').map(row => row.title), ['Vak 2', 'Vak 10']);
});

test('local date ranges include today, cross year and DST boundaries, and fill missing days', () => {
  assert.deepEqual(D.periodRange('7', new Date(2026, 0, 3, 12)), { start: '2025-12-28', end: '2026-01-03' });
  assert.deepEqual(D.periodRange('30', new Date(2026, 10, 10, 12)), { start: '2026-10-12', end: '2026-11-10' });
  assert.deepEqual(D.periodRange('alles', new Date(2026, 10, 10)), { start: '0000-01-01', end: '2026-11-10' });
  assert.equal(D.daySeries('2026-10-23', '2026-10-27').length, 5);
  assert.deepEqual(D.daySeries('0000-01-01', '2026-11-10', ['2026-11-09']), ['2026-11-09', '2026-11-10']);
  assert.deepEqual(D.daySeries('0000-01-01', '2026-11-10'), []);
});

test('escapes all HTML-sensitive characters including malicious Firestore keys', () => {
  assert.equal(D.escapeHTML('<img src=x onerror="alert(1)"> & \'x\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;x&#39;');
  assert.equal(D.escapeHTML(null), '');
  assert.equal(D.escapeHTML(0), '0');
});

test('exports browser helpers without accessing the DOM or Firebase', () => {
  const browser = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../js/beheer-data.js', import.meta.url), 'utf8'), browser);
  assert.equal(typeof browser.window.BeheerData.aggregate, 'function');
  assert.equal(browser.window.BeheerData.YEAR_MIN_SECONDS, 600);
});

test('chart calculation fills missing days and keeps exact quarter-minute values', () => {
  const chart = D.chartData(new Map([['2026-11-09', 15], ['2026-11-10', 60]]), null, 60, '2026-11-08', '2026-11-10', []);
  assert.deepEqual(chart.values.map(row => row.value), [0, .25, 1]);
  assert.equal(chart.values[1].raw, 15);
  assert.equal(chart.total, 1.25);
  assert.equal(chart.peak, 1);
});

// Minimal DOM and Firebase doubles run the page's own script in Node, without a browser or network.
const pageScript = readFileSync(new URL('../data.html', import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const settle = async () => { for (let i = 0; i < 35; i++) await Promise.resolve(); };
function dashboard({ delayedStats, failActivities = false, feedbackCount = 5, failFeedback = false,
  initialApps = [], testCounters = [], studentTests = {} } = {}) {
  const nodes = new Map(), listeners = new Map(), reads = [], filters = [];
  let changed;
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', hidden: false, value: '',
      setAttribute() {}, addEventListener(event, handler) { listeners.set(id + ':' + event, handler); } });
    return nodes.get(id);
  };
  const auth = { currentUser: null, onAuthStateChanged(callback) { changed = callback; } };
  const docs = values => values.map(value => ({ id: value.id, data: () => value }));
  const db = { collection(name) {
    return {
      where(...args) { filters.push({ name, args }); return this; },
      async get() {
        reads.push(name);
        if (name === 'activiteit') {
          if (failActivities) throw { code: '<failed>' };
          return { docs: [{ data: () => ({ uid: 'student', dag: D.localDay(new Date()), sec: 15, vakken: { huisvesting: { flashcards: { sec: 15, open: 1 } } }, toetsen: studentTests }) }] };
        }
        if (name === 'statistiek') {
          if (delayedStats) await delayedStats;
          return { docs: [{ id: D.localDay(new Date()), data: () => ({ bezoekers: 4 }), ref: { collection(part) {
            return { async get() { reads.push('statistiek/' + part); return { docs: docs(part === 'paginas' ? [{ id: '<script>alert(1)</script>', n: 3 }] : testCounters) }; } };
          } } }] };
        }
        if (failFeedback) throw { code: 'feedback-failed' };
        return { size: feedbackCount, docs: [] };
      }
    };
  } };
  const firebase = { apps: initialApps.slice(), initializeApp(config) { assert.equal(config.projectId, 'fmkompas-ff8bc'); this.apps.push({}); },
    auth: () => auth, firestore: Object.assign(() => db, { FieldPath: { documentId: () => '__name__' } }) };
  const window = { BeheerData: D, ATLAS_VAKKEN: courses, ATLAS_HUIDIG: current, firebase,
    addEventListener(type, handler) { listeners.set(type, handler); } };
  const location = new URL('https://fmatlas.nl/data.html');
  const globals = { window, firebase, location, URLSearchParams, Atlas: { topbar() {}, accountReady: Promise.resolve({}) },
    ATLAS_HUIDIG: current, document: { getElementById: node } };
  vm.runInNewContext(pageScript, globals);
  return { node, reads, filters, firebase,
    account(user) { auth.currentUser = user; changed(user); },
    async navigate(hash) { location.hash = hash; listeners.get('hashchange')(); await settle(); },
    clickSort(table, key) { listeners.get('view:click')({ target: { closest(selector) { return selector === '[data-sort]' ? { dataset: { table, sort: key } } : null; } } }); }
  };
}

test('page initializes Firebase for guests and never reads data for guests or other students', async () => {
  const page = dashboard(); await settle();
  assert.equal(page.firebase.apps.length, 1);
  page.account(null); await settle();
  assert.match(page.node('access').innerHTML, /Inloggen met Google/);
  assert.deepEqual(page.reads, []);
  page.account({ uid: 'other' }); await settle();
  assert.equal(page.node('access').textContent, 'Deze pagina is alleen voor de beheerder.');
  assert.equal(page.node('dashboard').hidden, true);
  assert.deepEqual(page.reads, []);
});

test('admin page filters activity reads, renders all five routes, escapes counters and supports history', async () => {
  const page = dashboard(); await settle();
  page.account({ uid: 'EFkA4kexkLNjBKCGuKD9eiyUvfM2' }); await settle();
  assert.match(page.node('view').innerHTML, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(page.node('view').innerHTML, /<script>alert/);
  assert.ok(page.filters.some(({ name, args }) => name === 'activiteit' && args[0] === 'dag' && args[1] === '>='));
  assert.equal(page.node('dashboard').hidden, false);
  await page.navigate('#vakken'); assert.match(page.node('view').innerHTML, /Huidige periode/);
  page.clickSort('vakken', 'title'); assert.match(page.node('view').innerHTML, /aria-sort="descending"/);
  await page.navigate('#vak=huisvesting'); assert.match(page.node('view').innerHTML, /Tijd en opens per onderdeel/);
  await page.navigate('#studenten'); assert.match(page.node('view').innerHTML, /Onbekend \(afgeleid\)/);
  await page.navigate('#student=student'); assert.match(page.node('view').innerHTML, /Minder dan 10 minuten/);
  await page.navigate('#inhoud&filter=huisvesting'); assert.match(page.node('view').innerHTML, /Actieve minuten/);
  await page.navigate('#meldingen'); assert.match(page.node('view').innerHTML, /5 meldingen met status nieuw/);
  await page.navigate('#overzicht&periode=7'); assert.equal(page.node('period').value, '7');
  assert.ok(page.filters.some(({ name, args }) => name === 'activiteit' && args[2] === D.periodRange('7').start));
  await page.navigate('#overzicht&periode=30'); assert.equal(page.node('period').value, '30');
});

test('dashboard shows indexed test titles and keeps unknown scores visibly unlinked', async () => {
  const testCounters = [
    { id: 'huisvesting-oefentoets-1-20', n: 1, som: 20 },
    { id: 'huisvesting-oefentoets-1-40', n: 2, som: 100 },
    { id: 'em1-oefentoets-2-40', n: 3, som: 180 },
    { id: 'huisvesting-begrippentoets-20', n: 3, som: 210 },
    { id: 'unknown-score', n: 3, som: 0 }
  ];
  const studentTests = Object.fromEntries(testCounters.map(({ id, n, som }) => [id, { n, som }]));
  const page = dashboard({ testCounters, studentTests }); await settle();
  page.account({ uid: 'EFkA4kexkLNjBKCGuKD9eiyUvfM2' }); await settle();
  assert.match(page.node('view').innerHTML, /Huisvesting · Oefentoets 1 · week 1 t\/m 3/);
  assert.match(page.node('view').innerHTML, /Eventmanagement 1 · Oefentoets 4 · extra moeilijk/);
  assert.match(page.node('view').innerHTML, /Huisvesting · Begrippentoets/);
  assert.match(page.node('view').innerHTML, /unknown-score \(niet gekoppeld\)/);
  assert.doesNotMatch(page.node('view').innerHTML, /huisvesting-oefentoets-1-(20|40)/);
  await page.navigate('#vak=huisvesting');
  assert.match(page.node('view').innerHTML, /Huisvesting · Oefentoets 1 · week 1 t\/m 3/);
  await page.navigate('#student=student');
  assert.equal((page.node('view').innerHTML.match(/Huisvesting · Oefentoets 1 · week 1 t\/m 3/g) || []).length, 1);
  assert.match(page.node('view').innerHTML, /unknown-score \(niet gekoppeld\)/);
});

test('feedback distinguishes an unknown count, a counted zero and a read error', async () => {
  for (const [options, expected] of [
    [{ feedbackCount: null }, /Het aantal meldingen wordt geteld…/],
    [{ feedbackCount: 0 }, /0 meldingen met status nieuw/],
    [{ failFeedback: true }, /Het aantal meldingen kon niet worden geladen/]
  ]) {
    const page = dashboard(options); await settle();
    page.account({ uid: 'EFkA4kexkLNjBKCGuKD9eiyUvfM2' }); await settle();
    await page.navigate('#meldingen');
    assert.match(page.node('view').innerHTML, expected);
    if (options.feedbackCount !== 0) assert.doesNotMatch(page.node('view').innerHTML, /0 meldingen/);
  }
});

test('signing out during a read discards late results and stops subsequent subcollection reads', async () => {
  let release;
  const page = dashboard({ delayedStats: new Promise(resolve => { release = resolve; }) });
  await settle(); page.account({ uid: 'EFkA4kexkLNjBKCGuKD9eiyUvfM2' }); await settle();
  page.account(null); release(); await settle();
  assert.equal(page.node('dashboard').hidden, true);
  assert.equal(page.node('view').innerHTML, '');
  assert.equal(page.reads.some(name => name.startsWith('statistiek/')), false);
});

test('failed activity read is an explicit error, not an empty successful dashboard', async () => {
  const page = dashboard({ failActivities: true }); await settle();
  page.account({ uid: 'EFkA4kexkLNjBKCGuKD9eiyUvfM2' }); await settle();
  assert.equal(page.node('load-state').textContent, 'Gegevens laden is mislukt (<failed>).');
  assert.match(page.node('view').innerHTML, /Opnieuw laden/);
});
