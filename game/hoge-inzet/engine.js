/*
 * Hoge Inzet: spelregels en rekenwerk.
 *
 * Dit bestand bevat alleen pure functies: geen DOM, geen opslag, geen timers. Elke functie die een
 * spelstand verandert krijgt een stand binnen en geeft een NIEUWE stand terug; de invoer wordt nooit
 * aangepast. Zo is alles los te testen:
 *
 *   browser (klassiek script):  window.HogeInzetEngine
 *   Node:                       const E = require('./engine.js');
 *
 * Geld: alle bedragen zijn speelfiches. Inzetten zijn hele getallen (10/25/50/100). Alleen een
 * blackjack betaalt 3:2 en kan dus een halve fiche opleveren (25 -> 62,5 terug). Bedragen zijn
 * daarom altijd een veelvoud van 0,5. Veelvouden van 0,5 zijn in een JavaScript-double exact
 * (het zijn binaire breuken) zolang ze onder 2^52 blijven; MAX_SALDO houdt ze daar ruim onder.
 * isAmount() bewaakt die regel bij elke invoer en bij het inlezen van opslag.
 *
 * Toevalsbron: crypto.getRandomValues (browser en Node 19+), met rejection sampling zodat elke
 * uitkomst precies even waarschijnlijk is. Ontbreekt crypto, dan valt het terug op Math.random.
 * Functies die toeval gebruiken nemen een optionele bron (functie die een uint32 teruggeeft) mee,
 * zodat een test een vaste reeks kan invoeren. De game zelf geeft nooit een bron mee.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HogeInzetEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'fa_hoge_inzet_v1';
  var START_SALDO = 1000;
  var CHIP_VALUES = [10, 25, 50, 100];
  var HISTORY_MAX = 12;
  var MAX_SALDO = 1e12;
  var UINT32 = 4294967296;

  /* ─── Toeval ─────────────────────────────────────────── */

  var defaultSource = null;

  function makeDefaultSource() {
    var c = null;
    if (typeof globalThis !== 'undefined' && globalThis.crypto) c = globalThis.crypto;
    else if (typeof self !== 'undefined' && self.crypto) c = self.crypto;
    if (c && typeof c.getRandomValues === 'function') {
      var buf = new Uint32Array(1);
      return function () { c.getRandomValues(buf); return buf[0]; };
    }
    return function () { return Math.floor(Math.random() * UINT32); };
  }

  function uint32() {
    if (!defaultSource) defaultSource = makeDefaultSource();
    return defaultSource();
  }

  // Uniform geheel getal in [0, n). Rejection sampling: waarden boven het grootste veelvoud van n
  // onder 2^32 worden weggegooid, anders zouden lage uitkomsten een fractie vaker vallen.
  function randomInt(n, source) {
    if (!Number.isInteger(n) || n < 1 || n > UINT32) throw new RangeError('randomInt: n buiten bereik');
    var next = source || uint32;
    var limit = Math.floor(UINT32 / n) * n;
    for (;;) {
      var u = next();
      if (!(Number.isInteger(u) && u >= 0 && u < UINT32)) throw new RangeError('randomInt: bron gaf geen uint32');
      if (u < limit) return u % n;
    }
  }

  // Fisher-Yates. Geeft een geschudde kopie terug.
  function shuffle(arr, source) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomInt(i + 1, source);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ─── Bedragen en stand ──────────────────────────────── */

  function isAmount(x) {
    return typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= MAX_SALDO && Number.isInteger(x * 2);
  }

  function isCount(x) {
    return typeof x === 'number' && Number.isSafeInteger(x) && x >= 0;
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function newGame() {
    return {
      v: 1,
      saldo: START_SALDO,
      top: START_SALDO,
      rondes: 0,
      gewonnen: 0,
      // Een afgerekende ronde waarvan de animatie nog niet is afgespeeld: 'roulette', 'blackjack' of null.
      open: null,
      roulette: { inzet: {}, vorige: null, historie: [], laatste: null },
      blackjack: { shoe: [], hand: null, laatsteInzet: CHIP_VALUES[0] }
    };
  }

  function fail(reden) { return { ok: false, reden: reden }; }

  function boekUitslag(s, inzet, uitbetaling) {
    s.saldo += uitbetaling;
    if (s.saldo > s.top) s.top = s.saldo;
    s.rondes += 1;
    if (uitbetaling > inzet) s.gewonnen += 1;
  }

  /* ─── Roulette: wiel ─────────────────────────────────── */

  // Europees wiel, met de klok mee vanaf de nul.
  var WHEEL_ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16,
    33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  var RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  var POCKET_DEG = 360 / 37;

  function isRouletteNumber(n) { return Number.isInteger(n) && n >= 0 && n <= 36; }

  function colorOf(n) {
    if (!isRouletteNumber(n)) throw new RangeError('colorOf: geen roulettenummer');
    if (n === 0) return 'groen';
    return RED_NUMBERS.indexOf(n) >= 0 ? 'rood' : 'zwart';
  }

  /*
   * Geometrie van wiel en bal.
   *
   * Assenstelsel: hoeken in graden, 0 = boven (12 uur), positief = met de klok mee, net als CSS
   * rotate(). In zijn eigen assenstelsel (rotatie 0) ligt het midden van vakje WHEEL_ORDER[i] op
   * i * 360/37 graden. Draait het wiel R graden, dan staat dat vakje op norm(pocketAngle(n) + R).
   *
   * De wijzer staat vast boven (0 graden). De bal draait in een eigen laag tegen de klok in en komt
   * altijd tot stilstand op een veelvoud van 360, dus ook boven. Wiel en bal stoppen dus allebei op
   * het vakje dat onder de wijzer staat; wheelRotationFor zorgt dat dat het getrokken nummer is.
   * numberAtRotation is de omgekeerde som en laat een test controleren dat het klopt.
   */
  function norm(deg) {
    var r = deg % 360;
    return r < 0 ? r + 360 : r;
  }

  function pocketAngle(n) {
    var i = WHEEL_ORDER.indexOf(n);
    if (i < 0) throw new RangeError('pocketAngle: geen roulettenummer');
    return i * POCKET_DEG;
  }

  // Doelrotatie voor het wiel: minstens `turns` hele slagen verder dan `current`, en zo dat het
  // midden van vakje n precies onder de wijzer (0 graden) eindigt.
  function wheelRotationFor(n, current, turns) {
    var base = (Number(current) || 0) + Math.max(0, Math.floor(turns || 0)) * 360;
    var delta = norm(-pocketAngle(n) - base);
    if (delta > 360 - 1e-9) delta = 0;
    return base + delta;
  }

  // Welk nummer staat onder de wijzer bij wielrotatie R?
  function numberAtRotation(R) {
    var idx = Math.round(norm(-R) / POCKET_DEG) % 37;
    return WHEEL_ORDER[idx];
  }

  // Doelrotatie voor de bal: `turns` slagen tegen de klok in, eindigend op een veelvoud van 360 (boven).
  function ballRotationFor(current, turns) {
    var k = Math.floor((Number(current) || 0) / 360);
    return (k - Math.max(1, Math.floor(turns || 1))) * 360;
  }

  /* ─── Roulette: inzetten en uitbetaling ──────────────── */

  // Sleutels: 'n0' t/m 'n36' voor een nummer, plus zes buitenkansen.
  var OUTSIDE_BETS = ['rood', 'zwart', 'even', 'oneven', 'laag', 'hoog'];

  function isBetKey(k) {
    if (typeof k !== 'string') return false;
    if (OUTSIDE_BETS.indexOf(k) >= 0) return true;
    var m = /^n(\d{1,2})$/.exec(k);
    return !!m && String(Number(m[1])) === m[1] && Number(m[1]) <= 36;
  }

  // Wint deze inzet bij uitkomst n? Op de nul verliezen alle buitenkansen, ook even en laag.
  function betWins(k, n) {
    if (!isBetKey(k)) throw new RangeError('betWins: onbekende inzet');
    if (!isRouletteNumber(n)) throw new RangeError('betWins: geen roulettenummer');
    if (k.charAt(0) === 'n') return Number(k.slice(1)) === n;
    if (n === 0) return false;
    switch (k) {
      case 'rood': return colorOf(n) === 'rood';
      case 'zwart': return colorOf(n) === 'zwart';
      case 'even': return n % 2 === 0;
      case 'oneven': return n % 2 === 1;
      case 'laag': return n <= 18;
      case 'hoog': return n >= 19;
    }
    return false;
  }

  // Wat komt er terug per ingezette fiche, inclusief de inzet zelf: nummer 36x (35 winst), buitenkans 2x.
  function betMultiplier(k) {
    if (!isBetKey(k)) throw new RangeError('betMultiplier: onbekende inzet');
    return k.charAt(0) === 'n' ? 36 : 2;
  }

  function betTotal(bets) {
    var t = 0;
    for (var k in bets) if (Object.prototype.hasOwnProperty.call(bets, k)) t += bets[k];
    return t;
  }

  function isBetMap(bets) {
    if (!bets || typeof bets !== 'object' || Array.isArray(bets)) return false;
    for (var k in bets) {
      if (!Object.prototype.hasOwnProperty.call(bets, k)) continue;
      if (!isBetKey(k)) return false;
      var v = bets[k];
      if (!(Number.isSafeInteger(v) && v > 0 && v <= MAX_SALDO)) return false;
    }
    return betTotal(bets) <= MAX_SALDO;
  }

  function settleBets(bets, n) {
    var inzet = 0, uitbetaling = 0, winnend = [];
    for (var k in bets) {
      if (!Object.prototype.hasOwnProperty.call(bets, k)) continue;
      inzet += bets[k];
      if (betWins(k, n)) { uitbetaling += bets[k] * betMultiplier(k); winnend.push(k); }
    }
    return { inzet: inzet, uitbetaling: uitbetaling, netto: uitbetaling - inzet, winnend: winnend };
  }

  // Een fiche op de tafel leggen. De fiche gaat direct van het saldo af.
  function placeBet(state, key, amount) {
    if (!isBetKey(key)) return fail('Onbekende inzet.');
    if (CHIP_VALUES.indexOf(amount) < 0) return fail('Kies een fiche van 10, 25, 50 of 100.');
    if (state.saldo < amount) return fail('Je hebt niet genoeg fiches voor deze inzet.');
    var s = clone(state);
    s.saldo -= amount;
    s.roulette.inzet[key] = (s.roulette.inzet[key] || 0) + amount;
    return { ok: true, state: s };
  }

  // Alle nog niet gedraaide inzet terug naar de bank.
  function clearBets(state) {
    var totaal = betTotal(state.roulette.inzet);
    if (totaal === 0) return fail('Er ligt geen inzet op tafel.');
    var s = clone(state);
    s.saldo += totaal;
    s.roulette.inzet = {};
    return { ok: true, state: s, terug: totaal };
  }

  // De vorige inzet in zijn geheel opnieuw leggen. Alleen op een lege tafel en alleen als alles past.
  function repeatBets(state) {
    var vorige = state.roulette.vorige;
    if (!vorige || betTotal(vorige) === 0) return fail('Er is nog geen vorige inzet.');
    if (betTotal(state.roulette.inzet) > 0) return fail('Wis eerst de inzet die nu op tafel ligt.');
    var totaal = betTotal(vorige);
    if (state.saldo < totaal) return fail('De vorige inzet past niet meer in je saldo.');
    var s = clone(state);
    s.saldo -= totaal;
    s.roulette.inzet = clone(vorige);
    return { ok: true, state: s };
  }

  // Draaien: trekt één uniform nummer, rekent af en geeft de nieuwe stand terug. Afrekenen en
  // het vastleggen van de uitslag gebeuren in één stap; de animatie is daarna alleen nog weergave.
  function spin(state, source) {
    var bets = state.roulette.inzet;
    var totaal = betTotal(bets);
    if (totaal === 0) return fail('Leg eerst een inzet.');
    var n = WHEEL_ORDER[randomInt(37, source)];
    var res = settleBets(bets, n);
    var s = clone(state);
    boekUitslag(s, res.inzet, res.uitbetaling);
    s.roulette.vorige = clone(bets);
    s.roulette.inzet = {};
    s.roulette.historie = [n].concat(s.roulette.historie).slice(0, HISTORY_MAX);
    s.roulette.laatste = { nummer: n, inzet: res.inzet, uitbetaling: res.uitbetaling };
    s.open = 'roulette';
    return {
      ok: true,
      state: s,
      uitslag: { nummer: n, kleur: colorOf(n), inzet: res.inzet, uitbetaling: res.uitbetaling, netto: res.netto, winnend: res.winnend }
    };
  }

  /* ─── Blackjack ──────────────────────────────────────── */

  var SUITS = ['S', 'H', 'D', 'C'];            // schoppen, harten, ruiten, klaveren
  var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  var DECKS = 6;
  var RESHUFFLE_BELOW = 78;                    // een kwart van zes decks: daaronder nieuw schudden
  var OUTCOMES = ['blackjack', 'winst', 'push', 'verlies'];

  // Kaarten zijn korte strings: rang + kleur, bijvoorbeeld 'AS', '10H', 'QD'.
  function cardRank(c) { return c.slice(0, -1); }
  function cardSuit(c) { return c.slice(-1); }
  function isCard(c) {
    return typeof c === 'string' && c.length >= 2 && c.length <= 3 &&
      RANKS.indexOf(cardRank(c)) >= 0 && SUITS.indexOf(cardSuit(c)) >= 0;
  }

  // Aas telt hier als 1; handValue maakt er 11 van als dat kan.
  function cardPoints(c) {
    var r = cardRank(c);
    if (r === 'A') return 1;
    if (r === 'J' || r === 'Q' || r === 'K') return 10;
    return Number(r);
  }

  // Totaal van een hand. Eén aas mag 11 tellen zolang het totaal niet boven 21 komt; dan is de hand 'soft'.
  function handValue(cards) {
    var total = 0, aces = 0;
    for (var i = 0; i < cards.length; i++) {
      total += cardPoints(cards[i]);
      if (cardRank(cards[i]) === 'A') aces++;
    }
    var soft = false;
    if (aces > 0 && total + 10 <= 21) { total += 10; soft = true; }
    return { total: total, soft: soft };
  }

  // Natuurlijke blackjack: 21 met de eerste twee kaarten. Een hand van twee kaarten is altijd de
  // beginhand (na een extra kaart heb je er minstens drie), dus dit is genoeg.
  function isNatural(cards) { return cards.length === 2 && handValue(cards).total === 21; }

  function orderedShoe(decks) {
    var d = decks || DECKS, out = [];
    for (var k = 0; k < d; k++)
      for (var s = 0; s < SUITS.length; s++)
        for (var r = 0; r < RANKS.length; r++) out.push(RANKS[r] + SUITS[s]);
    return out;
  }

  function newShoe(source, decks) { return shuffle(orderedShoe(decks || DECKS), source); }

  // Dealer trekt onder 17 en past op elke 17, ook soft 17.
  function dealerShouldHit(cards) { return handValue(cards).total < 17; }

  function playDealer(dealer, shoe) {
    var d = dealer.slice(), sh = shoe.slice();
    while (dealerShouldHit(d)) {
      if (!sh.length) throw new Error('playDealer: shoe is leeg');
      d.push(sh.shift());
    }
    return { dealer: d, shoe: sh };
  }

  // Uitkomst vanuit de speler gezien. Beide natural: push. Dealer-natural wint van elke andere 21.
  function bjOutcome(player, dealer) {
    var pNat = isNatural(player), dNat = isNatural(dealer);
    if (pNat && dNat) return 'push';
    if (pNat) return 'blackjack';
    if (dNat) return 'verlies';
    var p = handValue(player).total, d = handValue(dealer).total;
    if (p > 21) return 'verlies';
    if (d > 21) return 'winst';
    if (p > d) return 'winst';
    if (p < d) return 'verlies';
    return 'push';
  }

  // Wat er terugkomt, inclusief de inzet: blackjack 2,5x (3:2 winst), winst 2x, push 1x, verlies 0.
  function bjPayout(stake, outcome) {
    switch (outcome) {
      case 'blackjack': return stake * 2.5;
      case 'winst': return stake * 2;
      case 'push': return stake;
      case 'verlies': return 0;
    }
    throw new RangeError('bjPayout: onbekende uitkomst');
  }

  function draw(s) {
    var c = s.blackjack.shoe.shift();
    if (!c) throw new Error('draw: shoe is leeg');
    return c;
  }

  // Sluit de hand af in één stap: eventueel dealer laten spelen, uitkomst bepalen en uitbetalen.
  function finishHand(s, dealerPlays) {
    var h = s.blackjack.hand;
    if (dealerPlays) {
      var r = playDealer(h.dealer, s.blackjack.shoe);
      h.dealer = r.dealer;
      s.blackjack.shoe = r.shoe;
    }
    var uitkomst = bjOutcome(h.speler, h.dealer);
    var uitbetaling = bjPayout(h.inzet, uitkomst);
    boekUitslag(s, h.inzet, uitbetaling);
    h.fase = 'klaar';
    h.uitkomst = uitkomst;
    h.uitbetaling = uitbetaling;
    s.open = 'blackjack';
  }

  function handActive(state) {
    var h = state.blackjack.hand;
    return !!(h && h.fase === 'speler');
  }

  // Nieuwe hand: inzet direct van het saldo, kaarten in de volgorde speler, dealer, speler, dealer.
  // De dealer kijkt meteen of hij blackjack heeft (peek); heeft speler of dealer een natural, dan is
  // de hand direct afgelopen.
  function bjDeal(state, bet, source) {
    if (handActive(state)) return fail('Speel eerst de hand af die nog loopt.');
    if (CHIP_VALUES.indexOf(bet) < 0) return fail('Kies een inzet van 10, 25, 50 of 100.');
    if (state.saldo < bet) return fail('Je hebt niet genoeg fiches voor deze inzet.');
    var s = clone(state);
    if (s.blackjack.shoe.length < RESHUFFLE_BELOW) s.blackjack.shoe = newShoe(source);
    s.saldo -= bet;
    s.blackjack.laatsteInzet = bet;
    var p1 = draw(s), d1 = draw(s), p2 = draw(s), d2 = draw(s);
    s.blackjack.hand = { fase: 'speler', inzet: bet, verdubbeld: false, speler: [p1, p2], dealer: [d1, d2] };
    if (isNatural(s.blackjack.hand.speler) || isNatural(s.blackjack.hand.dealer)) finishHand(s, false);
    return { ok: true, state: s };
  }

  function bjHit(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    var s = clone(state), h = s.blackjack.hand;
    h.speler.push(draw(s));
    var t = handValue(h.speler).total;
    if (t > 21) finishHand(s, false);       // dood: direct verloren, dealer hoeft niet
    else if (t === 21) finishHand(s, true);  // 21: automatisch passen
    return { ok: true, state: s };
  }

  function bjStand(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    var s = clone(state);
    finishHand(s, true);
    return { ok: true, state: s };
  }

  function canDouble(state) {
    var h = state.blackjack.hand;
    return !!(h && h.fase === 'speler' && !h.verdubbeld && h.speler.length === 2 && state.saldo >= h.inzet);
  }

  // Verdubbelen: alleen met precies twee kaarten. Extra inzet gaat direct van het saldo, je krijgt
  // precies één kaart en daarna speelt de dealer.
  function bjDouble(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    if (!canDouble(state)) return fail('Verdubbelen kan alleen met je eerste twee kaarten en genoeg fiches.');
    var s = clone(state), h = s.blackjack.hand;
    s.saldo -= h.inzet;
    h.inzet *= 2;
    h.verdubbeld = true;
    h.speler.push(draw(s));
    finishHand(s, handValue(h.speler).total <= 21);
    return { ok: true, state: s };
  }

  // De animatie van een afgerekende ronde is afgespeeld.
  function acknowledge(state) {
    if (!state.open) return state;
    var s = clone(state);
    s.open = null;
    return s;
  }

  /* ─── Opslag inlezen ─────────────────────────────────── */

  function sanitizeHand(h) {
    if (!h || typeof h !== 'object') return null;
    if (h.fase !== 'speler' && h.fase !== 'klaar') return null;
    if (typeof h.verdubbeld !== 'boolean') return null;
    var basis = h.verdubbeld ? h.inzet / 2 : h.inzet;
    if (CHIP_VALUES.indexOf(basis) < 0) return null;
    if (!Array.isArray(h.speler) || !Array.isArray(h.dealer)) return null;
    // Elke kaart telt minstens 1 en er wordt niet doorgetrokken vanaf 21, dus een hand heeft hooguit 21 kaarten.
    if (h.speler.length < 2 || h.dealer.length < 2 || h.speler.length > 21 || h.dealer.length > 21) return null;
    if (!h.speler.every(isCard) || !h.dealer.every(isCard)) return null;
    var out = { fase: h.fase, inzet: h.inzet, verdubbeld: h.verdubbeld, speler: h.speler.slice(), dealer: h.dealer.slice() };
    if (h.fase === 'speler') {
      if (handValue(out.speler).total >= 21 || isNatural(out.dealer)) return null;
      if (out.verdubbeld) return null;
    } else {
      if (OUTCOMES.indexOf(h.uitkomst) < 0 || !isAmount(h.uitbetaling)) return null;
      if (h.uitbetaling !== bjPayout(out.inzet, h.uitkomst)) return null;
      out.uitkomst = h.uitkomst;
      out.uitbetaling = h.uitbetaling;
    }
    return out;
  }

  // Leest een opgeslagen stand in. Alles wat niet klopt wordt vervangen door een veilige waarde;
  // is het saldo zelf onbruikbaar, dan begint een nieuw spel. Gooit nooit.
  function sanitizeState(raw) {
    var fresh = newGame();
    try {
      if (!raw || typeof raw !== 'object' || raw.v !== 1 || !isAmount(raw.saldo)) return fresh;
      var s = fresh;
      s.saldo = raw.saldo;
      s.top = isAmount(raw.top) ? Math.max(raw.top, raw.saldo) : raw.saldo;
      s.rondes = isCount(raw.rondes) ? raw.rondes : 0;
      s.gewonnen = isCount(raw.gewonnen) && raw.gewonnen <= s.rondes ? raw.gewonnen : 0;
      s.open = raw.open === 'roulette' || raw.open === 'blackjack' ? raw.open : null;

      var r = raw.roulette && typeof raw.roulette === 'object' ? raw.roulette : {};
      if (isBetMap(r.inzet)) s.roulette.inzet = clone(r.inzet);
      if (r.vorige && isBetMap(r.vorige) && betTotal(r.vorige) > 0) s.roulette.vorige = clone(r.vorige);
      if (Array.isArray(r.historie)) s.roulette.historie = r.historie.filter(isRouletteNumber).slice(0, HISTORY_MAX);
      if (r.laatste && isRouletteNumber(r.laatste.nummer) && isAmount(r.laatste.inzet) && isAmount(r.laatste.uitbetaling))
        s.roulette.laatste = { nummer: r.laatste.nummer, inzet: r.laatste.inzet, uitbetaling: r.laatste.uitbetaling };

      var b = raw.blackjack && typeof raw.blackjack === 'object' ? raw.blackjack : {};
      if (Array.isArray(b.shoe) && b.shoe.length <= DECKS * 52 && b.shoe.every(isCard)) s.blackjack.shoe = b.shoe.slice();
      if (CHIP_VALUES.indexOf(b.laatsteInzet) >= 0) s.blackjack.laatsteInzet = b.laatsteInzet;
      s.blackjack.hand = sanitizeHand(b.hand);
      // Een lopende hand zonder genoeg kaarten in de shoe kan niet verder; nieuwe shoe erbij.
      if (s.blackjack.hand && s.blackjack.hand.fase === 'speler' && s.blackjack.shoe.length < 20) s.blackjack.shoe = s.blackjack.shoe.concat(newShoe());

      if (s.open === 'roulette' && !s.roulette.laatste) s.open = null;
      if (s.open === 'blackjack' && !(s.blackjack.hand && s.blackjack.hand.fase === 'klaar')) s.open = null;
      return s;
    } catch (e) {
      return newGame();
    }
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    START_SALDO: START_SALDO,
    CHIP_VALUES: CHIP_VALUES.slice(),
    HISTORY_MAX: HISTORY_MAX,
    MAX_SALDO: MAX_SALDO,
    // toeval
    randomInt: randomInt,
    shuffle: shuffle,
    // algemeen
    isAmount: isAmount,
    newGame: newGame,
    acknowledge: acknowledge,
    sanitizeState: sanitizeState,
    // roulette
    WHEEL_ORDER: WHEEL_ORDER.slice(),
    RED_NUMBERS: RED_NUMBERS.slice(),
    OUTSIDE_BETS: OUTSIDE_BETS.slice(),
    POCKET_DEG: POCKET_DEG,
    colorOf: colorOf,
    norm: norm,
    pocketAngle: pocketAngle,
    wheelRotationFor: wheelRotationFor,
    numberAtRotation: numberAtRotation,
    ballRotationFor: ballRotationFor,
    isBetKey: isBetKey,
    betWins: betWins,
    betMultiplier: betMultiplier,
    betTotal: betTotal,
    settleBets: settleBets,
    placeBet: placeBet,
    clearBets: clearBets,
    repeatBets: repeatBets,
    spin: spin,
    // blackjack
    SUITS: SUITS.slice(),
    RANKS: RANKS.slice(),
    DECKS: DECKS,
    RESHUFFLE_BELOW: RESHUFFLE_BELOW,
    cardRank: cardRank,
    cardSuit: cardSuit,
    isCard: isCard,
    cardPoints: cardPoints,
    handValue: handValue,
    isNatural: isNatural,
    orderedShoe: orderedShoe,
    newShoe: newShoe,
    dealerShouldHit: dealerShouldHit,
    playDealer: playDealer,
    bjOutcome: bjOutcome,
    bjPayout: bjPayout,
    canDouble: canDouble,
    bjDeal: bjDeal,
    bjHit: bjHit,
    bjStand: bjStand,
    bjDouble: bjDouble
  };
});
