/*
 * Pool (8-ball): de computertegenstander.
 *
 * Werkt op geometrie: voor elke eigen bal en elke pocket zoekt hij een vrije lijn van de bal naar de
 * pocket, rekent de ghost-ballpositie uit en kijkt of de witte bal daar vrij naartoe kan. De beste
 * paar kansen worden één keer met de echte simulatie nagerekend (geen brute force), zodat hij geen
 * stoot kiest die zeker een fout of een vroege 8 oplevert. Lukt potten niet, dan speelt hij safety:
 * een volle raak op een eigen bal met genoeg kracht voor een band, of een stoot via één band.
 *
 *   browser:  window.PoolBot   (na engine.js laden)
 *   Node:     const Bot = require('./bot.js');
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./engine.js'));
  else root.PoolBot = factory(root.PoolEngine);
})(typeof self !== 'undefined' ? self : this, function (P) {
  'use strict';

  var R = P.R, D = P.D, PH = P.PHYS;
  var RAIL_TOL = R - 0.3;

  /* ─── Snelheid naar afstand (zelfde wrijving als de simulatie, maar in 1D) ── */

  function speedAfter(v, s, dist) {
    var x = 0, h = 1 / 960, guard = 0;
    while (x < dist) {
      if (++guard > 200000) return 0;
      var sl = v - s;
      if (Math.abs(sl) > 1e-6) {
        var dv = PH.MU_SLIDE * h;
        if (Math.abs(sl) <= 3.5 * dv) { v = s = (5 * v + 2 * s) / 7; }
        else { var sg = sl > 0 ? 1 : -1; v -= sg * dv; s += sg * 2.5 * dv; }
      } else {
        var ns = v - (PH.ROLL_DECEL + PH.LIN_DAMP * v) * h;
        if (ns < PH.STOP_V) return 0;
        v = s = ns;
      }
      if (v <= 0) return 0;
      x += v * h;
    }
    return v;
  }

  /* Kleinste beginsnelheid (glijdend, zonder rotatie) om over dist nog met arrive aan te komen. */
  function speedNeeded(dist, arrive) {
    var lo = 50, hi = P.MAX_SPEED * 1.6;
    if (speedAfter(hi, 0, dist) < arrive) return Infinity;
    for (var i = 0; i < 26; i++) {
      var mid = (lo + hi) / 2;
      if (speedAfter(mid, 0, dist) >= arrive) hi = mid; else lo = mid;
    }
    return hi;
  }

  /* ─── Vrije lijnen ──────────────────────────────────── */

  function pathClearOfBalls(balls, ax, ay, bx, by, skip, clearance) {
    var s = P.seg(ax, ay, bx, by);
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      if (!b.on || skip.indexOf(b.n) >= 0) continue;
      if (P.pointSegDist(b.x, b.y, s) < clearance) return false;
    }
    return true;
  }

  function pathClearOfCushions(ax, ay, bx, by) {
    var s = P.seg(ax, ay, bx, by);
    for (var i = 0; i < P.CUSHIONS.length; i++) {
      if (P.segSegDist(s, P.CUSHIONS[i]) < RAIL_TOL) return false;
    }
    return true;
  }

  function insideTable(x, y) {
    if (x < R - 0.5 || x > P.W - R + 0.5 || y < R - 0.5 || y > P.H - R + 0.5) return false;
    for (var i = 0; i < P.CUSHIONS.length; i++) if (P.pointSegDist(x, y, P.CUSHIONS[i]) < RAIL_TOL) return false;
    return true;
  }

  /* ─── Potkansen ─────────────────────────────────────── */

  function callTargets(state) {
    return P.playerTargets(state, state.turn);
  }

  /*
   * Alle potkansen vanaf de huidige witte bal. Elke kans: { ball, pocket, angle, speed, cut, score }.
   */
  function potCandidates(state, cueX, cueY, opts) {
    opts = opts || {};
    var balls = state.balls;
    var cue = { x: cueX, y: cueY };
    var out = [];
    var targets = callTargets(state);
    targets.forEach(function (n) {
      var B = P.ballByN(balls, n);
      if (!B || !B.on) return;
      if (opts.kitchen && B.x < P.HEAD_X) return;   // keukenregel: niet direct achter de koplijn
      P.POCKETS.forEach(function (p) {
        // Beste doelpunt in de pocket: vrij van banden en ballen, zo centraal mogelijk.
        var best = null, bestDev = Infinity;
        var centralA = Math.atan2(p.aim.y - B.y, p.aim.x - B.x);
        p.targets.forEach(function (T) {
          var dx = T.x - B.x, dy = T.y - B.y, len = Math.hypot(dx, dy);
          if (len < 1) return;
          var ux = dx / len, uy = dy / len;
          // Aanloophoek ten opzichte van de pocketas
          var cosAx = ux * p.axis.x + uy * p.axis.y;
          if (cosAx < (p.kind === 'hoek' ? 0.34 : 0.42)) return;
          if (!pathClearOfCushions(B.x, B.y, T.x, T.y)) return;
          if (!pathClearOfBalls(balls, B.x, B.y, T.x, T.y, [n, 0], D + 1)) return;
          var dev = Math.abs(angleDiff(Math.atan2(dy, dx), centralA));
          if (dev < bestDev) { bestDev = dev; best = { T: T, ux: ux, uy: uy, len: len }; }
        });
        if (!best) return;
        var gx = B.x - best.ux * D, gy = B.y - best.uy * D;
        if (!insideTable(gx, gy)) return;
        for (var i = 0; i < balls.length; i++) {
          var o = balls[i];
          if (!o.on || o.n === 0 || o.n === n) continue;
          if (Math.hypot(o.x - gx, o.y - gy) < D - 0.01) return;
        }
        var cdx = gx - cue.x, cdy = gy - cue.y, dCue = Math.hypot(cdx, cdy);
        if (dCue < 1) return;
        var cx = cdx / dCue, cy = cdy / dCue;
        var cosCut = cx * best.ux + cy * best.uy;
        if (cosCut < Math.cos(80 * Math.PI / 180)) return;
        if (!pathClearOfBalls(balls, cue.x, cue.y, gx, gy, [0, n], D + 1)) return;
        if (!pathClearOfCushions(cue.x, cue.y, gx, gy)) return;
        // Kracht: de objectbal moet de pocket met wat vaart halen; de witte bal moet die vaart leveren.
        var vObj = speedNeeded(best.len + 120, 260);
        var vContact = vObj / (cosCut * (1 + PH.E_BALL) / 2);
        var v0 = speedNeeded(dCue, vContact);
        var feasible = isFinite(v0) && v0 <= P.MAX_SPEED;
        if (!feasible) v0 = P.MAX_SPEED;
        v0 = Math.max(P.MIN_SPEED, Math.min(P.MAX_SPEED, v0 * 1.06));
        var cut = Math.acos(Math.max(-1, Math.min(1, cosCut)));
        var score = cosCut * cosCut / (1 + (dCue * 0.35 + best.len) / 900);
        if (p.kind === 'midden') score *= 0.85;
        if (!feasible) score *= 0.2;
        out.push({ kind: 'pot', ball: n, pocket: p.id, angle: Math.atan2(cdy, cdx), speed: v0, cut: cut, score: score });
      });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  function angleDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /* ─── Safety en bandstoten ──────────────────────────── */

  function safetyCandidates(state, cueX, cueY, opts) {
    opts = opts || {};
    var balls = state.balls, out = [];
    callTargets(state).forEach(function (n) {
      var B = P.ballByN(balls, n);
      if (!B || !B.on) return;
      if (opts.kitchen && B.x < P.HEAD_X) return;
      var dx = B.x - cueX, dy = B.y - cueY, len = Math.hypot(dx, dy);
      if (len < D) return;
      var ux = dx / len, uy = dy / len;
      var gx = B.x - ux * D, gy = B.y - uy * D;
      if (pathClearOfBalls(balls, cueX, cueY, gx, gy, [0, n], D + 1) && pathClearOfCushions(cueX, cueY, gx, gy)) {
        // Volle raak: de objectbal gaat rechtdoor. Hoe ver is de eerste band of bal?
        var ray = P.castAim(balls, B.x, B.y, Math.atan2(uy, ux), n);
        var travel = Math.min(ray.t, 2600) + 80;
        var vObj = speedNeeded(travel, 120);
        var v0 = speedNeeded(len - D, vObj / ((1 + PH.E_BALL) / 2));
        if (isFinite(v0) && v0 <= P.MAX_SPEED) {
          out.push({ kind: 'safety', ball: n, angle: Math.atan2(uy, ux), speed: Math.max(P.MIN_SPEED, v0 * 1.15), score: 1 / (1 + v0 / 2000) });
        }
      }
    });
    if (!out.length) out = kickCandidates(state, cueX, cueY, opts);
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  /* Via één band: spiegel de doelbal in de bandlijn en mik op het spiegelbeeld. */
  function kickCandidates(state, cueX, cueY, opts) {
    var balls = state.balls, out = [];
    var lines = [
      { axis: 'x', v: R }, { axis: 'x', v: P.W - R }, { axis: 'y', v: R }, { axis: 'y', v: P.H - R }
    ];
    callTargets(state).forEach(function (n) {
      var B = P.ballByN(balls, n);
      if (!B || !B.on) return;
      if (opts && opts.kitchen && B.x < P.HEAD_X) return;
      lines.forEach(function (L) {
        var mx = L.axis === 'x' ? 2 * L.v - B.x : B.x;
        var my = L.axis === 'y' ? 2 * L.v - B.y : B.y;
        var dx = mx - cueX, dy = my - cueY;
        var tq = L.axis === 'x' ? (L.v - cueX) / dx : (L.v - cueY) / dy;
        if (!isFinite(tq) || tq <= 0 || tq >= 1) return;
        var qx = cueX + dx * tq, qy = cueY + dy * tq;
        // Niet in een pocketbek mikken
        var nearPocket = P.POCKETS.some(function (p) { return Math.hypot(p.x - qx, p.y - qy) < 190; });
        if (nearPocket) return;
        if (!pathClearOfBalls(balls, cueX, cueY, qx, qy, [0], D + 1)) return;
        if (!pathClearOfBalls(balls, qx, qy, B.x, B.y, [0, n], D + 1)) return;
        var dist = Math.hypot(dx, dy);
        var v0 = Math.min(P.MAX_SPEED, speedNeeded(dist, 900) / P.PHYS.E_RAIL);
        if (!isFinite(v0)) v0 = P.MAX_SPEED * 0.85;
        out.push({ kind: 'kick', ball: n, angle: Math.atan2(dy, dx), speed: Math.max(1500, v0), score: 0.2 / (1 + dist / 2000) });
      });
    });
    return out;
  }

  /* ─── Plaatsen bij bal in hand ──────────────────────── */

  function planPlacement(state) {
    var zone = state.ballInHand;
    var balls = state.balls;
    var others = balls.filter(function (b) { return b.n !== 0; });
    var kitchen = zone === 'kitchen';
    var cands = [];
    callTargets(state).forEach(function (n) {
      var B = P.ballByN(balls, n);
      if (!B || !B.on) return;
      if (kitchen && B.x < P.HEAD_X) return;
      P.POCKETS.forEach(function (p) {
        var ux = p.aim.x - B.x, uy = p.aim.y - B.y, l = Math.hypot(ux, uy);
        if (l < 1) return;
        ux /= l; uy /= l;
        [170, 300, 480, 700].forEach(function (d) {
          var x = B.x - ux * (D + d), y = B.y - uy * (D + d);
          cands.push({ x: x, y: y });
        });
      });
    });
    var gx0 = kitchen ? 60 : 120, gx1 = kitchen ? P.HEAD_X - 1 : P.W - 120;
    for (var gx = gx0; gx <= gx1; gx += kitchen ? 95 : 240) {
      for (var gy = 90; gy <= P.H - 90; gy += 125) cands.push({ x: gx, y: gy });
    }
    var best = null, bestScore = -Infinity;
    cands.forEach(function (c) {
      if (!P.validateCuePlacement(others, c.x, c.y, zone).ok) return;
      var pots = potCandidates(state, c.x, c.y, { kitchen: kitchen });
      var sc = pots.length ? pots[0].score : -1 + (safetyCandidates(state, c.x, c.y, { kitchen: kitchen }).length ? 0.5 : 0);
      if (sc > bestScore) { bestScore = sc; best = c; }
    });
    if (!best) best = P.findFreeSpot(others, zone) || { x: P.HEAD_X - 60, y: P.MID_Y };
    return best;
  }

  /* ─── Beurt plannen ─────────────────────────────────── */

  function gauss(rng) {
    var u = 1 - rng(), v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function withCue(state, x, y) {
    var s = P.cloneState(state);
    s.balls[0].x = x; s.balls[0].y = y; s.balls[0].on = true;
    return s;
  }

  function verify(state, plan) {
    try {
      var r = P.playShot(state, { angle: plan.angle, speed: plan.speed, call: plan.call });
      var o = r.outcome;
      if (o.winner !== null) return o.winner === state.turn ? 3 : -5;
      if (o.foul) return -2;
      if (o.calledMade) return 2;
      return 0;
    } catch (e) {
      return -9;
    }
  }

  /*
   * Plan de beurt van de speler die aan de beurt is.
   * opts: { rng, noise (radialen, standaard 0.0035), verify (standaard true) }
   * Geeft { place: {x,y}|null, angle, speed, call, kind } terug. Gooit nooit.
   */
  function planTurn(state, opts) {
    opts = opts || {};
    var rng = opts.rng || Math.random;
    var noise = opts.noise === undefined ? 0.0035 : opts.noise;
    var plan;
    try {
      plan = planInner(state, opts, rng);
    } catch (e) {
      plan = null;
    }
    if (!plan) plan = emergency(state);
    if (noise > 0 && plan.kind !== 'break') {
      plan.angle += gauss(rng) * noise;
      plan.speed = Math.max(P.MIN_SPEED, Math.min(P.MAX_SPEED, plan.speed * (1 + gauss(rng) * 0.03)));
    }
    return plan;
  }

  function planInner(state, opts, rng) {
    var place = null;
    var s = state;
    if (state.ballInHand) {
      if (state.phase === 'break') {
        var y = P.MID_Y + (rng() - 0.5) * 260;
        place = { x: P.HEAD_X - 30, y: y };
        if (!P.validateCuePlacement(state.balls.filter(function (b) { return b.n !== 0; }), place.x, place.y, 'kitchen').ok) {
          place = P.findFreeSpot(state.balls.filter(function (b) { return b.n !== 0; }), 'kitchen');
        }
      } else {
        place = planPlacement(state);
      }
      s = withCue(state, place.x, place.y);
    }
    var cue = s.balls[0];

    if (s.phase === 'break') {
      // Mik op de kopbal (dichtst bij het voetpunt), volle kracht.
      var apex = null, ad = Infinity;
      s.balls.forEach(function (b) {
        if (!b.on || b.n === 0) return;
        var d = Math.hypot(b.x - P.FOOT_X, b.y - P.MID_Y);
        if (d < ad) { ad = d; apex = b; }
      });
      var ang = Math.atan2(apex.y - cue.y, apex.x - cue.x) + (rng() - 0.5) * 0.004;
      return { place: place, angle: ang, speed: P.MAX_SPEED * 0.97, call: null, kind: 'break' };
    }

    var kitchen = s.ballInHand === 'kitchen';
    var pots = potCandidates(s, cue.x, cue.y, { kitchen: kitchen });
    var check = opts.verify === false ? 0 : 4;
    for (var i = 0; i < pots.length && i < Math.max(1, check); i++) {
      var c = pots[i];
      var plan = { place: place, angle: c.angle, speed: c.speed, call: { ball: c.ball, pocket: c.pocket }, kind: 'pot', score: c.score };
      if (!check) return plan;
      var v = verify(s, plan);
      if (v >= 2) return plan;
    }
    var safes = safetyCandidates(s, cue.x, cue.y, { kitchen: kitchen });
    for (var j = 0; j < safes.length && j < 5; j++) {
      var sp = { place: place, angle: safes[j].angle, speed: safes[j].speed, call: { safety: true }, kind: safes[j].kind };
      if (!check) return sp;
      if (verify(s, sp) >= 0) return sp;
    }
    // Geen zekere stoot: neem de beste potkans of safety zonder verificatie.
    if (pots.length) return { place: place, angle: pots[0].angle, speed: pots[0].speed, call: { ball: pots[0].ball, pocket: pots[0].pocket }, kind: 'pot' };
    if (safes.length) return { place: place, angle: safes[0].angle, speed: safes[0].speed, call: { safety: true }, kind: safes[0].kind };
    var em = emergency(s);
    em.place = place;
    return em;
  }

  /* Altijd een geldige invoer: op de dichtstbijzijnde eigen bal, safety aangekondigd. */
  function emergency(state) {
    var cue = state.balls[0];
    var targets = P.playerTargets(state, state.turn);
    var best = null, bd = Infinity;
    targets.forEach(function (n) {
      var b = P.ballByN(state.balls, n);
      if (!b || !b.on) return;
      var d = Math.hypot(b.x - cue.x, b.y - cue.y);
      if (d < bd) { bd = d; best = b; }
    });
    var angle = best ? Math.atan2(best.y - cue.y, best.x - cue.x) : 0;
    var place = null;
    if (state.ballInHand && !P.validateCuePlacement(state.balls.filter(function (b) { return b.n !== 0; }), cue.x, cue.y, state.ballInHand).ok) {
      place = P.findFreeSpot(state.balls.filter(function (b) { return b.n !== 0; }), state.ballInHand);
    }
    return { place: place, angle: angle, speed: 3200, call: state.phase === 'break' ? null : { safety: true }, kind: 'nood' };
  }

  /* ─── Breakkeuzes ───────────────────────────────────── */

  function chooseOption(state) {
    var ch = state.choice;
    if (!ch) return null;
    var o = ch.options;
    function has(x) { return o.indexOf(x) >= 0; }
    if (ch.type === 'achtBreak' && has('achtTerugDoor')) return 'achtTerugDoor';
    if (ch.type === 'achtBreakFout' && has('achtTerugKeuken')) return 'achtTerugKeuken';
    if (has('accepteren')) {
      var s = P.cloneState(state);
      s.phase = 'play'; s.turn = ch.chooser; s.choice = null;
      var cue = s.balls[0];
      if (cue.on) {
        var pots = potCandidates(s, cue.x, cue.y, {});
        if (pots.length && pots[0].score > 0.35) return 'accepteren';
      }
    }
    if (has('keuken')) return 'keuken';
    if (has('laatBreken')) return 'laatBreken';
    return o[0];
  }

  return {
    planTurn: planTurn,
    chooseOption: chooseOption,
    potCandidates: potCandidates,
    safetyCandidates: safetyCandidates,
    planPlacement: planPlacement,
    speedAfter: speedAfter,
    speedNeeded: speedNeeded
  };
});
