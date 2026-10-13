/*
 * Hoge Inzet: weergave en bediening. Alle spelregels en al het rekenwerk staan in engine.js.
 *
 * Bewaarstrategie (één regel voor alles): elke handeling die geld raakt levert via de engine een
 * complete nieuwe stand op, en die stand gaat in één keer naar localStorage voordat er iets
 * geanimeerd wordt. Een uitslag is dus al afgerekend op het moment dat het wiel begint te draaien
 * of de dealer zijn kaart omdraait; de animatie is alleen nog weergave. Gevolgen bij herladen:
 *   - roulette-inzet die nog niet gedraaid is ligt weer op tafel (en kan gewist worden);
 *   - herladen tijdens een draai of tijdens het spel van de dealer toont de al afgerekende uitslag
 *     met een melding; er wordt niets twee keer of niet uitbetaald;
 *   - een blackjackhand waarin jij nog aan de beurt bent, gaat verder waar hij was.
 * Lukt opslaan niet (privémodus, vol, geblokkeerd), dan speel je gewoon door zonder bewaren.
 *
 * De shoe gaat niet mee naar localStorage (zie E.forStorage): na herladen wordt er nieuw geschud.
 * Speelt iemand in twee tabbladen, of komt hij met de terugknop op een oude pagina, dan neemt dit
 * tabblad de bewaarde stand over voordat er weer gespeeld wordt. Zo kun je een verloren ronde niet
 * ongedaan maken door in een ander tabblad verder te spelen.
 */
