/* FM Atlas — anonieme gebruiksstatistiek voor het beheerdersdashboard.
   Telt per dag: unieke bezoekers (één keer per browser per dag), paginaweergaven per pagina
   en ingeleverde oefentoetsen met hun score. Er gaat geen naam, account, IP-adres of
   apparaat-id mee: alleen tellers in Firestore `statistiek/{dag}`. Lezen kan alleen de beheerder.
   Lukt schrijven niet (bijv. omdat de regel nog niet bestaat), dan gebeurt er stil niets. */
(function () {
  if (window.__faStats) return;
  window.__faStats = true;
  if (document.body.dataset.noStats !== undefined || document.body.dataset.noFeedback !== undefined) return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === 'file:') return;
  try { if (localStorage.getItem('fa_stats_uit') === '1') return; } catch (_) {}

  const PROJECT = 'fmkompas-ff8bc';
  const API_KEY = 'AIzaSyBB397Wk2eqpBjic8E7aGV1mTgIjhQ21a8';
  const DB = `projects/${PROJECT}/databases/(default)/documents`;
  const URL = `https://firestore.googleapis.com/v1/${DB}:commit?key=${API_KEY}`;

  const d = new Date();
  const dag = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const naam = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  const vak = new URLSearchParams(location.search).get('vak');
  const pagina = (vak ? `${naam}~${vak}` : naam).replace(/[^a-z0-9~-]/gi, '').slice(0, 80) || 'onbekend';

  function inc(pad, velden) {
    const body = { writes: [{ transform: { document: `${DB}/${pad}`, fieldTransforms:
      Object.entries(velden).map(([f, v]) => ({ fieldPath: f, increment: { integerValue: String(v) } })) } }] };
    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
      .catch(() => {});
  }

  /* Eén unieke bezoeker per browser per dag */
  try {
    if (localStorage.getItem('fa_stats_dag') !== dag) {
      localStorage.setItem('fa_stats_dag', dag);
      inc(`statistiek/${dag}`, { bezoekers: 1 });
    }
  } catch (_) {}

  /* Paginaweergave */
  inc(`statistiek/${dag}/paginas/${pagina}`, { n: 1 });

  /* Ingeleverde oefentoets: score uit de resultaatkaart */
  function haakToets() {
    if (typeof window.submitTest !== 'function' || window.submitTest.__faStats) return;
    const orig = window.submitTest;
    const wrapped = function () {
      const r = orig.apply(this, arguments);
      setTimeout(() => {
        const res = document.getElementById('ot-results');
        const pct = parseInt((document.getElementById('resPct') || {}).textContent, 10);
        if (res && getComputedStyle(res).display !== 'none' && !isNaN(pct)) {
          inc(`statistiek/${dag}/toetsen/${pagina}`, { n: 1, som: Math.max(0, Math.min(100, pct)) });
        }
      }, 300);
      return r;
    };
    wrapped.__faStats = true;
    window.submitTest = wrapped;
  }
  /* Na de andere scripts (oefentoets-extra.js wikkelt submitTest ook) */
  if (document.readyState === 'complete') haakToets(); else window.addEventListener('load', haakToets);
})();
