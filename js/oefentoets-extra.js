/* FM Atlas — extra's voor alle oefentoetspagina's.
   Laadt na het pagina-script en breidt de bestaande functies uit:
   - antwoorden blijven bewaard bij herladen (sessionStorage), met "Ga verder"
   - waarschuwing bij inleveren als er nog vragen open staan
   - "Bekijk fouten" toont alleen de foute vragen, met een knop terug
   - geopend vanaf Projectvaardigheden (?from=pv): terug naar die vakpagina
   Verwacht de globals van de toetspagina: answers, total, startTest,
   answer, submitTest, reviewMistakes en optioneel openMarks/selfMark. */
(function () {
  const KEY = 'fa_ot_state_' + location.pathname;
  const has = name => typeof window[name] === 'function';
  if (!has('startTest') || !has('answer') || !has('submitTest')) return;

  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (_) { return null; } },
    set(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (_) {} },
    clear() { try { sessionStorage.removeItem(KEY); } catch (_) {} },
  };
  const getAnswers = () => (typeof answers !== 'undefined' ? answers : {});
  const getMarks = () => (typeof openMarks !== 'undefined' ? openMarks : {});
  let replaying = false;

  function save() {
    if (replaying) return;
    const texts = {};
    document.querySelectorAll('.ot-open-area').forEach(t => { if (t.value) texts[t.id] = t.value; });
    store.set({ answers: getAnswers(), marks: getMarks(), texts, at: Date.now() });
  }
  function answeredCount() { return Object.keys(getAnswers()).length + Object.keys(getMarks()).length; }

  /* Bestaande functies uitbreiden */
  const origStart = window.startTest;
  window.startTest = function () {
    origStart.apply(this, arguments);
    if (!replaying) store.clear();
    document.querySelectorAll('.ot-feedback').forEach(f => f.setAttribute('aria-live', 'polite'));
    document.getElementById('ot-questions')?.classList.remove('only-wrong');
    hideOnlyWrongBar();
  };
  const origAnswer = window.answer;
  window.answer = function () { const r = origAnswer.apply(this, arguments); save(); return r; };
  if (has('selfMark')) {
    const origMark = window.selfMark;
    window.selfMark = function () { const r = origMark.apply(this, arguments); save(); return r; };
  }
  document.addEventListener('input', e => { if (e.target.classList?.contains('ot-open-area')) save(); });

  const origSubmit = window.submitTest;
  window.submitTest = function (force) {
    const open = total - answeredCount();
    if (open > 0 && force !== true) { showSubmitWarning(open); return; }
    hideSubmitWarning();
    const r = origSubmit.apply(this, arguments);
    store.clear();
    return r;
  };

  if (has('reviewMistakes')) {
    window.reviewMistakes = function () {
      document.getElementById('ot-test').style.display = 'block';
      document.getElementById('ot-results').style.display = 'none';
      const box = document.getElementById('ot-questions');
      box.classList.add('only-wrong');
      showOnlyWrongBar(box.querySelectorAll('.ot-q.wrong').length);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  /* Waarschuwing bij inleveren */
  function showSubmitWarning(open) {
    const card = document.getElementById('ot-submit');
    let w = document.getElementById('ot-warn');
    if (!w) {
      w = document.createElement('div');
      w.id = 'ot-warn';
      w.setAttribute('role', 'alert');
      w.className = 'ot-warn';
      card.insertBefore(w, card.querySelector('button'));
    }
    w.innerHTML = `Je hebt nog <strong>${open} ${open === 1 ? 'vraag' : 'vragen'}</strong> open. Die tellen als fout.
      <span class="ot-warn-actions">
        <button type="button" class="fa-btn fa-btn-ghost fa-btn-sm" id="ot-warn-goto">Naar eerste open vraag</button>
        <button type="button" class="fa-btn fa-btn-accent fa-btn-sm" id="ot-warn-force">Toch inleveren</button>
      </span>`;
    document.getElementById('ot-warn-force').onclick = () => window.submitTest(true);
    document.getElementById('ot-warn-goto').onclick = () => {
      const a = getAnswers(), m = getMarks();
      const first = [...document.querySelectorAll('.ot-q')].find(c => {
        const n = +c.id.replace('q-', '');
        return !(n in a) && !(n in m);
      });
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }
  function hideSubmitWarning() { document.getElementById('ot-warn')?.remove(); }

  /* Alleen fouten */
  function showOnlyWrongBar(n) {
    let bar = document.getElementById('ot-onlywrong');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'ot-onlywrong';
      bar.className = 'ot-onlywrong';
      document.getElementById('ot-questions').before(bar);
    }
    bar.innerHTML = n
      ? `Je ziet nu alleen je <strong>${n} foute ${n === 1 ? 'vraag' : 'vragen'}</strong>. <button type="button" class="fa-btn fa-btn-ghost fa-btn-sm">Toon alle vragen</button>`
      : `Geen foute vragen. <button type="button" class="fa-btn fa-btn-ghost fa-btn-sm">Toon alle vragen</button>`;
    bar.querySelector('button').onclick = () => {
      document.getElementById('ot-questions').classList.remove('only-wrong');
      hideOnlyWrongBar();
    };
  }
  function hideOnlyWrongBar() { document.getElementById('ot-onlywrong')?.remove(); }

  /* Verder gaan na herladen */
  const saved = store.get();
  if (saved && (Object.keys(saved.answers || {}).length + Object.keys(saved.marks || {}).length) > 0) {
    const row = document.querySelector('.ot-intro .fa-btn')?.parentElement;
    if (row) {
      const n = Object.keys(saved.answers || {}).length + Object.keys(saved.marks || {}).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fa-btn fa-btn-accent';
      btn.textContent = `Ga verder (${n} van ${total} beantwoord)`;
      btn.onclick = resume;
      row.prepend(btn);
    }
  }
  function resume() {
    const s = store.get();
    if (!s) return;
    replaying = true;
    window.startTest();
    for (const [num, val] of Object.entries(s.answers || {})) origAnswer(+num, val);
    for (const [id, txt] of Object.entries(s.texts || {})) { const t = document.getElementById(id); if (t) t.value = txt; }
    if (has('selfMark')) {
      for (const [num, good] of Object.entries(s.marks || {})) {
        const d = document.querySelector('#q-' + num + ' details');
        if (d) d.open = true;
        document.getElementById('mark-' + num)?.classList.add('show');
        window.selfMark(+num, good);
      }
    }
    replaying = false;
    save();
  }

  /* Geopend vanaf Projectvaardigheden: terug naar die vakpagina */
  if (new URLSearchParams(location.search).get('from') === 'pv') {
    document.querySelectorAll('a[href="evenementenlogistiek.html"]').forEach(a => {
      a.href = 'projectvaardigheden.html';
      if (a.textContent.trim() === 'Evenementenlogistiek') a.textContent = 'Projectvaardigheden';
    });
    const origLast = window.faMarkLastSeen;
    window.faMarkLastSeen = function (key) {
      if (key === 'evenementenlogistiek') return origLast('projectvaardigheden', 'Projectvaardigheden', 'projectvaardigheden.html');
      return origLast.apply(this, arguments);
    };
  }

  /* Stijl */
  const css = document.createElement('style');
  css.textContent = `
    .ot-warn { background:#fef3c7; color:#78350f; border:1.5px solid #fcd34d; border-radius:12px; padding:12px 14px; margin:0 0 14px; font-size:13.5px; line-height:1.5; }
    .ot-warn-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
    .ot-onlywrong { position:sticky; top:8px; z-index:5; background:var(--surface); border:1.5px solid var(--line); border-radius:12px; padding:10px 14px; margin-bottom:14px; font-size:13.5px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; box-shadow:var(--shadow); }
    .only-wrong .ot-q:not(.wrong), .only-wrong .ot-section-title, .only-wrong .ot-casus { display:none; }
    .ot-opt:focus-visible, .ot-mark-btn:focus-visible { outline:2px solid var(--accent-deep); outline-offset:2px; }
  `;
  document.head.appendChild(css);
})();
