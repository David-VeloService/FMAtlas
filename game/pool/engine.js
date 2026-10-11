/*
 * Pool (8-ball): tafelgeometrie, simulatie en spelregels.
 *
 * Geen DOM, geen opslag, geen timers. Laadbaar als klassiek script en in Node:
 *
 *   browser:  window.PoolEngine
 *   Node:     const P = require('./engine.js');
 *
 * Eenheden: millimeters en seconden. Het speelvlak loopt van (0,0) tot (W,H) en wordt begrensd door
 * de neuzen van de banden. De kopzijde (koplijn, keuken) ligt links, het voetpunt met het rek rechts.
 *
 * Simulatie: vaste tijdstap DT (1/240 s) met extra substappen naar snelheid, zodat een bal per substap
 * hooguit een kwart straal beweegt. Daardoor schiet ook een stoot op maximale kracht nergens doorheen.
 * Elke bal heeft een snelheid (vx,vy) en een rolsnelheid (sx,sy): de snelheid van het oppervlak door
 * de rotatie. Zolang die verschillen glijdt de bal (sterke wrijving); zijn ze gelijk, dan rolt hij
 * (rolweerstand plus een kleine snelheidsafhankelijke demping). Botsingen tussen ballen wisselen alleen
 * de normaalcomponent van de snelheid; de rotatie blijft, waardoor een rollende witte bal na een volle
 * raak doorloopt. Effect (spin zijwaarts, trek, massé, springen) bestaat niet.
 *
 * Regels: evaluateShot() is een pure functie die een stootverslag (shot log) beoordeelt. De beurt-
 * functies (beginShot/stepShot/finishShot, applyChoice, placeCue) geven steeds een nieuwe stand terug.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PoolEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ─── Maten ─────────────────────────────────────────── */

  var W = 2540;                 // 9-voetstafel: speelvlak 100 x 50 inch
  var H = 1270;
  var R = 28.575;               // bal 57,15 mm
  var D = 2 * R;
  var HEAD_X = W / 4;           // koplijn
  var FOOT_X = W * 3 / 4;       // voetpunt
  var MID_Y = H / 2;

  var CORNER_C = 82;            // hoekpocket: bek tussen (82,0) en (0,82) = 116 mm
  var SIDE_S = 64;              // middenpocket: bek 128 mm
  var CORNER_JAW = [-36, -27];  // lokale richting van de hoekbek vanaf het bekpunt (naar buiten)
  var SIDE_JAW = [12, -42];
  var CORNER_DROP = 45;         // bal valt als u+v < 45 (lokaal, hoek)
  var SIDE_DROP = 22;           // bal valt als hij 22 mm voorbij de bandlijn is (midden)

  var DT = 1 / 240;
  var MAX_SPEED = 7500;         // mm/s, maximale stoot
  var MIN_SPEED = 150;
  var E_BALL = 0.95;
  var E_RAIL = 0.78;
  var RAIL_TANGENT = 0.94;
  var MU_SLIDE = 1962;          // 0,2 g in mm/s^2
  var ROLL_DECEL = 200;
  var LIN_DAMP = 0.45;
  var STOP_V = 4;
  var CONTACT_SKIN = 0.2;       // ballen binnen 0,2 mm gelden als rakend (rek)
  var MAX_SHOT_TIME = 45;
  var MAX_FRAME = 0.1;          // langste frame die meetelt (tabwissel, haperingen)

  var STORAGE_KEY = 'fa_pool_v1';

  /* ─── Toeval ────────────────────────────────────────── */

  function seededRng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ─── Tafelgeometrie ────────────────────────────────── */

  function seg(ax, ay, bx, by, kind) {
    var ex = bx - ax, ey = by - ay;
    return { ax: ax, ay: ay, bx: bx, by: by, len2: ex * ex + ey * ey, kind: kind };
  }

  function cornerLocal(ox, oy) {
    var dx = ox === 0 ? 1 : -1, dy = oy === 0 ? 1 : -1;
    return {
      dx: dx, dy: dy,
      toWorld: function (u, v) { return { x: ox + u * dx, y: oy + v * dy }; },
      toLocal: function (x, y) { return { u: (x - ox) * dx, v: (y - oy) * dy }; }
    };
  }

  function sideLocal(oy) {
    var dy = oy === 0 ? 1 : -1;
    return {
      dx: 1, dy: dy,
      toWorld: function (u, v) { return { x: W / 2 + u, y: oy + v * dy }; },
      toLocal: function (x, y) { return { u: x - W / 2, v: (y - oy) * dy }; }
    };
  }

  var CUSHIONS = [];
  var POCKETS = [];

  (function bouwTafel() {
    var c = CORNER_C, s = SIDE_S;
    // Rechte banden (de neuzen)
    CUSHIONS.push(seg(c, 0, W / 2 - s, 0, 'band'));
    CUSHIONS.push(seg(W / 2 + s, 0, W - c, 0, 'band'));
    CUSHIONS.push(seg(c, H, W / 2 - s, H, 'band'));
    CUSHIONS.push(seg(W / 2 + s, H, W - c, H, 'band'));
    CUSHIONS.push(seg(0, c, 0, H - c, 'band'));
    CUSHIONS.push(seg(W, c, W, H - c, 'band'));

    var defs = [
      { id: 'LB', kind: 'hoek', ox: 0, oy: 0 },
      { id: 'MB', kind: 'midden', oy: 0 },
      { id: 'RB', kind: 'hoek', ox: W, oy: 0 },
      { id: 'LO', kind: 'hoek', ox: 0, oy: H },
      { id: 'MO', kind: 'midden', oy: H },
      { id: 'RO', kind: 'hoek', ox: W, oy: H }
    ];
    defs.forEach(function (d) {
      var p = { id: d.id, kind: d.kind, jaws: [], targets: [] };
      var L;
      if (d.kind === 'hoek') {
        L = cornerLocal(d.ox, d.oy);
        var a1 = L.toWorld(c, 0), a2 = L.toWorld(c + CORNER_JAW[0], CORNER_JAW[1]);
        var b1 = L.toWorld(0, c), b2 = L.toWorld(CORNER_JAW[1], c + CORNER_JAW[0]);
        p.jaws.push(seg(a1.x, a1.y, a2.x, a2.y, 'bek'), seg(b1.x, b1.y, b2.x, b2.y, 'bek'));
        p.mouth = [a1, b1];
        var hole = L.toWorld(-4, -4);
        p.x = hole.x; p.y = hole.y; p.r = 60;
        var aim = L.toWorld(17.5, 17.5);
        p.aim = aim;
        p.axis = { x: -L.dx / Math.SQRT2, y: -L.dy / Math.SQRT2 };
        for (var u = -24; u <= 60; u += 4) p.targets.push(L.toWorld(u, 35 - u));
        p.corner = { x: d.ox, y: d.oy };
      } else {
        L = sideLocal(d.oy);
        var m1 = L.toWorld(-s, 0), m2 = L.toWorld(-s + SIDE_JAW[0], SIDE_JAW[1]);
        var n1 = L.toWorld(s, 0), n2 = L.toWorld(s - SIDE_JAW[0], SIDE_JAW[1]);
        p.jaws.push(seg(m1.x, m1.y, m2.x, m2.y, 'bek'), seg(n1.x, n1.y, n2.x, n2.y, 'bek'));
        p.mouth = [m1, n1];
        var h2 = L.toWorld(0, -40);
        p.x = h2.x; p.y = h2.y; p.r = 56;
        p.aim = L.toWorld(0, -28);
        p.axis = { x: 0, y: -L.dy };
        for (var u2 = -24; u2 <= 24; u2 += 4) p.targets.push(L.toWorld(u2, -28));
      }
      p.local = L;
      p.jaws.forEach(function (j) { CUSHIONS.push(j); });
      POCKETS.push(p);
    });

    // Doelpunten voor de computer: alleen punten waar het middelpunt van een bal echt kan komen.
    POCKETS.forEach(function (p) {
      p.targets = p.targets.filter(function (t) {
        for (var i = 0; i < CUSHIONS.length; i++) {
          if (pointSegDist(t.x, t.y, CUSHIONS[i]) < R + 1) return false;
        }
        return true;
      });
    });
  })();

  var POCKET_IDS = POCKETS.map(function (p) { return p.id; });
  var POCKET_NAMES = { LB: 'linksboven', MB: 'midden boven', RB: 'rechtsboven', LO: 'linksonder', MO: 'midden onder', RO: 'rechtsonder' };

  function pocketById(id) {
    for (var i = 0; i < POCKETS.length; i++) if (POCKETS[i].id === id) return POCKETS[i];
    return null;
  }

  /* ─── Kleine meetkunde ──────────────────────────────── */

  function closestOnSeg(px, py, s) {
    var ex = s.bx - s.ax, ey = s.by - s.ay;
    var t = s.len2 > 0 ? ((px - s.ax) * ex + (py - s.ay) * ey) / s.len2 : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    return { x: s.ax + ex * t, y: s.ay + ey * t };
  }

  function pointSegDist(px, py, s) {
    var q = closestOnSeg(px, py, s);
    return Math.hypot(px - q.x, py - q.y);
  }

  function pointLineSegDist(px, py, ax, ay, bx, by) {
    return pointSegDist(px, py, seg(ax, ay, bx, by));
  }

  function segSegDist(a, b) {
    // Kortste afstand tussen twee lijnstukken (geen snijpunt-test nodig voor onze toepassingen,
    // behalve als ze kruisen: dan 0).
    if (segmentsCross(a, b)) return 0;
    return Math.min(
      pointSegDist(a.ax, a.ay, b), pointSegDist(a.bx, a.by, b),
      pointSegDist(b.ax, b.ay, a), pointSegDist(b.bx, b.by, a)
    );
  }

  function segmentsCross(a, b) {
    function orient(px, py, qx, qy, rx, ry) { return (qx - px) * (ry - py) - (qy - py) * (rx - px); }
    var d1 = orient(a.ax, a.ay, a.bx, a.by, b.ax, b.ay);
    var d2 = orient(a.ax, a.ay, a.bx, a.by, b.bx, b.by);
    var d3 = orient(b.ax, b.ay, b.bx, b.by, a.ax, a.ay);
    var d4 = orient(b.ax, b.ay, b.bx, b.by, a.bx, a.by);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
  }

  function rayCircle(px, py, dx, dy, cx, cy, r) {
    var fx = px - cx, fy = py - cy;
    var b = fx * dx + fy * dy;
    var c = fx * fx + fy * fy - r * r;
    if (c < 0) return 0;               // begint al binnen de cirkel
    var disc = b * b - c;
    if (disc < 0) return Infinity;
    var t = -b - Math.sqrt(disc);
    return t >= 0 ? t : Infinity;
  }

  function rayCapsule(px, py, dx, dy, s, r) {
    // Eerste t >= 0 waarop een cirkel met straal r die langs de straal beweegt het lijnstuk raakt.
    var best = Math.min(rayCircle(px, py, dx, dy, s.ax, s.ay, r), rayCircle(px, py, dx, dy, s.bx, s.by, r));
    var ex = s.bx - s.ax, ey = s.by - s.ay, len = Math.sqrt(s.len2);
    if (len === 0) return best;
    var nx = -ey / len, ny = ex / len;
    var denom = dx * nx + dy * ny;
    if (Math.abs(denom) > 1e-12) {
      [r, -r].forEach(function (off) {
        // lijn: (p - a) . n = off
        var t = (off - ((px - s.ax) * nx + (py - s.ay) * ny)) / denom;
        if (t >= 0 && t < best) {
          var hx = px + dx * t, hy = py + dy * t;
          var proj = ((hx - s.ax) * ex + (hy - s.ay) * ey) / s.len2;
          if (proj >= 0 && proj <= 1) best = t;
        }
      });
    }
    return best;
  }

  /* ─── Ballen ────────────────────────────────────────── */

  function groupOf(n) {
    if (n === 0) return 'wit';
    if (n === 8) return 'acht';
    return n < 8 ? 'vol' : 'half';
  }

  function makeBall(n, x, y) {
    return { n: n, x: x, y: y, vx: 0, vy: 0, sx: 0, sy: 0, on: true, pocket: null };
  }

  function cloneBalls(balls) {
    return balls.map(function (b) {
      return { n: b.n, x: b.x, y: b.y, vx: b.vx, vy: b.vy, sx: b.sx, sy: b.sy, on: b.on, pocket: b.pocket };
    });
  }

  function ballByN(balls, n) {
    for (var i = 0; i < balls.length; i++) if (balls[i].n === n) return balls[i];
    return null;
  }

  function rackSlots() {
    var gap = 0.1;
    var dx = (D + gap) * Math.sqrt(3) / 2;
    var slots = [];
    for (var row = 0; row < 5; row++) {
      for (var j = 0; j <= row; j++) {
        slots.push({ x: FOOT_X + row * dx, y: MID_Y + (j - row / 2) * (D + gap), row: row, j: j });
      }
    }
    return slots;
  }

  /*
   * Rek: de 8 in het midden van de derde rij, in de twee achterhoeken een volle en een halve bal,
   * de overige ballen willekeurig. Geeft 15 objectballen terug.
   */
  function rack(rng) {
    rng = rng || Math.random;
    var slots = rackSlots();
    var solids = [1, 2, 3, 4, 5, 6, 7], stripes = [9, 10, 11, 12, 13, 14, 15];
    function take(list) { return list.splice(Math.floor(rng() * list.length), 1)[0]; }
    var cornerSolid = take(solids), cornerStripe = take(stripes);
    var rest = solids.concat(stripes);
    for (var i = rest.length - 1; i > 0; i--) {
      var k = Math.floor(rng() * (i + 1));
      var tmp = rest[i]; rest[i] = rest[k]; rest[k] = tmp;
    }
    var order = new Array(15);
    order[4] = 8;
    if (rng() < 0.5) { order[10] = cornerSolid; order[14] = cornerStripe; }
    else { order[10] = cornerStripe; order[14] = cornerSolid; }
    var r = 0;
    for (var s = 0; s < 15; s++) if (order[s] === undefined) order[s] = rest[r++];
    return slots.map(function (sl, idx) { return makeBall(order[idx], sl.x, sl.y); });
  }

  /* ─── Plaatsing van de witte bal ────────────────────── */

  function validateCuePlacement(balls, x, y, zone) {
    if (!isFinite(x) || !isFinite(y)) return { ok: false, reason: 'buiten' };
    if (x < R || x > W - R || y < R || y > H - R) return { ok: false, reason: 'buiten' };
    for (var i = 0; i < CUSHIONS.length; i++) {
      if (pointSegDist(x, y, CUSHIONS[i]) < R) return { ok: false, reason: 'buiten' };
    }
    // WPA 3.10: bij bal in hand achter de koplijn ligt de witte bal strikt erachter, niet erop.
    if (zone === 'kitchen' && x >= HEAD_X) return { ok: false, reason: 'koplijn' };
    for (var j = 0; j < balls.length; j++) {
      var b = balls[j];
      if (!b.on || b.n === 0) continue;
      if (Math.hypot(b.x - x, b.y - y) < D) return { ok: false, reason: 'overlap' };
    }
    return { ok: true, reason: null };
  }

  function findFreeSpot(balls, zone, px, py) {
    if (px === undefined) {
      px = zone === 'kitchen' ? HEAD_X - 60 : HEAD_X;
      py = MID_Y;
    }
    if (validateCuePlacement(balls, px, py, zone).ok) return { x: px, y: py };
    for (var rad = 10; rad < 1400; rad += 10) {
      var steps = Math.max(8, Math.round(rad / 6));
      for (var k = 0; k < steps; k++) {
        var a = (k / steps) * Math.PI * 2;
        var x = px + Math.cos(a) * rad, y = py + Math.sin(a) * rad;
        if (validateCuePlacement(balls, x, y, zone).ok) return { x: x, y: y };
      }
    }
    return null;
  }

  /* De 8 terugzetten: op het voetpunt, of zo dichtbij mogelijk erachter op de lange lijn. */
  function spotPosition(balls, n) {
    function free(x) {
      for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (!b.on || b.n === n) continue;
        if (Math.hypot(b.x - x, b.y - MID_Y) < D) return false;
      }
      return true;
    }
    for (var x = FOOT_X; x <= W - R; x += 1) if (free(x)) return { x: x, y: MID_Y };
    for (var x2 = FOOT_X; x2 >= R; x2 -= 1) if (free(x2)) return { x: x2, y: MID_Y };
    return { x: FOOT_X, y: MID_Y };
  }

  /* ─── Simulatie ─────────────────────────────────────── */

  function friction(b, h) {
    var slx = b.vx - b.sx, sly = b.vy - b.sy;
    var sl = Math.sqrt(slx * slx + sly * sly);
    if (sl > 1e-6) {
      var dv = MU_SLIDE * h;
      if (sl <= 3.5 * dv) {
        var ux = (5 * b.vx + 2 * b.sx) / 7, uy = (5 * b.vy + 2 * b.sy) / 7;
        b.vx = b.sx = ux; b.vy = b.sy = uy;
      } else {
        var nx = slx / sl, ny = sly / sl;
        b.vx -= nx * dv; b.vy -= ny * dv;
        b.sx += nx * 2.5 * dv; b.sy += ny * 2.5 * dv;
      }
    } else {
      var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp > 0) {
        var ns = sp - (ROLL_DECEL + LIN_DAMP * sp) * h;
        if (ns < STOP_V) ns = 0;
        var f = ns / sp;
        b.vx *= f; b.vy *= f;
        b.sx = b.vx; b.sy = b.vy;
      }
    }
    if (Math.abs(b.vx) + Math.abs(b.vy) < STOP_V && Math.abs(b.sx) + Math.abs(b.sy) < STOP_V) {
      b.vx = b.vy = b.sx = b.sy = 0;
    }
  }

  function moving(b) {
    return b.on && (b.vx !== 0 || b.vy !== 0 || b.sx !== 0 || b.sy !== 0);
  }

  function dropPocket(x, y) {
    for (var i = 0; i < POCKETS.length; i++) {
      var p = POCKETS[i], l = p.local.toLocal(x, y);
      if (p.kind === 'hoek') {
        if (l.u < 200 && l.v < 200 && l.u + l.v < CORNER_DROP) return p;
      } else if (l.v < -SIDE_DROP && Math.abs(l.u) < SIDE_S + 10) {
        return p;
      }
    }
    if (x < -R || x > W + R || y < -R || y > H + R) {
      // Vangnet: buiten het speelvlak kan een bal alleen via een bek komen. Dichtstbijzijnde pocket.
      var best = null, bd = Infinity;
      POCKETS.forEach(function (q) {
        var d = Math.hypot(q.x - x, q.y - y);
        if (d < bd) { bd = d; best = q; }
      });
      return best;
    }
    return null;
  }

  function substep(balls, h, ctx) {
    var i, j, a, b;
    for (i = 0; i < balls.length; i++) {
      b = balls[i];
      if (!moving(b)) continue;
      friction(b, h);
      b.x += b.vx * h;
      b.y += b.vy * h;
    }
    var cue = balls[0];
    if (ctx.firstHit === null && cue.on && cue.x > HEAD_X) ctx.cueCrossed = true;

    // Bal tegen bal. Alle naderende contacten van deze substap worden samen opgelost (projected
    // Gauss-Seidel met opgetelde impulsen), zodat een bal die twee ballen tegelijk raakt de stoot
    // eerlijk verdeelt in plaats van alles aan de eerst behandelde bal te geven. Het raakmoment wordt
    // binnen de substap teruggerekend. Daarna wordt overlap gelijk verdeeld opgeheven.
    var contacts = [];
    for (i = 0; i < balls.length; i++) {
      a = balls[i];
      a.tau = 0; a.ovx = a.vx; a.ovy = a.vy;
    }
    for (i = 0; i < balls.length; i++) {
      a = balls[i];
      if (!a.on) continue;
      for (j = i + 1; j < balls.length; j++) {
        b = balls[j];
        if (!b.on) continue;
        var dx = b.x - a.x, dy = b.y - a.y;
        var d2 = dx * dx + dy * dy;
        if (d2 >= (D + CONTACT_SKIN) * (D + CONTACT_SKIN)) continue;
        var d = Math.sqrt(d2), nx, ny;
        if (d < 1e-9) { nx = 1; ny = 0; d = 0; } else { nx = dx / d; ny = dy / d; }
        var rv0 = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        var tau = 0;
        if (d < D && rv0 > 1e-3) {
          // Terugrekenen naar het raakmoment binnen deze substap, zodat de stootrichting exact klopt.
          var wx = b.vx - a.vx, wy = b.vy - a.vy;
          var ww = wx * wx + wy * wy, rw = dx * wx + dy * wy, cc = d2 - D * D;
          if (ww > 1e-9) {
            tau = (rw + Math.sqrt(Math.max(0, rw * rw - ww * cc))) / ww;
            if (tau < 0) tau = 0; else if (tau > h) tau = h;
            var tx0 = dx - wx * tau, ty0 = dy - wy * tau, tl0 = Math.sqrt(tx0 * tx0 + ty0 * ty0);
            if (tl0 > 1e-9) { nx = tx0 / tl0; ny = ty0 / tl0; }
            rv0 = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (tau > a.tau) a.tau = tau;
            if (tau > b.tau) b.tau = tau;
          }
        }
        if (rv0 <= 1e-3) {
          // Rakend of uit elkaar: alleen overlap opheffen. Een stoot loopt zo per substap door het rek,
          // zoals in het echt, en de witte bal kaatst niet terug op een star blok ballen.
          if (d < D) contacts.push({ a: a, b: b, nx: nx, ny: ny, d: d, rv0: rv0, target: 0, lambda: 0, rest: true });
          continue;
        }
        contacts.push({ a: a, b: b, nx: nx, ny: ny, d: d, rv0: rv0, target: -E_BALL * rv0, lambda: 0, rest: false });
      }
    }
    if (contacts.length) {
      var c, k;
      for (var it = 0; it < 24; it++) {
        var maxDelta = 0;
        for (k = 0; k < contacts.length; k++) {
          c = contacts[k];
          if (c.rest) continue;
          var rv = (c.a.vx - c.b.vx) * c.nx + (c.a.vy - c.b.vy) * c.ny;
          var dl = (rv - c.target) / 2;
          var nl = c.lambda + dl;
          if (nl < 0) nl = 0;
          dl = nl - c.lambda;
          if (dl === 0) continue;
          c.lambda = nl;
          c.a.vx -= dl * c.nx; c.a.vy -= dl * c.ny;
          c.b.vx += dl * c.nx; c.b.vy += dl * c.ny;
          if (Math.abs(dl) > maxDelta) maxDelta = Math.abs(dl);
        }
        if (maxDelta < 0.01) break;
      }
      // Ballen die na het raakmoment nog met de oude snelheid doorschoven: corrigeer met de nieuwe.
      for (i = 0; i < balls.length; i++) {
        a = balls[i];
        if (a.tau > 0) { a.x += (a.vx - a.ovx) * a.tau; a.y += (a.vy - a.ovy) * a.tau; }
      }
      var cueHit = null, cueHitL = 0;
      for (k = 0; k < contacts.length; k++) {
        c = contacts[k];
        if (c.lambda > 0) {
          if ((c.a.n === 0 || c.b.n === 0) && c.lambda > cueHitL) { cueHitL = c.lambda; cueHit = c.a.n === 0 ? c.b.n : c.a.n; }
          if (ctx.sounds && c.rv0 > 1e-3) ctx.sounds.push({ t: 'tik', v: c.rv0 });
        }
        var ex2 = c.b.x - c.a.x, ey2 = c.b.y - c.a.y, dd2 = Math.sqrt(ex2 * ex2 + ey2 * ey2);
        if (dd2 < D) {
          var mx2 = c.nx, my2 = c.ny;
          if (dd2 > 1e-9) { mx2 = ex2 / dd2; my2 = ey2 / dd2; }
          var half = (D - dd2) / 2 + 1e-6;
          c.a.x -= mx2 * half; c.a.y -= my2 * half;
          c.b.x += mx2 * half; c.b.y += my2 * half;
        }
      }
      if (ctx.firstHit === null && cueHit !== null) {
        ctx.firstHit = cueHit;
        ctx.events.push({ t: 'hit', ball: cueHit, time: ctx.time });
      }
    }

    // Bal tegen band of bek
    for (i = 0; i < balls.length; i++) {
      b = balls[i];
      if (!b.on) continue;
      for (j = 0; j < CUSHIONS.length; j++) {
        var s = CUSHIONS[j];
        var q = closestOnSeg(b.x, b.y, s);
        var ex = b.x - q.x, ey = b.y - q.y;
        var dd = ex * ex + ey * ey;
        if (dd >= R * R) continue;
        var dist = Math.sqrt(dd), mx, my;
        if (dist < 1e-9) {
          // middelpunt precies op de band: duw terug naar het speelvlak
          mx = W / 2 - b.x; my = H / 2 - b.y;
          var ml = Math.hypot(mx, my) || 1; mx /= ml; my /= ml;
        } else { mx = ex / dist; my = ey / dist; }
        b.x += mx * (R - dist + 1e-6);
        b.y += my * (R - dist + 1e-6);
        var vn = b.vx * mx + b.vy * my;
        if (vn < 0) {
          var tx = b.vx - vn * mx, ty = b.vy - vn * my;
          b.vx = tx * RAIL_TANGENT - vn * E_RAIL * mx;
          b.vy = ty * RAIL_TANGENT - vn * E_RAIL * my;
          b.sx = b.vx; b.sy = b.vy;
          if (vn < -2) {
            ctx.events.push({ t: 'rail', ball: b.n, time: ctx.time });
            if (ctx.sounds) ctx.sounds.push({ t: 'band', v: -vn });
          }
        }
      }
    }

    // Pockets
    for (i = 0; i < balls.length; i++) {
      b = balls[i];
      if (!b.on) continue;
      var p = dropPocket(b.x, b.y);
      if (p) {
        b.on = false; b.pocket = p.id;
        b.vx = b.vy = b.sx = b.sy = 0;
        b.x = p.x; b.y = p.y;
        ctx.events.push({ t: 'pot', ball: b.n, pocket: p.id, time: ctx.time });
        if (ctx.sounds) ctx.sounds.push({ t: 'pot', v: 1 });
      }
    }
  }

  /* Eén vaste tijdstap DT, met substappen zodat een bal per substap hooguit R/4 aflegt. */
  function physicsStep(balls, ctx) {
    var maxv = 0;
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      if (!b.on) continue;
      var v = Math.max(Math.abs(b.vx) + Math.abs(b.vy), Math.abs(b.sx) + Math.abs(b.sy));
      if (v > maxv) maxv = v;
    }
    var n = Math.min(64, Math.max(1, Math.ceil(maxv * DT / (R * 0.25))));
    var h = DT / n;
    for (var k = 0; k < n; k++) substep(balls, h, ctx);
    ctx.time += DT;
    ctx.steps += 1;
  }

  function allAtRest(balls) {
    for (var i = 0; i < balls.length; i++) if (moving(balls[i])) return false;
    return true;
  }

  function newSimContext() {
    return { events: [], sounds: null, firstHit: null, cueCrossed: false, time: 0, steps: 0, acc: 0, done: false, timedOut: false };
  }

  /* Losse simulatie (tests, computer): laat ballen lopen tot alles stil ligt. Muteert balls. */
  function simulate(balls, ctx, maxTime) {
    ctx = ctx || newSimContext();
    maxTime = maxTime || MAX_SHOT_TIME;
    while (!allAtRest(balls)) {
      if (ctx.time >= maxTime) { stopAll(balls); ctx.timedOut = true; break; }
      physicsStep(balls, ctx);
    }
    ctx.done = true;
    return ctx;
  }

  function stopAll(balls) {
    balls.forEach(function (b) { b.vx = b.vy = b.sx = b.sy = 0; });
  }

  /* ─── Richten ───────────────────────────────────────── */

  /*
   * Waar raakt de witte bal (of een andere bal) als hij vanaf (x,y) in richting angle rolt?
   * Geeft de eerste bal of band terug, met de ghost-ballpositie en de vertrekrichtingen.
   */
  function castAim(balls, x, y, angle, selfN) {
    var dx = Math.cos(angle), dy = Math.sin(angle);
    var best = { t: Infinity, type: 'none' };
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      if (!b.on || b.n === (selfN === undefined ? 0 : selfN)) continue;
      var t = rayCircle(x, y, dx, dy, b.x, b.y, D);
      if (t < best.t) best = { t: t, type: 'ball', ball: b.n, bx: b.x, by: b.y };
    }
    for (var j = 0; j < CUSHIONS.length; j++) {
      var tc = rayCapsule(x, y, dx, dy, CUSHIONS[j], R);
      if (tc < best.t) best = { t: tc, type: 'rail' };
    }
    if (best.t === Infinity) { best.t = 3000; best.type = 'none'; }
    var gx = x + dx * best.t, gy = y + dy * best.t;
    var res = { type: best.type, t: best.t, x: gx, y: gy, ball: best.type === 'ball' ? best.ball : null };
    if (best.type === 'ball') {
      var nx = best.bx - gx, ny = best.by - gy, nl = Math.hypot(nx, ny) || 1;
      nx /= nl; ny /= nl;
      var dot = dx * nx + dy * ny;
      res.objDir = { x: nx, y: ny };
      res.cut = Math.acos(Math.max(-1, Math.min(1, dot)));
      var tx = dx - dot * nx, ty = dy - dot * ny, tl = Math.hypot(tx, ty);
      res.cueDir = tl > 1e-6 ? { x: tx / tl, y: ty / tl } : null;
    }
    return res;
  }

  /* ─── Spelregels ────────────────────────────────────── */

  function onTableObjects(balls) {
    var r = [];
    balls.forEach(function (b) { if (b.on && b.n !== 0) r.push(b.n); });
    return r.sort(function (a, b) { return a - b; });
  }

  function emptyGroups(remaining) {
    var vol = 0, half = 0;
    remaining.forEach(function (n) { if (groupOf(n) === 'vol') vol++; else if (groupOf(n) === 'half') half++; });
    var e = [];
    if (vol === 0) e.push('vol');
    if (half === 0) e.push('half');
    return e;
  }

  /* Ballen die de speler als eerste mag raken (en mag aankondigen). */
  function legalTargets(groups, remaining, player) {
    var hasEight = remaining.indexOf(8) >= 0;
    if (!groups) {
      var t = remaining.filter(function (n) { return n !== 8; });
      if (hasEight && emptyGroups(remaining).length > 0) t.push(8);
      return t;
    }
    var own = remaining.filter(function (n) { return groupOf(n) === groups[player]; });
    if (own.length) return own;
    return hasEight ? [8] : [];
  }

  function isOnEight(groups, remaining, player) {
    var t = legalTargets(groups, remaining, player);
    return t.indexOf(8) >= 0;
  }

  function isValidCall(groups, remaining, player, call) {
    if (!call) return false;
    if (call.safety) return true;
    if (POCKET_IDS.indexOf(call.pocket) < 0) return false;
    return legalTargets(groups, remaining, player).indexOf(call.ball) >= 0;
  }

  var FOUL_TEXT = {
    scratch: 'de witte bal viel in een pocket',
    geenContact: 'de witte bal raakte geen enkele bal',
    verkeerdeEerste: 'eerst een verkeerde bal geraakt',
    keukenregel: 'vanuit de keuken direct een bal achter de koplijn geraakt',
    geenBand: 'na het raken ging er geen bal naar een band of in een pocket'
  };

  /*
   * Beoordeel één stoot. Puur: verandert niets.
   *
   * log = {
   *   isBreak, shooter (0|1), call: null | {ball, pocket} | {safety:true},
   *   groups: null | ['vol'|'half', 'vol'|'half'] (vóór de stoot),
   *   remaining: objectballen op tafel vóór de stoot,
   *   fromKitchen: bal in hand achter de koplijn, behindHead: objectballen strikt achter de koplijn vóór de stoot
   *     (een bal precies op de lijn hoort er niet bij),
   *   cueCrossed: witte bal is vóór het eerste contact over de koplijn gegaan,
   *   firstHit: nummer van de eerste geraakte bal of null,
   *   events: geordend [{t:'hit',ball}, {t:'rail',ball}, {t:'pot',ball,pocket}]
   * }
   */
  function evaluateShot(log) {
    var shooter = log.shooter, opp = 1 - shooter;
    var events = log.events || [];
    var pots = events.filter(function (e) { return e.t === 'pot'; });
    var objectPots = pots.filter(function (e) { return e.ball !== 0; });
    var scratch = pots.some(function (e) { return e.ball === 0; });
    var eightPot = null;
    objectPots.forEach(function (e) { if (e.ball === 8) eightPot = e; });
    var remaining = log.remaining || [];
    var call = log.call || null;
    var groups = log.groups || null;

    var o = {
      isBreak: !!log.isBreak, shooter: shooter, call: call,
      fouls: [], foul: false, scratch: scratch,
      pots: pots.map(function (e) { return { ball: e.ball, pocket: e.pocket }; }),
      potted: objectPots.map(function (e) { return e.ball; }),
      firstHit: log.firstHit === undefined ? null : log.firstHit,
      eightPotted: !!eightPot, calledMade: false, legalBreak: null, railedObjects: 0,
      assign: null, winner: null, loser: null, endReason: null,
      next: opp, ballInHand: null, choice: null
    };

    if (scratch) o.fouls.push('scratch');
    if (o.firstHit === null) o.fouls.push('geenContact');

    if (log.isBreak) {
      var railed = {};
      events.forEach(function (e) { if (e.t === 'rail' && e.ball !== 0) railed[e.ball] = true; });
      o.railedObjects = Object.keys(railed).length;
      o.legalBreak = objectPots.length > 0 || o.railedObjects >= 4;
      o.foul = o.fouls.length > 0;
      if (eightPot) {
        if (o.foul) o.choice = { type: 'achtBreakFout', chooser: opp, options: ['achtTerugKeuken', 'opnieuwBreken'] };
        else o.choice = { type: 'achtBreak', chooser: shooter, options: ['achtTerugDoor', 'opnieuwBreken'] };
      } else if (!o.legalBreak && !o.foul) {
        o.choice = { type: 'ongeldigeBreak', chooser: opp, options: ['accepteren', 'zelfBreken', 'laatBreken'] };
      } else if (o.foul) {
        var opts = scratch ? ['keuken'] : ['accepteren', 'keuken'];
        if (opts.length > 1) o.choice = { type: 'breakFout', chooser: opp, options: opts };
        else { o.next = opp; o.ballInHand = 'kitchen'; }
      } else {
        o.next = objectPots.length > 0 ? shooter : opp;
      }
      return o;
    }

    var legal = legalTargets(groups, remaining, shooter);
    if (o.firstHit !== null && legal.indexOf(o.firstHit) < 0) o.fouls.push('verkeerdeEerste');
    if (log.fromKitchen && o.firstHit !== null && (log.behindHead || []).indexOf(o.firstHit) >= 0 && !log.cueCrossed) {
      o.fouls.push('keukenregel');
    }
    if (o.firstHit !== null) {
      var hitIdx = -1;
      for (var i = 0; i < events.length; i++) if (events[i].t === 'hit') { hitIdx = i; break; }
      var after = events.slice(hitIdx + 1);
      if (!after.some(function (e) { return e.t === 'rail' || e.t === 'pot'; })) o.fouls.push('geenBand');
    }
    o.foul = o.fouls.length > 0;

    var callValid = isValidCall(groups, remaining, shooter, call);
    var calledEight = callValid && call && !call.safety && call.ball === 8;

    if (eightPot) {
      o.loser = shooter; o.winner = opp;
      if (o.foul) o.endReason = 'achtMetFout';
      else if (!calledEight) o.endReason = isOnEight(groups, remaining, shooter) ? 'achtNietAangekondigd' : 'achtTeVroeg';
      else if (eightPot.pocket !== call.pocket) o.endReason = 'achtVerkeerdePocket';
      else { o.winner = shooter; o.loser = opp; o.endReason = 'achtGepot'; o.calledMade = true; }
      if (o.winner === shooter && !groups) o.assign = claimEmpty(remaining, shooter);
      o.next = null;
      return o;
    }

    if (o.foul) {
      o.next = opp; o.ballInHand = 'table';
      return o;
    }
    if (calledEight && !groups) o.assign = claimEmpty(remaining, shooter);
    if (call && call.safety) { o.next = opp; return o; }
    o.calledMade = callValid && pots.some(function (e) { return e.ball === call.ball && e.pocket === call.pocket; });
    if (o.calledMade) {
      o.next = shooter;
      if (!groups && call.ball !== 8) o.assign = { player: shooter, group: groupOf(call.ball) };
    } else {
      o.next = opp;
    }
    return o;
  }

  function claimEmpty(remaining, shooter) {
    var e = emptyGroups(remaining);
    if (!e.length) return null;
    return { player: shooter, group: e[0] };
  }

  /* ─── Partij ────────────────────────────────────────── */

  function defaultNames(mode) {
    return mode === 'duo' ? ['Speler 1', 'Speler 2'] : ['Jij', 'Computer'];
  }

  function newGame(opts) {
    opts = opts || {};
    var mode = opts.mode === 'duo' ? 'duo' : 'cpu';
    var breaker = opts.breaker === 1 ? 1 : 0;
    var balls = [makeBall(0, HEAD_X - 60, MID_Y)].concat(rack(opts.rng));
    return {
      v: 1,
      mode: mode,
      names: opts.names || defaultNames(mode),
      turn: breaker,
      breaker: breaker,
      phase: 'break',
      groups: null,
      ballInHand: 'kitchen',
      choice: null,
      winner: null,
      endReason: null,
      shots: 0,
      balls: balls,
      last: null
    };
  }

  function cloneState(s) {
    var c = JSON.parse(JSON.stringify(s));
    c.balls = cloneBalls(s.balls);
    return c;
  }

  function isCpu(state, idx) { return state.mode === 'cpu' && idx === 1; }

  function remainingOf(state) { return onTableObjects(state.balls); }

  function playerGroup(state, p) { return state.groups ? state.groups[p] : null; }

  function playerTargets(state, p) {
    return legalTargets(state.groups, remainingOf(state), p === undefined ? state.turn : p);
  }

  function placeCue(state, x, y) {
    var zone = state.ballInHand;
    if (!zone) throw new Error('Geen bal in hand');
    var others = state.balls.filter(function (b) { return b.n !== 0; });
    var v = validateCuePlacement(others, x, y, zone);
    if (!v.ok) return { ok: false, reason: v.reason, state: state };
    var s = cloneState(state);
    var cue = s.balls[0];
    cue.x = x; cue.y = y; cue.on = true; cue.pocket = null;
    cue.vx = cue.vy = cue.sx = cue.sy = 0;
    return { ok: true, reason: null, state: s };
  }

  function rerack(s, breaker, rng) {
    s.balls = [makeBall(0, HEAD_X - 60, MID_Y)].concat(rack(rng));
    s.breaker = breaker; s.turn = breaker;
    s.phase = 'break'; s.groups = null; s.ballInHand = 'kitchen'; s.choice = null;
  }

  function ensureCue(s, zone) {
    var cue = s.balls[0];
    if (!cue.on) {
      var spot = findFreeSpot(s.balls, zone || 'table') || { x: HEAD_X - 60, y: MID_Y };
      cue.x = spot.x; cue.y = spot.y; cue.on = true; cue.pocket = null;
      cue.vx = cue.vy = cue.sx = cue.sy = 0;
    }
  }

  function respotEight(s) {
    var eight = ballByN(s.balls, 8);
    if (eight.on) return;
    var pos = spotPosition(s.balls, 8);
    eight.x = pos.x; eight.y = pos.y; eight.on = true; eight.pocket = null;
    eight.vx = eight.vy = eight.sx = eight.sy = 0;
  }

  var CHOICE_TEXT = {
    accepteren: 'Tafel accepteren en zelf stoten',
    zelfBreken: 'Opnieuw rekken en zelf breken',
    laatBreken: 'Opnieuw rekken, de ander breekt nog eens',
    keuken: 'Bal in hand achter de koplijn',
    achtTerugDoor: '8 terugzetten en doorspelen',
    achtTerugKeuken: '8 terugzetten, bal in hand achter de koplijn',
    opnieuwBreken: 'Opnieuw rekken en breken'
  };

  function applyChoice(state, option, rng) {
    if (state.phase !== 'choice' || !state.choice) throw new Error('Er is geen keuze open');
    if (state.choice.options.indexOf(option) < 0) throw new Error('Onbekende keuze: ' + option);
    var s = cloneState(state);
    var ch = s.choice;
    var chooser = ch.chooser, other = 1 - chooser;
    s.choice = null;
    s.last = { choice: option, chooser: chooser };
    switch (option) {
      case 'accepteren':
        s.phase = 'play'; s.turn = chooser; s.ballInHand = null; ensureCue(s, 'table');
        break;
      case 'keuken':
        s.phase = 'play'; s.turn = chooser; s.ballInHand = 'kitchen'; ensureCue(s, 'kitchen');
        break;
      case 'zelfBreken':
        rerack(s, chooser, rng);
        break;
      case 'laatBreken':
        rerack(s, other, rng);
        break;
      case 'opnieuwBreken':
        rerack(s, chooser, rng);
        break;
      case 'achtTerugDoor':
        respotEight(s);
        s.phase = 'play'; s.turn = chooser; s.ballInHand = null; ensureCue(s, 'table');
        break;
      case 'achtTerugKeuken':
        respotEight(s);
        s.phase = 'play'; s.turn = chooser; s.ballInHand = 'kitchen'; ensureCue(s, 'kitchen');
        break;
    }
    if (s.ballInHand === 'kitchen' && s.balls[0].on && s.balls[0].x >= HEAD_X) {
      var spot = findFreeSpot(s.balls.filter(function (b) { return b.n !== 0; }), 'kitchen');
      if (spot) { s.balls[0].x = spot.x; s.balls[0].y = spot.y; }
    }
    return s;
  }

  /*
   * Een stoot beginnen. shot = { angle, speed, call }. Geeft een context terug die stepShot laat lopen.
   * Gooit een fout bij een ongeldige stoot (verkeerde fase, ongeldige plaatsing of aankondiging).
   */
  function beginShot(state, shot) {
    if (state.phase !== 'break' && state.phase !== 'play') throw new Error('Nu kan er niet gestoten worden');
    var cue = state.balls[0];
    if (!cue.on) throw new Error('De witte bal ligt niet op tafel');
    if (state.ballInHand) {
      var v = validateCuePlacement(state.balls.filter(function (b) { return b.n !== 0; }), cue.x, cue.y, state.ballInHand);
      if (!v.ok) throw new Error('De witte bal ligt niet op een geldige plek');
    }
    var remaining = remainingOf(state);
    var isBreak = state.phase === 'break';
    var call = isBreak ? null : (shot.call || null);
    if (!isBreak && !isValidCall(state.groups, remaining, state.turn, call)) throw new Error('Kondig een geldige bal en pocket aan, of kies safety');
    var speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, +shot.speed || 0));
    var angle = +shot.angle || 0;

    var ctx = newSimContext();
    ctx.state = state;
    ctx.balls = cloneBalls(state.balls);
    ctx.pre = {
      isBreak: isBreak,
      shooter: state.turn,
      call: call,
      groups: state.groups ? state.groups.slice() : null,
      remaining: remaining,
      fromKitchen: state.ballInHand === 'kitchen',
      // WPA 1.6/3.11: een objectbal met het middelpunt precies op de koplijn is direct speelbaar.
      behindHead: state.balls.filter(function (b) { return b.on && b.n !== 0 && b.x < HEAD_X; }).map(function (b) { return b.n; })
    };
    ctx.shot = { angle: angle, speed: speed };
    var c = ctx.balls[0];
    c.vx = Math.cos(angle) * speed; c.vy = Math.sin(angle) * speed;
    c.sx = 0; c.sy = 0;
    return ctx;
  }

  /* Laat de stoot frameDt seconden verder lopen in vaste stappen. Geeft true als alles stil ligt. */
  function stepShot(ctx, frameDt) {
    if (ctx.done) return true;
    var dt = Math.max(0, Math.min(MAX_FRAME, +frameDt || 0));
    ctx.acc += dt;
    while (ctx.acc >= DT) {
      ctx.acc -= DT;
      physicsStep(ctx.balls, ctx);
      if (allAtRest(ctx.balls)) { ctx.done = true; break; }
      if (ctx.time >= MAX_SHOT_TIME) { stopAll(ctx.balls); ctx.timedOut = true; ctx.done = true; break; }
    }
    return ctx.done;
  }

  function runShot(ctx) {
    while (!ctx.done) stepShot(ctx, MAX_FRAME);
    return ctx;
  }

  function shotLog(ctx) {
    var p = ctx.pre;
    return {
      isBreak: p.isBreak, shooter: p.shooter, call: p.call, groups: p.groups, remaining: p.remaining,
      fromKitchen: p.fromKitchen, behindHead: p.behindHead, cueCrossed: ctx.cueCrossed,
      firstHit: ctx.firstHit, events: ctx.events.map(function (e) { return { t: e.t, ball: e.ball, pocket: e.pocket }; })
    };
  }

  /* Verwerk de afgelopen stoot: beoordelen en de nieuwe stand opbouwen. */
  function finishShot(ctx) {
    if (!ctx.done) runShot(ctx);
    var log = shotLog(ctx);
    var o = evaluateShot(log);
    var s = cloneState(ctx.state);
    s.balls = cloneBalls(ctx.balls);
    stopAll(s.balls);
    s.shots += 1;
    s.last = { outcome: o };
    if (o.assign) {
      var g = o.assign.group;
      var other = g === 'vol' ? 'half' : 'vol';
      s.groups = o.assign.player === 0 ? [g, other] : [other, g];
    }
    if (o.winner !== null) {
      s.phase = 'over'; s.winner = o.winner; s.endReason = o.endReason; s.ballInHand = null; s.choice = null;
    } else if (o.choice) {
      s.phase = 'choice'; s.choice = o.choice; s.turn = o.choice.chooser; s.ballInHand = null;
    } else {
      s.phase = 'play';
      s.turn = o.next;
      s.ballInHand = o.ballInHand;
      if (!s.balls[0].on) {
        // Kan alleen bij een fout; voor de zekerheid altijd bal in hand.
        if (!s.ballInHand) s.ballInHand = 'table';
        ensureCue(s, s.ballInHand);
      } else if (s.ballInHand === 'kitchen' && s.balls[0].x >= HEAD_X) {
        var spot = findFreeSpot(s.balls.filter(function (b) { return b.n !== 0; }), 'kitchen');
        if (spot) { s.balls[0].x = spot.x; s.balls[0].y = spot.y; }
      }
    }
    return { state: s, outcome: o, log: log, timedOut: ctx.timedOut };
  }

  function playShot(state, shot) {
    var ctx = beginShot(state, shot);
    runShot(ctx);
    return finishShot(ctx);
  }

  /* ─── Teksten ───────────────────────────────────────── */

  var GROUP_TEXT = { vol: 'volle ballen (1–7)', half: 'halve ballen (9–15)' };
  var GROUP_SHORT = { vol: 'Volle', half: 'Halve' };

  var END_TEXT = {
    achtGepot: 'pot de 8 netjes in de aangekondigde pocket',
    achtMetFout: 'pot de 8 met een fout en verliest',
    achtTeVroeg: 'pot de 8 te vroeg en verliest',
    achtNietAangekondigd: 'pot de 8 zonder hem aan te kondigen en verliest',
    achtVerkeerdePocket: 'pot de 8 in een andere pocket dan aangekondigd en verliest'
  };

  function describeOutcome(o, state, pocketName) {
    pocketName = pocketName || function (id) { return POCKET_NAMES[id]; };
    var names = state.names;
    var me = names[o.shooter], other = names[1 - o.shooter];
    var lines = [];
    if (o.winner !== null) {
      lines.push(me + ' ' + END_TEXT[o.endReason] + '.');
      lines.push(names[o.winner] + ' wint de partij.');
      return lines;
    }
    if (o.isBreak) {
      if (o.choice) {
        var t = o.choice.type, ch = names[o.choice.chooser];
        if (t === 'achtBreak') lines.push('De 8 valt op de break. ' + ch + ' kiest: 8 terugzetten en doorspelen, of opnieuw breken.');
        else if (t === 'achtBreakFout') lines.push('De 8 valt op de break, met een fout. ' + ch + ' kiest: 8 terug met bal in hand achter de koplijn, of opnieuw breken.');
        else if (t === 'ongeldigeBreak') lines.push('Geen geldige break: niets gepot en minder dan vier ballen tegen een band. ' + ch + ' kiest hoe het verder gaat.');
        else if (t === 'breakFout') lines.push('Fout op de break. ' + ch + ' kiest hoe het verder gaat.');
        return lines;
      }
      if (o.foul) {
        lines.push('Fout op de break: ' + o.fouls.map(function (f) { return FOUL_TEXT[f]; }).join(', ') + '. ' + other + ' krijgt bal in hand achter de koplijn.');
        return lines;
      }
      if (o.potted.length) lines.push('Goede break: ' + o.potted.length + (o.potted.length === 1 ? ' bal' : ' ballen') + ' gepot. ' + me + ' gaat door, de tafel is open.');
      else lines.push('Geldige break, niets gepot. ' + other + ' is aan de beurt, de tafel is open.');
      return lines;
    }
    if (o.foul) {
      lines.push('Fout: ' + o.fouls.map(function (f) { return FOUL_TEXT[f]; }).join(', ') + '. ' + other + ' krijgt bal in hand.');
      return lines;
    }
    if (o.assign) lines.push(names[o.assign.player] + ' speelt met de ' + GROUP_TEXT[o.assign.group] + '.');
    if (o.call && o.call.safety) {
      lines.push(me + ' speelde safety. ' + other + ' is aan de beurt.');
    } else if (o.calledMade) {
      lines.push(o.call.ball + ' in ' + pocketName(o.call.pocket) + '. ' + me + ' gaat door.');
    } else {
      lines.push((o.potted.length ? 'Niet de aangekondigde bal in de aangekondigde pocket. ' : 'Mis. ') + other + ' is aan de beurt.');
    }
    return lines;
  }

  return {
    // maten
    W: W, H: H, R: R, D: D, HEAD_X: HEAD_X, FOOT_X: FOOT_X, MID_Y: MID_Y,
    DT: DT, MAX_SPEED: MAX_SPEED, MIN_SPEED: MIN_SPEED, MAX_FRAME: MAX_FRAME, MAX_SHOT_TIME: MAX_SHOT_TIME,
    STORAGE_KEY: STORAGE_KEY,
    PHYS: { MU_SLIDE: MU_SLIDE, ROLL_DECEL: ROLL_DECEL, LIN_DAMP: LIN_DAMP, STOP_V: STOP_V, E_BALL: E_BALL, E_RAIL: E_RAIL },
    CUSHIONS: CUSHIONS, POCKETS: POCKETS, POCKET_IDS: POCKET_IDS, POCKET_NAMES: POCKET_NAMES,
    FOUL_TEXT: FOUL_TEXT, CHOICE_TEXT: CHOICE_TEXT, GROUP_TEXT: GROUP_TEXT, GROUP_SHORT: GROUP_SHORT, END_TEXT: END_TEXT,
    // hulpjes
    seededRng: seededRng, groupOf: groupOf, pocketById: pocketById, ballByN: ballByN,
    pointSegDist: pointSegDist, pointLineSegDist: pointLineSegDist, segSegDist: segSegDist, seg: seg,
    rayCircle: rayCircle, rayCapsule: rayCapsule,
    // ballen en simulatie
    makeBall: makeBall, cloneBalls: cloneBalls, rack: rack, rackSlots: rackSlots,
    newSimContext: newSimContext, physicsStep: physicsStep, simulate: simulate, allAtRest: allAtRest,
    dropPocket: dropPocket, castAim: castAim,
    // plaatsing
    validateCuePlacement: validateCuePlacement, findFreeSpot: findFreeSpot, spotPosition: spotPosition,
    // regels
    onTableObjects: onTableObjects, emptyGroups: emptyGroups, legalTargets: legalTargets, isOnEight: isOnEight,
    isValidCall: isValidCall, evaluateShot: evaluateShot,
    // partij
    newGame: newGame, cloneState: cloneState, isCpu: isCpu, remainingOf: remainingOf, playerGroup: playerGroup,
    playerTargets: playerTargets, placeCue: placeCue, applyChoice: applyChoice,
    beginShot: beginShot, stepShot: stepShot, runShot: runShot, shotLog: shotLog, finishShot: finishShot, playShot: playShot,
    describeOutcome: describeOutcome
  };
});
