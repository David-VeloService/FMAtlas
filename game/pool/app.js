/*
 * Pool: tekenen en bediening. Alle regels en de simulatie staan in engine.js, de computer in bot.js.
 *
 * De tekenlus draait alleen als er iets beweegt (rollende ballen, de computer die richt, de keu die
 * stoot) en stopt als het tabblad verborgen is. Daarna wordt er alleen nog getekend als er iets
 * verandert. Een partij wordt niet bewaard; alleen voorkeuren (speelwijze, kracht, geluid, volume,
 * richtlijn, naam).
 *
 * Online (net.js, window.PoolNet) is de host de autoriteit: beide kanten tonen alleen standen die de
 * host stuurt, en een stoot wordt afgespeeld vanaf de vorige stand met dezelfde engine. Wie niet aan
 * de beurt is, kan niets doen (ui 'remote'); de gast wacht na een actie op de host (ui 'wacht').
 *
 * Met ?test=1 in de adresbalk komt window.PoolTest beschikbaar om standen te zetten (zie README.md).
 */
(function () {
  'use strict';

  var P = window.PoolEngine;
  var Bot = window.PoolBot;
  var Net = window.PoolNet || null;
  if (!P || !Bot) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var TEST = /[?&]test=1(&|$)/.test(location.search);

  try { localStorage.setItem('fa_laatste_game', 'pool'); } catch (_) { /* geen opslag: niet erg */ }

  /* ─── Voorkeuren ─────────────────────────────────────── */

  var NAME_MAX = 20;
  function cleanName(v) {
    if (Net) return Net.cleanName(v);
    return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) : '';
  }

  var prefs = { mode: 'cpu', sound: false, power: 55, volume: 70, guide: true, name: '' };
  try {
    var raw = JSON.parse(localStorage.getItem(P.STORAGE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      if (raw.mode === 'cpu' || raw.mode === 'duo') prefs.mode = raw.mode;
      if (typeof raw.sound === 'boolean') prefs.sound = raw.sound;
      if (typeof raw.power === 'number' && raw.power >= 5 && raw.power <= 100) prefs.power = Math.round(raw.power);
      if (typeof raw.volume === 'number' && raw.volume >= 0 && raw.volume <= 100) prefs.volume = Math.round(raw.volume);
      if (typeof raw.guide === 'boolean') prefs.guide = raw.guide;
      if (typeof raw.name === 'string') prefs.name = cleanName(raw.name);
    }
  } catch (_) { /* kapotte of geblokkeerde opslag: standaardwaarden */ }

  var prefsSaved = true;
  function bewaarPrefs() {
    try { localStorage.setItem(P.STORAGE_KEY, JSON.stringify(prefs)); prefsSaved = true; } catch (_) { prefsSaved = false; }
    return prefsSaved;
  }

  /* ─── Elementen ──────────────────────────────────────── */

  var el = {
    canvas: $('[data-tafel]'),
    wrap: $('[data-tafel-wrap]'),
    podium: $('.pl-podium'),
    bar: $('.pl-bar'),
    spelersBlok: $('.pl-spelers'),
    bediening: $('.pl-bediening'),
    status: $('[data-status]'),
    callRegel: $('[data-call-regel]'),
    spelers: $$('[data-speler]'),
    modusKnoppen: $$('[data-modus-knop]'),
    geluid: $('[data-geluid]'),
    nieuw: $('[data-nieuw]'),
    bevestig: $('[data-bevestig]'),
    bevestigTekst: $('[data-bevestig-tekst]'),
    bevestigJa: $('[data-bevestig-ja]'),
    bevestigNee: $('[data-bevestig-nee]'),
    winst: $('[data-winst]'),
    winstTitel: $('[data-winst-titel]'),
    winstTekst: $('[data-winst-tekst]'),
    opnieuw: $('[data-opnieuw]'),
    keuze: $('[data-keuze]'),
    keuzeTitel: $('[data-keuze-titel]'),
    keuzeTekst: $('[data-keuze-tekst]'),
    keuzeKnoppen: $('[data-keuze-knoppen]'),
    plaats: $('[data-plaats]'),
    plaatsTekst: $('[data-plaats-tekst]'),
    plaatsOk: $('[data-plaats-ok]'),
    stoot: $('[data-stoot]'),
    call: $('[data-call]'),
    doelbal: $('[data-doelbal]'),
    pocket: $('[data-pocket]'),
    safety: $('[data-safety]'),
    kracht: $('[data-kracht]'),
    krachtWaarde: $('[data-kracht-waarde]'),
    verplaats: $('[data-verplaats]'),
    stootKnop: $('[data-stoot-knop]'),
    aankondiging: $('[data-aankondiging]'),
    sub: $('[data-sub]'),
    main: $('.pl-main'),
    voet: $('.pl-voet'),
    regels: $('.pl-regels'),
    menuKnop: $('[data-menu-open]'),
    hulpKnop: $('[data-hulp-open]'),
    winstVerlaat: $('[data-winst-verlaat]'),
    // lagen: menu, hulp, instellingen, speelwijze, online
    laag: $('[data-laag]'),
    panelen: {
      menu: $('[data-paneel="menu"]'),
      hulp: $('[data-paneel="hulp"]'),
      instellingen: $('[data-paneel="instellingen"]'),
      speelwijze: $('[data-paneel="speelwijze"]'),
      online: $('[data-paneel="online"]')
    },
    menuNoot: $('[data-menu-noot]'),
    menuVolledig: $('[data-menu="volledig"]'),
    menuVerlaat: $('[data-menu="verlaat"]'),
    menuNieuw: $('[data-menu="nieuw"]'),
    setNaam: $('[data-instelling="naam"]'),
    setGeluid: $('[data-instelling="geluid"]'),
    setVolume: $('[data-instelling="volume"]'),
    setVolumeWaarde: $('[data-instelling-volume-waarde]'),
    setRichtlijn: $('[data-instelling="richtlijn"]'),
    setNoot: $('[data-instelling-noot]'),
    // online
    onNaam: $('[data-online-naam]'),
    onCode: $('[data-online-code]'),
    onMaak: $('[data-online-maak]'),
    onMee: $('[data-online-mee]'),
    onUitnodiging: $('[data-online-uitnodiging]'),
    onFout: $('[data-online-fout]'),
    onFile: $('[data-online-file]'),
    onVerbindTekst: $('[data-online-verbind-tekst]'),
    onAnnuleer: $('[data-online-annuleer]'),
    onCodeGroot: $('[data-online-code-groot]'),
    onLink: $('[data-online-link]'),
    onKopieer: $('[data-online-kopieer]'),
    onKopieerCode: $('[data-online-kopieer-code]'),
    onKopieerStatus: $('[data-online-kopieer-status]'),
    onSpelers: $('[data-online-spelers]'),
    onLobbyTekst: $('[data-online-lobby-tekst]'),
    onStart: $('[data-online-start]'),
    onHervat: $('[data-online-hervat]'),
    onVerlaat: $('[data-online-verlaat]'),
    onDeel: $('[data-online-deel]'),
    onFoutTekst: $('[data-online-fout-tekst]'),
    onOpnieuw: $('[data-online-opnieuw]'),
    onLokaal: $('[data-online-lokaal]'),
    onSluit: $('[data-online-sluit]'),
    // meldingsbalk (online verzoeken en korte meldingen)
    balk: $('[data-balk]'),
    balkTekst: $('[data-balk-tekst]'),
    balkJa: $('[data-balk-ja]'),
    balkNee: $('[data-balk-nee]')
  };
  var ctx2d = el.canvas.getContext('2d');

  /* ─── Toestand ───────────────────────────────────────── */

  var breakerNext = 0;
  var state = null;
  // 'aiming' | 'placing' | 'shooting' | 'cpu' | 'choice' | 'over' | 'idle'
  // online daarnaast: 'remote' (de ander is aan zet), 'wacht' (actie verstuurd, wacht op de host)
  var ui = 'idle';
  var online = null;           // lopende online kamer, zie "Online" verderop
  var paused = false;          // offline pauze: menu of paneel open
  var pausedAt = 0;
  var aim = { angle: 0, locked: false };
  var power = prefs.power;     // 5..100
  var call = { ball: null, pocket: null, safety: false, manual: false };
  var preview = null;          // {x,y} plek van de witte bal tijdens bal in hand
  var shot = null;             // lopende simulatie (engine-context)
  var strike = null;           // {start, dur, then}: keu-animatie vóór de stoot
  var tween = null;            // computer richt: {start, dur, from, to, p0, p1, then}
  var cpuToken = 0;
  var cpuPaused = false;       // alleen via de testinterface
  var lastTs = null;
  var rafId = 0;
  var pointer = null;          // lopende aanwijzing op de tafel
  var hover = null;            // muispositie in tafelcoördinaten
  var view = { s: 1, rotated: false, cssW: 0, cssH: 0, dpr: 1 };
  var bgCache = null;

  var F = 150;                 // rand rond het speelvlak (band + hout), in mm
  var TW = P.W + 2 * F, TH = P.H + 2 * F;

  var COLORS = {
    0: '#f8f5ec', 1: '#f4c20d', 2: '#1f4fbf', 3: '#d62d20', 4: '#5b2a86', 5: '#f2711c', 6: '#1d7a3a', 7: '#7a1f1f',
    8: '#151515', 9: '#f4c20d', 10: '#1f4fbf', 11: '#d62d20', 12: '#5b2a86', 13: '#f2711c', 14: '#1d7a3a', 15: '#7a1f1f'
  };

  /* ─── Kracht ─────────────────────────────────────────── */

  function speedFromPower(p) {
    var t = Math.max(0, Math.min(1, (p - 5) / 95));
    return P.MIN_SPEED + (P.MAX_SPEED - P.MIN_SPEED) * Math.pow(t, 1.5);
  }
  function powerFromSpeed(v) {
    var t = Math.max(0, Math.min(1, (v - P.MIN_SPEED) / (P.MAX_SPEED - P.MIN_SPEED)));
    return 5 + 95 * Math.pow(t, 1 / 1.5);
  }
  function setPower(p, bewaar) {
    power = Math.max(5, Math.min(100, Math.round(p)));
    el.kracht.value = String(power);
    el.krachtWaarde.textContent = power + '%';
    if (bewaar) { prefs.power = power; bewaarPrefs(); }
    requestDraw();
  }

  /* ─── Weergave: maat en coördinaten ──────────────────── */

  /*
   * Hoeveel ruimte heeft de tafel echt? Gemeten, niet geschat: de breedte is de binnenmaat van het
   * podium; de hoogte is de schermhoogte min alles wat boven het podium staat (kop, spelers), de
   * binnenrand van het podium, en de bediening als die eronder staat. Staat de bediening ernaast
   * (liggende telefoon), dan telt hij niet mee. Al die maten hangen niet af van de tafelmaat zelf,
   * dus één meting is genoeg en er ontstaat geen lus.
   */
  var FIT_GAP = 6;             // lucht onder de bediening, in px
  var MIN_TABLE_H = 110;       // ondergrens voor uitzonderlijk lage vensters, in px

  function cssPx(v, fallback) { var n = parseFloat(v); return isFinite(n) ? n : fallback; }

  function measureSpace() {
    var podium = el.podium || el.wrap.parentNode;
    var cs = window.getComputedStyle ? window.getComputedStyle(podium) : {};
    var padL = cssPx(cs.paddingLeft, 0), padR = cssPx(cs.paddingRight, padL);
    var padT = cssPx(cs.paddingTop, padL), padB = cssPx(cs.paddingBottom, padT);
    var scrollY = window.pageYOffset || window.scrollY || 0;
    var pr = podium.getBoundingClientRect();
    var podiumBottom = pr.top + (pr.height || 0);
    var below = 0;
    if (el.bediening && !el.bediening.hidden) {
      var br = el.bediening.getBoundingClientRect();
      if (br.height > 0 && br.top >= podiumBottom - 1) below = br.top + br.height - podiumBottom;
    }
    return {
      w: (podium.clientWidth || 0) - padL - padR,
      h: window.innerHeight - (pr.top + scrollY) - padT - padB - below - FIT_GAP
    };
  }

  /* Rekent de tafelmaat uit en past hem alleen toe als er iets verandert. Geeft true bij een wijziging. */
  function resize(force) {
    var a = measureSpace();
    // Liggend of staand: wat de grootste tafel oplevert. Staand alleen als dat duidelijk groter is.
    var sFlat = Math.min(a.w / TW, a.h / TH);
    var sRot = Math.min(a.w / TH, a.h / TW);
    var rotated = sRot > sFlat * 1.08;
    var sc = rotated ? sRot : sFlat;
    var sFloor = Math.min(a.w / TW, MIN_TABLE_H / TH);
    if (!(sc >= sFloor)) { sc = sFloor; rotated = false; }
    if (!(sc > 0)) sc = 0.05;
    var w = Math.max(1, Math.floor(sc * (rotated ? TH : TW)));
    var h = Math.max(1, Math.floor(sc * (rotated ? TW : TH)));
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    if (!force && w === view.cssW && h === view.cssH && rotated === view.rotated && dpr === view.dpr) return false;
    view.rotated = rotated;
    view.cssW = w; view.cssH = h; view.dpr = dpr;
    view.s = w / (rotated ? TH : TW);
    el.wrap.style.width = w + 'px';
    el.canvas.style.width = w + 'px';
    el.canvas.style.height = h + 'px';
    el.canvas.width = Math.round(w * dpr);
    el.canvas.height = Math.round(h * dpr);
    bgCache = null;
    renderPocketOptions();
    requestDraw();
    return true;
  }

  function toScreen(x, y) {
    var s = view.s;
    if (view.rotated) return { x: (y + F) * s, y: (P.W + F - x) * s };
    return { x: (x + F) * s, y: (y + F) * s };
  }
  function toWorld(sx, sy) {
    var s = view.s;
    if (view.rotated) return { x: P.W + F - sy / s, y: sx / s - F };
    return { x: sx / s - F, y: sy / s - F };
  }
  function screenVecToWorld(dx, dy) {
    return view.rotated ? { x: -dy, y: dx } : { x: dx, y: dy };
  }
  function worldTransform(c) {
    var s = view.s * view.dpr;
    if (view.rotated) c.setTransform(0, -s, s, 0, F * s, (P.W + F) * s);
    else c.setTransform(s, 0, 0, s, F * s, F * s);
  }

  function pocketName(id) {
    var p = P.pocketById(id);
    var sc = toScreen(p.x, p.y);
    var col = sc.x < view.cssW / 3 ? 'links' : sc.x > view.cssW * 2 / 3 ? 'rechts' : 'midden';
    var row = sc.y < view.cssH / 3 ? 'boven' : sc.y > view.cssH * 2 / 3 ? 'onder' : 'midden';
    if (col === 'midden') return 'midden ' + row;
    if (row === 'midden') return 'midden ' + col;
    return col + row;
  }

  /* ─── Tekenen ────────────────────────────────────────── */

  function cushionPolygons() {
    var depth = 48;
    var polys = [];
    var cx = P.W / 2, cy = P.H / 2;
    P.CUSHIONS.forEach(function (s) {
      if (s.kind !== 'band') return;
      var ex = s.bx - s.ax, ey = s.by - s.ay, len = Math.hypot(ex, ey);
      var nx = -ey / len, ny = ex / len;
      if (nx * (cx - s.ax) + ny * (cy - s.ay) > 0) { nx = -nx; ny = -ny; }   // naar buiten
      function jawEnd(px, py) {
        var jaw = null;
        P.CUSHIONS.forEach(function (j) {
          if (j.kind === 'bek' && Math.abs(j.ax - px) < 0.01 && Math.abs(j.ay - py) < 0.01) jaw = j;
        });
        var jx = jaw.bx - jaw.ax, jy = jaw.by - jaw.ay;
        var t = depth / (jx * nx + jy * ny);
        return { x: px + jx * t, y: py + jy * t };
      }
      var a2 = jawEnd(s.ax, s.ay), b2 = jawEnd(s.bx, s.by);
      polys.push({ pts: [a2, { x: s.ax, y: s.ay }, { x: s.bx, y: s.by }, b2], nx: nx, ny: ny, s: s });
    });
    return polys;
  }
  var CUSHION_POLYS = cushionPolygons();

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function buildBackground() {
    var cv = document.createElement('canvas');
    cv.width = el.canvas.width; cv.height = el.canvas.height;
    var c = cv.getContext('2d');
    worldTransform(c);

    // Houten rand
    var wood = c.createLinearGradient(0, -F, 0, P.H + F);
    wood.addColorStop(0, '#6a4026'); wood.addColorStop(0.5, '#4a2b18'); wood.addColorStop(1, '#2f1a0d');
    roundRect(c, -F, -F, TW, TH, 70);
    c.fillStyle = wood; c.fill();
    // nerf
    c.save();
    roundRect(c, -F, -F, TW, TH, 70); c.clip();
    c.globalAlpha = 0.08; c.strokeStyle = '#000'; c.lineWidth = 3;
    for (var g = -F + 12; g < P.H + F; g += 23) {
      c.beginPath(); c.moveTo(-F, g); c.bezierCurveTo(P.W * 0.3, g + 10, P.W * 0.7, g - 10, P.W + F, g + 4); c.stroke();
    }
    c.restore();
    // binnenrand
    c.strokeStyle = 'rgba(255,220,170,0.18)'; c.lineWidth = 4;
    roundRect(c, -F + 8, -F + 8, TW - 16, TH - 16, 62); c.stroke();

    // Diamanten
    c.fillStyle = '#efe6d2';
    function diamond(x, y) {
      c.beginPath(); c.moveTo(x, y - 13); c.lineTo(x + 8, y); c.lineTo(x, y + 13); c.lineTo(x - 8, y); c.closePath(); c.fill();
    }
    var dm = -F + (F - 48) / 2;
    for (var k = 1; k < 8; k++) {
      if (k === 4) continue;
      diamond(P.W * k / 8, dm); diamond(P.W * k / 8, P.H - dm);
    }
    for (var k2 = 1; k2 < 4; k2++) {
      c.save(); c.translate(dm, P.H * k2 / 4); c.rotate(Math.PI / 2); diamond(0, 0); c.restore();
      c.save(); c.translate(P.W - dm, P.H * k2 / 4); c.rotate(Math.PI / 2); diamond(0, 0); c.restore();
    }

    // Laken onder de banden
    c.fillStyle = '#0f4a43';
    c.fillRect(-48, -48, P.W + 96, P.H + 96);

    // Speelvlak met lamp
    var lamp = c.createRadialGradient(P.W / 2, P.H / 2, 60, P.W / 2, P.H / 2, P.W * 0.62);
    lamp.addColorStop(0, '#2a8f7f'); lamp.addColorStop(0.55, '#1c7266'); lamp.addColorStop(1, '#114f47');
    c.fillStyle = lamp;
    c.fillRect(0, 0, P.W, P.H);
    // fijne lakenstructuur
    c.globalAlpha = 0.05; c.fillStyle = '#000';
    for (var t = 0; t < 900; t++) {
      var rx = (Math.sin(t * 12.9898) * 43758.5453) % 1, ry = (Math.sin(t * 78.233) * 12345.678) % 1;
      c.fillRect(Math.abs(rx) * P.W, Math.abs(ry) * P.H, 4, 4);
    }
    c.globalAlpha = 1;

    // Voetpunt en kopijn-markering
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.beginPath(); c.arc(P.FOOT_X, P.MID_Y, 6, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(P.HEAD_X, P.MID_Y, 4, 0, Math.PI * 2); c.fill();

    // Pockets
    P.POCKETS.forEach(function (p) {
      var gr = c.createRadialGradient(p.x, p.y, 4, p.x, p.y, p.r);
      gr.addColorStop(0, '#000'); gr.addColorStop(0.75, '#070707'); gr.addColorStop(1, '#1c1c1c');
      c.beginPath(); c.arc(p.x, p.y, p.r + 10, 0, Math.PI * 2);
      c.fillStyle = '#20140b'; c.fill();
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c.fillStyle = gr; c.fill();
    });

    // Banden (rubber met laken) met een lichte neus
    CUSHION_POLYS.forEach(function (poly) {
      c.beginPath();
      poly.pts.forEach(function (pt, i) { if (i) c.lineTo(pt.x, pt.y); else c.moveTo(pt.x, pt.y); });
      c.closePath();
      var mx = (poly.s.ax + poly.s.bx) / 2, my = (poly.s.ay + poly.s.by) / 2;
      var gr2 = c.createLinearGradient(mx + poly.nx * 48, my + poly.ny * 48, mx, my);
      gr2.addColorStop(0, '#0c3d37'); gr2.addColorStop(1, '#1a7062');
      c.fillStyle = gr2; c.fill();
      c.strokeStyle = 'rgba(190,255,235,0.22)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(poly.s.ax, poly.s.ay); c.lineTo(poly.s.bx, poly.s.by); c.stroke();
    });

    bgCache = cv;
  }

  function drawBall(c, n, sx, sy, r, alpha) {
    c.save();
    if (alpha !== undefined) c.globalAlpha = alpha;
    c.beginPath(); c.arc(sx, sy, r, 0, Math.PI * 2); c.closePath();
    c.save();
    c.clip();
    var col = COLORS[n];
    if (n === 0 || n >= 9) {
      c.fillStyle = '#f8f5ec'; c.fillRect(sx - r, sy - r, 2 * r, 2 * r);
      if (n >= 9) { c.fillStyle = col; c.fillRect(sx - r, sy - r * 0.56, 2 * r, r * 1.12); }
    } else {
      c.fillStyle = col; c.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    }
    if (n > 0) {
      c.fillStyle = '#fbf8f0';
      c.beginPath(); c.arc(sx, sy, r * 0.47, 0, Math.PI * 2); c.fill();
      if (r >= 6.5) {
        c.fillStyle = '#161616';
        c.font = '900 ' + Math.max(6, r * (n >= 10 ? 0.56 : 0.66)).toFixed(1) + 'px Nunito, system-ui, sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(String(n), sx, sy + r * 0.04);
      }
    }
    var sh = c.createRadialGradient(sx - r * 0.38, sy - r * 0.42, r * 0.05, sx, sy, r * 1.05);
    sh.addColorStop(0, 'rgba(255,255,255,0.75)');
    sh.addColorStop(0.18, 'rgba(255,255,255,0.18)');
    sh.addColorStop(0.6, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,0.38)');
    c.fillStyle = sh; c.fillRect(sx - r, sy - r, 2 * r, 2 * r);
    c.restore();
    c.restore();
  }

  function drawShadow(c, sx, sy, r) {
    var cx = view.cssW / 2, cy = view.cssH / 2;
    var dx = sx - cx, dy = sy - cy, l = Math.hypot(dx, dy) || 1;
    var ox = dx / l * r * 0.28, oy = dy / l * r * 0.28 + r * 0.12;
    var g = c.createRadialGradient(sx + ox, sy + oy, r * 0.2, sx + ox, sy + oy, r * 1.25);
    g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(sx + ox, sy + oy, r * 1.25, 0, Math.PI * 2); c.fill();
  }

  function currentBalls() { return shot ? shot.balls : state.balls; }

  function cuePos() {
    if (ui === 'placing' && preview) return preview;
    var cue = currentBalls()[0];
    return cue.on ? { x: cue.x, y: cue.y } : null;
  }

  function draw() {
    if (!state) return;
    if (!bgCache) buildBackground();
    var c = ctx2d;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, el.canvas.width, el.canvas.height);
    c.drawImage(bgCache, 0, 0);
    c.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    var s = view.s, r = P.R * s;
    var balls = currentBalls();

    // Keuken tijdens bal in hand achter de koplijn
    if (state.ballInHand === 'kitchen' && (ui === 'placing' || ui === 'aiming' || ui === 'cpu') && !shot) {
      c.save(); worldTransform(c);
      c.fillStyle = 'rgba(255,255,255,0.06)';
      c.fillRect(0, 0, P.HEAD_X, P.H);
      c.setLineDash([18, 14]); c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(P.HEAD_X, 0); c.lineTo(P.HEAD_X, P.H); c.stroke();
      c.restore();
      c.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    }

    // Aangekondigde pocket (online ook tijdens de stoot van de ander)
    var showCall = (!shot && (ui === 'aiming' || ui === 'cpu') && state.phase === 'play' && !call.safety) ||
      (!!shot && !!online && !!online.animMsg && !call.safety && call.ball !== null);
    if (showCall && call.pocket) {
      var pk = P.pocketById(call.pocket), ps = toScreen(pk.x, pk.y);
      c.strokeStyle = '#ef5a3f'; c.lineWidth = Math.max(2, 2.2 * s * 3);
      c.beginPath(); c.arc(ps.x, ps.y, (pk.r + 16) * s, 0, Math.PI * 2); c.stroke();
    }

    // Schaduwen, dan ballen
    balls.forEach(function (b) {
      if (!b.on || (b.n === 0 && ui === 'placing')) return;
      var p = toScreen(b.x, b.y); drawShadow(c, p.x, p.y, r);
    });
    balls.forEach(function (b) {
      if (!b.on || (b.n === 0 && ui === 'placing')) return;
      var p = toScreen(b.x, b.y);
      drawBall(c, b.n, p.x, p.y, r);
      if (showCall && call.ball === b.n) {
        c.strokeStyle = '#ef5a3f'; c.lineWidth = Math.max(2, r * 0.22);
        c.beginPath(); c.arc(p.x, p.y, r + Math.max(3, r * 0.3), 0, Math.PI * 2); c.stroke();
      }
    });

    // Bal in hand: voorbeeld
    if (ui === 'placing' && preview) {
      var pv = toScreen(preview.x, preview.y);
      var ok = placementCheck(preview.x, preview.y).ok;
      drawShadow(c, pv.x, pv.y, r);
      drawBall(c, 0, pv.x, pv.y, r, ok ? 0.95 : 0.6);
      c.strokeStyle = ok ? '#8fe0a8' : '#ff6b57'; c.lineWidth = Math.max(2, r * 0.18);
      c.setLineDash(ok ? [] : [4, 3]);
      c.beginPath(); c.arc(pv.x, pv.y, r + Math.max(4, r * 0.35), 0, Math.PI * 2); c.stroke();
      c.setLineDash([]);
    }

    // Richtlijn en keu
    var cp = cuePos();
    var aimingNow = !shot && cp && (ui === 'aiming' || ui === 'cpu' || strike);
    if (aimingNow) {
      if (prefs.guide) drawAim(c, cp, balls);
      drawCue(c, cp);
    } else if (shot && strike) {
      drawCue(c, cp);
    }
  }

  function drawAim(c, cp, balls) {
    var s = view.s, r = P.R * s;
    var hit = P.castAim(balls, cp.x, cp.y, aim.angle);
    var a = toScreen(cp.x, cp.y), g = toScreen(hit.x, hit.y);
    var maxLen = 900;  // korte richtlijn: hooguit 90 cm tot het eerste contact
    var len = Math.min(hit.t, maxLen);
    var end = toScreen(cp.x + Math.cos(aim.angle) * len, cp.y + Math.sin(aim.angle) * len);
    c.save();
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = Math.max(1.2, s * 4);
    c.setLineDash([Math.max(4, s * 22), Math.max(3, s * 16)]);
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(end.x, end.y); c.stroke();
    c.setLineDash([]);
    if (hit.t <= maxLen) {
      c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = Math.max(1.2, s * 4);
      c.beginPath(); c.arc(g.x, g.y, r, 0, Math.PI * 2); c.stroke();
      if (hit.type === 'ball') {
        var b = P.ballByN(balls, hit.ball);
        var bs = toScreen(b.x, b.y);
        var oe = toScreen(b.x + hit.objDir.x * 260, b.y + hit.objDir.y * 260);
        var legal = state.phase === 'break' || P.playerTargets(state, state.turn).indexOf(hit.ball) >= 0;
        c.strokeStyle = legal ? '#ffd8ce' : '#ff6b57'; c.lineWidth = Math.max(1.5, s * 6);
        c.beginPath(); c.moveTo(bs.x, bs.y); c.lineTo(oe.x, oe.y); c.stroke();
        if (hit.cueDir) {
          var ce = toScreen(hit.x + hit.cueDir.x * 160, hit.y + hit.cueDir.y * 160);
          c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = Math.max(1, s * 3);
          c.beginPath(); c.moveTo(g.x, g.y); c.lineTo(ce.x, ce.y); c.stroke();
        }
        if (!legal) {
          c.strokeStyle = '#ff6b57'; c.lineWidth = Math.max(2, r * 0.2);
          c.beginPath(); c.arc(bs.x, bs.y, r + 3, 0, Math.PI * 2); c.stroke();
        }
      }
    }
    c.restore();
  }

  function drawCue(c, cp) {
    var s = view.s, r = P.R * s;
    var pull = (12 + power * 1.6);   // mm terug, afhankelijk van de kracht
    if (strike) {
      var t = Math.min(1, (performance.now() - strike.start) / strike.dur);
      pull = pull * (1 - t) - 10 * t;
    }
    var dx = Math.cos(aim.angle), dy = Math.sin(aim.angle);
    var tipD = P.R + 8 + pull, len = 1450;
    var tip = toScreen(cp.x - dx * tipD, cp.y - dy * tipD);
    var butt = toScreen(cp.x - dx * (tipD + len), cp.y - dy * (tipD + len));
    var vx = butt.x - tip.x, vy = butt.y - tip.y, vl = Math.hypot(vx, vy);
    var ux = vx / vl, uy = vy / vl, nx = -uy, ny = ux;
    function seg(from, to, w0, w1, fill) {
      var a = { x: tip.x + ux * from * vl, y: tip.y + uy * from * vl };
      var b = { x: tip.x + ux * to * vl, y: tip.y + uy * to * vl };
      c.beginPath();
      c.moveTo(a.x + nx * w0, a.y + ny * w0); c.lineTo(b.x + nx * w1, b.y + ny * w1);
      c.lineTo(b.x - nx * w1, b.y - ny * w1); c.lineTo(a.x - nx * w0, a.y - ny * w0);
      c.closePath(); c.fillStyle = fill; c.fill();
    }
    var w0 = Math.max(1.6, 6.5 * s), w1 = Math.max(3, 14.5 * s);
    function w(t) { return w0 + (w1 - w0) * t; }
    c.save();
    c.shadowColor = 'rgba(0,0,0,0.45)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
    seg(0, 1, w(0), w(1), '#2b1a10');
    c.shadowColor = 'transparent';
    seg(0, 0.62, w(0), w(0.62), '#e6cf9f');
    seg(0.02, 0.62, w(0.02) * 0.45, w(0.62) * 0.45, 'rgba(255,255,255,0.18)');
    seg(0.62, 0.66, w(0.62), w(0.66), '#ef5a3f');
    seg(0.7, 0.9, w(0.7), w(0.9), '#151515');
    seg(0, 0.012, w(0), w(0.012), '#f4efe2');
    seg(0, 0.004, w(0), w(0.004), '#4f7fbf');
    c.restore();
    void r;
  }

  /* ─── Tekenlus ───────────────────────────────────────── */

  function requestDraw() {
    if (!rafId && !document.hidden) rafId = requestAnimationFrame(frame);
  }

  function frame(ts) {
    rafId = 0;
    if (paused) {
      // Offline pauze: niets loopt door, alleen het beeld wordt bijgewerkt.
      lastTs = null;
      draw();
      return;
    }
    var dt = lastTs === null ? 0 : (ts - lastTs) / 1000;
    lastTs = ts;
    var keep = false;

    if (tween) {
      var t = Math.min(1, (performance.now() - tween.start) / tween.dur);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      aim.angle = tween.from + angleDiff(tween.to, tween.from) * e;
      setPower(tween.p0 + (tween.p1 - tween.p0) * e, false);
      if (t >= 1) { var then = tween.then; tween = null; if (then) then(); }
      keep = true;
    }
    if (strike && !shot) {
      if (performance.now() - strike.start >= strike.dur) { var go = strike.then; strike = null; go(); }
      keep = true;
    }
    if (shot) {
      if (strike) strike = null;
      P.stepShot(shot, dt);
      playSounds();
      if (shot.done) endShot(); else keep = true;
    }
    draw();
    if (keep && !document.hidden) rafId = requestAnimationFrame(frame);
    else lastTs = null;
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      lastTs = null;
    } else {
      lastTs = null;
      requestDraw();
    }
  });

  function angleDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /* ─── Pauze (alleen offline) ─────────────────────────── */

  /*
   * Timers die bij een offline pauze stilstaan: de denktijd van de computer. Ze lopen na de pauze
   * verder met de tijd die nog over was, zodat er geen sprong ontstaat.
   */
  var pTimers = [];
  function later(fn, ms) {
    var t = { fn: fn, left: ms, start: performance.now(), id: 0 };
    function fire() {
      var i = pTimers.indexOf(t);
      if (i >= 0) pTimers.splice(i, 1);
      t.fn();
    }
    t.fire = fire;
    pTimers.push(t);
    if (!paused) t.id = window.setTimeout(fire, ms);
    return t;
  }
  function clearLaters() {
    pTimers.forEach(function (t) { if (t.id) window.clearTimeout(t.id); });
    pTimers = [];
  }

  function setPaused(on) {
    on = !!on;
    if (on === paused) return;
    var now = performance.now();
    if (on) {
      paused = true;
      pausedAt = now;
      pTimers.forEach(function (t) {
        if (t.id) { window.clearTimeout(t.id); t.id = 0; }
        t.left = Math.max(0, t.left - (now - t.start));
      });
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      lastTs = null;
    } else {
      paused = false;
      var d = now - pausedAt;
      if (strike) strike.start += d;
      if (tween) tween.start += d;
      pTimers.forEach(function (t) { t.start = now; t.id = window.setTimeout(t.fire, t.left); });
      lastTs = null;
      requestDraw();
    }
  }

  /* ─── Geluid (standaard uit) ─────────────────────────── */

  var audio = null, lastSound = { tik: 0, band: 0, pot: 0 };
  function audioCtx() {
    if (!audio) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { audio = new AC(); } catch (_) { return null; }
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }
  function blip(type, strength) {
    var level = prefs.volume / 100;
    if (!(level > 0)) return;
    var a = audioCtx(); if (!a) return;
    var now = a.currentTime;
    if (now - lastSound[type] < 0.03) return;
    lastSound[type] = now;
    var vol = Math.max(0.02, Math.min(0.5, strength));
    var o = a.createOscillator(), g = a.createGain();
    if (type === 'tik') { o.type = 'triangle'; o.frequency.setValueAtTime(2300, now); o.frequency.exponentialRampToValueAtTime(900, now + 0.04); }
    else if (type === 'band') { o.type = 'sine'; o.frequency.setValueAtTime(160, now); o.frequency.exponentialRampToValueAtTime(70, now + 0.08); vol *= 0.8; }
    else { o.type = 'sine'; o.frequency.setValueAtTime(120, now); o.frequency.exponentialRampToValueAtTime(45, now + 0.25); vol = 0.4; }
    vol = Math.max(0.001, vol * level);
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0008, now + (type === 'pot' ? 0.3 : 0.09));
    o.connect(g); g.connect(a.destination);
    o.start(now); o.stop(now + 0.32);
  }
  function playSounds() {
    if (!shot || !shot.sounds) return;
    var list = shot.sounds; shot.sounds = [];
    if (!prefs.sound) return;
    list.forEach(function (snd) {
      if (snd.t === 'tik') blip('tik', snd.v / 6000);
      else if (snd.t === 'band') blip('band', snd.v / 5000);
      else blip('pot', 1);
    });
  }

  /* ─── Aankondigen ────────────────────────────────────── */

  function ballLabel(n) {
    if (n === 8) return '8';
    return n + (n < 8 ? ' (vol)' : ' (half)');
  }

  function renderCallOptions() {
    var targets = state && state.phase === 'play' ? P.playerTargets(state, state.turn) : [];
    var cur = call.ball;
    el.doelbal.innerHTML = '';
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = targets.length ? 'Kies bal' : '–';
    el.doelbal.appendChild(o0);
    targets.forEach(function (n) {
      var o = document.createElement('option'); o.value = String(n); o.textContent = ballLabel(n);
      el.doelbal.appendChild(o);
    });
    el.doelbal.value = cur !== null && targets.indexOf(cur) >= 0 ? String(cur) : '';
  }

  function renderPocketOptions() {
    var cur = call.pocket;
    el.pocket.innerHTML = '';
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Kies pocket';
    el.pocket.appendChild(o0);
    P.POCKET_IDS.forEach(function (id) {
      var o = document.createElement('option'); o.value = id; o.textContent = pocketName(id);
      el.pocket.appendChild(o);
    });
    el.pocket.value = cur || '';
  }

  function callIsComplete() {
    if (!state) return false;
    if (state.phase === 'break') return true;
    if (call.safety) return true;
    return call.ball !== null && call.pocket !== null && P.isValidCall(state.groups, P.remainingOf(state), state.turn, { ball: call.ball, pocket: call.pocket });
  }

  function currentCall() {
    if (state.phase === 'break') return null;
    if (call.safety) return { safety: true };
    return { ball: call.ball, pocket: call.pocket };
  }

  /* Stel een aankondiging voor op basis van de richting, zolang de speler zelf niets koos. */
  function suggestCall() {
    if (!state || state.phase !== 'play' || call.manual || call.safety || ui !== 'aiming') return;
    var cp = cuePos(); if (!cp) return;
    var hit = P.castAim(state.balls, cp.x, cp.y, aim.angle);
    if (hit.type !== 'ball') return;
    var targets = P.playerTargets(state, state.turn);
    if (targets.indexOf(hit.ball) < 0) return;
    var b = P.ballByN(state.balls, hit.ball);
    var best = null, bd = 35 * Math.PI / 180;
    P.POCKETS.forEach(function (p) {
      var a = Math.atan2(p.aim.y - b.y, p.aim.x - b.x);
      var d = Math.abs(angleDiff(a, Math.atan2(hit.objDir.y, hit.objDir.x)));
      if (d < bd) { bd = d; best = p.id; }
    });
    call.ball = hit.ball;
    call.pocket = best;
    el.doelbal.value = String(hit.ball);
    el.pocket.value = best || '';
  }

  /* ─── Statusweergave ─────────────────────────────────── */

  function groupLabel(g) { return g === 'vol' ? 'Volle ballen · 1–7' : 'Halve ballen · 9–15'; }

  function renderPlayers() {
    var remaining = P.remainingOf(state);
    el.spelers.forEach(function (box, idx) {
      $('[data-naam]', box).textContent = state.names[idx] + (online && online.seat === idx ? ' (jij)' : '');
      var active = state.phase !== 'over' && state.turn === idx;
      box.classList.toggle('is-aan', active);
      var g = P.playerGroup(state, idx);
      var groep = $('[data-groep]', box);
      var list = $('[data-ballen]', box);
      list.innerHTML = '';
      if (groep.removeAttribute) groep.removeAttribute('title');
      if (!g) {
        groep.textContent = state.phase === 'break' ? (state.turn === idx ? 'Breekt' : 'Wacht op de break') : 'Open tafel';
        list.setAttribute('aria-label', 'Ballen van deze speler');
      } else {
        var own = (g === 'vol' ? [1, 2, 3, 4, 5, 6, 7] : [9, 10, 11, 12, 13, 14, 15]);
        var left = own.filter(function (n) { return remaining.indexOf(n) >= 0; }).length;
        var full = groupLabel(g) + (left ? ' · nog ' + left : ' · op de 8');
        // Kort op één regel naast de balletjes; de volledige tekst staat in title en aria-label.
        groep.textContent = '';
        var gn = document.createElement('span'); gn.className = 'pl-groep-naam'; gn.textContent = g === 'vol' ? 'Vol' : 'Half';
        var gx = document.createElement('span'); gx.className = 'pl-groep-extra'; gx.textContent = left ? ' · nog ' + left : ' · op de 8';
        groep.appendChild(gn); groep.appendChild(gx);
        groep.setAttribute('title', full);
        list.setAttribute('aria-label', full);
        // Op de 8: alleen de 8 tonen, de eigen groep is dan toch helemaal weg.
        (left ? own : [8]).forEach(function (n) {
          var li = document.createElement('li');
          li.className = 'pl-bal' + (n >= 9 ? ' is-half' : '') + (remaining.indexOf(n) < 0 ? ' is-weg' : '');
          li.style.setProperty('--kleur', COLORS[n]);
          li.setAttribute('aria-label', 'Bal ' + n + (remaining.indexOf(n) < 0 ? ', gepot' : ', op tafel'));
          var sp = document.createElement('span'); sp.textContent = String(n); sp.setAttribute('aria-hidden', 'true');
          li.appendChild(sp);
          list.appendChild(li);
        });
      }
    });
  }

  function statusText() {
    var name = state.names[state.turn];
    if (online && online.phase !== 'match') {
      if (online.phase === 'paused') return 'De partij staat stil tot je tegenstander terug is.';
      return 'Online: wachten tot de partij begint.';
    }
    if (state.phase === 'over') return state.names[state.winner] + ' wint de partij.';
    if (ui === 'shooting') return 'De ballen rollen…';
    if (ui === 'wacht') return 'Even wachten op de host…';
    if (ui === 'remote') {
      if (state.phase === 'choice') return state.names[state.choice.chooser] + ' kiest hoe het verder gaat…';
      return name + ' is aan de beurt' + (state.phase === 'break' ? ' en breekt…' : '…');
    }
    if (state.phase === 'choice') return name + (P.isCpu(state, state.turn) ? ' kiest hoe het verder gaat…' : ', kies hoe het verder gaat.');
    if (ui === 'cpu') return 'De computer is aan zet…';
    if (state.phase === 'break') {
      return ui === 'placing' ? name + ' breekt. Leg de witte bal achter de koplijn.' : name + ' breekt. Richt op het rek en kies je kracht.';
    }
    if (ui === 'placing') return 'Bal in hand voor ' + name + '. Leg de witte bal neer' + (state.ballInHand === 'kitchen' ? ' achter de koplijn.' : '.');
    var g = P.playerGroup(state, state.turn);
    var onEight = P.isOnEight(state.groups, P.remainingOf(state), state.turn) && g;
    return name + ' is aan de beurt' + (g ? (onEight ? ' en speelt op de 8.' : ' met de ' + (g === 'vol' ? 'volle' : 'halve') + '.') : '. De tafel is open.');
  }

  function callText() {
    if (ui === 'shooting' && online && online.animMsg) {
      var who = state.names[state.turn];
      if (call.safety) return who + ' speelt safety.';
      if (call.ball !== null && call.pocket) return who + ' kondigde ' + call.ball + ' aan in ' + pocketName(call.pocket) + '.';
      return '';
    }
    if (ui === 'remote' && online && online.phase === 'match') return 'Je kunt pas iets doen als je aan de beurt bent.';
    if (state.phase !== 'play' || (ui !== 'aiming' && ui !== 'cpu')) return '';
    if (call.safety) return 'Aangekondigd: safety.';
    if (call.ball !== null && call.pocket) return 'Aangekondigd: ' + call.ball + ' in ' + pocketName(call.pocket) + '.';
    if (ui === 'cpu') return '';
    return 'Kondig een bal en pocket aan, of kies Safety.';
  }

  var statusFout = null;
  function render() {
    if (!state) return;
    renderPlayers();
    el.status.textContent = statusFout || statusText();
    el.status.classList.toggle('is-fout', !!statusFout);

    var choiceShown = state.phase === 'choice' && ui === 'choice' && controlsLocal(state.choice ? state.choice.chooser : state.turn);
    el.keuze.hidden = !choiceShown;
    el.plaats.hidden = ui !== 'placing';
    el.stoot.hidden = choiceShown;
    // Bij bal in hand ligt het plaatspaneel over de stootrij heen; die blijft onzichtbaar staan zodat
    // de bediening even hoog blijft en de tafel niet verspringt.
    el.stoot.classList.toggle('is-verborgen', ui === 'placing');

    var canAim = ui === 'aiming';
    var isBreak = state.phase === 'break';
    el.call.disabled = !canAim || isBreak;
    el.doelbal.disabled = !canAim || isBreak || call.safety;
    el.pocket.disabled = !canAim || isBreak || call.safety;
    el.safety.disabled = !canAim || isBreak;
    el.safety.setAttribute('aria-pressed', call.safety ? 'true' : 'false');
    el.kracht.disabled = !canAim;
    el.verplaats.hidden = !(canAim && state.ballInHand);
    el.canvas.classList.toggle('is-wacht', ui === 'cpu' || ui === 'shooting' || ui === 'remote' || ui === 'wacht' || ui === 'idle');
    renderOnlineBits();
    el.canvas.classList.toggle('is-plaats', ui === 'placing');
    syncAimControls();
    requestDraw();
  }

  /*
   * Wat bij elke richtingswijziging meteen moet kloppen: de aankondigingsregel, of Stoot mag, en het
   * richtingslabel van de tafel. Licht genoeg voor elke muisbeweging; de spelerpanelen blijven staan.
   */
  function syncAimControls() {
    if (!state) return;
    el.callRegel.textContent = callText();
    el.stootKnop.disabled = ui !== 'aiming' || !callIsComplete();
    el.canvas.setAttribute('aria-label', canvasLabel());
  }

  function canvasLabel() {
    if (ui === 'placing') return 'Pooltafel. Bal in hand: pijltjes verplaatsen de witte bal, Enter of spatie bevestigt.';
    if (ui === 'aiming') return 'Pooltafel. Richting ' + Math.round(((aim.angle * 180 / Math.PI) % 360 + 360) % 360) + ' graden, kracht ' + power + ' procent. Pijltjes richten en kracht, spatie stoot.';
    return 'Pooltafel';
  }

  function announce(text) {
    el.aankondiging.textContent = '';
    window.setTimeout(function () { el.aankondiging.textContent = text; }, 30);
  }

  /* ─── Partijverloop ──────────────────────────────────── */

  function newGame(mode) {
    cpuToken++;
    clearLaters();
    tween = null; strike = null; shot = null; pointer = null;
    prefs.mode = mode || prefs.mode;
    bewaarPrefs();
    state = P.newGame({ mode: prefs.mode, breaker: breakerNext });
    breakerNext = 1 - breakerNext;
    el.winst.hidden = true;
    updateModusKnoppen();
    announce('Nieuwe partij. ' + state.names[state.turn] + ' breekt.');
    nextTurn();
  }

  function updateModusKnoppen() {
    var cur = online ? 'online' : prefs.mode;
    el.modusKnoppen.forEach(function (b) {
      var on = b.getAttribute('data-modus-knop') === cur;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }

  /* Bedient dit apparaat speler idx? Online alleen de eigen stoel, offline elke speler behalve de computer. */
  function controlsLocal(idx) {
    if (online) return online.phase === 'match' && online.seat === idx;
    return !P.isCpu(state, idx);
  }

  function resetCall() {
    call = { ball: null, pocket: null, safety: false, manual: false };
    statusFout = null;
  }

  function defaultAim() {
    var cue = state.balls[0];
    var targets = state.phase === 'break' ? P.onTableObjects(state.balls) : P.playerTargets(state, state.turn);
    var best = null, bd = Infinity;
    targets.forEach(function (n) {
      var b = P.ballByN(state.balls, n);
      var d = state.phase === 'break' ? Math.hypot(b.x - P.FOOT_X, b.y - P.MID_Y) : Math.hypot(b.x - cue.x, b.y - cue.y);
      if (d < bd) { bd = d; best = b; }
    });
    if (best) aim.angle = Math.atan2(best.y - cue.y, best.x - cue.x);
    aim.locked = false;
  }

  function nextTurn() {
    resetCall();
    renderCallOptions();
    if (state.phase === 'over') {
      ui = 'over';
      showWinner();
      render();
      return;
    }
    if (online) {
      // Online: alleen de eigen stoel speelt; de rest is kijken naar wat de host stuurt.
      var mover = state.phase === 'choice' ? state.choice.chooser : state.turn;
      if (online.phase !== 'match') { ui = 'idle'; render(); return; }
      if (mover !== online.seat) { ui = 'remote'; render(); return; }
      if (online.pending) { ui = 'wacht'; render(); return; }
    }
    if (state.phase === 'choice') {
      ui = 'choice';
      if (P.isCpu(state, state.choice.chooser)) {
        var tok = ++cpuToken;
        render();
        later(function () {
          if (tok !== cpuToken || cpuPaused) return;
          var opt = Bot.chooseOption(state);
          doChoice(opt);
        }, reduceMotion ? 300 : 1100);
      } else {
        showChoice();
        render();
      }
      return;
    }
    if (P.isCpu(state, state.turn)) {
      cpuTurn();
      return;
    }
    if (state.ballInHand && !(online && online.placed)) {
      ui = 'placing';
      preview = { x: state.balls[0].x, y: state.balls[0].y };
      updatePlaceText();
    } else {
      ui = 'aiming';
      defaultAim();
    }
    if (ui === 'aiming') suggestCall();
    render();
  }

  function showChoice() {
    var ch = state.choice;
    var name = state.names[ch.chooser];
    var titles = {
      ongeldigeBreak: 'Ongeldige break',
      breakFout: 'Fout op de break',
      achtBreak: 'De 8 viel op de break',
      achtBreakFout: 'De 8 viel op de break, met een fout'
    };
    var texts = {
      ongeldigeBreak: 'Er viel niets en minder dan vier ballen raakten een band. ' + name + ' kiest:',
      breakFout: 'De break was een fout. ' + name + ' kiest:',
      achtBreak: name + ' brak en pootte de 8 zonder fout. ' + name + ' kiest:',
      achtBreakFout: 'De 8 viel en de break was een fout. ' + name + ' kiest:'
    };
    el.keuzeTitel.textContent = titles[ch.type] || 'Keuze';
    el.keuzeTekst.textContent = texts[ch.type] || name + ' kiest:';
    el.keuzeKnoppen.innerHTML = '';
    ch.options.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pl-knop ' + (i === 0 ? 'pl-knop-koraal' : 'pl-knop-rand');
      b.textContent = P.CHOICE_TEXT[opt] || opt;
      b.setAttribute('data-keuze-optie', opt);
      b.addEventListener('click', function () { doChoice(opt); });
      el.keuzeKnoppen.appendChild(b);
    });
    announce(el.keuzeTitel.textContent + '. ' + el.keuzeTekst.textContent + ' ' + ch.options.map(function (o) { return P.CHOICE_TEXT[o]; }).join(', of ') + '.');
    window.setTimeout(function () {
      var first = el.keuzeKnoppen.querySelector('button');
      if (first && !el.keuze.hidden) first.focus();
    }, 50);
  }

  function doChoice(opt) {
    if (!state || state.phase !== 'choice') return;
    if (online) {
      if (ui !== 'choice' || state.choice.options.indexOf(opt) < 0) return;
      var hadF = el.keuze.contains(document.activeElement);
      submitOnline({ type: 'choice', opt: opt });
      if (hadF) el.canvas.focus({ preventScroll: true });
      return;
    }
    var chooser = state.choice.chooser;
    state = P.applyChoice(state, opt);
    announce(state.names[chooser] + ' kiest: ' + (P.CHOICE_TEXT[opt] || opt).toLowerCase() + '.');
    var hadFocus = el.keuze.contains(document.activeElement);
    nextTurn();
    if (hadFocus) el.canvas.focus({ preventScroll: true });
  }

  function showWinner() {
    var w = state.winner;
    var cpuGame = state.mode === 'cpu' && !online;
    if (online) el.winstTitel.textContent = w === online.seat ? 'Jij wint!' : state.names[w] + ' wint';
    else el.winstTitel.textContent = cpuGame ? (w === 0 ? 'Jij wint!' : 'De computer wint') : state.names[w] + ' wint!';
    var reason = state.last && state.last.outcome ? P.describeOutcome(state.last.outcome, state, pocketName)[0] : '';
    el.winstTekst.textContent = reason;
    el.winst.hidden = false;
    renderWinnerButtons();
    if (!layerOpen()) window.setTimeout(function () { if (!el.winst.hidden && !layerOpen()) el.opnieuw.focus({ preventScroll: true }); }, 60);
  }

  /* De knoppen op de winnaarkaart: offline direct opnieuw, online pas als beide akkoord zijn. */
  function renderWinnerButtons() {
    if (!online) {
      el.opnieuw.textContent = 'Opnieuw spelen';
      el.opnieuw.disabled = false;
      el.winstVerlaat.hidden = true;
      return;
    }
    var me = online.seat, other = 1 - me;
    var otherName = online.players[other] || 'je tegenstander';
    el.winstVerlaat.hidden = false;
    el.winstVerlaat.textContent = online.role === 'host' ? 'Kamer sluiten' : 'Kamer verlaten';
    if (online.ready[me]) {
      el.opnieuw.textContent = 'Wacht op ' + otherName + '…';
      el.opnieuw.disabled = true;
    } else {
      el.opnieuw.textContent = online.ready[other] ? 'Ja, nog een partij' : 'Nog een partij';
      el.opnieuw.disabled = false;
    }
    if (online.ready[other] && !online.ready[me]) el.winstTekst.textContent = otherName + ' wil nog een partij.';
  }

  function placementCheck(x, y) {
    var others = state.balls.filter(function (b) { return b.n !== 0; });
    return P.validateCuePlacement(others, x, y, state.ballInHand);
  }

  var PLACE_TEXT = {
    buiten: 'Die plek ligt niet op het speelvlak.',
    koplijn: 'Bij deze bal in hand moet de witte bal achter de koplijn liggen, niet erop.',
    overlap: 'Daar ligt al een bal.'
  };

  function updatePlaceText() {
    if (!preview) return;
    var chk = placementCheck(preview.x, preview.y);
    el.plaatsTekst.textContent = chk.ok
      ? (state.ballInHand === 'kitchen' ? 'Bal in hand achter de koplijn. Sleep of klik om te verplaatsen en bevestig.' : 'Bal in hand: overal op tafel. Sleep of klik om te verplaatsen en bevestig.')
      : PLACE_TEXT[chk.reason];
    el.plaatsTekst.classList.toggle('is-fout', !chk.ok);
    el.plaatsOk.disabled = !chk.ok;
  }

  function confirmPlacement() {
    if (ui !== 'placing' || !preview) return;
    var r = P.placeCue(state, preview.x, preview.y);
    if (!r.ok) { updatePlaceText(); announce(PLACE_TEXT[r.reason]); return; }
    if (online) {
      submitOnline({ type: 'place', x: preview.x, y: preview.y });
      el.canvas.focus({ preventScroll: true });
      return;
    }
    state = r.state;
    ui = 'aiming';
    defaultAim();
    suggestCall();
    announce('Witte bal ligt. Richt en stoot.');
    render();
    el.canvas.focus({ preventScroll: true });
  }

  function shoot() {
    if (ui !== 'aiming') return;
    if (!callIsComplete()) {
      statusFout = 'Kondig eerst een bal en een pocket aan, of kies Safety.';
      render();
      announce(statusFout);
      return;
    }
    var shotCall = currentCall();
    var speed = speedFromPower(power);
    // De Stoot-knop wordt zo uitgeschakeld; houd de focus op de tafel zodat het toetsenbord blijft werken.
    if (document.activeElement === el.stootKnop) el.canvas.focus({ preventScroll: true });
    if (online) {
      // Eerst lokaal controleren (zelfde engine), dan als verzoek naar de host. Die rekent de stoot uit.
      try { P.beginShot(state, { angle: aim.angle, speed: speed, call: shotCall }); } catch (e) { statusFout = e.message; render(); return; }
      submitOnline({ type: 'shoot', angle: normAngle(aim.angle), speed: speed, call: shotCall });
      return;
    }
    startShot(aim.angle, speed, shotCall);
  }

  function normAngle(a) {
    var t = a % (2 * Math.PI);
    if (t > Math.PI) t -= 2 * Math.PI;
    if (t < -Math.PI) t += 2 * Math.PI;
    return t;
  }

  function startShot(angle, speed, shotCall) {
    var ctx;
    try {
      ctx = P.beginShot(state, { angle: angle, speed: speed, call: shotCall });
    } catch (e) {
      statusFout = e.message;
      render();
      return false;
    }
    playShot(ctx, angle);
    return true;
  }

  /* Speel een begonnen stoot af: eerst de keu, dan de ballen. */
  function playShot(ctx, angle) {
    ctx.sounds = [];
    statusFout = null;
    ui = 'shooting';
    aim.angle = angle;
    var run = function () { shot = ctx; lastTs = null; render(); };
    if (reduceMotion) run();
    else { strike = { start: performance.now(), dur: 110, then: run }; render(); }
  }

  function endShot() {
    if (online && online.animMsg) { endOnlineShot(); return; }
    var r = P.finishShot(shot);
    shot = null;
    state = r.state;
    var lines = P.describeOutcome(r.outcome, state, pocketName);
    announce(lines.join(' '));
    nextTurn();
    showFoulBriefly(r.outcome, lines);
  }

  function showFoulBriefly(outcome, lines) {
    if (ui !== 'over' && lines.length && outcome && outcome.foul) {
      // Toon het belangrijkste kort in de statusregel als het een fout was.
      statusFout = lines[0];
      render();
      window.setTimeout(function () { if (statusFout === lines[0]) statusFout = null; if (state) render(); }, 3800);
    }
  }

  /* ─── Computerbeurt ──────────────────────────────────── */

  function cpuTurn() {
    ui = 'cpu';
    var tok = ++cpuToken;
    render();
    later(function () {
      if (tok !== cpuToken || cpuPaused) return;
      var plan;
      try { plan = Bot.planTurn(state, { noise: 0.006 }); } catch (e) { plan = null; }
      if (!plan) { plan = { place: null, angle: 0, speed: 3000, call: state.phase === 'break' ? null : { safety: true } }; }
      var afterPlace = function () {
        if (tok !== cpuToken) return;
        if (plan.call) {
          call.safety = !!plan.call.safety;
          call.ball = plan.call.safety ? null : plan.call.ball;
          call.pocket = plan.call.safety ? null : plan.call.pocket;
          renderCallOptions();
          el.pocket.value = call.pocket || '';
          if (!call.safety) announce('De computer kondigt ' + call.ball + ' aan in ' + pocketName(call.pocket) + '.');
          else announce('De computer speelt safety.');
        }
        render();
        var from = aim.angle;
        tween = {
          start: performance.now(), dur: reduceMotion ? 1 : 700, from: from, to: plan.angle,
          p0: power, p1: powerFromSpeed(plan.speed),
          then: function () {
            if (tok !== cpuToken) return;
            later(function () {
              if (tok !== cpuToken) return;
              if (!startShot(plan.angle, plan.speed, state.phase === 'break' ? null : plan.call)) {
                // Mocht de plaatsing of aankondiging toch ongeldig zijn: veilige noodstoot.
                var em = Bot.planTurn(state, { noise: 0, verify: false });
                if (!startShot(em.angle, em.speed, state.phase === 'break' ? null : (em.call || { safety: true }))) {
                  startShot(em.angle, 3000, state.phase === 'break' ? null : { safety: true });
                }
              }
            }, reduceMotion ? 50 : 250);
          }
        };
        requestDraw();
      };
      if (plan.place && state.ballInHand) {
        var r = P.placeCue(state, plan.place.x, plan.place.y);
        if (r.ok) state = r.state;
        else {
          var spot = P.findFreeSpot(state.balls.filter(function (b) { return b.n !== 0; }), state.ballInHand);
          if (spot) { var r2 = P.placeCue(state, spot.x, spot.y); if (r2.ok) state = r2.state; }
        }
        render();
        later(afterPlace, reduceMotion ? 50 : 450);
      } else {
        afterPlace();
      }
    }, reduceMotion ? 200 : 800);
  }

  /* ─── Bevestigen (nieuwe partij, moduswissel) ────────── */

  var bevestigActie = null, bevestigTerug = null;
  function vraagBevestiging(tekst, actie, terug) {
    bevestigActie = actie; bevestigTerug = terug || document.activeElement;
    el.bevestigTekst.textContent = tekst;
    el.bevestig.hidden = false;
    el.bevestigJa.focus();
  }
  function sluitBevestiging(uitvoeren) {
    if (el.bevestig.hidden) return;
    el.bevestig.hidden = true;
    var actie = bevestigActie, terug = bevestigTerug;
    bevestigActie = bevestigTerug = null;
    if (uitvoeren && actie) { actie(); if (!layerOpen()) el.canvas.focus({ preventScroll: true }); }
    else if (terug && terug.focus) terug.focus();
  }
  el.bevestigJa.addEventListener('click', function () { sluitBevestiging(true); });
  el.bevestigNee.addEventListener('click', function () { sluitBevestiging(false); });
  el.bevestig.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); sluitBevestiging(false); }
  });

  function partijLoopt() {
    return state && state.phase !== 'over' && (state.shots > 0 || state.phase === 'choice');
  }

  /* Nieuwe partij: offline direct (met bevestiging als er een loopt), online alleen als beide akkoord zijn. */
  function vraagNieuwePartij(knop) {
    if (online) { vraagOnlineNieuw(knop); return; }
    if (partijLoopt()) vraagBevestiging('De partij die nu loopt stopt en er wordt opnieuw gerekt.', function () { newGame(); }, knop);
    else newGame();
  }
  el.nieuw.addEventListener('click', function () { vraagNieuwePartij(el.nieuw); });
  el.opnieuw.addEventListener('click', function () {
    if (online) { setOnlineReady(true); return; }
    newGame(); el.canvas.focus({ preventScroll: true });
  });
  el.winstVerlaat.addEventListener('click', function () { verlaatOnline(el.winstVerlaat); });

  var MODE_TEXT = { cpu: 'tegen de computer', duo: 'twee spelers op één scherm', online: 'online' };
  function kiesModus(mode, knop) {
    if (mode === 'online') { openOnline(knop); return; }
    if (mode !== 'cpu' && mode !== 'duo') return;
    if (online) {
      verlaatOnline(knop, mode);
      return;
    }
    if (mode === prefs.mode) return;
    if (partijLoopt()) {
      vraagBevestiging('Je wisselt naar ' + MODE_TEXT[mode] + '. De partij die nu loopt stopt.', function () { newGame(mode); }, knop);
    } else newGame(mode);
  }
  el.modusKnoppen.forEach(function (b, i) {
    b.addEventListener('click', function () { kiesModus(b.getAttribute('data-modus-knop'), b); });
    b.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (dir) {
        e.preventDefault();
        var n = el.modusKnoppen.length;
        var other = el.modusKnoppen[(i + dir + n) % n];
        other.focus();
        kiesModus(other.getAttribute('data-modus-knop'), other);
      }
    });
  });

  /* ─── Bediening: knoppen en velden ───────────────────── */

  /* Geluid: één bron (prefs.sound), zichtbaar op de knop in de kop en in de instellingen. */
  function setSound(on, preview) {
    prefs.sound = !!on;
    bewaarPrefs();
    el.geluid.classList.toggle('is-aan', prefs.sound);
    el.geluid.setAttribute('aria-pressed', prefs.sound ? 'true' : 'false');
    el.setGeluid.checked = prefs.sound;
    el.setVolume.disabled = !prefs.sound;
    renderSettingsNote();
    if (prefs.sound && preview) { audioCtx(); blip('tik', 0.2); }
  }
  el.geluid.addEventListener('click', function () { setSound(!prefs.sound, true); });

  el.kracht.addEventListener('input', function () { setPower(+el.kracht.value, true); el.canvas.setAttribute('aria-label', canvasLabel()); });

  el.doelbal.addEventListener('change', function () {
    call.ball = el.doelbal.value === '' ? null : +el.doelbal.value;
    call.manual = true; statusFout = null;
    render();
  });
  el.pocket.addEventListener('change', function () {
    call.pocket = el.pocket.value || null;
    call.manual = true; statusFout = null;
    render();
  });
  el.safety.addEventListener('click', function () {
    call.safety = !call.safety;
    call.manual = true; statusFout = null;
    if (!call.safety) suggestCall();
    render();
    announce(call.safety ? 'Safety aangekondigd.' : 'Safety uit. Kondig een bal en pocket aan.');
  });
  el.stootKnop.addEventListener('click', shoot);
  el.plaatsOk.addEventListener('click', confirmPlacement);
  el.verplaats.addEventListener('click', function () {
    if (ui !== 'aiming' || !state.ballInHand) return;
    ui = 'placing';
    preview = { x: state.balls[0].x, y: state.balls[0].y };
    updatePlaceText();
    render();
    el.canvas.focus({ preventScroll: true });
  });

  /* ─── Aanwijzen op de tafel ──────────────────────────── */

  function eventPoint(e) {
    var rect = el.canvas.getBoundingClientRect();
    return { sx: e.clientX - rect.left, sy: e.clientY - rect.top };
  }

  function hitTest(sx, sy, coarse) {
    var w = toWorld(sx, sy);
    var tol = Math.max(P.R * 1.25, (coarse ? 20 : 9) / view.s);
    var best = null, bd = Infinity;
    state.balls.forEach(function (b) {
      if (!b.on || b.n === 0) return;
      var d = Math.hypot(b.x - w.x, b.y - w.y);
      if (d < tol && d < bd) { bd = d; best = { type: 'ball', n: b.n }; }
    });
    if (best) return best;
    P.POCKETS.forEach(function (p) {
      var d = Math.hypot(p.x - w.x, p.y - w.y);
      if (d < Math.max(p.r + 40, (coarse ? 26 : 14) / view.s + p.r) && d < bd) { bd = d; best = { type: 'pocket', id: p.id }; }
    });
    return best;
  }

  function aimAt(sx, sy) {
    var cp = cuePos(); if (!cp) return;
    var w = toWorld(sx, sy);
    if (Math.hypot(w.x - cp.x, w.y - cp.y) < 1) return;
    aim.angle = Math.atan2(w.y - cp.y, w.x - cp.x);
    suggestCall();
    syncAimControls();
    requestDraw();
  }

  function movePreview(sx, sy) {
    var w = toWorld(sx, sy);
    var m = P.R;
    preview = { x: Math.max(m, Math.min(P.W - m, w.x)), y: Math.max(m, Math.min(P.H - m, w.y)) };
    updatePlaceText();
    requestDraw();
  }

  function selectFromHit(hit) {
    if (!hit || state.phase !== 'play') return false;
    if (hit.type === 'ball') {
      var targets = P.playerTargets(state, state.turn);
      if (targets.indexOf(hit.n) < 0) {
        statusFout = 'Bal ' + hit.n + ' mag je nu niet aankondigen.';
        render();
        window.setTimeout(function () { statusFout = null; if (state) render(); }, 2200);
        return true;
      }
      call.ball = hit.n; call.safety = false; call.manual = true; statusFout = null;
      el.doelbal.value = String(hit.n);
      render();
      announce('Aangekondigd: bal ' + hit.n + (call.pocket ? ' in ' + pocketName(call.pocket) : '') + '.');
      return true;
    }
    if (hit.type === 'pocket') {
      call.pocket = hit.id; call.safety = false; call.manual = true; statusFout = null;
      el.pocket.value = hit.id;
      render();
      announce('Pocket ' + pocketName(hit.id) + ' gekozen.');
      return true;
    }
    return false;
  }

  el.canvas.addEventListener('pointerdown', function (e) {
    if (!state || layerOpen() || (ui !== 'aiming' && ui !== 'placing')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var pt = eventPoint(e);
    pointer = { id: e.pointerId, type: e.pointerType, sx: pt.sx, sy: pt.sy, moved: false, angleBefore: aim.angle, previewBefore: preview ? { x: preview.x, y: preview.y } : null };
    try { el.canvas.setPointerCapture(e.pointerId); } catch (_) { /* oudere browsers */ }
    if (ui === 'placing') movePreview(pt.sx, pt.sy);
    e.preventDefault();
  });

  el.canvas.addEventListener('pointermove', function (e) {
    if (!state || layerOpen()) return;
    var pt = eventPoint(e);
    if (pointer && pointer.id === e.pointerId) {
      if (Math.hypot(pt.sx - pointer.sx, pt.sy - pointer.sy) > 8) pointer.moved = true;
      if (ui === 'placing') movePreview(pt.sx, pt.sy);
      else if (ui === 'aiming' && pointer.moved) { aim.locked = false; aimAt(pt.sx, pt.sy); }
      return;
    }
    if (e.pointerType === 'mouse') {
      hover = toWorld(pt.sx, pt.sy);
      if (ui === 'placing') movePreview(pt.sx, pt.sy);
      else if (ui === 'aiming' && !aim.locked) aimAt(pt.sx, pt.sy);
    }
  });

  el.canvas.addEventListener('pointerup', function (e) {
    if (!pointer || pointer.id !== e.pointerId) return;
    var p = pointer; pointer = null;
    var pt = eventPoint(e);
    if (ui === 'placing') { movePreview(pt.sx, pt.sy); return; }
    if (ui !== 'aiming') return;
    if (!p.moved) {
      var hit = hitTest(pt.sx, pt.sy, p.type !== 'mouse');
      if (selectFromHit(hit)) {
        aim.angle = p.angleBefore;
        requestDraw();
        return;
      }
      if (p.type === 'mouse') {
        aim.locked = !aim.locked;
        if (!aim.locked) aimAt(pt.sx, pt.sy);
        announce(aim.locked ? 'Richting vastgezet.' : 'Richten met de muis.');
        el.callRegel.textContent = callText();
      } else {
        aimAt(pt.sx, pt.sy);
      }
    } else if (p.type === 'mouse') {
      aim.locked = true;
    }
    render();
  });

  el.canvas.addEventListener('pointercancel', function (e) {
    if (!pointer || pointer.id !== e.pointerId) return;
    var p = pointer; pointer = null;
    aim.angle = p.angleBefore;
    if (ui === 'placing' && p.previewBefore) { preview = p.previewBefore; updatePlaceText(); }
    requestDraw();
  });

  el.canvas.addEventListener('pointerleave', function () { hover = null; });

  /* ─── Toetsenbord ────────────────────────────────────── */

  // Alleen als de tafel de focus heeft: zo blijven pijltjes elders gewoon de pagina scrollen.
  function keyTarget(e) { return e.target === el.canvas; }

  document.addEventListener('keydown', function (e) {
    if (!state || layerOpen() || !keyTarget(e) || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (ui === 'placing') {
      var step = e.shiftKey ? 2 : 12;
      var sd = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (sd) {
        e.preventDefault();
        var wv = screenVecToWorld(sd[0] * step, sd[1] * step);
        preview = { x: Math.max(P.R, Math.min(P.W - P.R, preview.x + wv.x)), y: Math.max(P.R, Math.min(P.H - P.R, preview.y + wv.y)) };
        updatePlaceText(); requestDraw();
        return;
      }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); confirmPlacement(); }
      return;
    }
    if (ui !== 'aiming') {
      if (k === ' ' && e.target === el.canvas) e.preventDefault();
      return;
    }
    var deg = Math.PI / 180;
    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      e.preventDefault();
      aim.angle += (k === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 0.1 : 1) * deg;
      aim.locked = true;
      suggestCall(); render();
    } else if (k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault();
      setPower(power + (k === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 1 : 5), true);
      render();
    } else if (k === ' ' || k === 'Enter') {
      e.preventDefault();
      shoot();
    }
  });

  /* ─── Lagen: menu, hulp, instellingen, speelwijze, online ─── */

  /*
   * Eén laag over de hele pagina met daarin steeds één paneel. Zolang hij open is, zijn kop, spel en
   * voet inert (geen klik, geen focus, geen toets) en staat het spel offline stil. Online loopt de
   * partij door: de host blijft acties van de gast verwerken, ook met het menu open.
   */
  var layerStack = [];
  var layerReturn = null;

  function layerOpen() { return layerStack.length > 0; }
  function topLayer() { return layerStack.length ? layerStack[layerStack.length - 1] : null; }

  function isVisible(n) {
    if (!n) return false;
    if (typeof n.getClientRects !== 'function') return true;
    return n.getClientRects().length > 0;
  }

  function showPanel(name) {
    Object.keys(el.panelen).forEach(function (k) { if (el.panelen[k]) el.panelen[k].hidden = k !== name; });
  }

  function setInert(on) {
    [el.bar, el.main, el.voet].forEach(function (n) {
      if (!n) return;
      n.inert = on;
      if (on) n.setAttribute('aria-hidden', 'true'); else n.removeAttribute('aria-hidden');
    });
  }

  function updatePause() { setPaused(layerOpen() && !online); }

  function openLayer(name, from) {
    if (!el.panelen[name]) return;
    if (!layerOpen()) {
      layerReturn = from || document.activeElement;
      if (pointer) { pointer = null; }
      el.laag.hidden = false;
      setInert(true);
    }
    if (topLayer() !== name) {
      var i = layerStack.indexOf(name);
      if (i >= 0) layerStack.splice(i, 1);
      layerStack.push(name);
    }
    showPanel(name);
    onPanelShown(name);
    updatePause();
    focusPanel(name);
  }

  function backLayer() {
    layerStack.pop();
    if (!layerStack.length) { closeLayers(); return; }
    var name = topLayer();
    showPanel(name);
    onPanelShown(name);
    focusPanel(name);
  }

  function closeLayers(noFocus) {
    var was = layerOpen() || !el.laag.hidden;
    layerStack = [];
    el.laag.hidden = true;
    showPanel(null);
    setInert(false);
    updatePause();
    var back = layerReturn;
    layerReturn = null;
    if (was && !noFocus) {
      if (back && back.focus && back !== document.body && isVisible(back) && !back.disabled) back.focus({ preventScroll: true });
      else el.canvas.focus({ preventScroll: true });
    }
    if (state) render();
  }

  function focusPanel(name) {
    var target = null;
    if (name === 'online') target = onlineFocusTarget();
    else if (el.panelen[name]) target = el.panelen[name].querySelector('[data-autofocus]');
    window.setTimeout(function () {
      if (topLayer() !== name || !target || !target.focus) return;
      target.focus({ preventScroll: true });
    }, 30);
  }

  function onPanelShown(name) {
    if (name === 'menu') {
      el.menuNoot.textContent = online
        ? 'Online loopt de partij door terwijl dit menu open is: je tegenstander kan gewoon verder.'
        : 'Het spel staat stil zolang dit menu open is.';
      el.menuVerlaat.hidden = !online;
      el.menuVerlaat.textContent = online && online.role === 'host' ? 'Kamer sluiten' : 'Kamer verlaten';
      el.menuNieuw.textContent = online ? 'Nieuwe partij voorstellen' : 'Nieuwe partij';
      renderFs();
    } else if (name === 'instellingen') {
      syncSettings();
    } else if (name === 'speelwijze') {
      var cur = online ? 'online' : prefs.mode;
      $$('[data-speelwijze]', el.panelen.speelwijze).forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-speelwijze') === cur ? 'true' : 'false');
      });
    }
  }

  function escLayer() {
    if (topLayer() === 'online') onlineEsc();
    else backLayer();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (e.defaultPrevented || !el.bevestig.hidden) return;
    e.preventDefault();
    if (layerOpen()) escLayer();
    else openLayer('menu', document.activeElement);
  });

  // Tab blijft binnen het open paneel (ook in browsers zonder inert).
  el.laag.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var panel = el.panelen[topLayer()];
    if (!panel) return;
    var list = $$('button, [href], input, select, textarea', panel).filter(function (n) { return !n.disabled && isVisible(n); });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Klik naast een paneel sluit het (niet het onlinepaneel: daar kan een verbinding lopen).
  el.laag.addEventListener('click', function (e) {
    if (e.target === el.laag && topLayer() !== 'online') closeLayers();
  });

  el.menuKnop.addEventListener('click', function () { openLayer('menu', el.menuKnop); });
  el.hulpKnop.addEventListener('click', function () { openLayer('hulp', el.hulpKnop); });
  $$('[data-laag-terug]').forEach(function (b) { b.addEventListener('click', backLayer); });
  $$('[data-laag-sluit]').forEach(function (b) { b.addEventListener('click', function () { closeLayers(); }); });

  $$('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () {
      var what = b.getAttribute('data-menu');
      if (what === 'hervat') closeLayers();
      else if (what === 'hulp' || what === 'instellingen' || what === 'speelwijze') openLayer(what);
      else if (what === 'nieuw') { closeLayers(true); vraagNieuwePartij(el.nieuw); }
      else if (what === 'volledig') toggleFs();
      else if (what === 'verlaat') { closeLayers(true); verlaatOnline(el.menuKnop); }
    });
  });

  $$('[data-speelwijze]').forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.getAttribute('data-speelwijze');
      if (mode === 'online') { layerStack = layerStack.filter(function (n) { return n === 'menu'; }); openOnline(); return; }
      closeLayers(true);
      kiesModus(mode, el.menuKnop);
      if (!layerOpen() && el.bevestig.hidden) el.canvas.focus({ preventScroll: true });
    });
  });

  $$('[data-hulp-regels]').forEach(function (b) {
    b.addEventListener('click', function () {
      closeLayers(true);
      el.regels.open = true;
      if (el.regels.scrollIntoView) el.regels.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      var sum = el.regels.querySelector('summary');
      if (sum && sum.focus) sum.focus({ preventScroll: true });
    });
  });

  /* ─── Instellingen ───────────────────────────────────── */

  function renderSettingsNote() {
    el.setNoot.textContent = prefsSaved
      ? 'Je instellingen worden in deze browser bewaard.'
      : 'Opslaan lukt niet in deze browser. Je instellingen gelden tot je de pagina sluit.';
  }

  function syncSettings() {
    el.setNaam.value = prefs.name;
    el.setGeluid.checked = prefs.sound;
    el.setVolume.value = String(prefs.volume);
    el.setVolume.disabled = !prefs.sound;
    el.setVolumeWaarde.textContent = prefs.volume + '%';
    el.setRichtlijn.checked = prefs.guide;
    renderSettingsNote();
  }

  function bewaarNaam(v) {
    prefs.name = cleanName(v);
    bewaarPrefs();
    el.setNaam.value = prefs.name;
    if (el.onNaam.value !== prefs.name) el.onNaam.value = prefs.name;
    renderSettingsNote();
  }

  el.setNaam.addEventListener('change', function () { bewaarNaam(el.setNaam.value); });
  el.setGeluid.addEventListener('change', function () { setSound(el.setGeluid.checked, true); });
  el.setVolume.addEventListener('input', function () {
    var v = Math.max(0, Math.min(100, Math.round(+el.setVolume.value)));
    if (!isFinite(v)) return;
    prefs.volume = v;
    el.setVolumeWaarde.textContent = v + '%';
  });
  el.setVolume.addEventListener('change', function () {
    bewaarPrefs();
    renderSettingsNote();
    if (prefs.sound) blip('tik', 0.25);
  });
  el.setRichtlijn.addEventListener('change', function () {
    prefs.guide = !!el.setRichtlijn.checked;
    bewaarPrefs();
    renderSettingsNote();
    requestDraw();
  });

  /* ─── Volledig scherm ────────────────────────────────── */

  var docEl = document.documentElement;
  function fsSupported() {
    return !!((document.fullscreenEnabled || document.webkitFullscreenEnabled) &&
      (docEl.requestFullscreen || docEl.webkitRequestFullscreen));
  }
  function fsActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function renderFs() {
    var ok = fsSupported();
    el.menuVolledig.hidden = !ok;
    if (!ok) return;
    var on = fsActive();
    el.menuVolledig.textContent = on ? 'Volledig scherm uit' : 'Volledig scherm';
    el.menuVolledig.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function toggleFs() {
    var p;
    try {
      if (fsActive()) p = (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else p = (docEl.requestFullscreen || docEl.webkitRequestFullscreen).call(docEl);
    } catch (_) {
      toonBalk('Volledig scherm lukte niet in deze browser.');
      return;
    }
    if (p && typeof p.then === 'function') p.then(null, function () { toonBalk('De browser weigerde volledig scherm.'); renderFs(); });
  }
  document.addEventListener('fullscreenchange', renderFs);
  document.addEventListener('webkitfullscreenchange', renderFs);

  /* ─── Meldingsbalk ───────────────────────────────────── */

  var balkTimer = 0, balkActies = null, balkSoort = null;
  function toonBalk(tekst, acties, soort) {
    window.clearTimeout(balkTimer);
    balkTimer = 0;
    balkActies = acties || null;
    balkSoort = soort || 'melding';
    el.balkTekst.textContent = tekst;
    el.balkJa.hidden = !(acties && acties.ja);
    if (acties && acties.ja) el.balkJa.textContent = acties.ja.label;
    el.balkNee.textContent = acties && acties.nee ? acties.nee.label : 'Sluiten';
    el.balk.hidden = false;
    if (!acties) balkTimer = window.setTimeout(verbergBalk, 5000);
  }
  function verbergBalk() {
    window.clearTimeout(balkTimer);
    balkTimer = 0;
    balkActies = null;
    balkSoort = null;
    el.balk.hidden = true;
  }
  el.balkJa.addEventListener('click', function () { var a = balkActies; verbergBalk(); if (a && a.ja && a.ja.fn) a.ja.fn(); });
  el.balkNee.addEventListener('click', function () { var a = balkActies; verbergBalk(); if (a && a.nee && a.nee.fn) a.nee.fn(); });

  /* ─── Online ─────────────────────────────────────────── */

  /*
   * online = { role: 'host'|'guest', seat: 0|1, code, name, phase: 'connecting'|'lobby'|'match'|'paused',
   *   players: [host, gast], ready: [b, b], match, rev, placed, queue, animMsg, pending, actId, session,
   *   auth (alleen host: PoolNet.Authority), resumable, lastError }
   *
   * Beide kanten tonen alleen standen van de host (onStateMsg). Een stoot komt binnen met `anim`: de
   * beweging wordt afgespeeld vanaf de vorige stand en daarna geldt de stand van de host. Komen er
   * standen binnen terwijl er nog een stoot loopt, dan wachten ze; bij een achterstand wordt er
   * direct naar de nieuwste gesprongen.
   */
  var RELAY = Net ? (Net.relayFromSearch(location.search) || Net.DEFAULT_RELAY) : null;
  var INVITE = Net ? Net.codeFromSearch(location.search) : null;
  var onlineScherm = 'start';
  var lastRetry = null;
  var lastOnlineError = null;

  var NACK_TEXT = {
    'verouderd': 'De stand was net veranderd. Probeer het nog eens.',
    'dubbel': 'Die zet was al verstuurd.',
    'niet-jouw-beurt': 'Je bent niet aan de beurt.',
    'pauze': 'De partij staat even stil.',
    'fase': 'Dat kan nu niet.',
    'aankondiging': 'Kondig een geldige bal en pocket aan, of kies Safety.',
    'plaats-buiten': 'Die plek ligt niet op het speelvlak.',
    'plaats-koplijn': 'De witte bal moet achter de koplijn liggen.',
    'plaats-overlap': 'Daar ligt al een bal.'
  };

  function downText(reason, role, code) {
    var fileNote = location.protocol === 'file:' ? ' Online spelen werkt alleen op de pagina van FM Atlas, niet vanuit een los bestand.' : '';
    switch (reason) {
      case 'niet-gevonden': return 'Kamer ' + code + ' bestaat niet (meer). Kijk de code na of vraag om een nieuwe.';
      case 'vol': return 'Deze kamer is vol: er spelen al twee mensen.';
      case 'versie': return 'Jullie hebben een andere versie van Pool. Laad allebei de pagina opnieuw.';
      case 'timeout': return 'De kamer gaf geen antwoord. Probeer het opnieuw.';
      case 'gesloten': return 'De host heeft de kamer gesloten.';
      case 'host-weg': return 'De host is weg. Deze online partij is gestopt.';
      case 'geweigerd': return 'De host liet je niet binnen.';
      case 'rate-limit': return 'Er gingen te veel berichten tegelijk; de verbinding is verbroken.';
      case 'netwerk': return role === 'host' ? 'De verbinding met de server is weggevallen. De kamer is gesloten.' : 'De verbinding is weggevallen.';
      default: return 'De server voor online spelen is niet bereikbaar.' + fileNote;
    }
  }

  function showOnlineScherm(name) {
    onlineScherm = name;
    $$('[data-online-scherm]', el.panelen.online).forEach(function (s) { s.hidden = s.getAttribute('data-online-scherm') !== name; });
    var label = name === 'verbinden' ? 'Annuleren' : name === 'lobby' && online && online.phase !== 'match'
      ? (online.role === 'host' ? 'Kamer sluiten' : 'Kamer verlaten') : 'Sluiten';
    el.onSluit.setAttribute('aria-label', label);
    el.onSluit.setAttribute('title', label);
  }

  function onlineFocusTarget() {
    if (onlineScherm === 'verbinden') return el.onAnnuleer;
    if (onlineScherm === 'fout') return el.onOpnieuw;
    if (onlineScherm === 'lobby') {
      if (!online) return el.onVerlaat;
      if (online.role === 'host') {
        if (online.players[1]) return !el.onHervat.hidden ? el.onHervat : el.onStart;
        return el.onKopieer;
      }
      return el.onVerlaat;
    }
    if (!el.onNaam.value) return el.onNaam;
    return el.onCode.value ? el.onMee : el.onMaak;
  }

  function openOnline(from) {
    if (!Net) { toonBalk('Online spelen is hier niet beschikbaar.'); return; }
    if (online) {
      if (online.phase === 'connecting') showOnlineScherm('verbinden'); else showLobby();
      openLayer('online', from);
      return;
    }
    if (!el.onNaam.value) el.onNaam.value = prefs.name;
    if (INVITE && !el.onCode.value) el.onCode.value = INVITE;
    el.onUitnodiging.hidden = !INVITE;
    if (INVITE) el.onUitnodiging.textContent = 'Je bent uitgenodigd voor kamer ' + INVITE + '. Vul je naam in en kies Meedoen.';
    el.onFile.hidden = location.protocol !== 'file:';
    el.onFout.textContent = '';
    showOnlineScherm('start');
    openLayer('online', from);
  }

  function onlineEsc() {
    if (onlineScherm === 'verbinden') { annuleerOnline(); return; }
    if (onlineScherm === 'lobby' && online && online.phase !== 'match') { verlaatOnline(el.onVerlaat); return; }
    backLayer();
  }

  function startOnline(role, code, name) {
    var WS = typeof window.WebSocket === 'function' ? window.WebSocket : null;
    teardownOnline();
    cpuToken++; clearLaters();
    tween = null; strike = null; shot = null; pointer = null;
    el.winst.hidden = true;
    statusFout = null;
    var o = {
      role: role, seat: role === 'host' ? 0 : 1, code: code, name: name, phase: 'connecting',
      players: role === 'host' ? [name, null] : [null, name], ready: [false, false], match: null, rev: -1,
      placed: false, queue: [], animMsg: null, pending: null, actId: 0, session: null, ackTimer: 0,
      auth: role === 'host' ? new Net.Authority(P) : null, resumable: false, lastError: null
    };
    online = o;
    state = P.newGame({ mode: 'duo', names: role === 'host' ? [name, 'Tegenstander'] : ['Host', name] });
    ui = 'idle';
    updateModusKnoppen();
    updatePause();
    el.onVerbindTekst.textContent = role === 'host' ? 'Kamer openen…' : 'Verbinden met kamer ' + code + '…';
    showOnlineScherm('verbinden');
    if (topLayer() !== 'online') openLayer('online'); else focusPanel('online');
    render();
    if (!WS) { onlineDown('onbereikbaar'); return; }
    var opts = {
      name: name, relay: RELAY, WebSocket: WS, code: code || undefined,
      onEvent: function (type, data) { if (online === o && o.session === sess) onNetEvent(type, data); }
    };
    if (role === 'host') delete opts.code;
    var sess = role === 'host' ? new Net.HostSession(opts) : new Net.GuestSession(opts);
    o.session = sess;
    sess.start();
  }

  function onNetEvent(type, d) {
    var o = online;
    if (type === 'down') { onlineDown(d && d.reason); return; }
    if (o.role === 'host') {
      if (type === 'open') {
        o.code = d.code;
        o.phase = 'lobby';
        showLobby();
        focusPanel('online');
        announce('Kamer ' + o.code + ' is open. Deel de code met je tegenstander.');
        render();
      } else if (type === 'join') hostJoin(d.name);
      else if (type === 'leave') hostLeave(d.name, d.reason);
      else if (type === 'msg') hostMsg(d);
    } else {
      if (type === 'joined') {
        o.players = [d.host, d.you || o.name];
        o.phase = 'lobby';
        showLobby();
        focusPanel('online');
        announce('Je zit in kamer ' + o.code + '. Wacht tot ' + d.host + ' de partij start.');
        render();
      } else if (type === 'msg') guestMsg(d);
    }
  }

  function annuleerOnline() {
    teardownOnline();
    newGame(prefs.mode);
    showOnlineScherm('start');
    focusPanel('online');
  }

  function onlineDown(reason) {
    var o = online;
    if (!o) return;
    lastOnlineError = reason || 'onbereikbaar';
    lastRetry = { role: o.role, code: o.role === 'guest' ? o.code : null, name: o.name };
    var tekst = downText(lastOnlineError, o.role, o.code);
    teardownOnline();
    newGame(prefs.mode);
    el.onFoutTekst.textContent = tekst;
    el.onOpnieuw.textContent = lastRetry.role === 'guest' ? 'Opnieuw meedoen' : 'Nieuwe kamer maken';
    showOnlineScherm('fout');
    if (topLayer() !== 'online') openLayer('online'); else focusPanel('online');
    announce(tekst);
  }

  /* Ruimt sockets, timers en wachtende standen op. Raakt de lagen niet aan. */
  function teardownOnline() {
    var o = online;
    if (!o) return;
    online = null;
    if (o.ackTimer) window.clearTimeout(o.ackTimer);
    o.ackTimer = 0;
    o.queue = [];
    o.animMsg = null;
    o.pending = null;
    try { if (o.session) o.session.close(); } catch (_) { /* al dicht */ }
    tween = null; strike = null; shot = null; pointer = null;
    if (balkSoort === 'verzoek') verbergBalk();
    updateModusKnoppen();
    updatePause();
  }

  /* Kamer verlaten of sluiten; met bevestiging als er iemand is of een partij loopt. */
  function verlaatOnline(knop, mode) {
    var o = online;
    if (!o) { if (mode) newGame(mode); return; }
    var other = o.players[1 - o.seat];
    var lopend = !!state && state.phase !== 'over' && (state.shots > 0 || state.phase === 'choice') &&
      (o.phase === 'match' || o.phase === 'paused');
    var go = function () { leaveOnline(mode); };
    if (o.role === 'host' && (other || lopend)) {
      vraagBevestiging('Je sluit de kamer.' + (other ? ' ' + other + ' kan dan niet verder spelen.' : ' De partij die stilstaat vervalt.'), go, knop);
    } else if (o.role === 'guest' && lopend && o.phase === 'match') {
      vraagBevestiging('Je verlaat de kamer. De partij staat stil tot je met dezelfde code terugkomt.', go, knop);
    } else go();
  }

  function leaveOnline(mode) {
    var wasHost = online && online.role === 'host';
    teardownOnline();
    closeLayers(true);
    newGame(mode || prefs.mode);
    el.canvas.focus({ preventScroll: true });
    announce(wasHost ? 'Kamer gesloten. Je speelt weer op dit apparaat.' : 'Kamer verlaten. Je speelt weer op dit apparaat.');
  }

  function showLobby(notice) {
    var o = online;
    if (!o) return;
    el.onCodeGroot.textContent = o.code || '';
    el.onLink.value = o.code ? Net.inviteUrl(location.href, o.code, RELAY) : '';
    el.onKopieerStatus.textContent = '';
    el.onDeel.hidden = o.role !== 'host';
    el.onSpelers.innerHTML = '';
    [0, 1].forEach(function (i) {
      var li = document.createElement('li');
      var naam = o.players[i];
      li.className = 'pl-lobby-speler' + (naam ? '' : ' is-leeg');
      li.textContent = naam ? naam + (i === o.seat ? ' (jij)' : '') + (i === 0 ? ' · host' : '') : 'Nog niemand';
      el.onSpelers.appendChild(li);
    });
    var other = o.players[1 - o.seat];
    var tekst;
    if (o.role === 'host') {
      var heeftPartij = !!(o.auth && o.auth.state);
      var stil = heeftPartij && o.auth.state.phase !== 'over' && o.phase === 'paused';
      el.onStart.hidden = o.phase === 'match';
      el.onStart.disabled = !other;
      el.onStart.textContent = heeftPartij ? 'Nieuwe partij' : 'Start partij';
      el.onHervat.hidden = !stil;
      el.onHervat.disabled = !other;
      if (o.phase === 'match') tekst = 'De partij loopt. Deel de code als je tegenstander opnieuw moet meedoen.';
      else if (!other) tekst = (notice ? notice + ' ' : '') + 'Wacht op een tegenstander: deel de code of de link.';
      else if (stil) tekst = other + ' doet mee. Ga verder met de partij die stilstaat, of begin een nieuwe.';
      else tekst = other + ' doet mee. Start de partij als jullie klaar zijn.';
      el.onVerlaat.textContent = 'Kamer sluiten';
    } else {
      el.onStart.hidden = true;
      el.onHervat.hidden = true;
      var host = o.players[0] || 'de host';
      tekst = o.phase === 'paused' ? 'Wacht tot ' + host + ' de partij hervat of een nieuwe start.'
        : o.phase === 'match' ? 'De partij loopt.' : 'Wacht tot ' + host + ' de partij start.';
      el.onVerlaat.textContent = 'Kamer verlaten';
    }
    el.onLobbyTekst.textContent = tekst;
    showOnlineScherm('lobby');
  }

  function kopieer(tekst, wat) {
    var gelukt = function () { el.onKopieerStatus.textContent = (wat === 'link' ? 'Link' : 'Code') + ' gekopieerd.'; };
    var mislukt = function () {
      if (wat === 'link') {
        el.onLink.focus();
        if (el.onLink.select) el.onLink.select();
        el.onKopieerStatus.textContent = 'Kopiëren lukte niet. De link hierboven is geselecteerd: kopieer hem zelf.';
      } else {
        el.onKopieerStatus.textContent = 'Kopiëren lukte niet. De code is ' + tekst + '.';
      }
    };
    try {
      var cb = window.navigator && window.navigator.clipboard;
      if (cb && typeof cb.writeText === 'function') cb.writeText(tekst).then(gelukt, mislukt);
      else mislukt();
    } catch (_) { mislukt(); }
  }

  /* ─── Online: host ─── */

  function sendRoom() {
    var o = online;
    if (!o || o.role !== 'host') return;
    o.session.send({ k: 'room', phase: o.phase, players: o.players.slice(), ready: o.auth.ready.slice(), match: o.auth.match });
  }

  function broadcast(out) {
    online.session.send(out);
    onStateMsg(out);
  }

  function hostJoin(name) {
    var o = online;
    o.players[1] = name;
    o.auth.resetSeat(1);
    o.ready = o.auth.ready.slice();
    if (o.auth.state) {
      // Er is al een partij: de gast kijkt mee, de host kiest zelf hervatten of opnieuw.
      o.auth.paused = true;
      o.phase = 'paused';
    }
    sendRoom();
    if (o.auth.state) o.session.send(o.auth.snapshot(null));
    showLobby();
    if (topLayer() !== 'online') openLayer('online');
    else focusPanel('online');
    announce(name + ' doet mee.');
    refreshTurn();
  }

  function hostLeave(name, reason) {
    var o = online;
    o.players[1] = null;
    o.auth.resetSeat(1);
    o.ready = o.auth.ready.slice();
    var lopend = o.auth.state && o.auth.state.phase !== 'over';
    if (o.auth.state) { o.auth.paused = true; o.phase = 'paused'; }
    else o.phase = 'lobby';
    var notice = name + (reason === 'stil' ? ' reageert niet meer.' : ' heeft de kamer verlaten.') + (lopend ? ' De partij staat stil.' : '');
    showLobby(notice);
    if (topLayer() !== 'online') openLayer('online');
    announce(notice);
    refreshTurn();
  }

  function hostMsg(d) {
    var o = online;
    if (d.k === 'act') {
      var r = o.auth.apply(1, d);
      if (r.ok) broadcast(r.out);
      else {
        o.lastError = 'gast: ' + r.reason;
        o.session.send({ k: 'nack', id: typeof d.id === 'number' && isFinite(d.id) ? d.id : null, reason: r.reason });
        if (o.auth.state) o.session.send(o.auth.snapshot(null));
      }
    } else if (d.k === 'ready') {
      if (d.match === o.auth.match && o.phase === 'match') hostReady(1, d.on === true);
    } else if (d.k === 'decline') {
      if (d.match === o.auth.match && o.auth.ready[0]) {
        o.auth.ready[0] = false;
        o.ready = o.auth.ready.slice();
        sendRoom();
        toonBalk((o.players[1] || 'Je tegenstander') + ' speelt deze partij liever uit.');
        render();
      }
    } else if (d.k === 'sync') {
      sendRoom();
      if (o.auth.state) o.session.send(o.auth.snapshot(null));
    }
  }

  function hostReady(seat, on) {
    var o = online;
    var both = o.auth.setReady(seat, on);
    o.ready = o.auth.ready.slice();
    if (both) { hostStartMatch(); return; }
    sendRoom();
    render();
    if (state && state.phase === 'over' && !el.winst.hidden) renderWinnerButtons();
  }

  function hostStartMatch() {
    var o = online;
    if (!o || o.role !== 'host' || !o.players[1]) return;
    var out = o.auth.start([o.name, o.players[1]]);
    o.phase = 'match';
    o.ready = [false, false];
    sendRoom();
    o.session.send(out);
    if (topLayer() === 'online') closeLayers();
    onStateMsg(out);
  }

  function hostResume() {
    var o = online;
    if (!o || o.role !== 'host' || !o.players[1] || !o.auth.state) return;
    o.auth.paused = false;
    o.phase = 'match';
    sendRoom();
    o.session.send(o.auth.snapshot(null));
    if (topLayer() === 'online') closeLayers();
    announce('De partij gaat verder.');
    refreshTurn();
  }

  /* ─── Online: gast ─── */

  function guestMsg(d) {
    var o = online;
    if (d.k === 'room') {
      var ph = d.phase === 'match' || d.phase === 'paused' || d.phase === 'lobby' ? d.phase : null;
      if (!ph) return;
      var pl = Array.isArray(d.players) ? d.players : [];
      o.players = [cleanName(pl[0]) || o.players[0] || 'Host', cleanName(pl[1]) || o.name];
      if (Array.isArray(d.ready)) o.ready = [d.ready[0] === true, d.ready[1] === true];
      var was = o.phase;
      o.phase = ph;
      if (ph === 'match') {
        if (topLayer() === 'online') closeLayers();
        if (was !== 'match') { announce('De partij loopt.'); refreshTurn(); }
        else render();
      } else {
        showLobby();
        if (topLayer() !== 'online') openLayer('online');
        refreshTurn();
      }
      if (state && state.phase === 'over' && !el.winst.hidden) renderWinnerButtons();
    } else if (d.k === 'state') {
      onStateMsg(d);
    } else if (d.k === 'nack') {
      if (o.pending && d.id === o.pending.id) {
        clearPending();
        var t = NACK_TEXT[d.reason] || 'De host weigerde deze zet.';
        o.lastError = 'nack: ' + d.reason;
        refreshTurn();
        statusFout = t;
        render();
        announce(t);
      }
    }
  }

  function clearPending() {
    var o = online;
    if (!o) return;
    o.pending = null;
    if (o.ackTimer) { window.clearTimeout(o.ackTimer); o.ackTimer = 0; }
  }

  /* ─── Online: beide kanten ─── */

  /* Een actie van de speler op dit apparaat: bij de host direct naar de autoriteit, bij de gast naar de host. */
  function submitOnline(a) {
    var o = online;
    if (!o || o.phase !== 'match' || !o.match) return;
    var msg = { k: 'act', match: o.match, rev: o.rev, id: ++o.actId, a: a };
    statusFout = null;
    if (o.role === 'host') {
      var r = o.auth.apply(0, msg);
      if (!r.ok) {
        o.lastError = 'host: ' + r.reason;
        refreshTurn();
        statusFout = NACK_TEXT[r.reason] || 'Dat kan nu niet.';
        render();
        return;
      }
      broadcast(r.out);
      return;
    }
    if (!o.session.send(msg)) { statusFout = 'Versturen lukte niet.'; render(); return; }
    o.pending = { id: msg.id, rev: o.rev, type: a.type };
    ui = 'wacht';
    render();
    o.ackTimer = window.setTimeout(function () {
      if (online !== o || !o.pending || o.pending.id !== msg.id) return;
      o.ackTimer = 0;
      o.session.send({ k: 'sync' });
      statusFout = 'Nog geen antwoord van de host. Even geduld…';
      render();
    }, Net.LIMITS.ackTimeoutMs);
  }

  function setOnlineReady(on) {
    var o = online;
    if (!o || !o.match || o.phase !== 'match') return;
    if (o.role === 'host') { hostReady(0, on); return; }
    o.ready[1] = !!on;
    o.session.send({ k: 'ready', match: o.match, on: !!on });
    render();
    if (state && state.phase === 'over' && !el.winst.hidden) renderWinnerButtons();
  }

  function declineOnline() {
    var o = online;
    if (!o || !o.match) return;
    if (o.role === 'host') {
      if (!o.auth.ready[1]) return;
      o.auth.ready[1] = false;
      o.ready = o.auth.ready.slice();
      sendRoom();
    } else {
      o.ready[0] = false;
      o.session.send({ k: 'decline', match: o.match });
    }
    render();
  }

  function vraagOnlineNieuw(knop) {
    var o = online;
    if (!o || o.phase !== 'match' || !o.match) { toonBalk('Er loopt nog geen online partij.'); return; }
    if (state.phase === 'over') { setOnlineReady(true); return; }
    if (o.ready[o.seat]) { toonBalk('Je vroeg al om een nieuwe partij.'); return; }
    var other = o.players[1 - o.seat] || 'je tegenstander';
    vraagBevestiging('Een nieuwe partij begint pas als ' + other + ' ook akkoord is. Tot dan speel je deze partij verder.', function () { setOnlineReady(true); }, knop);
  }

  function onStateMsg(m) {
    var o = online;
    if (!o || !m || typeof m !== 'object') return;
    var st = Net.readState(m.state, P);
    if (!st || typeof m.match !== 'string' || typeof m.rev !== 'number' || !isFinite(m.rev)) { o.lastError = 'ongeldige stand'; return; }
    if (m.match !== o.match) {
      // Nieuwe partij: alles van de vorige vervalt.
      o.match = m.match;
      o.rev = -1;
      o.queue = [];
      o.animMsg = null;
      shot = null; strike = null; tween = null;
      clearPending();
      el.winst.hidden = true;
      statusFout = null;
      if (balkSoort === 'verzoek') verbergBalk();
      announce('Nieuwe partij. ' + st.names[st.turn] + ' breekt.');
    } else {
      var newest = o.queue.length ? o.queue[o.queue.length - 1].rev : o.animMsg ? o.animMsg.rev : o.rev;
      if (m.rev <= newest) return;     // dubbel of verouderd
    }
    if (Array.isArray(m.ready)) o.ready = [m.ready[0] === true, m.ready[1] === true];
    var anim = null;
    if (m.anim && typeof m.anim === 'object' && m.anim.from === m.rev - 1 && m.anim.shot && typeof m.anim.shot === 'object') {
      var a = Net.readAction({ type: 'shoot', angle: m.anim.shot.angle, speed: m.anim.shot.speed, call: m.anim.shot.call }, P);
      if (a) anim = { from: m.anim.from, shot: { angle: a.angle, speed: a.speed, call: a.call } };
    }
    o.queue.push({ rev: m.rev, state: st, anim: anim, placed: m.placed === true });
    pumpQueue();
  }

  function pumpQueue() {
    var o = online;
    if (!o || o.animMsg || shot || strike) return;
    while (o.queue.length) {
      var m = o.queue.shift();
      if (m.anim && m.anim.from === o.rev && !o.queue.length && startOnlineShot(m)) return;
      applySnapshot(m);
    }
  }

  function applySnapshot(m) {
    var o = online;
    o.rev = m.rev;
    o.placed = m.placed;
    state = m.state;
    clearPending();
    var lines = m.anim && state.last && state.last.outcome ? P.describeOutcome(state.last.outcome, state, pocketName) : [];
    if (lines.length) announce(lines.join(' '));
    if (state.phase !== 'over') el.winst.hidden = true;
    nextTurn();
  }

  function startOnlineShot(m) {
    var ctx;
    try { ctx = P.beginShot(state, m.anim.shot); } catch (_) { return false; }
    online.animMsg = m;
    clearPending();
    var c = m.anim.shot.call;
    call = { ball: c && !c.safety ? c.ball : null, pocket: c && !c.safety ? c.pocket : null, safety: !!(c && c.safety), manual: true };
    el.winst.hidden = true;
    playShot(ctx, m.anim.shot.angle);
    return true;
  }

  function endOnlineShot() {
    var o = online, m = o.animMsg;
    o.animMsg = null;
    shot = null;
    o.rev = m.rev;
    o.placed = m.placed;
    state = m.state;
    var oc = state.last && state.last.outcome;
    var lines = oc ? P.describeOutcome(oc, state, pocketName) : [];
    announce(lines.join(' '));
    nextTurn();
    showFoulBriefly(oc, lines);
    pumpQueue();
  }

  function refreshTurn() {
    if (shot || strike) { render(); return; }
    nextTurn();
  }

  /* Kop, verzoekbalk en winnaarkaart volgen de online toestand. Wordt bij elke render aangeroepen. */
  function renderOnlineBits() {
    var subCode = online && online.code && online.phase !== 'connecting' ? online.code : '';
    if (el.sub.getAttribute('data-code') !== subCode) {
      // Breed "Online · CODE", smal alleen de code (pl-lang verdwijnt op een telefoon).
      el.sub.setAttribute('data-code', subCode);
      el.sub.textContent = subCode ? '' : '8-ball';
      if (subCode) {
        var s1 = document.createElement('span'); s1.className = 'pl-lang'; s1.textContent = 'Online · ';
        var s2 = document.createElement('span'); s2.textContent = subCode;
        el.sub.appendChild(s1); el.sub.appendChild(s2);
      }
    }
    if (!online || online.phase !== 'match' || !state || state.phase === 'over') {
      if (balkSoort === 'verzoek') verbergBalk();
      return;
    }
    var me = online.seat, other = 1 - me;
    var otherName = online.players[other] || 'Je tegenstander';
    var key = online.ready[0] + '/' + online.ready[1];
    if (online.ready[other] && !online.ready[me]) {
      if (balkSoort !== 'verzoek' || el.balk.getAttribute('data-sleutel') !== key) {
        toonBalk(otherName + ' wil een nieuwe partij beginnen.', {
          ja: { label: 'Akkoord', fn: function () { setOnlineReady(true); } },
          nee: { label: 'Nee, doorspelen', fn: declineOnline }
        }, 'verzoek');
        el.balk.setAttribute('data-sleutel', key);
      }
    } else if (online.ready[me] && !online.ready[other]) {
      if (balkSoort !== 'verzoek' || el.balk.getAttribute('data-sleutel') !== key) {
        toonBalk('Je vroeg om een nieuwe partij. Wacht op ' + otherName + '.', {
          nee: { label: 'Intrekken', fn: function () { setOnlineReady(false); } }
        }, 'verzoek');
        el.balk.setAttribute('data-sleutel', key);
      }
    } else if (balkSoort === 'verzoek') {
      verbergBalk();
    }
  }

  /* Knoppen en velden van het onlinepaneel. */
  function naamOfMelding() {
    var name = cleanName(el.onNaam.value);
    el.onNaam.value = name;
    if (!name) { el.onFout.textContent = 'Vul eerst je naam in.'; el.onNaam.focus(); return null; }
    bewaarNaam(name);
    return name;
  }
  el.onMaak.addEventListener('click', function () {
    var name = naamOfMelding();
    if (!name) return;
    el.onFout.textContent = '';
    var go = function () { startOnline('host', null, name); };
    if (!online && partijLoopt()) vraagBevestiging('Je maakt een online kamer. De partij die nu loopt stopt.', go, el.onMaak);
    else go();
  });
  function doeMee() {
    var name = naamOfMelding();
    if (!name) return;
    var code = Net.normalizeRoomCode(el.onCode.value);
    if (!code) {
      el.onFout.textContent = 'Een code bestaat uit vijf letters en cijfers, zoals K7M2Q.';
      el.onCode.focus();
      return;
    }
    el.onCode.value = code;
    el.onFout.textContent = '';
    var go = function () { startOnline('guest', code, name); };
    if (!online && partijLoopt()) vraagBevestiging('Je doet mee in kamer ' + code + '. De partij die nu loopt stopt.', go, el.onMee);
    else go();
  }
  el.onMee.addEventListener('click', doeMee);
  el.onCode.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doeMee(); } });
  el.onCode.addEventListener('change', function () {
    var c = Net && Net.normalizeRoomCode(el.onCode.value);
    if (c) el.onCode.value = c;
  });
  el.onAnnuleer.addEventListener('click', annuleerOnline);
  el.onSluit.addEventListener('click', onlineEsc);
  el.onStart.addEventListener('click', hostStartMatch);
  el.onHervat.addEventListener('click', hostResume);
  el.onVerlaat.addEventListener('click', function () { verlaatOnline(el.onVerlaat); });
  el.onKopieer.addEventListener('click', function () { kopieer(el.onLink.value, 'link'); });
  el.onKopieerCode.addEventListener('click', function () { if (online && online.code) kopieer(online.code, 'code'); });
  el.onOpnieuw.addEventListener('click', function () {
    var r = lastRetry;
    if (r && r.role === 'guest' && r.code) startOnline('guest', r.code, r.name || prefs.name);
    else if (r && r.role === 'host') startOnline('host', null, r.name || prefs.name);
    else showOnlineScherm('start');
  });
  el.onLokaal.addEventListener('click', function () { closeLayers(); });

  // Pagina weg: sockets en timers netjes dicht. De ander hoort het via de relay.
  window.addEventListener('pagehide', function () {
    if (!online) return;
    teardownOnline();
    closeLayers(true);
    newGame(prefs.mode);
  });

  /* ─── Start ──────────────────────────────────────────── */

  setPower(power, false);
  el.geluid.classList.toggle('is-aan', prefs.sound);
  el.geluid.setAttribute('aria-pressed', prefs.sound ? 'true' : 'false');
  syncSettings();
  renderFs();
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { if (resize()) render(); }, 80);
  });
  // Kop, spelers en bediening kunnen van hoogte veranderen (keuzepaneel, lettertype geladen, tekst
  // die een regel langer wordt). Dan opnieuw meten. De tafelmaat zelf verandert hun hoogte niet, dus
  // dit kan niet in een lus raken; resize() doet niets als de maat gelijk blijft.
  var layoutObserver = null;
  if (typeof window.ResizeObserver === 'function') {
    layoutObserver = new window.ResizeObserver(function () { if (resize()) syncAimControls(); });
    [el.bar, el.spelersBlok, el.bediening].forEach(function (n) { if (n) layoutObserver.observe(n); });
  }
  resize(true);
  newGame(prefs.mode);
  render();
  // Uitnodigingslink (?kamer=CODE): het onlinepaneel staat klaar met de code, maar er wordt pas
  // meegedaan als de speler zelf op Meedoen drukt.
  if (INVITE) openOnline();

  /* ─── Testinterface (alleen met ?test=1) ─────────────── */

  if (TEST) {
    document.documentElement.setAttribute('data-pool-test', '1');
    window.PoolTest = {
      engine: P,
      bot: Bot,
      state: function () { return P.cloneState(state); },
      ui: function () { return ui; },
      call: function () { return { ball: call.ball, pocket: call.pocket, safety: call.safety }; },
      aim: function (angle) { if (angle !== undefined) { aim.angle = angle; aim.locked = true; suggestCall(); render(); } return aim.angle; },
      power: function (p) { if (p !== undefined) setPower(p, false); return power; },
      pauseCpu: function (on) { cpuPaused = on !== false; if (on === false && state && P.isCpu(state, state.turn) && ui === 'cpu') cpuTurn(); },
      /* Zet een stand. patch: { balls:[{n,x,y,on}], turn, groups, phase, ballInHand, choice, mode, names } */
      setState: function (patch) {
        if (online) throw new Error('Online gaat een stand alleen via net.fixture() bij de host');
        cpuToken++; tween = null; strike = null; shot = null;
        var s = P.cloneState(state);
        if (patch.mode) { s.mode = patch.mode; s.names = patch.names || (patch.mode === 'duo' ? ['Speler 1', 'Speler 2'] : ['Jij', 'Computer']); }
        if (patch.balls) {
          patch.balls.forEach(function (pb) {
            var b = P.ballByN(s.balls, pb.n);
            if (!b) return;
            if (pb.x !== undefined) b.x = pb.x;
            if (pb.y !== undefined) b.y = pb.y;
            b.on = pb.on !== false; b.pocket = b.on ? null : (pb.pocket || 'LB');
            b.vx = b.vy = b.sx = b.sy = 0;
          });
        }
        ['turn', 'groups', 'phase', 'ballInHand', 'choice', 'breaker', 'shots'].forEach(function (k) { if (k in patch) s[k] = patch[k]; });
        el.winst.hidden = true;
        state = s;
        nextTurn();
        return P.cloneState(state);
      },
      /* Stoot direct (zonder animatie als instant). shot: { angle, power | speed, call, instant } */
      shoot: function (o) {
        o = o || {};
        if (ui !== 'aiming') throw new Error('Niet aan het richten (ui=' + ui + ')');
        var speed = o.speed !== undefined ? o.speed : speedFromPower(o.power !== undefined ? o.power : power);
        var c = o.call !== undefined ? o.call : currentCall();
        if (online) {
          // Online via dezelfde weg als de knop: als verzoek naar de autoriteit (host) of de host (gast).
          if (o.angle !== undefined) aim.angle = o.angle;
          if (!P.isValidCall(state.groups, P.remainingOf(state), state.turn, c) && state.phase !== 'break') throw new Error('Ongeldige aankondiging');
          try { P.beginShot(state, { angle: aim.angle, speed: speed, call: c }); } catch (e) { throw new Error(e.message); }
          submitOnline({ type: 'shoot', angle: normAngle(aim.angle), speed: speed, call: state.phase === 'break' ? null : c });
          if (o.instant && (strike || shot)) {
            if (strike) { var go0 = strike.then; strike = null; go0(); }
            P.runShot(shot); endShot();
          }
          return P.cloneState(state);
        }
        if (!startShot(o.angle !== undefined ? o.angle : aim.angle, speed, c)) throw new Error(statusFout || 'Stoot geweigerd');
        if (o.instant) {
          if (strike) { var go = strike.then; strike = null; go(); }
          P.runShot(shot); endShot();
        }
        return P.cloneState(state);
      },
      place: function (x, y, confirm) {
        if (ui !== 'placing') throw new Error('Geen bal in hand (ui=' + ui + ')');
        preview = { x: x, y: y }; updatePlaceText(); requestDraw();
        var ok = placementCheck(x, y);
        if (confirm !== false && ok.ok) confirmPlacement();
        return ok;
      },
      choose: function (opt) { doChoice(opt); return P.cloneState(state); },
      toScreen: function (x, y) { var r = el.canvas.getBoundingClientRect(); var p = toScreen(x, y); return { x: r.left + p.x, y: r.top + p.y }; },
      toWorld: function (cx, cy) { var r = el.canvas.getBoundingClientRect(); return toWorld(cx - r.left, cy - r.top); },
      pocketName: pocketName,
      view: function () { return { rotated: view.rotated, scale: view.s, width: view.cssW, height: view.cssH }; },
      rafActive: function () { return !!rafId; },
      paused: function () { return paused; },
      layer: function () { return layerStack.slice(); },
      prefs: function () { return JSON.parse(JSON.stringify(prefs)); },
      /*
       * Online inspectie. fixture() bestaat alleen hier, alleen bij de host met een partij, en loopt via
       * de autoriteit: de nieuwe stand gaat als gewone revisie naar beide kanten. Een gast kan hem niet
       * aanroepen en er is geen netwerkbericht voor.
       */
      net: {
        status: function () {
          if (!online) return { room: 'none', lastError: lastOnlineError };
          var o = online;
          return {
            room: o.phase, role: o.role, seat: o.seat, code: o.code, match: o.match, rev: o.rev,
            authRev: o.auth ? o.auth.rev : null, placed: o.placed, pending: !!o.pending,
            animating: !!o.animMsg, queued: o.queue.length,
            synced: !o.pending && !o.animMsg && !o.queue.length && (!o.auth || !o.auth.state || o.auth.rev === o.rev),
            players: o.players.slice(), ready: o.ready.slice(), ui: ui,
            lastError: o.lastError || lastOnlineError, relay: RELAY,
            invite: o.code ? Net.inviteUrl(location.href, o.code, RELAY) : null
          };
        },
        fixture: function (patch) {
          if (!online || online.role !== 'host' || !online.auth || !online.auth.state) throw new Error('Alleen bij de host met een lopende partij');
          var out = online.auth.fixture(patch);
          broadcast(out);
          return out.rev;
        },
        relay: function () { return RELAY; }
      }
    };
  }
})();
