/* FM Atlas — feedbackknoppen op elke pagina.
   Twee knoppen rechtsonder: "Feedback" en "Meld een onjuistheid". De melding gaat met
   de pagina, de titel en eventueel geselecteerde tekst naar Firestore (collectie
   `feedback`), via de REST-API zodat er op de pagina geen Firestore-SDK nodig is.
   Een verwerker op de Mac mini pakt nieuwe meldingen op; de status is te zien op
   beheer.html. */
(function () {
  if (window.__faFeedback) return;
  window.__faFeedback = true;

  const PROJECT = 'fmkompas-ff8bc';
  const API_KEY = 'AIzaSyBB397Wk2eqpBjic8E7aGV1mTgIjhQ21a8';
  const DB = `projects/${PROJECT}/databases/(default)/documents`;
  const MAX_PER_UUR = 5;
  let selectie = '';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Geselecteerde tekst onthouden: bij klikken op de knop is de selectie vaak al weg */
  document.addEventListener('selectionchange', () => {
    const s = String(window.getSelection ? window.getSelection() : '').trim();
    if (s && !document.getElementById('fa-fb-modal')?.contains(document.activeElement)) selectie = s.slice(0, 500);
  });

  function recent() {
    try { return JSON.parse(localStorage.getItem('fa_fb_tijden') || '[]').filter(t => Date.now() - t < 3600e3); } catch (_) { return []; }
  }
  function onthoud() {
    try { localStorage.setItem('fa_fb_tijden', JSON.stringify([...recent(), Date.now()])); } catch (_) {}
  }
  function randomId() {
    const a = new Uint8Array(15); crypto.getRandomValues(a);
    return Array.from(a, b => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[b % 62]).join('').slice(0, 20);
  }

  async function verstuur(data) {
    const id = randomId();
    const fields = {};
    for (const [k, v] of Object.entries(data)) if (v !== undefined && v !== '') fields[k] = { stringValue: String(v) };
    fields.status = { stringValue: 'nieuw' };
    const body = {
      writes: [{
        update: { name: `${DB}/feedback/${id}`, fields },
        updateTransforms: [{ fieldPath: 'aangemaakt', setToServerValue: 'REQUEST_TIME' }],
        currentDocument: { exists: false },
      }],
    };
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:commit?key=${API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return id;
  }

  /* Terugval: lukt Firestore niet (bijv. omdat de regel voor `feedback` nog niet bestaat),
     dan gaat de melding via Formspree naar de mail van de beheerder. */
  async function verstuurPerMail(data) {
    const r = await fetch('https://formspree.io/f/mpqbarbd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `FM Atlas ${data.type === 'onjuistheid' ? 'onjuistheid' : 'feedback'}: ${data.titel}`,
        soort: data.type, pagina: 'https://fmatlas.nl/' + data.pagina, titel: data.titel,
        geselecteerde_tekst: data.selectie || '-', bericht: data.bericht,
        ...(data.email ? { email: data.email } : {}),
      }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
  }

  function maakKnoppen() {
    const wrap = document.createElement('div');
    wrap.className = 'fa-fb-knoppen';
    wrap.innerHTML = `
      <button type="button" class="fa-fb-knop" data-type="feedback" aria-haspopup="dialog">
        <span aria-hidden="true">💬</span> Feedback
      </button>
      <button type="button" class="fa-fb-knop fa-fb-knop-fout" data-type="onjuistheid" aria-haspopup="dialog">
        <span aria-hidden="true">⚠️</span> Meld een onjuistheid
      </button>`;
    wrap.addEventListener('mousedown', e => e.preventDefault()); // selectie niet wissen
    wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => open(b.dataset.type)));
    document.body.appendChild(wrap);
  }

  function open(type) {
    sluit();
    const fout = type === 'onjuistheid';
    const ov = document.createElement('div');
    ov.id = 'fa-fb-modal';
    ov.className = 'fa-fb-overlay';
    ov.innerHTML = `
      <form class="fa-fb-dialog" role="dialog" aria-modal="true" aria-labelledby="fa-fb-titel" novalidate>
        <div class="fa-fb-kop">
          <h2 id="fa-fb-titel">${fout ? 'Meld een onjuistheid' : 'Feedback geven'}</h2>
          <button type="button" class="fa-fb-sluit" aria-label="Sluiten">×</button>
        </div>
        <p class="fa-fb-uitleg">${fout
          ? 'Klopt er iets niet op deze pagina? Beschrijf wat er fout is en wat het volgens jou moet zijn. Noem als het kan de bron (les, dia, boek).'
          : 'Mis je iets, is iets onduidelijk of heb je een idee? Laat het weten.'}</p>
        <div class="fa-fb-pagina">Pagina: <strong>${esc(document.title.replace(/ — FM Atlas$/, ''))}</strong></div>
        ${selectie ? `<label class="fa-fb-sel"><input type="checkbox" name="metSelectie" checked> Geselecteerde tekst meesturen: <q>${esc(selectie.slice(0, 160))}${selectie.length > 160 ? '…' : ''}</q></label>` : (fout ? '<p class="fa-fb-tip">Tip: selecteer eerst de tekst die niet klopt, dan gaat die automatisch mee.</p>' : '')}
        <label class="fa-fb-label" for="fa-fb-bericht">${fout ? 'Wat klopt er niet?' : 'Je feedback'}</label>
        <textarea id="fa-fb-bericht" name="bericht" rows="5" maxlength="2000" required></textarea>
        <label class="fa-fb-label" for="fa-fb-email">E-mailadres <span>(optioneel, alleen als je antwoord wilt)</span></label>
        <input id="fa-fb-email" name="email" type="email" maxlength="200" autocomplete="email">
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="fa-fb-hp">
        <div class="fa-fb-status" role="status" aria-live="polite"></div>
        <div class="fa-fb-acties">
          <button type="button" class="fa-btn fa-btn-ghost fa-fb-annuleer">Annuleren</button>
          <button type="submit" class="fa-btn fa-btn-accent">Versturen</button>
        </div>
        <p class="fa-fb-privacy">De pagina en je bericht worden opgeslagen om de site te verbeteren. <a href="privacy.html">Privacy</a></p>
      </form>`;
    document.body.appendChild(ov);
    const form = ov.querySelector('form');
    const status = ov.querySelector('.fa-fb-status');
    ov.addEventListener('click', e => { if (e.target === ov) sluit(); });
    ov.querySelector('.fa-fb-sluit').onclick = sluit;
    ov.querySelector('.fa-fb-annuleer').onclick = sluit;
    ov.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); sluit(); }
      if (e.key === 'Tab') {
        const f = [...form.querySelectorAll('input:not(.fa-fb-hp), textarea, button, a[href]')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i === 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    setTimeout(() => form.querySelector('textarea').focus(), 30);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const bericht = form.bericht.value.trim();
      if (form.website.value) { sluit(); return; } // spamval
      if (bericht.length < 5) { status.textContent = 'Schrijf iets meer, dan kan het goed worden opgepakt.'; return; }
      if (recent().length >= MAX_PER_UUR) { status.textContent = 'Je hebt het afgelopen uur al een paar meldingen gestuurd. Probeer het later nog eens.'; return; }
      const knop = form.querySelector('button[type="submit"]');
      knop.disabled = true; status.textContent = 'Versturen…';
      try {
        let uid = '';
        try { uid = (window.firebase && !firebase._stub && firebase.apps?.length && firebase.auth().currentUser?.uid) || ''; } catch (_) {}
        const data = {
          type,
          bericht,
          pagina: location.pathname.replace(/^\//, '') + location.search,
          titel: document.title.slice(0, 200),
          selectie: form.metSelectie?.checked ? selectie : '',
          email: form.email.value.trim(),
          uid,
        };
        try { await verstuur(data); } catch (_) { await verstuurPerMail(data); }
        onthoud();
        form.innerHTML = `<div class="fa-fb-kop"><h2 id="fa-fb-titel">Dank je!</h2><button type="button" class="fa-fb-sluit" aria-label="Sluiten">×</button></div>
          <p class="fa-fb-uitleg">${fout ? 'Je melding is binnen. Hij wordt nagekeken tegen het lesmateriaal en, als hij klopt, op de site verbeterd.' : 'Je feedback is binnen.'}</p>
          <div class="fa-fb-acties"><button type="button" class="fa-btn fa-btn-primary fa-fb-annuleer">Sluiten</button></div>`;
        form.querySelectorAll('.fa-fb-sluit, .fa-fb-annuleer').forEach(b => b.onclick = sluit);
        form.querySelector('.fa-fb-annuleer').focus();
        selectie = '';
      } catch (err) {
        knop.disabled = false;
        status.textContent = 'Versturen lukte niet. Probeer het later opnieuw of gebruik het contactformulier.';
      }
    });
  }
  function sluit() { document.getElementById('fa-fb-modal')?.remove(); }

  const css = document.createElement('style');
  css.textContent = `
    .fa-fb-knoppen { position: fixed; right: 16px; bottom: 16px; z-index: 70; display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .fa-fb-knop { font: inherit; font-size: 13px; font-weight: 800; background: var(--surface, #fff); color: var(--ink, #1a2024); border: 1.5px solid var(--line, #e3ddd1); border-radius: 999px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(26,32,36,.10); }
    .fa-fb-knop:hover { border-color: var(--accent, #ef5a3f); }
    .fa-fb-knop-fout { background: #fff7ed; border-color: #fdba74; }
    @media (max-width: 600px) { .fa-fb-knoppen { right: 10px; bottom: 10px; } .fa-fb-knop { padding: 7px 11px; font-size: 12px; } }
    @media print { .fa-fb-knoppen { display: none; } }
    .fa-fb-overlay { position: fixed; inset: 0; z-index: 90; background: rgba(26,32,36,.45); display: grid; place-items: center; padding: 16px; }
    .fa-fb-dialog { width: min(520px, 100%); max-height: calc(100vh - 32px); overflow: auto; background: var(--surface, #fff); color: var(--ink, #1a2024); border-radius: 18px; padding: 20px; box-shadow: 0 20px 60px rgba(0,0,0,.2); font-family: inherit; }
    .fa-fb-kop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
    .fa-fb-kop h2 { font-size: 20px; font-weight: 900; margin: 0; }
    .fa-fb-sluit { font-size: 26px; line-height: 1; background: none; border: 0; cursor: pointer; color: var(--ink-soft, #4a5258); }
    .fa-fb-uitleg { font-size: 14px; color: var(--ink-soft, #4a5258); margin: 0 0 12px; line-height: 1.5; }
    .fa-fb-pagina { font-size: 12.5px; color: var(--muted, #646c72); margin-bottom: 10px; }
    .fa-fb-sel { display: block; font-size: 12.5px; background: var(--surface-alt, #f1ece2); border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
    .fa-fb-sel q { font-style: italic; }
    .fa-fb-tip { font-size: 12.5px; color: var(--muted, #646c72); margin: 0 0 10px; }
    .fa-fb-label { display: block; font-size: 13px; font-weight: 800; margin: 10px 0 4px; }
    .fa-fb-label span { font-weight: 600; color: var(--muted, #646c72); }
    .fa-fb-dialog textarea, .fa-fb-dialog input[type=email] { width: 100%; font: inherit; font-size: 14px; border: 1.5px solid var(--line, #e3ddd1); border-radius: 10px; padding: 9px 11px; background: var(--bg, #f7f3ec); color: inherit; }
    .fa-fb-hp { position: absolute; left: -9999px; width: 1px; height: 1px; }
    .fa-fb-status { min-height: 18px; font-size: 13px; font-weight: 700; color: var(--accent-deep, #c83f24); margin-top: 8px; }
    .fa-fb-acties { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
    .fa-fb-privacy { font-size: 11.5px; color: var(--muted, #646c72); margin: 10px 0 0; }
  `;
  document.head.appendChild(css);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maakKnoppen); else maakKnoppen();
})();