(function () {
  'use strict';

  var E = window.HogeInzetEngine;
  if (!E) return;
  var R = window.FMReclame || null;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  try { localStorage.setItem('fa_laatste_game', 'hoge-inzet'); } catch (_) { /* geen opslag: niet erg */ }

  /* ─── Stand en opslag ────────────────────────────────── */

  var opslagMeldingGedaan = false;

  function laad() {
    try {
      var raw = localStorage.getItem(E.STORAGE_KEY);
      return E.sanitizeState(raw ? JSON.parse(raw) : null);
    } catch (_) {
      return E.newGame();
    }
  }

  function bewaar() {
    try {
      localStorage.setItem(E.STORAGE_KEY, JSON.stringify(E.forStorage(state)));
    } catch (_) {
      if (!opslagMeldingGedaan) {
        opslagMeldingGedaan = true;
        toonMelding('Je stand kan in deze browser niet bewaard worden. Spelen gaat gewoon, maar na herladen begin je opnieuw.');
      }
    }
  }

  var state = laad();
  var bezig = false;          // er loopt een animatie: alles wat geld of tabs raakt staat dicht
  var weergaveSaldo = null;   // saldo dat tijdens een animatie getoond wordt (nog zonder uitbetaling)
  var actieveTab = 'roulette';
  var ALLES = 'alles';
  var FICHES = E.CHIP_VALUES.concat([ALLES]);   // de keuzes in de fichebalk; 'alles' zet het hele saldo in
  var rKeuze = E.CHIP_VALUES[0];
  var bKeuze = state.blackjack.laatsteInzet;
  var rWeergaveInzet = null;  // inzet die tijdens het draaien op tafel blijft liggen
  var bjView = null;          // { s: [per hand], d, open }: hoeveel kaarten van speler en dealer zichtbaar zijn
  var timers = [];
  var reclameBezig = false;   // er speelt een reclamevideo: alles staat dicht
  var syncNodig = false;      // een ander tabblad heeft de stand veranderd terwijl hier een animatie liep

  /* ─── Hulpjes ────────────────────────────────────────── */

  var nf = (window.Intl && Intl.NumberFormat) ? new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }) : null;
  function fmt(x) { return nf ? nf.format(x) : String(x).replace('.', ','); }
  function fmtNetto(x) { return x > 0 ? '+' + fmt(x) : x < 0 ? '−' + fmt(-x) : '±0'; }

  // Wat een fichekeuze nu inzet: de fichewaarde, of bij 'alles' het hele saldo.
  function inzetVoor(keuze) { return keuze === ALLES ? E.allesIn(state) : keuze; }

  function ficheLabel(w) { return w === ALLES ? 'Alles' : w >= 1000 ? (w / 1000) + 'K' : String(w); }

  function aankondig(tekst) {
    var el = $('[data-aankondiging]');
    el.textContent = '';
    setTimeout(function () { el.textContent = tekst; }, 30);
  }

  function toonMelding(tekst) {
    var el = $('[data-melding]');
    el.textContent = tekst;
    el.hidden = !tekst;
  }

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

  var KLEURNAAM = { rood: 'rood', zwart: 'zwart', groen: 'groen' };
  var SUIT_SYMBOL = { S: '♠', H: '♥', D: '♦', C: '♣' };
  var SUIT_NAAM = { S: 'schoppen', H: 'harten', D: 'ruiten', C: 'klaveren' };
  var RANK_NAAM = { A: 'aas', J: 'boer', Q: 'vrouw', K: 'heer' };
  var RANK_TOON = { A: 'A', J: 'B', Q: 'V', K: 'H' };
  var BUITEN = [
    { key: 'laag', label: '1–18', naam: '1 tot en met 18' },
    { key: 'even', label: 'Even', naam: 'even' },
    { key: 'rood', label: 'Rood', naam: 'rood' },
    { key: 'zwart', label: 'Zwart', naam: 'zwart' },
    { key: 'oneven', label: 'Oneven', naam: 'oneven' },
    { key: 'hoog', label: '19–36', naam: '19 tot en met 36' }
  ];

  function betNaam(key) {
    if (key.charAt(0) === 'n') {
      var n = Number(key.slice(1));
      return n === 0 ? 'nul' : n === E.DOUBLE_ZERO ? 'dubbele nul' : n + ' ' + KLEURNAAM[E.colorOf(n)];
    }
    for (var i = 0; i < BUITEN.length; i++) if (BUITEN[i].key === key) return BUITEN[i].naam;
    return key;
  }

  function kaartNaam(c) {
    var r = E.cardRank(c);
    return (RANK_NAAM[r] || r) + ' ' + SUIT_NAAM[E.cardSuit(c)];
  }

  /* ─── Geluid (Web Audio, standaard uit) ──────────────── */

  var AC = window.AudioContext || window.webkitAudioContext;
  var audio = null;
  var geluidAan = false;

  function toon(freq, start, duur, type, vol) {
    if (!geluidAan || !audio) return;
    try {
      var t0 = audio.currentTime + start;
      var o = audio.createOscillator();
      var g = audio.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duur);
      o.connect(g); g.connect(audio.destination);
      o.start(t0); o.stop(t0 + duur + 0.02);
    } catch (_) { /* geluid is bijzaak */ }
  }

  function geluid(soort, duurMs) {
    if (!geluidAan) return;
    switch (soort) {
      case 'fiche': toon(1400, 0, 0.05, 'triangle', 0.06); toon(2100, 0.02, 0.04, 'triangle', 0.03); break;
      case 'kaart': toon(520, 0, 0.06, 'square', 0.025); break;
      case 'draai':
        // Tikjes die steeds verder uit elkaar komen te liggen, net als een bal die uitloopt.
        var totaal = (duurMs || 4000) / 1000, t = 0, stap = 0.05;
        while (t < totaal - 0.2) { toon(1800, t, 0.025, 'square', 0.02); t += stap; stap *= 1.07; }
        break;
      case 'winst': toon(660, 0, 0.14, 'sine', 0.09); toon(880, 0.12, 0.2, 'sine', 0.09); toon(1320, 0.26, 0.28, 'sine', 0.06); break;
      case 'verlies': toon(220, 0, 0.25, 'sine', 0.07); toon(165, 0.18, 0.35, 'sine', 0.06); break;
      case 'push': toon(440, 0, 0.18, 'sine', 0.06); break;
    }
  }

  function initGeluidKnop() {
    var knop = $('[data-geluid]');
    if (!AC) {
      knop.disabled = true;
      knop.title = 'Geluid wordt in deze browser niet ondersteund';
      return;
    }
    knop.addEventListener('click', function () {
      if (!geluidAan) {
        try {
          if (!audio) audio = new AC();
          if (audio.resume) audio.resume();
          geluidAan = true;
        } catch (_) { geluidAan = false; }
      } else {
        geluidAan = false;
        try { if (audio && audio.suspend) audio.suspend(); } catch (_) { /* niets */ }
      }
      knop.setAttribute('aria-pressed', geluidAan ? 'true' : 'false');
      knop.classList.toggle('is-aan', geluidAan);
      if (geluidAan) geluid('fiche');
    });
  }

  /* ─── Bovenbalk, statistieken, nieuw spel ────────────── */

  function renderBank() {
    var s = weergaveSaldo === null ? state.saldo : weergaveSaldo;
    $('[data-saldo]').textContent = fmt(s);
    $('[data-stat-top]').textContent = fmt(state.top);
    $('[data-stat-rondes]').textContent = fmt(state.rondes);
    $('[data-stat-gewonnen]').textContent = fmt(state.gewonnen);
    $('[data-nieuw]').disabled = bezig;
    $$('[data-tekort-nieuw]').forEach(function (b) { b.disabled = bezig; });
    renderReclame();
  }

  /* ─── Reclame: video van JonasMS (../../js/spel-reclame.js) ─── */
  // Een video uitkijken levert 500 fiches op. Tussen rondes komt er soms vanzelf een video,
  // behalve als de speler reclamevrij heeft.

  var TUSSEN_RONDES = { kans: 0.2, minTussen: 180 };

  function renderReclame() {
    var aan = !!R;
    var knop = $('[data-reclame]');
    $('[data-reclame-blok]').hidden = !aan;
    knop.disabled = bezig;
    $('[data-reclame-tekst]').textContent = 'Kijk een video';
    $$('[data-tekort-reclame]').forEach(function (el) {
      el.hidden = !aan;
      $('button', el).disabled = bezig;
    });
  }

  // Alles dicht en het geluid uit zolang de video speelt.
  function metReclame(fn) {
    bezig = true;
    reclameBezig = true;
    try { if (audio && audio.suspend) audio.suspend(); } catch (_) { /* niets */ }
    renderAlles();
    return fn().then(function (gekeken) {
      bezig = false;
      reclameBezig = false;
      try { if (geluidAan && audio && audio.resume) audio.resume(); } catch (_) { /* niets */ }
      renderAlles();
      if (syncNodig) synchroniseer();
      return gekeken;
    });
  }

  function kijkReclame() {
    if (bezig || !R) return;
    metReclame(function () { return R.toon({ beloning: '500 fiches' }); }).then(function (gekeken) {
      if (!gekeken) return;
      // Speelde er intussen iemand in een ander tabblad, dan eerst die stand, dan de fiches erbij.
      if (syncNodig) state = E.acknowledge(laad());
      var r = E.bonus(state);
      if (!r.ok) { toonMelding(r.reden); return; }
      state = r.state;
      bewaar();
      flitsSaldo(r.bedrag);
      geluid('winst');
      toonMelding('Je kreeg ' + fmt(r.bedrag) + ' fiches voor het kijken van de video.');
      aankondig(fmt(r.bedrag) + ' fiches erbij. Saldo ' + fmt(state.saldo) + '.');
      renderAlles();
    });
  }

  // Na een ronde, als de uitslag even in beeld heeft gestaan.
  function tussenRonde() {
    if (!R || R.reclamevrij()) return;
    later(function () {
      if (bezig) return;
      metReclame(function () { return R.misschien(TUSSEN_RONDES); });
    }, 2500);
  }

  function flitsSaldo(netto) {
    var el = $('[data-saldo]');
    el.classList.remove('flits-plus', 'flits-min');
    void el.offsetWidth;
    if (netto > 0) el.classList.add('flits-plus');
    else if (netto < 0) el.classList.add('flits-min');
  }

  function openBevestig() {
    if (bezig) return;
    var paneel = $('[data-bevestig]');
    paneel.hidden = false;
    $('[data-bevestig-nee]').focus();
  }

  function sluitBevestig(terugFocus) {
    $('[data-bevestig]').hidden = true;
    if (terugFocus) $('[data-nieuw]').focus();
  }

  function nieuwSpel() {
    if (bezig) return;
    state = E.newGame();
    bewaar();
    bKeuze = state.blackjack.laatsteInzet;
    rKeuze = E.CHIP_VALUES[0];
    rWeergaveInzet = null;
    bjView = null;
    zetWielDirect(0, false);
    markeerVak(null);
    toonRUitslag(null);
    $('[data-bj-dealer-kaarten]').innerHTML = '';
    handVakken(0);
    sluitBevestig(true);
    toonMelding('');
    renderAlles();
    aankondig('Nieuw spel. Je hebt 1.000 speelfiches.');
  }

  /* ─── Tabs ───────────────────────────────────────────── */

  function kiesTab(naam, focus) {
    if (bezig || naam === actieveTab) return;
    actieveTab = naam;
    $$('[data-tab]').forEach(function (t) {
      var aan = t.getAttribute('data-tab') === naam;
      t.setAttribute('aria-selected', aan ? 'true' : 'false');
      t.tabIndex = aan ? 0 : -1;
      if (aan && focus) t.focus();
    });
    $('#hi-paneel-roulette').hidden = naam !== 'roulette';
    $('#hi-paneel-blackjack').hidden = naam !== 'blackjack';
    renderAlles();
  }

  function initTabs() {
    var tabs = $$('[data-tab]');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { kiesTab(t.getAttribute('data-tab'), false); });
      t.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault();
        kiesTab(tabs[j].getAttribute('data-tab'), true);
      });
    });
  }

  function renderTabs() {
    $$('[data-tab]').forEach(function (t) {
      t.setAttribute('aria-disabled', bezig && t.getAttribute('data-tab') !== actieveTab ? 'true' : 'false');
    });
  }

  /* ─── Fiches kiezen ──────────────────────────────────── */

  function maakFiches(houder, getKeuze, setKeuze, groep) {
    FICHES.forEach(function (w) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hi-fiche hi-fiche-' + w;
      b.setAttribute('role', 'radio');
      b.setAttribute('data-waarde', String(w));
      b.setAttribute('aria-label', w === ALLES ? 'Alles in: je hele saldo' : w + ' fiches');
      b.innerHTML = '<span aria-hidden="true">' + ficheLabel(w) + '</span>';
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-disabled') === 'true') return;
        setKeuze(w);
        geluid('fiche');
        renderAlles();
      });
      b.addEventListener('keydown', function (e) {
        if (b.getAttribute('aria-disabled') === 'true') return;
        var vals = FICHES, i = vals.indexOf(getKeuze()), j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(vals.length - 1, i + 1);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(0, i - 1);
        if (j === null) return;
        e.preventDefault();
        setKeuze(vals[j]);
        renderAlles();
        $('[data-waarde="' + vals[j] + '"]', houder).focus();
      });
      houder.appendChild(b);
    });
    houder.setAttribute('data-groep', groep);
  }

  function renderFiches(houder, keuze, uit) {
    $$('.hi-fiche', houder).forEach(function (b) {
      var raw = b.getAttribute('data-waarde');
      var w = raw === ALLES ? ALLES : Number(raw);
      var gekozen = w === keuze;
      b.setAttribute('aria-checked', gekozen ? 'true' : 'false');
      b.tabIndex = gekozen ? 0 : -1;
      b.setAttribute('aria-disabled', uit ? 'true' : 'false');
      b.classList.toggle('is-gekozen', gekozen);
      var bedrag = inzetVoor(w);
      b.classList.toggle('is-te-hoog', bedrag < 1 || bedrag > state.saldo);
    });
  }

  // Past de gekozen fiche niet meer in het saldo, kies dan de grootste die wel past. 'Alles' past
  // altijd zolang er minstens één fiche is.
  function pasKeuzesAan() {
    if (bezig) return;
    var past = E.CHIP_VALUES.filter(function (w) { return w <= state.saldo; });
    if (!past.length) return;
    var grootste = past[past.length - 1];
    if (rKeuze !== ALLES && rKeuze > state.saldo) rKeuze = grootste;
    if (bKeuze !== ALLES && bKeuze > state.saldo && !(state.blackjack.hand && state.blackjack.hand.fase === 'speler')) bKeuze = grootste;
  }

  /* ─── Roulette: wiel ─────────────────────────────────── */

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var wielRot = 0;
  var balRot = 0;

  // Punt op het wiel: hoek in graden met de klok mee vanaf boven, middelpunt (200,200).
  function pt(r, a) {
    var rad = a * Math.PI / 180;
    return [200 + r * Math.sin(rad), 200 - r * Math.cos(rad)];
  }

  function sector(r0, r1, a0, a1) {
    var p1 = pt(r1, a0), p2 = pt(r1, a1), p3 = pt(r0, a1), p4 = pt(r0, a0);
    var f = function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); };
    return 'M' + f(p1) + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + f(p2) + ' L' + f(p3) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + f(p4) + ' Z';
  }

  function svgEl(naam, attrs) {
    var el = document.createElementNS(SVG_NS, naam);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    return el;
  }

  function bouwWiel() {
    var svg = svgEl('svg', { viewBox: '0 0 400 400', 'aria-hidden': 'true', focusable: 'false', class: 'hi-wiel-svg' });
    var defs = svgEl('defs', {});
    defs.innerHTML =
      '<radialGradient id="hi-hout" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#6b4227"/><stop offset="0.7" stop-color="#3d2416"/><stop offset="1" stop-color="#26150c"/></radialGradient>' +
      '<radialGradient id="hi-kegel" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#7a4c2c"/><stop offset="1" stop-color="#2f1b10"/></radialGradient>' +
      '<linearGradient id="hi-goudlijn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c785"/><stop offset="0.5" stop-color="#b48c45"/><stop offset="1" stop-color="#e2c27a"/></linearGradient>';
    svg.appendChild(defs);

    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 199, fill: 'url(#hi-hout)' }));
    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 187, fill: 'none', stroke: 'url(#hi-goudlijn)', 'stroke-width': 2.5 }));

    var KLEUR = { rood: '#b1302a', zwart: '#1c1714', groen: '#1f7a4a' };
    var g = svgEl('g', {});
    E.WHEEL_ORDER.forEach(function (n, i) {
      var mid = i * E.POCKET_DEG, half = E.POCKET_DEG / 2;
      var kleur = KLEUR[E.colorOf(n)];
      g.appendChild(svgEl('path', { d: sector(148, 185, mid - half, mid + half), fill: kleur, class: 'hi-vak', 'data-vak': n }));
      g.appendChild(svgEl('path', { d: sector(118, 148, mid - half, mid + half), fill: kleur, opacity: 0.55 }));
      var p = pt(167, mid);
      var t = svgEl('text', { x: p[0].toFixed(2), y: p[1].toFixed(2), transform: 'rotate(' + mid.toFixed(3) + ' ' + p[0].toFixed(2) + ' ' + p[1].toFixed(2) + ')', class: 'hi-vak-tekst' });
      t.textContent = E.numberLabel(n);
      g.appendChild(t);
      var a = pt(118, mid - half), b = pt(185, mid - half);
      g.appendChild(svgEl('line', { x1: a[0].toFixed(2), y1: a[1].toFixed(2), x2: b[0].toFixed(2), y2: b[1].toFixed(2), stroke: '#c9a45c', 'stroke-opacity': 0.55, 'stroke-width': 1 }));
    });
    svg.appendChild(g);
    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 148, fill: 'none', stroke: '#c9a45c', 'stroke-opacity': 0.6, 'stroke-width': 1.2 }));
    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 118, fill: 'url(#hi-kegel)', stroke: 'url(#hi-goudlijn)', 'stroke-width': 2 }));
    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 70, fill: 'none', stroke: '#c9a45c', 'stroke-opacity': 0.25, 'stroke-width': 1 }));
    // Het kruis in het midden
    var kruis = svgEl('g', { stroke: 'url(#hi-goudlijn)', 'stroke-width': 7, 'stroke-linecap': 'round' });
    kruis.appendChild(svgEl('line', { x1: 200, y1: 150, x2: 200, y2: 250 }));
    kruis.appendChild(svgEl('line', { x1: 150, y1: 200, x2: 250, y2: 200 }));
    svg.appendChild(kruis);
    [[200, 146], [200, 254], [146, 200], [254, 200]].forEach(function (c) {
      svg.appendChild(svgEl('circle', { cx: c[0], cy: c[1], r: 6, fill: '#e2c27a' }));
    });
    svg.appendChild(svgEl('circle', { cx: 200, cy: 200, r: 16, fill: '#e2c27a', stroke: '#8f7238', 'stroke-width': 2 }));
    $('[data-wiel-draai]').appendChild(svg);
  }

  function zetWielDirect(rot, metBal) {
    var draai = $('[data-wiel-draai]'), baan = $('[data-bal-baan]');
    draai.style.transition = 'none';
    baan.style.transition = 'none';
    wielRot = rot;
    balRot = 0;
    draai.style.transform = 'rotate(' + wielRot + 'deg)';
    baan.style.transform = 'rotate(0deg)';
    baan.classList.toggle('is-zichtbaar', !!metBal);
    void draai.offsetWidth;
  }

  function markeerVak(n) {
    $$('.hi-vak').forEach(function (v) { v.classList.toggle('is-winnend', n !== null && Number(v.getAttribute('data-vak')) === n); });
  }

  /* ─── Roulette: bord ─────────────────────────────────── */

  function maakBordKnop(key, inhoud, extraClass) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'hi-vakje ' + (extraClass || '');
    b.setAttribute('data-bet', key);
    b.innerHTML = inhoud + '<span class="hi-zet" aria-hidden="true"></span>';
    b.addEventListener('click', function () { zetIn(key, b); });
    return b;
  }

  function bouwBord() {
    var bord = $('[data-bord]');
    // Plek op het bord. Liggend (breed): 13 kolommen, de nummers in 3 rijen (3-6-9... bovenaan) die
    // elk twee halve rijen beslaan, zodat 00 (boven) en 0 (onder) links ieder anderhalve rij krijgen.
    // Staand (smal): 6 halve kolommen, de nummers 1-2-3 bovenaan, 0 en 00 naast elkaar erboven.
    function plek(b, hc, hr, vc, vr) {
      b.style.setProperty('--hc', hc);
      b.style.setProperty('--hr', hr);
      b.style.setProperty('--vc', vc);
      b.style.setProperty('--vr', vr);
    }
    var dubbel = maakBordKnop('n' + E.DOUBLE_ZERO, '<span class="hi-num">00</span>', 'is-groen hi-nul');
    var nul = maakBordKnop('n0', '<span class="hi-num">0</span>', 'is-groen hi-nul');
    plek(nul, '1', '4 / span 3', '1 / span 3', '1');
    plek(dubbel, '1', '1 / span 3', '4 / span 3', '1');
    bord.appendChild(nul);
    bord.appendChild(dubbel);
    for (var n = 1; n <= 36; n++) {
      var kleur = E.colorOf(n);
      var b = maakBordKnop('n' + n, '<span class="hi-num">' + n + '</span>', 'is-' + kleur);
      var kol = Math.ceil(n / 3), rij = (n - 1) % 3;
      plek(b, String(kol + 1), (2 * (2 - rij) + 1) + ' / span 2', (2 * rij + 1) + ' / span 2', String(kol + 1));
      bord.appendChild(b);
    }
    var buiten = $('[data-buiten]');
    BUITEN.forEach(function (x) {
      var inhoud = x.key === 'rood' || x.key === 'zwart'
        ? '<span class="hi-ruit hi-ruit-' + x.key + '" aria-hidden="true"></span><span class="hi-buiten-label">' + x.label + '</span>'
        : '<span class="hi-buiten-label">' + x.label + '</span>';
      buiten.appendChild(maakBordKnop(x.key, inhoud, 'hi-buitenkans'));
    });
  }

  function chipKlasse(bedrag) {
    if (bedrag >= 1000) return 'hi-fiche-1000';
    if (bedrag >= 500) return 'hi-fiche-500';
    if (bedrag >= 100) return 'hi-fiche-100';
    if (bedrag >= 50) return 'hi-fiche-50';
    if (bedrag >= 25) return 'hi-fiche-25';
    return 'hi-fiche-10';
  }

  function renderBord() {
    var inzet = rWeergaveInzet || state.roulette.inzet;
    var laatste = !bezig && state.roulette.laatste && !rWeergaveInzet ? state.roulette.laatste.nummer : null;
    var rBedrag = inzetVoor(rKeuze);
    var beschikbaar = rBedrag >= 1 && state.saldo >= rBedrag;
    $$('[data-bet]').forEach(function (b) {
      var key = b.getAttribute('data-bet');
      var bedrag = inzet[key] || 0;
      var zet = $('.hi-zet', b);
      zet.textContent = bedrag ? fmt(bedrag) : '';
      zet.className = 'hi-zet' + (bedrag ? ' is-zichtbaar ' + chipKlasse(bedrag) : '');
      b.disabled = bezig;
      b.setAttribute('aria-disabled', !bezig && !beschikbaar ? 'true' : 'false');
      b.setAttribute('aria-label', 'Inzet op ' + betNaam(key) + (bedrag ? ', nu ' + fmt(bedrag) + ' fiches' : ''));
      b.classList.toggle('is-laatste', laatste !== null && key.charAt(0) === 'n' && Number(key.slice(1)) === laatste);
    });
  }

  function renderRoulette() {
    var totaal = E.betTotal(rWeergaveInzet || state.roulette.inzet);
    $('[data-r-totaal]').textContent = fmt(totaal);
    renderFiches($('[data-r-fiches]'), rKeuze, bezig);
    renderBord();
    var leeg = E.betTotal(state.roulette.inzet) === 0;
    $('[data-wis]').disabled = bezig || leeg;
    var vorige = state.roulette.vorige;
    $('[data-herhaal]').disabled = bezig || !leeg || !vorige || E.betTotal(vorige) > state.saldo;
    $('[data-draai]').disabled = bezig || leeg;
    $('[data-draai]').textContent = bezig && !reclameBezig && actieveTab === 'roulette' ? 'Draait…' : 'Draai';
    var tekort = $('#hi-paneel-roulette [data-tekort]');
    tekort.hidden = bezig || !leeg || state.saldo >= E.CHIP_VALUES[0];

    var hist = $('[data-historie]');
    hist.innerHTML = '';
    var lijst = state.roulette.historie;
    // Tijdens het draaien staat de nieuwe uitslag al in de stand, maar nog niet in beeld.
    if (bezig && state.open === 'roulette') lijst = lijst.slice(1);
    if (!lijst.length) {
      var leegItem = document.createElement('li');
      leegItem.className = 'hi-historie-leeg';
      leegItem.textContent = 'Nog niet gedraaid';
      hist.appendChild(leegItem);
    }
    lijst.forEach(function (n, i) {
      var li = document.createElement('li');
      li.className = 'hi-historie-n is-' + E.colorOf(n) + (i === 0 ? ' is-nieuwste' : '');
      li.textContent = E.numberLabel(n);
      li.setAttribute('aria-label', betNaam('n' + n));
      hist.appendChild(li);
    });
  }

  function toonRUitslag(u) {
    var num = $('[data-r-nummer]'), tekst = $('[data-r-tekst]'), blok = $('[data-r-uitslag]');
    blok.classList.remove('is-winst', 'is-verlies', 'is-nieuw');
    if (!u) {
      num.textContent = '–';
      num.className = 'hi-uitslag-nummer';
      tekst.textContent = 'Leg je fiches en draai het wiel.';
      return;
    }
    var kleur = E.colorOf(u.nummer);
    var netto = u.uitbetaling - u.inzet;
    num.textContent = E.numberLabel(u.nummer);
    num.className = 'hi-uitslag-nummer is-' + kleur;
    tekst.innerHTML = '';
    var kop = document.createElement('strong');
    kop.textContent = E.isZero(u.nummer) ? E.numberLabel(u.nummer) + ' groen' : u.nummer + ' ' + KLEURNAAM[kleur];
    var regel = document.createElement('span');
    regel.textContent = 'Uitbetaling ' + fmt(u.uitbetaling) + ' · netto ' + fmtNetto(netto);
    tekst.appendChild(kop);
    tekst.appendChild(regel);
    void blok.offsetWidth;
    blok.classList.add('is-nieuw', netto > 0 ? 'is-winst' : 'is-verlies');
  }

  function zetIn(key, knop) {
    if (bezig) return;
    var gebruikt = inzetVoor(rKeuze);
    if (gebruikt < 1) { aankondig('Je hebt geen fiches meer.'); toonMelding('Je hebt geen fiches meer.'); return; }
    var r = E.placeBet(state, key, gebruikt);
    if (!r.ok) { aankondig(r.reden); toonMelding(r.reden); return; }
    toonMelding('');
    state = r.state;
    bewaar();
    geluid('fiche');
    renderAlles();
    var zet = $('.hi-zet', knop);
    zet.classList.remove('is-geplaatst'); void zet.offsetWidth; zet.classList.add('is-geplaatst');
    aankondig(fmt(gebruikt) + ' op ' + betNaam(key) + '. Op tafel: ' + fmt(E.betTotal(state.roulette.inzet)) + '.');
  }

  function wis() {
    if (bezig) return;
    var r = E.clearBets(state);
    if (!r.ok) return;
    state = r.state;
    bewaar();
    renderAlles();
    aankondig('Inzet gewist. ' + fmt(r.terug) + ' fiches terug.');
  }

  function herhaal() {
    if (bezig) return;
    var r = E.repeatBets(state);
    if (!r.ok) { aankondig(r.reden); toonMelding(r.reden); return; }
    toonMelding('');
    state = r.state;
    bewaar();
    geluid('fiche');
    renderAlles();
    aankondig('Vorige inzet herhaald. Op tafel: ' + fmt(E.betTotal(state.roulette.inzet)) + '.');
  }

  function draai() {
    if (bezig) return;
    var inzet = state.roulette.inzet;
    var vooraf = state.saldo;
    var r = E.spin(state);
    if (!r.ok) { aankondig(r.reden); return; }

    // Eerst afgerekend en bewaard, dan pas animeren.
    bezig = true;
    rWeergaveInzet = inzet;
    weergaveSaldo = vooraf;
    state = r.state;
    bewaar();
    toonMelding('');
    sluitBevestig(false);
    markeerVak(null);
    $('[data-r-uitslag]').classList.remove('is-winst', 'is-verlies');
    $('[data-r-tekst]').textContent = 'Het wiel draait…';
    $('[data-r-nummer]').textContent = '…';
    $('[data-r-nummer]').className = 'hi-uitslag-nummer';
    renderAlles();
    aankondig('Het wiel draait.');

    var duur = reduceMotion ? 700 : 4800;
    var draaiEl = $('[data-wiel-draai]'), baan = $('[data-bal-baan]');
    var wielDoel = E.wheelRotationFor(r.uitslag.nummer, wielRot, reduceMotion ? 1 : 5);
    var balDoel = E.ballRotationFor(balRot, reduceMotion ? 1 : 8);
    baan.style.setProperty('--hi-duur', duur + 'ms');
    baan.classList.add('is-zichtbaar', 'is-rollend');
    draaiEl.style.transition = 'transform ' + duur + 'ms cubic-bezier(0.15, 0.55, 0.12, 1)';
    baan.style.transition = 'transform ' + duur + 'ms cubic-bezier(0.2, 0.62, 0.18, 1)';
    void draaiEl.offsetWidth;
    wielRot = wielDoel;
    balRot = balDoel;
    draaiEl.style.transform = 'rotate(' + wielRot + 'deg)';
    baan.style.transform = 'rotate(' + balRot + 'deg)';
    geluid('draai', duur);

    later(function () {
      baan.classList.remove('is-rollend');
      // Rotaties terugbrengen naar 0..360 zonder zichtbaar verschil, zodat de getallen niet oplopen.
      zetWielDirect(E.norm(wielRot), true);
      bezig = false;
      weergaveSaldo = null;
      rWeergaveInzet = null;
      state = E.acknowledge(state);
      if (!syncNodig) bewaar();
      markeerVak(r.uitslag.nummer);
      toonRUitslag(state.roulette.laatste);
      flitsSaldo(r.uitslag.netto);
      geluid(r.uitslag.netto > 0 ? 'winst' : 'verlies');
      renderAlles();
      aankondig('Uitslag ' + betNaam('n' + r.uitslag.nummer) + '. Uitbetaling ' + fmt(r.uitslag.uitbetaling) +
        ', netto ' + fmtNetto(r.uitslag.netto) + '. Saldo ' + fmt(state.saldo) + '.');
      if (syncNodig) synchroniseer();
      tussenRonde();
    }, duur + 60);
  }

  /* ─── Blackjack ──────────────────────────────────────── */

  function maakKaart(c, dicht, nieuw, flip) {
    var el = document.createElement('div');
    el.setAttribute('role', 'listitem');
    if (dicht) {
      el.className = 'hi-kaart is-dicht' + (nieuw ? ' is-nieuw' : '');
      el.setAttribute('aria-label', 'dichte kaart');
      el.setAttribute('data-sleutel', 'dicht');
      return el;
    }
    var rank = E.cardRank(c), suit = E.cardSuit(c);
    var rood = suit === 'H' || suit === 'D';
    el.className = 'hi-kaart' + (rood ? ' is-rood' : '') + (nieuw ? ' is-nieuw' : '') + (flip ? ' is-flip' : '');
    el.setAttribute('aria-label', kaartNaam(c));
    el.setAttribute('data-sleutel', c);
    var r = RANK_TOON[rank] || rank, s = SUIT_SYMBOL[suit];
    el.innerHTML =
      '<span class="hi-hoek" aria-hidden="true"><b>' + r + '</b><i>' + s + '</i></span>' +
      '<span class="hi-pip" aria-hidden="true">' + s + '</span>' +
      '<span class="hi-hoek hi-hoek-onder" aria-hidden="true"><b>' + r + '</b><i>' + s + '</i></span>';
    return el;
  }

  // Zet precies `aantal` kaarten neer; bestaande kaarten blijven staan, alleen nieuwe animeren in.
  function renderKaarten(houder, kaarten, aantal, dichtIndex) {
    for (var i = 0; i < aantal; i++) {
      var dicht = i === dichtIndex;
      var sleutel = dicht ? 'dicht' : kaarten[i];
      var bestaand = houder.children[i];
      if (bestaand && bestaand.getAttribute('data-sleutel') === sleutel) continue;
      var flip = !!(bestaand && bestaand.getAttribute('data-sleutel') === 'dicht' && !dicht);
      var el = maakKaart(kaarten[i], dicht, !bestaand, flip);
      if (bestaand) houder.replaceChild(el, bestaand); else houder.appendChild(el);
    }
    while (houder.children.length > aantal) houder.removeChild(houder.lastChild);
  }

  var UITKOMST_KORT = { blackjack: 'Blackjack', winst: 'Wint', push: 'Gelijk', verlies: 'Verliest' };

  function isGesplitst(h) { return !!(h && h.handen.length > 1); }

  function handNaam(h, i) { return isGesplitst(h) ? 'Hand ' + (i + 1) : 'Jij'; }

  function bjUitslagTekst(h) {
    var terug = h.uitbetaling, netto = h.uitbetaling - h.inzet;
    var dTot = E.handValue(h.dealer).total;
    var kop;
    if (isGesplitst(h)) {
      var levend = h.handen.some(function (x) { return x.status !== 'dood'; });
      kop = !levend ? 'Al je handen zijn dood.' : dTot > 21 ? 'De dealer is dood met ' + dTot + '.' : 'De dealer heeft ' + dTot + '.';
      var per = h.handen.map(function (x, i) {
        return 'hand ' + (i + 1) + ' ' + (x.status === 'dood' ? 'dood' : UITKOMST_KORT[x.uitkomst].toLowerCase());
      }).join(', ');
      return { kop: kop, regel: 'Terug ' + fmt(terug) + ' · netto ' + fmtNetto(netto), netto: netto, per: per };
    }
    var x = h.handen[0], pTot = E.handValue(x.kaarten).total;
    switch (x.uitkomst) {
      case 'blackjack': kop = 'Blackjack! Je wint 6 tegen 5.'; break;
      case 'winst': kop = dTot > 21 ? 'De dealer is dood. Je wint.' : 'Je wint met ' + pTot + ' tegen ' + dTot + '.'; break;
      case 'push':
        kop = E.isNatural(x.kaarten) ? 'Allebei blackjack. Gelijkspel.' : 'Gelijkspel op ' + pTot + '.'; break;
      default:
        if (pTot > 21) kop = 'Dood met ' + pTot + '. Je verliest.';
        else if (E.isNatural(h.dealer)) kop = 'De dealer heeft blackjack.';
        else kop = 'De dealer wint met ' + dTot + ' tegen ' + pTot + '.';
    }
    return { kop: kop, regel: 'Terug ' + fmt(terug) + ' · netto ' + fmtNetto(netto), netto: netto, per: '' };
  }

  // Weergave: hoeveel kaarten per spelershand (s) en van de dealer (d) zichtbaar zijn, en of de
  // dichte dealerkaart al om is.
  function volledigeView(h) {
    if (!h) return null;
    return {
      s: h.handen.map(function (x) { return x.kaarten.length; }),
      d: h.fase === 'klaar' ? h.dealer.length : 2,
      open: h.fase === 'klaar'
    };
  }

  function waardeTekst(kaarten) {
    if (!kaarten.length) return '';
    var v = E.handValue(kaarten);
    return v.soft && v.total < 21 ? (v.total - 10) + ' / ' + v.total : String(v.total);
  }

  // Zorgt dat er precies `aantal` handvakken staan en geeft ze terug.
  function handVakken(aantal) {
    var houder = $('[data-bj-handen]');
    while (houder.children.length > aantal) houder.removeChild(houder.lastChild);
    while (houder.children.length < aantal) {
      var vak = document.createElement('div');
      vak.className = 'hi-hand hi-speler-hand';
      vak.innerHTML =
        '<div class="hi-hand-kop"><span data-naam></span><span class="hi-waarde" data-waarde></span></div>' +
        '<div class="hi-kaarten" role="list" data-kaarten></div>' +
        '<div class="hi-bj-inzet" data-inzet hidden></div>' +
        '<p class="hi-hand-uitslag" data-hand-uitslag hidden></p>';
      houder.appendChild(vak);
    }
    houder.classList.toggle('is-gesplitst', aantal > 1);
    return Array.prototype.slice.call(houder.children);
  }

  function renderHand(vak, h, i, aantal, actief, afgerond) {
    var x = h.handen[i];
    var naam = handNaam(h, i);
    $('[data-naam]', vak).textContent = naam;
    var kEl = $('[data-kaarten]', vak);
    kEl.setAttribute('aria-label', isGesplitst(h) ? 'Kaarten van hand ' + (i + 1) : 'Jouw kaarten');
    renderKaarten(kEl, x.kaarten, aantal, -1);
    $('[data-waarde]', vak).textContent = waardeTekst(x.kaarten.slice(0, aantal));
    vak.classList.toggle('is-actief', actief);
    if (actief) vak.setAttribute('aria-current', 'true'); else vak.removeAttribute('aria-current');

    var inzetEl = $('[data-inzet]', vak);
    inzetEl.hidden = false;
    inzetEl.innerHTML = '';
    var chip = document.createElement('span');
    chip.className = 'hi-zet is-zichtbaar ' + chipKlasse(x.inzet / (x.verdubbeld ? 2 : 1));
    chip.textContent = fmt(x.inzet);
    chip.setAttribute('aria-hidden', 'true');
    var lbl = document.createElement('span');
    lbl.textContent = 'Inzet ' + fmt(x.inzet) + (x.verdubbeld ? ' (verdubbeld)' : '');
    inzetEl.appendChild(chip);
    inzetEl.appendChild(lbl);

    // Bij gesplitste handen staat per hand wat hij opleverde.
    var uEl = $('[data-hand-uitslag]', vak);
    vak.classList.remove('is-winst', 'is-verlies', 'is-push');
    if (afgerond && isGesplitst(h)) {
      var netto = x.uitbetaling - x.inzet;
      uEl.textContent = (x.status === 'dood' ? 'Dood' : UITKOMST_KORT[x.uitkomst]) + ' · ' + fmtNetto(netto);
      uEl.hidden = false;
      vak.classList.add(netto > 0 ? 'is-winst' : netto < 0 ? 'is-verlies' : 'is-push');
    } else {
      uEl.hidden = true;
      uEl.textContent = '';
    }
  }

  function renderBlackjack() {
    var h = state.blackjack.hand;
    var view = bjView || volledigeView(h);
    var dKaarten = $('[data-bj-dealer-kaarten]');
    var dWaarde = $('[data-bj-dealer-waarde]');
    var uitslag = $('[data-bj-uitslag]');

    if (!h || !view) {
      renderKaarten(dKaarten, [], 0, -1);
      handVakken(0);
      dWaarde.textContent = '';
      uitslag.className = 'hi-bj-uitslag';
      uitslag.textContent = 'Kies je inzet en druk op Deel.';
    } else {
      var afgerond = !bezig && h.fase === 'klaar';
      var vakken = handVakken(h.handen.length);
      vakken.forEach(function (vak, i) {
        var aantal = view.s[i] || 0;
        var actief = !bezig && h.fase === 'speler' && isGesplitst(h) && i === h.actief;
        renderHand(vak, h, i, aantal, actief, afgerond);
      });
      renderKaarten(dKaarten, h.dealer, view.d, view.open ? -1 : 1);
      // Zolang de tweede dealerkaart dicht is, tellen we alleen de open kaart.
      var dZicht = view.open ? h.dealer.slice(0, view.d) : h.dealer.slice(0, Math.min(1, view.d));
      dWaarde.textContent = dZicht.length ? (view.open ? String(E.handValue(dZicht).total) : 'toont ' + E.handValue(dZicht).total) : '';

      uitslag.className = 'hi-bj-uitslag';
      if (bezig) {
        uitslag.textContent = view.open ? 'De dealer speelt…' : 'Delen…';
      } else if (h.fase === 'speler') {
        var opties = E.canSplit(state) ? 'kaart, pas, verdubbel of splits' : E.canDouble(state) ? 'kaart, pas of verdubbel' : 'kaart of pas';
        uitslag.textContent = (isGesplitst(h) ? 'Hand ' + (h.actief + 1) + ' van ' + h.handen.length + ': ' : 'Jouw beurt: ') + opties + '.';
      } else {
        var t = bjUitslagTekst(h);
        uitslag.innerHTML = '';
        var kop = document.createElement('strong'); kop.textContent = t.kop;
        var regel = document.createElement('span'); regel.textContent = t.regel;
        uitslag.appendChild(kop); uitslag.appendChild(regel);
        uitslag.classList.add(t.netto > 0 ? 'is-winst' : t.netto < 0 ? 'is-verlies' : 'is-push');
      }
    }

    var actief = !!(h && h.fase === 'speler');
    renderFiches($('[data-b-fiches]'), bKeuze, bezig || actief);
    var bBedrag = inzetVoor(bKeuze);
    $('[data-deel]').disabled = bezig || actief || bBedrag < 1 || state.saldo < bBedrag;
    $('[data-kaart]').disabled = bezig || !actief;
    $('[data-pas]').disabled = bezig || !actief;
    $('[data-verdubbel]').disabled = bezig || !E.canDouble(state);
    $('[data-splits]').disabled = bezig || !E.canSplit(state);
    var tekort = $('#hi-paneel-blackjack [data-tekort]');
    tekort.hidden = bezig || actief || state.saldo >= E.CHIP_VALUES[0];
  }

  // Stappen van de huidige weergave naar de doelweergave: eerst om en om delen, dan per hand de
  // extra kaarten van links naar rechts, dan de dichte kaart omdraaien, dan de dealerkaarten.
  function stappenNaar(van, naar) {
    var v = { s: naar.s.map(function (_, i) { return van.s[i] || 0; }), d: van.d, open: van.open };
    var out = [];
    var kopie = function () { return { s: v.s.slice(), d: v.d, open: v.open }; };
    var enkel = naar.s.length === 1;
    while ((enkel && v.s[0] < Math.min(2, naar.s[0])) || v.d < Math.min(2, naar.d)) {
      if (enkel && v.s[0] <= v.d && v.s[0] < Math.min(2, naar.s[0])) v.s[0]++; else v.d++;
      out.push(kopie());
    }
    for (var i = 0; i < naar.s.length; i++) {
      while (v.s[i] < naar.s[i]) { v.s[i]++; out.push(kopie()); }
    }
    if (naar.open && !v.open) { v.open = true; out.push(kopie()); }
    while (v.d < naar.d) { v.d++; out.push(kopie()); }
    return out;
  }

  function focusNaAnimatie(knop) {
    var ae = document.activeElement;
    if (actieveTab === 'blackjack' && !knop.disabled && (!ae || ae === document.body || ae.disabled)) knop.focus();
  }

  // Speelt de kaarten in stappen af. Tijdens het afspelen staat alles dicht.
  function speelBj(van) {
    var h = state.blackjack.hand;
    var doel = volledigeView(h);
    var stappen = stappenNaar(van, doel);
    var stapMs = reduceMotion ? 140 : 430;
    bezig = true;
    // Een afgeronde hand is al uitbetaald; tot de laatste kaart ligt toon je het saldo nog zonder uitbetaling.
    weergaveSaldo = h.fase === 'klaar' ? state.saldo - h.uitbetaling : null;
    bjView = { s: van.s.slice(), d: van.d, open: van.open };
    renderAlles();
    stappen.forEach(function (stap, i) {
      later(function () {
        bjView = stap;
        geluid('kaart');
        renderAlles();
      }, (i + 1) * stapMs);
    });
    later(function () {
      bezig = false;
      bjView = null;
      weergaveSaldo = null;
      if (h.fase === 'klaar') {
        state = E.acknowledge(state);
        if (!syncNodig) bewaar();
        var t = bjUitslagTekst(h);
        flitsSaldo(t.netto);
        geluid(t.netto > 0 ? 'winst' : t.netto < 0 ? 'verlies' : 'push');
        renderAlles();
        aankondig(t.kop + (t.per ? ' ' + t.per.charAt(0).toUpperCase() + t.per.slice(1) + '.' : '') + ' ' + t.regel + '. Saldo ' + fmt(state.saldo) + '.');
        focusNaAnimatie($('[data-deel]'));
        tussenRonde();
      } else {
        renderAlles();
        var x = h.handen[h.actief];
        aankondig((isGesplitst(h) ? 'Hand ' + (h.actief + 1) + ': ' + E.handValue(x.kaarten).total : 'Jij hebt ' + E.handValue(x.kaarten).total) +
          '. De dealer toont ' + E.handValue([h.dealer[0]]).total + '.');
        focusNaAnimatie($('[data-kaart]'));
      }
      if (syncNodig) synchroniseer();
    }, (stappen.length + 1) * stapMs);
  }

  function huidigeView() {
    var h = state.blackjack.hand;
    if (!h) return { s: [0], d: 0, open: false };
    return volledigeView(h);
  }

  function deel() {
    if (bezig) return;
    var r = E.bjDeal(state, inzetVoor(bKeuze));
    if (!r.ok) { aankondig(r.reden); toonMelding(r.reden); return; }
    toonMelding('');
    sluitBevestig(false);
    state = r.state;
    bewaar();
    $('[data-bj-dealer-kaarten]').innerHTML = '';
    handVakken(0);
    speelBj({ s: [0], d: 0, open: false });
  }

  function bjActie(fn) {
    if (bezig) return;
    var van = huidigeView();
    var r = fn(state);
    if (!r.ok) { aankondig(r.reden); return; }
    state = r.state;
    bewaar();
    speelBj(van);
  }

  // Splitsen: de twee kaarten gaan uit elkaar en elke nieuwe hand krijgt daarna zijn tweede kaart.
  function splits() {
    if (bezig) return;
    var oud = state.blackjack.hand;
    var r = E.bjSplit(state);
    if (!r.ok) { aankondig(r.reden); return; }
    var van = volledigeView(oud);
    van.s = van.s.slice(0, oud.actief).concat([1, 1], van.s.slice(oud.actief + 1));
    state = r.state;
    bewaar();
    speelBj(van);
  }

  /* ─── Andere tabbladen ───────────────────────────────── */

  // Neemt de bewaarde stand over. Wacht als hier nog een animatie loopt; die roept dit daarna aan.
  function synchroniseer() {
    if (bezig) { syncNodig = true; return; }
    syncNodig = false;
    state = E.acknowledge(laad());
    bKeuze = state.blackjack.laatsteInzet;
    bjView = null;
    rWeergaveInzet = null;
    weergaveSaldo = null;
    var laatste = state.roulette.laatste;
    zetWielDirect(laatste ? E.norm(E.wheelRotationFor(laatste.nummer, 0, 0)) : 0, !!laatste);
    markeerVak(laatste ? laatste.nummer : null);
    toonRUitslag(laatste);
    $('[data-bj-dealer-kaarten]').innerHTML = '';
    handVakken(0);
    toonMelding('Je stand is bijgewerkt met wat je in een ander tabblad speelde.');
    renderAlles();
  }

  /* ─── Alles tekenen ──────────────────────────────────── */

  function renderAlles() {
    pasKeuzesAan();
    renderBank();
    renderTabs();
    renderRoulette();
    renderBlackjack();
  }

  /* ─── Start ──────────────────────────────────────────── */

  function init() {
    bouwWiel();
    bouwBord();
    maakFiches($('[data-r-fiches]'), function () { return rKeuze; }, function (w) { rKeuze = w; }, 'roulette');
    maakFiches($('[data-b-fiches]'), function () { return bKeuze; }, function (w) { bKeuze = w; }, 'blackjack');
    initTabs();
    initGeluidKnop();

    $('[data-wis]').addEventListener('click', wis);
    $('[data-herhaal]').addEventListener('click', herhaal);
    $('[data-draai]').addEventListener('click', draai);
    $('[data-deel]').addEventListener('click', deel);
    $('[data-kaart]').addEventListener('click', function () { bjActie(E.bjHit); });
    $('[data-pas]').addEventListener('click', function () { bjActie(E.bjStand); });
    $('[data-verdubbel]').addEventListener('click', function () { bjActie(E.bjDouble); });
    $('[data-splits]').addEventListener('click', splits);
    $('[data-nieuw]').addEventListener('click', openBevestig);
    $('[data-reclame]').addEventListener('click', kijkReclame);
    $$('[data-tekort-reclame] button').forEach(function (b) { b.addEventListener('click', kijkReclame); });
    $$('[data-tekort-nieuw]').forEach(function (b) { b.addEventListener('click', openBevestig); });
    $('[data-bevestig-ja]').addEventListener('click', nieuwSpel);
    $('[data-bevestig-nee]').addEventListener('click', function () { sluitBevestig(true); });
    $('[data-bevestig]').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); sluitBevestig(true); }
    });

    // Wiel in de stand van de laatste uitslag, bal in dat vakje.
    var laatste = state.roulette.laatste;
    if (laatste) {
      zetWielDirect(E.norm(E.wheelRotationFor(laatste.nummer, 0, 0)), true);
      markeerVak(laatste.nummer);
      toonRUitslag(laatste);
    } else {
      zetWielDirect(0, false);
    }

    // Een ronde die al was afgerekend maar waarvan de animatie niet af was (herladen tijdens het draaien of delen).
    var wasOpen = state.open;
    if (state.open === 'roulette' && laatste) {
      toonMelding('Je herlaadde tijdens het draaien. Die draai was al afgerekend: ' + betNaam('n' + laatste.nummer) +
        ', uitbetaling ' + fmt(laatste.uitbetaling) + ', netto ' + fmtNetto(laatste.uitbetaling - laatste.inzet) + '.');
    } else if (state.open === 'blackjack' && state.blackjack.hand) {
      var t = bjUitslagTekst(state.blackjack.hand);
      toonMelding('Je herlaadde tijdens de hand. Die was al afgerekend: ' + t.kop + ' ' + t.regel + '.');
    }
    if (state.open) { state = E.acknowledge(state); bewaar(); }

    var h = state.blackjack.hand;
    if (h && h.fase === 'speler') {
      kiesTab('blackjack', false);
      toonMelding('Je hand van de vorige keer loopt nog. Speel hem verder.');
    } else if (h && h.fase === 'klaar' && (wasOpen === 'blackjack' || !laatste)) {
      kiesTab('blackjack', false);
    }
    renderAlles();


    window.addEventListener('storage', function (e) {
      if (e.key === E.STORAGE_KEY) synchroniseer();
    });
    // Terug naar deze pagina via de terugknop: de pagina komt uit de cache met een oude stand.
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) synchroniseer();
    });
  }

  init();
})();
