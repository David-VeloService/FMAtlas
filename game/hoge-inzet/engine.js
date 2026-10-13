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
 * Geld: alle bedragen zijn speelfiches. Inzetten zijn hele getallen (10/25/50/100) en alle
 * uitbetalingen ook: een blackjack betaalt 6:5 (25 -> 55 terug). Een stand van vóór 13-10-2026,
 * toen blackjack nog 3:2 betaalde, kan een halve fiche bevatten. Bedragen zijn daarom altijd een
 * veelvoud van 0,5. Veelvouden van 0,5 zijn in een JavaScript-double exact
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

  // Amerikaans wiel met 0 en 00, met de klok mee vanaf de nul. De dubbele nul heet intern 37,
  // zodat elk vakje een gewoon getal is; numberLabel maakt er voor de weergave '00' van.
  var DOUBLE_ZERO = 37;
  var WHEEL_ORDER = [0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, DOUBLE_ZERO,
    27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2];
  var POCKETS = WHEEL_ORDER.length;            // 38
  var RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  var POCKET_DEG = 360 / POCKETS;

  function isRouletteNumber(n) { return Number.isInteger(n) && n >= 0 && n <= DOUBLE_ZERO; }
  function isZero(n) { return n === 0 || n === DOUBLE_ZERO; }
  function numberLabel(n) { return n === DOUBLE_ZERO ? '00' : String(n); }

  function colorOf(n) {
    if (!isRouletteNumber(n)) throw new RangeError('colorOf: geen roulettenummer');
    if (isZero(n)) return 'groen';
    return RED_NUMBERS.indexOf(n) >= 0 ? 'rood' : 'zwart';
  }

  /*
   * Geometrie van wiel en bal.
   *
   * Assenstelsel: hoeken in graden, 0 = boven (12 uur), positief = met de klok mee, net als CSS
   * rotate(). In zijn eigen assenstelsel (rotatie 0) ligt het midden van vakje WHEEL_ORDER[i] op
   * i * 360/38 graden. Draait het wiel R graden, dan staat dat vakje op norm(pocketAngle(n) + R).
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
    var idx = Math.round(norm(-R) / POCKET_DEG) % POCKETS;
    return WHEEL_ORDER[idx];
  }

  // Doelrotatie voor de bal: `turns` slagen tegen de klok in, eindigend op een veelvoud van 360 (boven).
  function ballRotationFor(current, turns) {
    var k = Math.floor((Number(current) || 0) / 360);
    return (k - Math.max(1, Math.floor(turns || 1))) * 360;
  }

  /* ─── Roulette: inzetten en uitbetaling ──────────────── */

  // Sleutels: 'n0' t/m 'n36' en 'n37' (de 00) voor een nummer, plus zes buitenkansen.
  var OUTSIDE_BETS = ['rood', 'zwart', 'even', 'oneven', 'laag', 'hoog'];

  function isBetKey(k) {
    if (typeof k !== 'string') return false;
    if (OUTSIDE_BETS.indexOf(k) >= 0) return true;
    var m = /^n(\d{1,2})$/.exec(k);
    return !!m && String(Number(m[1])) === m[1] && Number(m[1]) <= DOUBLE_ZERO;
  }

  // Wint deze inzet bij uitkomst n? Op 0 en 00 verliezen alle buitenkansen, ook even en laag.
  function betWins(k, n) {
    if (!isBetKey(k)) throw new RangeError('betWins: onbekende inzet');
    if (!isRouletteNumber(n)) throw new RangeError('betWins: geen roulettenummer');
    if (k.charAt(0) === 'n') return Number(k.slice(1)) === n;
    if (isZero(n)) return false;
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
    var n = WHEEL_ORDER[randomInt(POCKETS, source)];
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
  var RESHUFFLE_BELOW = 156;                   // de helft van zes decks: daaronder nieuw schudden
  var MAX_HANDEN = 4;                          // splitsen kan tot vier handen
  var OUTCOMES = ['blackjack', 'winst', 'push', 'verlies'];
  var STATUSSEN = ['speelt', 'staat', 'dood'];

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

  // Natuurlijke blackjack: 21 met de eerste twee kaarten. Na splitsen telt 21 met twee kaarten niet
  // als blackjack; daarvoor geeft bjOutcome `gesplitst` mee.
  function isNatural(cards) { return cards.length === 2 && handValue(cards).total === 21; }

  function orderedShoe(decks) {
    var d = decks || DECKS, out = [];
    for (var k = 0; k < d; k++)
      for (var s = 0; s < SUITS.length; s++)
        for (var r = 0; r < RANKS.length; r++) out.push(RANKS[r] + SUITS[s]);
    return out;
  }

  function newShoe(source, decks) { return shuffle(orderedShoe(decks || DECKS), source); }

  // Dealer trekt onder 17 en ook op soft 17 (een aas die als 11 telt); hij past op harde 17.
  function dealerShouldHit(cards) {
    var v = handValue(cards);
    return v.total < 17 || (v.total === 17 && v.soft);
  }

  function playDealer(dealer, shoe) {
    var d = dealer.slice(), sh = shoe.slice();
    while (dealerShouldHit(d)) {
      if (!sh.length) throw new Error('playDealer: shoe is leeg');
      d.push(sh.shift());
    }
    return { dealer: d, shoe: sh };
  }

  // Uitkomst vanuit de speler gezien. Beide natural: push. Dealer-natural wint van elke andere 21.
  // Een gesplitste hand kan geen natural zijn.
  function bjOutcome(player, dealer, gesplitst) {
    var pNat = !gesplitst && isNatural(player), dNat = isNatural(dealer);
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

  // Wat er terugkomt, inclusief de inzet: blackjack inzet plus 6/5 (6:5 winst, 25 -> 55), winst 2x,
  // push 1x, verlies 0. Eerst vermenigvuldigen, dan delen: 10 * 1.2 is in een double net niet 12.
  function bjPayout(stake, outcome) {
    switch (outcome) {
      case 'blackjack': return stake + stake * 6 / 5;
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

  /*
   * Een lopende ronde:
   *   { fase: 'speler' | 'klaar', dealer: [kaarten], actief: index, inzet: totaal,
   *     handen: [{ kaarten, inzet, verdubbeld, azen, status: 'speelt' | 'staat' | 'dood',
   *                uitkomst, uitbetaling }],
   *     uitbetaling: totaal (alleen bij 'klaar') }
   * Zonder splitsen is er één hand. Na splitsen speel je de handen van links naar rechts; `actief`
   * wijst de hand aan die aan de beurt is. `azen` markeert een hand uit gesplitste azen: die krijgt
   * precies één kaart en kan niet verder.
   */
  function nieuweHand(kaarten, inzet) {
    return { kaarten: kaarten, inzet: inzet, verdubbeld: false, azen: false, status: 'speelt' };
  }

  function totaalInzet(h) {
    var t = 0;
    for (var i = 0; i < h.handen.length; i++) t += h.handen[i].inzet;
    return t;
  }

  // Sluit de ronde af in één stap: eventueel dealer laten spelen, per hand uitkomst bepalen en
  // alles samen uitbetalen.
  function finishHand(s, dealerPlays) {
    var h = s.blackjack.hand;
    if (dealerPlays) {
      var r = playDealer(h.dealer, s.blackjack.shoe);
      h.dealer = r.dealer;
      s.blackjack.shoe = r.shoe;
    }
    var gesplitst = h.handen.length > 1, uitbetaling = 0;
    h.handen.forEach(function (x) {
      if (x.status === 'speelt') x.status = 'staat';
      x.uitkomst = bjOutcome(x.kaarten, h.dealer, gesplitst);
      x.uitbetaling = bjPayout(x.inzet, x.uitkomst);
      uitbetaling += x.uitbetaling;
    });
    h.inzet = totaalInzet(h);
    boekUitslag(s, h.inzet, uitbetaling);
    h.fase = 'klaar';
    h.uitbetaling = uitbetaling;
    s.open = 'blackjack';
  }

  // Door naar de eerste hand die nog speelt. Is er geen meer, dan is de dealer. Zijn alle handen
  // dood, dan hoeft de dealer niet te trekken.
  function volgende(s) {
    var h = s.blackjack.hand;
    while (h.actief < h.handen.length && h.handen[h.actief].status !== 'speelt') h.actief++;
    if (h.actief < h.handen.length) return;
    h.actief = h.handen.length - 1;
    var levend = h.handen.some(function (x) { return x.status !== 'dood'; });
    finishHand(s, levend);
  }

  // Status van een hand na een nieuwe kaart: boven 21 dood, op 21 blijft hij automatisch staan.
  function zetStatus(x) {
    var t = handValue(x.kaarten).total;
    if (t > 21) x.status = 'dood';
    else if (t === 21) x.status = 'staat';
  }

  function handActive(state) {
    var h = state.blackjack.hand;
    return !!(h && h.fase === 'speler');
  }

  function actieveHand(state) {
    var h = state.blackjack.hand;
    return handActive(state) ? h.handen[h.actief] : null;
  }

  // Nieuwe ronde: inzet direct van het saldo, kaarten in de volgorde speler, dealer, speler, dealer.
  // De dealer kijkt meteen of hij blackjack heeft (peek); heeft speler of dealer een natural, dan is
  // de ronde direct afgelopen.
  function bjDeal(state, bet, source) {
    if (handActive(state)) return fail('Speel eerst de hand af die nog loopt.');
    if (CHIP_VALUES.indexOf(bet) < 0) return fail('Kies een inzet van 10, 25, 50 of 100.');
    if (state.saldo < bet) return fail('Je hebt niet genoeg fiches voor deze inzet.');
    var s = clone(state);
    if (s.blackjack.shoe.length < RESHUFFLE_BELOW) s.blackjack.shoe = newShoe(source);
    s.saldo -= bet;
    s.blackjack.laatsteInzet = bet;
    var p1 = draw(s), d1 = draw(s), p2 = draw(s), d2 = draw(s);
    s.blackjack.hand = { fase: 'speler', dealer: [d1, d2], actief: 0, inzet: bet, handen: [nieuweHand([p1, p2], bet)] };
    if (isNatural([p1, p2]) || isNatural([d1, d2])) finishHand(s, false);
    return { ok: true, state: s };
  }

  function bjHit(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    var s = clone(state), h = s.blackjack.hand, x = h.handen[h.actief];
    x.kaarten.push(draw(s));
    zetStatus(x);
    volgende(s);
    return { ok: true, state: s };
  }

  function bjStand(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    var s = clone(state), h = s.blackjack.hand;
    h.handen[h.actief].status = 'staat';
    volgende(s);
    return { ok: true, state: s };
  }

  function canDouble(state) {
    var x = actieveHand(state);
    return !!(x && !x.verdubbeld && !x.azen && x.kaarten.length === 2 && state.saldo >= x.inzet);
  }

  // Verdubbelen: alleen met precies twee kaarten, ook na splitsen. Extra inzet gaat direct van het
  // saldo, je krijgt precies één kaart en daarna is de volgende hand of de dealer.
  function bjDouble(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    if (!canDouble(state)) return fail('Verdubbelen kan alleen met je eerste twee kaarten en genoeg fiches.');
    var s = clone(state), h = s.blackjack.hand, x = h.handen[h.actief];
    s.saldo -= x.inzet;
    x.inzet *= 2;
    x.verdubbeld = true;
    x.kaarten.push(draw(s));
    x.status = handValue(x.kaarten).total > 21 ? 'dood' : 'staat';
    h.inzet = totaalInzet(h);
    volgende(s);
    return { ok: true, state: s };
  }

  // Splitsen kan met twee kaarten van dezelfde waarde (ook boer en heer), tot vier handen, als je
  // de inzet nog een keer kunt betalen.
  function canSplit(state) {
    var x = actieveHand(state), h = state.blackjack.hand;
    return !!(x && !x.verdubbeld && !x.azen && x.kaarten.length === 2 && h.handen.length < MAX_HANDEN &&
      cardPoints(x.kaarten[0]) === cardPoints(x.kaarten[1]) && state.saldo >= x.inzet);
  }

  // Splitsen: de twee kaarten worden twee handen met elk dezelfde inzet en elk een nieuwe tweede
  // kaart. Gesplitste azen krijgen ieder precies één kaart en blijven dan staan.
  function bjSplit(state) {
    if (!handActive(state)) return fail('Er loopt geen hand.');
    if (!canSplit(state)) return fail('Splitsen kan alleen met twee kaarten van dezelfde waarde en genoeg fiches.');
    var s = clone(state), h = s.blackjack.hand, x = h.handen[h.actief];
    var azen = cardRank(x.kaarten[0]) === 'A';
    s.saldo -= x.inzet;
    var a = nieuweHand([x.kaarten[0], draw(s)], x.inzet);
    var b = nieuweHand([x.kaarten[1], draw(s)], x.inzet);
    [a, b].forEach(function (y) {
      if (azen) { y.azen = true; y.status = 'staat'; }
      else zetStatus(y);
    });
    h.handen.splice(h.actief, 1, a, b);
    h.inzet = totaalInzet(h);
    volgende(s);
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

  function sanitizeSubHand(x, fase, gesplitst) {
    if (!x || typeof x !== 'object') return null;
    if (typeof x.verdubbeld !== 'boolean' || typeof x.azen !== 'boolean') return null;
    if (STATUSSEN.indexOf(x.status) < 0) return null;
    // Elke kaart telt minstens 1 en er wordt niet doorgetrokken vanaf 21, dus een hand heeft hooguit 21 kaarten.
    if (!Array.isArray(x.kaarten) || x.kaarten.length < 2 || x.kaarten.length > 21 || !x.kaarten.every(isCard)) return null;
    var basis = x.verdubbeld ? x.inzet / 2 : x.inzet;
    if (CHIP_VALUES.indexOf(basis) < 0) return null;
    var t = handValue(x.kaarten).total;
    if ((x.status === 'dood') !== (t > 21)) return null;
    if (x.status === 'speelt' && (fase !== 'speler' || t >= 21 || x.verdubbeld || x.azen)) return null;
    if (x.azen && (!gesplitst || x.kaarten.length !== 2 || cardRank(x.kaarten[0]) !== 'A')) return null;
    var out = { kaarten: x.kaarten.slice(), inzet: x.inzet, verdubbeld: x.verdubbeld, azen: x.azen, status: x.status };
    if (fase === 'klaar') {
      if (OUTCOMES.indexOf(x.uitkomst) < 0 || !isAmount(x.uitbetaling)) return null;
      if (x.uitbetaling !== bjPayout(out.inzet, x.uitkomst)) return null;
      out.uitkomst = x.uitkomst;
      out.uitbetaling = x.uitbetaling;
    }
    return out;
  }

  // Een stand van voor het splitsen had één hand in `speler` en `inzet`. Die zet je om, zodat een
  // lopende hand van de vorige versie niet verloren gaat.
  function oudeHandOmzetten(h) {
    if (!Array.isArray(h.speler) || h.handen) return h;
    var t = h.speler.every(isCard) ? handValue(h.speler).total : 0;
    var status = t > 21 ? 'dood' : h.fase === 'speler' ? 'speelt' : 'staat';
    return {
      fase: h.fase, dealer: h.dealer, actief: 0, inzet: h.inzet, uitbetaling: h.uitbetaling,
      handen: [{ kaarten: h.speler, inzet: h.inzet, verdubbeld: h.verdubbeld, azen: false, status: status,
        uitkomst: h.uitkomst, uitbetaling: h.uitbetaling }]
    };
  }

  function sanitizeHand(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var h = oudeHandOmzetten(raw);
    if (h.fase !== 'speler' && h.fase !== 'klaar') return null;
    if (!Array.isArray(h.dealer) || h.dealer.length < 2 || h.dealer.length > 21 || !h.dealer.every(isCard)) return null;
    if (!Array.isArray(h.handen) || h.handen.length < 1 || h.handen.length > MAX_HANDEN) return null;
    var gesplitst = h.handen.length > 1;
    var handen = [];
    for (var i = 0; i < h.handen.length; i++) {
      var x = sanitizeSubHand(h.handen[i], h.fase, gesplitst);
      if (!x) return null;
      handen.push(x);
    }
    var basis = handen[0].verdubbeld ? handen[0].inzet / 2 : handen[0].inzet;
    if (!handen.every(function (x) { return (x.verdubbeld ? x.inzet / 2 : x.inzet) === basis; })) return null;
    var out = { fase: h.fase, dealer: h.dealer.slice(), actief: 0, handen: handen };
    out.inzet = totaalInzet(out);
    if (h.fase === 'speler') {
      if (isNatural(out.dealer)) return null;
      if (!gesplitst && isNatural(handen[0].kaarten)) return null;
      var a = h.actief;
      if (!Number.isInteger(a) || a < 0 || a >= handen.length || handen[a].status !== 'speelt') return null;
      for (var j = 0; j < a; j++) if (handen[j].status === 'speelt') return null;
      out.actief = a;
    } else {
      if (handen.some(function (x) { return x.status === 'speelt'; })) return null;
      out.actief = handen.length - 1;
      out.uitbetaling = handen.reduce(function (t, x) { return t + x.uitbetaling; }, 0);
    }
    return out;
  }

  // Wat er in localStorage komt: alles behalve de shoe. Zo valt er niet vooruit te kijken welke
  // kaarten er komen, en kan een zelf ingevulde shoe niet terugkomen. Na herladen wordt er nieuw
  // geschud.
  function forStorage(state) {
    var s = clone(state);
    s.blackjack.shoe = [];
    return s;
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
      // Een opgeslagen shoe wordt nooit overgenomen: wie localStorage aanpast, zou anders de kaarten
      // kunnen kiezen. Er komt altijd een vers geschudde shoe.
      s.blackjack.shoe = newShoe();
      if (CHIP_VALUES.indexOf(b.laatsteInzet) >= 0) s.blackjack.laatsteInzet = b.laatsteInzet;
      s.blackjack.hand = sanitizeHand(b.hand);

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
    forStorage: forStorage,
    // roulette
    WHEEL_ORDER: WHEEL_ORDER.slice(),
    DOUBLE_ZERO: DOUBLE_ZERO,
    POCKETS: POCKETS,
    isZero: isZero,
    numberLabel: numberLabel,
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
    MAX_HANDEN: MAX_HANDEN,
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
    canSplit: canSplit,
    bjDeal: bjDeal,
    bjHit: bjHit,
    bjStand: bjStand,
    bjDouble: bjDouble,
    bjSplit: bjSplit
  };
});
