/* FM Atlas — reclame in de spelletjes: een video van JonasMS (youtube.com/@JonasMeloSousa).
   Jonas wil abonnees; FM Atlas promoot hem. Er loopt geen advertentienetwerk: het is een gewone
   YouTube-video via youtube-nocookie.com, met geluid, en een timer van 30 seconden voordat je verder
   kunt. Staat de browser geluid niet toe zonder klik, dan speelt hij gedempt.

   Twee manieren om een video te tonen:
   - window.FMReclame.toon()  toont meteen een video; geeft een Promise die true oplevert als de
     timer helemaal is afgelopen (voor een beloning, zoals fiches in Hoge Inzet).
   - window.FMReclame.misschien({ kans, minTussen })  tussen potjes: toont soms een video, met kans
     `kans` (0..1) en nooit binnen `minTussen` seconden na de vorige. Doet niets als reclamevrij.
   Games die zelf niets van FM Atlas weten sturen tussen potjes het window-event
   'fmatlas:tussen-potjes' (detail: { spel }); dit script luistert daarnaar.

   Reclamevrij (€2) staat in localStorage 'fa_reclamevrij'. Zolang BETAAL_URL leeg is, is er geen
   knop om het te kopen. */
(function () {
  if (window.FMReclame) return;

  const KANAAL = 'https://www.youtube.com/@JonasMeloSousa';
  const BETAAL_URL = '';          // pagina die de Mollie-betaling start; leeg: knop verborgen
  const SECONDEN = 30;
  const STANDAARD = { kans: 0.5, minTussen: 120 };   // tussen potjes
  const SLEUTEL_VRIJ = 'fa_reclamevrij';
  const SLEUTEL_LAATST = 'fa_reclame_laatst';

  // Alle video's van het kanaal op 13-10-2026 (allemaal insluitbaar, gecontroleerd met oEmbed).
  // Nieuwe video's van Jonas: id toevoegen.
  const VIDEOS = [
    '2HDTzzc83NE', '3704I2-w6CE', '93qacQIjnWc', '9cbNkFpGwdA', '9kRPCV7sGyc', 'actp5rc4Jlo',
    'd9ZFTwNjyLA', 'E0FA_ERukBQ', 'ecOyZNkuc28', 'EwUcxLZfL4M', 'Fx7nZvQCSmA', 'g45zwsRhbSg',
    'HrNiuuJiCxQ', 'huqp1faaY_4', 'jEgQYhe4rsE', 'K0Q2wMSTRB4', 'm-WuNytn5CY', 'mm6qnklHHVI',
    'NgPblVL97Fw', 'NWfIixdqlIw', 'rlUAVkPvTdI', 'sHXQwZeu1-s', 'szpuBQs_y6Q', 'VqHBQugVXo8',
    'we87hNcCc3s', 'xAyx5XwrlXA', 'y97WIZNltB4', 'YCa3LjBdar0', 'yCUjvNyijY8', 'ZNKw2cVRYAQ'
  ];

  function lees(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function schrijf(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }

  function reclamevrij() { return !!lees(SLEUTEL_VRIJ); }

  const CSS = `
.fa-rc{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;
  background:rgba(8,10,16,.88);font-family:Nunito,system-ui,-apple-system,sans-serif;color:#fff;padding:12px;
  -webkit-user-select:none;user-select:none;touch-action:manipulation}
.fa-rc *{box-sizing:border-box}
.fa-rc-doos{width:min(720px,100%,calc((100vh - 150px) * 16 / 9));min-width:min(280px,100%);display:flex;flex-direction:column;gap:10px}
.fa-rc-kop{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;font-weight:800}
.fa-rc-label{background:#ffcc00;color:#111;border-radius:6px;padding:3px 8px;letter-spacing:.04em;text-transform:uppercase;font-size:11px;margin-right:8px}
.fa-rc-tijd{font-variant-numeric:tabular-nums;opacity:.85}
.fa-rc-video{position:relative;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden}
.fa-rc-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.fa-rc-balk{height:4px;background:rgba(255,255,255,.18);border-radius:4px;overflow:hidden}
.fa-rc-balk i{display:block;height:100%;width:0;background:#ffcc00;transition:width .25s linear}
.fa-rc-knoppen{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.fa-rc-knop{font:inherit;font-size:14px;font-weight:800;border-radius:999px;padding:9px 16px;border:0;cursor:pointer;text-decoration:none;
  display:inline-flex;align-items:center;gap:6px;line-height:1.2}
.fa-rc-abo{background:#ff0033;color:#fff}
.fa-rc-vrij{background:rgba(255,255,255,.12);color:#fff}
.fa-rc-verder{margin-left:auto;background:#fff;color:#111}
.fa-rc-verder:disabled{opacity:.45;cursor:default}
.fa-rc-hint{font-size:12px;opacity:.7}
@media (max-width:520px){.fa-rc-verder{margin-left:0;flex:1 0 100%;justify-content:center}}
`;

  let open = null;   // Promise van de video die nu speelt

  function kiesVideo() {
    const vorige = lees('fa_reclame_video');
    let id = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
    if (id === vorige && VIDEOS.length > 1) id = VIDEOS[(VIDEOS.indexOf(id) + 1) % VIDEOS.length];
    schrijf('fa_reclame_video', id);
    return id;
  }

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === 'text') e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    kids.forEach(c => c && e.appendChild(c));
    return e;
  }

  // De YouTube-speler (IFrame API) wordt één keer geladen, pas bij de eerste video.
  let api = null;
  function laadApi() {
    if (api) return api;
    api = new Promise(resolve => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const vorige = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (vorige) vorige(); resolve(window.YT); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => { api = null; resolve(null); };
      document.head.appendChild(s);
    });
    return api;
  }

  // Start met geluid. Blokkeert de browser dat (geen eerdere klik op de pagina, of iOS), dan
  // gedempt verder en meldt `zonderGeluid` het.
  function speelMetGeluid(plek, id, zonderGeluid) {
    let player = null;
    let weg = false;
    const kaal = () => {
      // Zonder API: gewone embed, gedempt (dat mag altijd automatisch starten)
      plek.replaceWith(el('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`,
        title: 'Video van JonasMS', allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: ''
      }));
      zonderGeluid();
    };
    laadApi().then(YT => {
      if (weg) return;
      if (!YT) return kaal();
      player = new YT.Player(plek, {
        host: 'https://www.youtube-nocookie.com',
        videoId: id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: e => {
            try { e.target.unMute(); e.target.setVolume(100); e.target.playVideo(); } catch (_) {}
            setTimeout(() => {
              if (weg || !player) return;
              let st = -1;
              try { st = player.getPlayerState(); } catch (_) {}
              if (st !== 1 && st !== 3) {   // speelt niet en laadt niet: geblokkeerd
                try { player.mute(); player.playVideo(); } catch (_) {}
                zonderGeluid();
              }
            }, 1500);
          }
        }
      });
    });
    return { stop() { weg = true; try { player && player.destroy(); } catch (_) {} } };
  }

  function toon(opties) {
    if (open) return open;
    const o = opties || {};
    open = new Promise(resolve => {
      if (!document.getElementById('fa-rc-css')) {
        const s = el('style', { id: 'fa-rc-css' });
        s.textContent = CSS;
        document.head.appendChild(s);
      }
      try { document.exitPointerLock && document.exitPointerLock(); } catch (_) {}
      schrijf(SLEUTEL_LAATST, String(Date.now()));

      const id = kiesVideo();
      const plek = el('div');
      const hint = el('div', { class: 'fa-rc-hint', text: '' });
      const speler = speelMetGeluid(plek, id, () => { hint.textContent = 'Je browser startte de video zonder geluid. Tik op de video voor geluid.'; });
      const tijd = el('span', { class: 'fa-rc-tijd' });
      const balk = el('i');
      const verder = el('button', { class: 'fa-rc-knop fa-rc-verder', type: 'button' });
      verder.disabled = true;
      const abo = el('a', { class: 'fa-rc-knop fa-rc-abo', href: KANAAL + '?sub_confirmation=1', target: '_blank', rel: 'noopener', text: 'Abonneer op JonasMS' });
      const vrij = BETAAL_URL && !reclamevrij()
        ? el('a', { class: 'fa-rc-knop fa-rc-vrij', href: BETAAL_URL, target: '_blank', rel: 'noopener', text: 'Reclamevrij voor €2' })
        : null;
      const kop = el('div', { class: 'fa-rc-kop' },
        el('span', {}, el('span', { class: 'fa-rc-label', text: 'Reclame' }), document.createTextNode(o.beloning ? `Kijk de video voor ${o.beloning}` : 'Video van JonasMS')),
        tijd);
      const laag = el('div', { class: 'fa-rc', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Reclame: video van JonasMS' },
        el('div', { class: 'fa-rc-doos' },
          kop,
          el('div', { class: 'fa-rc-video' }, plek),
          el('div', { class: 'fa-rc-balk' }, balk),
          el('div', { class: 'fa-rc-knoppen' }, abo, vrij, verder),
          hint));

      // Het spel eronder krijgt geen toetsen zolang de video openstaat
      const slik = e => { if (e.key !== 'Tab') e.stopPropagation(); if (e.key === ' ' || e.key === 'Escape') e.preventDefault(); };
      ['keydown', 'keyup', 'keypress'].forEach(t => window.addEventListener(t, slik, true));

      let over = SECONDEN;
      let klaar = false;
      function teken() {
        tijd.textContent = klaar ? 'Je kunt verder' : `Verder over ${over} s`;
        verder.textContent = klaar ? (o.beloning ? `Verder, ${o.beloning} erbij` : 'Verder spelen') : `Verder (${over})`;
        balk.style.width = `${Math.round((SECONDEN - over) / SECONDEN * 100)}%`;
      }
      teken();
      // Telt alleen af terwijl de pagina in beeld is
      const tik = setInterval(() => {
        if (document.hidden || klaar) return;
        over -= 1;
        if (over <= 0) { over = 0; klaar = true; verder.disabled = false; verder.focus(); }
        teken();
      }, 1000);

      function sluit() {
        if (!klaar) return;
        clearInterval(tik);
        ['keydown', 'keyup', 'keypress'].forEach(t => window.removeEventListener(t, slik, true));
        speler.stop();
        laag.remove();
        open = null;
        resolve(true);
      }
      verder.addEventListener('click', sluit);
      laag.addEventListener('keydown', e => { if (e.key === 'Enter' && klaar) sluit(); });

      (document.fullscreenElement || document.body).appendChild(laag);
    });
    return open;
  }

  function misschien(opties) {
    const o = Object.assign({}, STANDAARD, opties || {});
    if (reclamevrij() || open) return Promise.resolve(false);
    const laatst = Number(lees(SLEUTEL_LAATST)) || 0;
    if (Date.now() - laatst < o.minTussen * 1000) return Promise.resolve(false);
    if (Math.random() >= o.kans) return Promise.resolve(false);
    return toon();
  }

  window.addEventListener('fmatlas:tussen-potjes', e => {
    const d = (e && e.detail) || {};
    // even wachten, zodat de uitslag eerst in beeld komt
    setTimeout(() => misschien(d), 1500);
  });

  window.FMReclame = { toon, misschien, reclamevrij, kanaal: KANAAL };
})();
