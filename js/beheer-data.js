/* Pure calculations for the FM Atlas administration dashboard. */
(function (root) {
  'use strict';
  const YEAR_MIN_SECONDS = 10 * 60;
  const RETAKE_MIN_SECONDS = 15 * 60;
  const DIFFICULT_MIN_SUBMISSIONS = 3;
  const GROUPS = ['leren', 'oefenen', 'toetsen'];
  const PARTS = ['begrippentoets', 'oefentoets', 'samenvatting', 'begrippen', 'flashcards', 'video'];
  const ICON_PARTS = { book: 'samenvatting', list: 'begrippen', play: 'video', cards: 'flashcards', check: 'begrippentoets', quiz: 'oefentoets' };
  const number = value => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const cleanId = value => String(value || '').toLowerCase().replace(/[^a-z0-9~-]/g, '').slice(0, 80) || 'onbekend';
  function pageId(href) {
    const url = new URL(href, 'https://fmatlas.nl/');
    const name = (url.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '');
    return cleanId(name + ((url.searchParams.get('v') || url.searchParams.get('vak')) ? '~' + (url.searchParams.get('v') || url.searchParams.get('vak')) : ''));
  }
  function partOf(href, icon) {
    const filename = new URL(href, 'https://fmatlas.nl/').pathname.split('/').pop();
    return PARTS.find(part => new RegExp('(^|-)' + part + '(-|\\.html$)').test(filename)) || ICON_PARTS[icon] || 'overig';
  }
  function makeIndex(courses = []) {
    const items = courses.flatMap(course => GROUPS.flatMap(group => (course[group] || []).map(([title, href, icon], i) => ({
      key: `${course.key}:${group}:${i}`, courseKey: course.key, courseTitle: course.title,
      group, title, href, part: partOf(href, icon), pageId: pageId(href)
    }))));
    return { courses, items };
  }
  function resolvePage(id, index) {
    const hub = index.courses.find(course => pageId('vak.html?v=' + encodeURIComponent(course.key)) === id);
    if (hub) return { courseKey: hub.key, items: [], shared: false };
    const items = index.items.filter(item => item.pageId === id);
    const keys = [...new Set(items.map(item => item.courseKey))];
    return { courseKey: keys.length === 1 ? keys[0] : null, items, shared: items.length > 1 };
  }
  function resolveActivity(courseKey, part, index) {
    return { course: index.courses.find(course => course.key === courseKey) || null,
      items: index.items.filter(item => item.courseKey === courseKey && item.part === part) };
  }
  // The measurement module applies cleanId to the caller's test key.
  // Exact page IDs are supported; unrecognised keys remain visible without guessed attribution.
  function resolveTest(id, index) {
    return resolvePage(id, { ...index, items: index.items.filter(item => ['begrippentoets', 'oefentoets'].includes(item.part)) });
  }
  function localDay(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function periodRange(choice = '30', today = new Date()) {
    const end = localDay(today), date = new Date(today);
    const days = ['7', '30', '90'].includes(String(choice)) ? Number(choice) : null;
    if (days) date.setDate(date.getDate() - days + 1);
    return { start: days ? localDay(date) : '0000-01-01', end };
  }
  function daySeries(start, end, observed = []) {
    if (start === '0000-01-01') start = observed.filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day) && day <= end).sort()[0];
    if (!start || start > end) return [];
    const result = [], date = new Date(start + 'T12:00:00');
    while (localDay(date) <= end) {
      result.push(localDay(date)); date.setDate(date.getDate() + 1);
    }
    return result;
  }
  function chartData(source, field, divisor, start, end, observed) {
    const mapped = source instanceof Map ? source : new Map(source.map(row => [row.day, row[field]]));
    const values = daySeries(start, end, observed).map(day => ({ day, raw: number(mapped.get(day)), value: number(mapped.get(day)) / divisor }));
    return { values, total: values.reduce((sum, row) => sum + row.value, 0), peak: values.reduce((max, row) => Math.max(max, row.value), 0) };
  }
  function inferYear(courseSeconds, index) {
    const years = new Map();
    for (const course of index.courses) years.set(course.year, (years.get(course.year) || 0) + number(courseSeconds.get(course.key)));
    const total = [...years.values()].reduce((a, b) => a + b, 0);
    const ranked = [...years].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const tie = ranked.length > 1 && ranked[0][1] === ranked[1][1];
    return { year: total >= YEAR_MIN_SECONDS && !tie ? ranked[0]?.[0] ?? null : null, total, years: [...years].map(([year, sec]) => ({ year, sec })), tie };
  }
  function inferRetakes(courseSeconds, inferredYear, current, index) {
    return index.courses.filter(course => number(courseSeconds.get(course.key)) >= RETAKE_MIN_SECONDS &&
      !(course.periods || []).includes(current.period) &&
      ((inferredYear !== null && course.year <= inferredYear) ||
       (course.year === current.year && (course.periods || []).some(period => period < current.period))));
  }
  function sortRows(rows, key, direction = 'asc') {
    const sign = direction === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const x = a[key], y = b[key];
      if (x == null) return y == null ? 0 : 1;
      if (y == null) return -1;
      return sign * (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'nl', { numeric: true }));
    });
  }
  function aggregate({ courses = [], current = {}, statistics = [], activities = [], start = '0000-01-01', end = '9999-12-31' } = {}) {
    const index = makeIndex(courses), days = new Map(), students = new Map(), pages = new Map(), tests = new Map();
    const courseRows = new Map(courses.map(course => [course.key, { ...course, sec: 0, views: 0, opens: 0, n: 0, som: 0,
      students: new Set(), days: new Map(), parts: new Map(), tests: new Map(), current: course.year === current.year && (course.periods || []).includes(current.period) }]));
    const dayRow = day => { if (!days.has(day)) days.set(day, { day, visitors: 0, sec: 0 }); return days.get(day); };
    const inRange = day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= start && day <= end;
    const sumTest = (map, id, value) => {
      if (!map.has(id)) map.set(id, { id, n: 0, som: 0 });
      const row = map.get(id); row.n += number(value?.n); row.som += number(value?.som); return row;
    };
    let visitors = 0, sec = 0;
    for (const stat of statistics) {
      if (!inRange(stat.day)) continue;
      const daily = dayRow(stat.day); daily.visitors += number(stat.bezoekers); visitors += number(stat.bezoekers);
      for (const page of stat.paginas || []) {
        const match = resolvePage(page.id, index), n = number(page.n);
        if (!pages.has(page.id)) pages.set(page.id, { id: page.id, views: 0, ...match });
        pages.get(page.id).views += n;
        if (match.courseKey) courseRows.get(match.courseKey).views += n;
      }
      for (const test of stat.toetsen || []) {
        sumTest(tests, test.id, test);
        const match = resolveTest(test.id, index), course = courseRows.get(match.courseKey);
        if (course) { course.n += number(test.n); course.som += number(test.som); sumTest(course.tests, test.id, test); }
      }
    }
    for (const activity of activities) {
      if (!inRange(activity.dag) || typeof activity.uid !== 'string' || !activity.uid) continue;
      if (!students.has(activity.uid)) students.set(activity.uid, { uid: activity.uid, label: 'Student ' + activity.uid.slice(0, 6), sec: 0,
        days: new Map(), courses: new Map(), results: [], lastDay: activity.dag });
      const student = students.get(activity.uid), seconds = number(activity.sec);
      sec += seconds; dayRow(activity.dag).sec += seconds; student.sec += seconds;
      student.days.set(activity.dag, (student.days.get(activity.dag) || 0) + seconds);
      if (activity.dag > student.lastDay) student.lastDay = activity.dag;
      for (const [courseKey, parts] of Object.entries(activity.vakken || {})) {
        const course = courseRows.get(courseKey);
        if (!course) continue;
        for (const [part, values] of Object.entries(parts || {})) {
          const partSec = number(values?.sec), opens = number(values?.open);
          if (!partSec && !opens) continue;
          if (!student.courses.has(courseKey)) student.courses.set(courseKey, { key: courseKey, title: course.title, sec: 0, opens: 0 });
          const studentCourse = student.courses.get(courseKey);
          course.students.add(activity.uid); course.sec += partSec; course.opens += opens;
          course.days.set(activity.dag, (course.days.get(activity.dag) || 0) + partSec);
          if (!course.parts.has(part)) course.parts.set(part, { part, sec: 0, opens: 0 });
          course.parts.get(part).sec += partSec; course.parts.get(part).opens += opens;
          studentCourse.sec += partSec; studentCourse.opens += opens;
        }
      }
      for (const [id, result] of Object.entries(activity.toetsen || {})) {
        const n = number(result?.n), som = number(result?.som);
        if (!n) continue;
        const match = resolveTest(id, index), course = courseRows.get(match.courseKey);
        student.results.push({ day: activity.dag, id, n, som, average: som / n, courseKey: match.courseKey });
        if (course) {
          course.students.add(activity.uid);
          if (!student.courses.has(course.key)) student.courses.set(course.key, { key: course.key, title: course.title, sec: 0, opens: 0 });
        }
      }
    }
    for (const student of students.values()) {
      const times = new Map([...student.courses].map(([key, value]) => [key, value.sec]));
      student.inference = inferYear(times, index); student.year = student.inference.year;
      student.retakes = inferRetakes(times, student.year, current, index);
      student.retakeCount = student.retakes.length; student.activeDays = student.days.size; student.courseCount = student.courses.size;
      student.results = sortRows(student.results, 'day', 'desc');
    }
    for (const course of courseRows.values()) {
      course.studentCount = course.students.size; course.minutesPerStudent = course.studentCount ? course.sec / 60 / course.studentCount : 0;
      course.average = course.n ? course.som / course.n : null;
      for (const part of course.parts.values()) {
        const items = resolveActivity(course.key, part.part, index).items;
        part.group = [...new Set(items.map(item => item.group))].join(' / ') || 'vakpagina / overig';
        part.titles = items.map(item => item.title).join(', ') || part.part;
      }
      for (const test of course.tests.values()) test.average = test.n ? test.som / test.n : null;
    }
    for (const test of tests.values()) { test.average = test.n ? test.som / test.n : null; Object.assign(test, resolveTest(test.id, index)); }
    const content = index.items.map(item => {
      const course = courseRows.get(item.courseKey), activityItems = resolveActivity(item.courseKey, item.part, index).items;
      const test = tests.get(item.pageId);
      return { ...item, views: pages.get(item.pageId)?.views || 0, sharedViews: resolvePage(item.pageId, index).shared,
        opens: course.parts.get(item.part)?.opens || 0, sec: course.parts.get(item.part)?.sec || 0,
        sharedActivity: activityItems.length > 1, average: test?.average ?? null, n: test?.n || 0 };
    });
    const n = [...tests.values()].reduce((sum, test) => sum + test.n, 0), som = [...tests.values()].reduce((sum, test) => sum + test.som, 0);
    return { index, visitors, sec, studentCount: students.size, n, average: n ? som / n : null,
      days: sortRows([...days.values()], 'day'), courses: [...courseRows.values()], students: [...students.values()], content,
      pages: sortRows([...pages.values()], 'views', 'desc'), tests: [...tests.values()],
      difficult: sortRows([...tests.values()].filter(test => test.n >= DIFFICULT_MIN_SUBMISSIONS), 'average'),
      hasData: visitors > 0 || pages.size > 0 || tests.size > 0 || students.size > 0 };
  }
  const helpers = { YEAR_MIN_SECONDS, RETAKE_MIN_SECONDS, DIFFICULT_MIN_SUBMISSIONS, escapeHTML, cleanId, pageId, partOf,
    makeIndex, resolvePage, resolveActivity, resolveTest, localDay, periodRange, daySeries, chartData, inferYear, inferRetakes, sortRows, aggregate };
  if (typeof module !== 'undefined' && module.exports) module.exports = helpers;
  else if (root) root.BeheerData = helpers;
})(typeof window === 'undefined' ? null : window);
