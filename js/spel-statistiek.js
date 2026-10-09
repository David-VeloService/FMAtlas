/* FM Atlas — anonieme spelstatistiek van Slipstroom (game/) voor het beheerdersdashboard.
   De game stuurt alleen window-events `slipstroom:stat` met { name, som }; dit script telt ze per
   dag in Firestore `statistiek/{dag}/spel/{name}` als { n: +1 } (en som: +som, hooguit 6).
   Geen naam, account, IP-adres of apparaat-id: alleen tellers. Lezen kan alleen de beheerder.
   Wie de beheerpagina heeft geopend (fa_stats_uit) telt niet mee. Pas na het laden van de game
   gaat er iets over het netwerk; lukt schrijven niet (bijv. omdat de regel nog niet bestaat), dan
   gebeurt er stil niets. Wordt alleen geladen door de FM Atlas-build van de game. */
(function () {
  if (window.__faSpelStats) return;
  window.__faSpelStats = true;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === 'file:') return;
  try { if (localStorage.getItem('fa_stats_uit') === '1') return; } catch (_) {}

  const PROJECT = 'fmkompas-ff8bc';
  const API_KEY = 'AIzaSyBB397Wk2eqpBjic8E7aGV1mTgIjhQ21a8';
  const DB = `projects/${PROJECT}/databases/(default)/documents`;
  const URL = `https://firestore.googleapis.com/v1/${DB}:commit?key=${API_KEY}`;

  /* Dag in Nederlandse tijd, zelfde vorm als statistiek.js (JJJJ-MM-DD) */
  function dag() {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date()); } catch (_) {}
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function inc(pad, velden) {
    const body = { writes: [{ transform: { document: `${DB}/${pad}`, fieldTransforms:
      Object.entries(velden).map(([f, v]) => ({ fieldPath: f, increment: { integerValue: String(v) } })) } }] };
    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true })
      .catch(() => {});
  }

  function tel(detail) {
    const name = detail && detail.name;
    if (typeof name !== 'string' || !/^[a-z0-9-]{1,40}$/.test(name)) return;
    const velden = { n: 1 };
    const som = detail.som;
    if (typeof som === 'number' && isFinite(som)) velden.som = Math.max(0, Math.min(6, Math.round(som)));
    inc(`statistiek/${dag()}/spel/${name}`, velden);
  }

  /* Luisteren meteen (anders missen we 'geopend'), versturen pas als de game geladen is */
  let wacht = [];
  window.addEventListener('slipstroom:stat', e => { if (wacht) wacht.push(e.detail); else tel(e.detail); });
  function los() {
    const rij = wacht || [];
    wacht = null;
    rij.forEach(tel);
  }
  function naLaden() { setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(los, { timeout: 5000 }) : los()), 2000); }
  if (document.readyState === 'complete') naLaden(); else window.addEventListener('load', naLaden);
  window.addEventListener('pagehide', () => { if (wacht) los(); });
})();
