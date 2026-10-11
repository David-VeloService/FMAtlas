/*
 * Pool online: kamercodes, de verbinding met de relay en de gezaghebbende partij.
 *
 * Geen DOM. Laadbaar als klassiek script en in Node:
 *
 *   browser:  window.PoolNet
 *   Node:     const N = require('./net.js');
 *
 * Verbinding. Pool gebruikt dezelfde relay als Slipstroom en Stadsstorm
 * (wss://slipstroom.jochem-35e.workers.dev/relay), maar in eigen kamers: de relaykamer is `PL` + de
 * code en de host heeft het peer-id `pool-<CODE>`. Een code van een ander spel komt hier in een lege
 * kamer uit en geeft "kamer niet gevonden". Wire protocol van de relay (zie RelayRoom.ts):
 *
 *   naar de relay   { t:'hello', peer, key } { t:'connect', cid, to, label, meta }
 *                   { t:'data', cid, to, d } { t:'close', cid, to }
 *   van de relay    { t:'open' } { t:'connection', cid, from, label, meta } { t:'connected', cid }
 *                   { t:'data', cid, from, d } { t:'close', cid, from } { t:'gone', peer }
 *                   { t:'error', type, cid? }
 *
 * Elk socketbericht is een JSON-array van frames, hooguit 16 KiB; hier nooit meer dan 12 KiB. Uitgaande
 * frames worden gebundeld (hooguit één socketbericht per 50 ms) en een kale "ping" houdt de verbinding
 * open als er 20 s niets ging.
 *
 * Partij. Eén host is de autoriteit (Authority hieronder). De gast stuurt alleen bedoelde acties
 * ({ k:'act', match, rev, id, a }) en nooit een stand. De host controleert partij, revisie, actie-id,
 * beurt, fase, bal in hand en aankondiging, rekent de stoot zelf uit met de engine en stuurt de nieuwe
 * stand ({ k:'state', match, rev, state, anim }) naar beide kanten. `anim` bevat de stoot zelf, zodat
 * beide apparaten dezelfde beweging afspelen vanaf de vorige stand; aan het eind geldt altijd de stand
 * van de host.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PoolNet = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PROTO = 1;
  var ROOM_PREFIX = 'PL';
  var PEER_PREFIX = 'pool-';
  var LABEL = 'pool';
  var CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // geen 0/O en 1/I/L
  var CODE_LENGTH = 5;
  var DEFAULT_RELAY = 'wss://slipstroom.jochem-35e.workers.dev/relay';
  var NAME_MAX = 20;

  var LIMITS = {
    chunk: 12 * 1024,        // tekens per socketbericht (relay: 16 KiB)
    flushMs: 50,             // hooguit één socketbericht per 50 ms
    keepaliveMs: 20000,      // "ping" na 20 s zonder verzenden
    checkMs: 5000,           // controle-interval voor keepalive en hartslag
    deadMs: 15000,           // ping zonder antwoord: socket dood (na twee controles)
    openTimeoutMs: 8000,     // relay moet binnen 8 s registreren
    joinTimeoutMs: 12000,    // gast: welkom van de host binnen 12 s
    ackTimeoutMs: 10000,     // gast: antwoord op een actie binnen 10 s
    heartbeatMs: 5000,       // host: hartslag naar de gast
    guestSilentMs: 20000     // host: gast reageert 20 s niet op de hartslag (twee keer achter elkaar): weg
  };

  /* ─── Kleine hulpjes ─────────────────────────────────── */

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function finite(v) { return typeof v === 'number' && isFinite(v); }
  function isInt(v) { return finite(v) && Math.floor(v) === v; }
  function str(v, max) { return typeof v === 'string' && v.length > 0 && v.length <= (max || 128) ? v : null; }

  function randomBytes(n) {
    var out = [];
    var c = typeof crypto !== 'undefined' && crypto && typeof crypto.getRandomValues === 'function' ? crypto : null;
    if (c) {
      var a = new Uint8Array(n);
      c.getRandomValues(a);
      for (var i = 0; i < n; i++) out.push(a[i]);
    } else {
      for (var j = 0; j < n; j++) out.push(Math.floor(Math.random() * 256));
    }
    return out;
  }

  function randomId(n) {
    var abc = 'abcdefghijkmnpqrstuvwxyz23456789';
    return randomBytes(n).map(function (b) { return abc[b % abc.length]; }).join('');
  }

  function defaultClock() {
    return {
      now: function () { return Date.now(); },
      setTimeout: function (f, ms) { return setTimeout(f, ms); },
      clearTimeout: function (id) { clearTimeout(id); },
      setInterval: function (f, ms) { return setInterval(f, ms); },
      clearInterval: function (id) { clearInterval(id); }
    };
  }

  function soon(fn) {
    if (typeof Promise === 'function') Promise.resolve().then(fn);
    else setTimeout(fn, 0);
  }

  /* ─── Codes, namen en adressen ───────────────────────── */

  function makeRoomCode() {
    return randomBytes(CODE_LENGTH).map(function (b) { return CODE_ALPHABET[b % CODE_ALPHABET.length]; }).join('');
  }

  /* Hoofdletters, zonder spaties of streepjes. Een geplakte uitnodigingslink mag ook. Anders null. */
  function normalizeRoomCode(input) {
    if (typeof input !== 'string' || input.length > 400) return null;
    var s = input.trim();
    var m = /[?&#]kamer=([^&#\s]*)/i.exec(s);
    if (m) s = m[1];
    s = s.toUpperCase().replace(/[\s\-_.]/g, '');
    if (s.length !== CODE_LENGTH) return null;
    for (var i = 0; i < s.length; i++) if (CODE_ALPHABET.indexOf(s[i]) < 0) return null;
    return s;
  }

  /* Naam: zonder stuurtekens, witruimte samengevoegd, hooguit 20 tekens. Kan leeg zijn. */
  function cleanName(v) {
    if (typeof v !== 'string') return '';
    var s = v.slice(0, 200)
      .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, '')
      .replace(/\s+/g, ' ').trim();
    var chars = Array.from ? Array.from(s) : s.split('');
    if (chars.length > NAME_MAX) s = chars.slice(0, NAME_MAX).join('').trim();
    return s;
  }

  /* Alleen ws: of wss: met een gewone host, optioneel poort en pad. Geen query, geen fragment. */
  function validRelayUrl(v) {
    if (typeof v !== 'string' || v.length > 200) return null;
    return /^wss?:\/\/[A-Za-z0-9.-]+(:\d{1,5})?(\/[A-Za-z0-9._~\/-]*)?$/.test(v) ? v : null;
  }

  function relayFromSearch(search) {
    var m = /[?&]relay=([^&#]*)/.exec(typeof search === 'string' ? search : '');
    if (!m) return null;
    var v;
    try { v = decodeURIComponent(m[1]); } catch (_) { return null; }
    return validRelayUrl(v);
  }

  function codeFromSearch(search) {
    var m = /[?&]kamer=([^&#]*)/.exec(typeof search === 'string' ? search : '');
    return m ? normalizeRoomCode(m[1]) : null;
  }

  function roomUrl(base, code) { return base + '?room=' + ROOM_PREFIX + code; }
  function hostPeerId(code) { return PEER_PREFIX + code; }

  /* Uitnodiging: de huidige pagina met ?kamer=CODE; een aangepaste relay gaat mee. */
  function inviteUrl(href, code, relay) {
    var base = String(href || '').split('#')[0].split('?')[0];
    var q = '?kamer=' + code;
    if (relay && relay !== DEFAULT_RELAY && validRelayUrl(relay)) q += '&relay=' + encodeURIComponent(relay);
    return base + q;
  }

  /* ─── Verbinding met de relay ────────────────────────── */

  /*
   * Eén socket naar één relaykamer. o = { url, peer, key?, WebSocket, clock?, onOpen(), onFrame(f),
   * onDown(reden) }. Reden: 'onbereikbaar' (nooit geregistreerd), 'netwerk' (daarna weggevallen),
   * 'unavailable-id', 'room-full', 'rate-limit'. close() ruimt alles op zonder onDown.
   */
  function Link(o) {
    this.url = o.url;
    this.peer = o.peer;
    this.key = o.key || randomId(16);
    this.WS = o.WebSocket;
    this.clock = o.clock || defaultClock();
    this.onOpen = o.onOpen || function () {};
    this.onFrame = o.onFrame || function () {};
    this.onDown = o.onDown || function () {};
    this.ws = null;
    this.registered = false;
    this.closed = false;
    this.downReason = null;
    this.out = [];
    this.flushQueued = false;
    this.lastFlush = -Infinity;
    this.lastSend = 0;
    this.lastRecv = 0;
    this.pingAt = 0;
    this.suspect = false;
    this.timers = { open: 0, keep: 0, flush: 0 };
    this.stats = { sent: 0, received: 0, tooLarge: 0, badFrames: 0 };
  }

  Link.prototype.start = function () {
    var self = this, ws;
    if (this.closed) return;
    if (typeof this.WS !== 'function') { this._fail('onbereikbaar'); return; }
    try { ws = new this.WS(this.url); } catch (_) {
      this.clock.setTimeout(function () { self._fail('onbereikbaar'); }, 0);
      return;
    }
    this.ws = ws;
    ws.onopen = function () {
      if (self.ws !== ws) return;
      self.lastRecv = self.lastSend = self.clock.now();
      self._raw(JSON.stringify([{ t: 'hello', peer: self.peer, key: self.key }]));
    };
    ws.onmessage = function (ev) {
      if (self.ws !== ws) return;
      self.lastRecv = self.clock.now();
      var data = ev && ev.data;
      if (typeof data !== 'string' || data === 'pong') return;
      var frames;
      try { frames = JSON.parse(data); } catch (_) { self.stats.badFrames++; return; }
      var list = Array.isArray(frames) ? frames : [frames];
      for (var i = 0; i < list.length && !self.closed; i++) {
        var f = list[i];
        if (!isObj(f) || typeof f.t !== 'string') { self.stats.badFrames++; continue; }
        self._frame(f);
      }
    };
    ws.onclose = function () { if (self.ws === ws) self._fail(self.registered ? 'netwerk' : 'onbereikbaar'); };
    ws.onerror = function () { /* onclose volgt */ };
    this.timers.open = this.clock.setTimeout(function () {
      if (!self.registered) self._fail('onbereikbaar');
    }, LIMITS.openTimeoutMs);
    this.timers.keep = this.clock.setInterval(function () { self._keepalive(); }, LIMITS.checkMs);
  };

  Link.prototype._frame = function (f) {
    this.stats.received++;
    if (f.t === 'open') {
      if (this.registered) return;
      this.registered = true;
      this.clock.clearTimeout(this.timers.open);
      this.timers.open = 0;
      this.onOpen();
      this._schedule();
      return;
    }
    if (f.t === 'error' && (f.type === 'unavailable-id' || f.type === 'room-full' || f.type === 'rate-limit')) {
      // De relay sluit de socket hierna zelf; onthoud waarom.
      this.downReason = f.type;
      return;
    }
    this.onFrame(f);
  };

  /* Zet een frame klaar. false als hij te groot is of de verbinding dicht is. */
  Link.prototype.send = function (frame) {
    if (this.closed) return false;
    var s;
    try { s = JSON.stringify(frame); } catch (_) { return false; }
    if (typeof s !== 'string' || s.length + 2 > LIMITS.chunk) { this.stats.tooLarge++; return false; }
    this.out.push(s);
    this._schedule();
    return true;
  };

  Link.prototype._schedule = function () {
    var self = this;
    if (this.flushQueued || !this.registered || !this.out.length || this.closed) return;
    this.flushQueued = true;
    var wait = this.lastFlush + LIMITS.flushMs - this.clock.now();
    if (wait <= 0) soon(function () { self._flush(); });
    else this.timers.flush = this.clock.setTimeout(function () { self._flush(); }, wait);
  };

  Link.prototype._flush = function () {
    this.flushQueued = false;
    this.timers.flush = 0;
    var ws = this.ws;
    if (this.closed || !this.registered || !ws || !this.out.length) return;
    if (ws.readyState !== undefined && ws.readyState !== 1) return;
    var parts = [], len = 2;
    var list = this.out;
    this.out = [];
    for (var i = 0; i < list.length; i++) {
      if (parts.length && len + list[i].length + 1 > LIMITS.chunk) {
        this._raw('[' + parts.join(',') + ']');
        parts = []; len = 2;
      }
      parts.push(list[i]);
      len += list[i].length + 1;
    }
    if (parts.length) this._raw('[' + parts.join(',') + ']');
    this.lastFlush = this.clock.now();
  };

  Link.prototype._raw = function (text) {
    try { this.ws.send(text); } catch (_) { return; }
    this.stats.sent++;
    this.lastSend = this.clock.now();
  };

  Link.prototype._keepalive = function () {
    var ws = this.ws;
    if (this.closed || !ws || (ws.readyState !== undefined && ws.readyState !== 1)) return;
    var now = this.clock.now();
    if (this.pingAt && this.lastRecv < this.pingAt) {
      // Wacht nog op antwoord op de ping. Te lang stil: pas bij de tweede controle op rij is de socket
      // dood (een pagina waarvan de hoofdthread even vastzat, krijgt zo eerst het wachtende antwoord).
      if (now - this.pingAt > LIMITS.deadMs) {
        if (this.suspect) { this._fail('netwerk'); return; }
        this.suspect = true;
      }
      return;
    }
    this.suspect = false;
    if (now - this.lastSend >= LIMITS.keepaliveMs) {
      this._raw('ping');
      this.pingAt = now;
    }
  };

  Link.prototype._cleanup = function (code, reason) {
    var t = this.timers;
    if (t.open) this.clock.clearTimeout(t.open);
    if (t.keep) this.clock.clearInterval(t.keep);
    if (t.flush) this.clock.clearTimeout(t.flush);
    this.timers = { open: 0, keep: 0, flush: 0 };
    this.out = [];
    var ws = this.ws;
    this.ws = null;
    this.registered = false;
    if (!ws) return;
    ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
    try { ws.close(code || 1000, reason || 'bye'); } catch (_) { /* al dicht */ }
  };

  Link.prototype._fail = function (reason) {
    if (this.closed) return;
    this.closed = true;
    this._cleanup(4000, 'down');
    this.onDown(this.downReason || reason);
  };

  /* Netjes sluiten: wat klaarstaat gaat nog weg, daarna dicht. Geen onDown. */
  Link.prototype.close = function () {
    if (this.closed) return;
    if (this.registered && this.out.length) this._flush();
    this.closed = true;
    this._cleanup(1000, 'bye');
  };

  /* ─── Host ───────────────────────────────────────────── */

  /*
   * De host van een kamer. o = { name, relay, code?, WebSocket, clock?, onEvent(type, data) }.
   * Gebeurtenissen: 'open' {code}, 'join' {name}, 'leave' {name, reason}, 'msg' (bericht van de gast),
   * 'down' {reason}. Hooguit één gast; een derde krijgt 'vol'.
   */
  function HostSession(o) {
    this.o = o;
    this.name = cleanName(o.name) || 'Host';
    this.relay = o.relay || DEFAULT_RELAY;
    this.code = o.code || makeRoomCode();
    this.clock = o.clock || defaultClock();
    this.emit = o.onEvent || function () {};
    this.tries = 0;
    this.opened = false;
    this.closed = false;
    this.guest = null;
    this.link = null;
    this.hb = 0;
    this.stats = { rejected: 0, ignored: 0 };
  }

  HostSession.prototype.start = function () {
    var self = this;
    if (this.closed) return;
    this.link = new Link({
      url: roomUrl(this.relay, this.code), peer: hostPeerId(this.code), WebSocket: this.o.WebSocket, clock: this.clock,
      onOpen: function () {
        self.opened = true;
        if (!self.hb) self.hb = self.clock.setInterval(function () { self._heartbeat(); }, LIMITS.heartbeatMs);
        self.emit('open', { code: self.code });
      },
      onFrame: function (f) { self._frame(f); },
      onDown: function (reason) {
        if (self.closed) return;
        // Code al in gebruik: stil een nieuwe proberen (hooguit drie keer).
        if (reason === 'unavailable-id' && !self.opened && self.tries < 3) {
          self.tries++;
          self.code = makeRoomCode();
          self.start();
          return;
        }
        self._end();
        self.emit('down', { reason: reason === 'unavailable-id' ? 'onbereikbaar' : reason });
      }
    });
    this.link.start();
  };

  HostSession.prototype._reject = function (cid, to, reason) {
    this.stats.rejected++;
    this.link.send({ t: 'data', cid: cid, to: to, d: { k: 'reject', reason: reason, v: PROTO } });
    this.link.send({ t: 'close', cid: cid, to: to });
  };

  HostSession.prototype._frame = function (f) {
    var g = this.guest;
    if (f.t === 'connection') {
      var cid = str(f.cid), from = str(f.from);
      if (!cid || !from) return;
      var meta = isObj(f.meta) ? f.meta : {};
      if (f.label !== LABEL) { this.stats.rejected++; this.link.send({ t: 'close', cid: cid, to: from }); return; }
      if (meta.v !== PROTO) { this._reject(cid, from, 'versie'); return; }
      if (g && g.peer !== from) { this._reject(cid, from, 'vol'); return; }
      var now = this.clock.now();
      this.guest = { peer: from, cid: cid, name: cleanName(meta.name) || 'Gast', heard: now, hbAt: 0, suspect: false };
      this.link.send({ t: 'data', cid: cid, to: from, d: { k: 'welcome', v: PROTO, code: this.code, host: this.name, you: this.guest.name, seat: 1 } });
      this.emit('join', { name: this.guest.name });
      return;
    }
    if (!g) { this.stats.ignored++; return; }
    if (f.t === 'data') {
      if (f.from !== g.peer || f.cid !== g.cid) { this.stats.ignored++; return; }
      g.heard = this.clock.now();
      var d = f.d;
      if (!isObj(d) || typeof d.k !== 'string') { this.stats.rejected++; return; }
      if (d.k === 'hb') return;
      if (d.k === 'bye') { this._guestGone('weg'); return; }
      this.emit('msg', d);
      return;
    }
    if ((f.t === 'close' && f.from === g.peer && f.cid === g.cid) || (f.t === 'gone' && f.peer === g.peer)) {
      this._guestGone('weg');
    }
  };

  HostSession.prototype._guestGone = function (reason) {
    var g = this.guest;
    if (!g) return;
    this.guest = null;
    if (reason !== 'weg' && this.link) this.link.send({ t: 'close', cid: g.cid, to: g.peer });
    this.emit('leave', { name: g.name, reason: reason });
  };

  /* Hartslag: houdt een gast vast die stil verdwenen is (telefoon in slaap zonder dat de socket sluit). */
  HostSession.prototype._heartbeat = function () {
    var g = this.guest;
    if (!g || this.closed) return;
    var now = this.clock.now();
    if (g.hbAt && g.heard < g.hbAt) {
      // Nog geen antwoord sinds hbAt. Te lang: bij de tweede controle op rij is de gast weg.
      if (now - g.hbAt > LIMITS.guestSilentMs) {
        if (g.suspect) { this._guestGone('stil'); return; }
        g.suspect = true;
      }
    } else {
      g.suspect = false;
      g.hbAt = now;
    }
    this.send({ k: 'hb' });
  };

  HostSession.prototype.send = function (msg) {
    var g = this.guest;
    if (!g || this.closed || !this.link) return false;
    return this.link.send({ t: 'data', cid: g.cid, to: g.peer, d: msg });
  };

  HostSession.prototype.hasGuest = function () { return !!this.guest; };

  HostSession.prototype._end = function () {
    this.closed = true;
    this.guest = null;
    if (this.hb) { this.clock.clearInterval(this.hb); this.hb = 0; }
  };

  /* Kamer sluiten: de gast hoort het, dan gaat de socket dicht. */
  HostSession.prototype.close = function () {
    if (this.closed) return;
    var g = this.guest;
    if (g && this.link) {
      this.link.send({ t: 'data', cid: g.cid, to: g.peer, d: { k: 'closed' } });
      this.link.send({ t: 'close', cid: g.cid, to: g.peer });
    }
    this._end();
    if (this.link) this.link.close();
  };

  /* ─── Gast ───────────────────────────────────────────── */

  /*
   * Een gast. o = { code, name, relay, WebSocket, clock?, onEvent(type, data) }.
   * Gebeurtenissen: 'joined' {host, you}, 'msg' (bericht van de host), 'down' {reason, joined}.
   * Redenen: 'niet-gevonden', 'vol', 'versie', 'timeout', 'onbereikbaar', 'gesloten', 'host-weg',
   * 'netwerk', 'geweigerd', 'rate-limit'.
   */
  function GuestSession(o) {
    this.o = o;
    this.code = o.code;
    this.name = cleanName(o.name) || 'Gast';
    this.relay = o.relay || DEFAULT_RELAY;
    this.clock = o.clock || defaultClock();
    this.emit = o.onEvent || function () {};
    this.peer = PEER_PREFIX + 'g' + randomId(12);
    this.cid = this.peer + '.1';
    this.host = hostPeerId(this.code);
    this.joined = false;
    this.closed = false;
    this.link = null;
    this.timer = 0;
    this.stats = { ignored: 0 };
  }

  GuestSession.prototype.start = function () {
    var self = this;
    this.link = new Link({
      url: roomUrl(this.relay, this.code), peer: this.peer, WebSocket: this.o.WebSocket, clock: this.clock,
      onOpen: function () {
        self.link.send({ t: 'connect', cid: self.cid, to: self.host, label: LABEL, meta: { v: PROTO, name: self.name } });
      },
      onFrame: function (f) { self._frame(f); },
      onDown: function (reason) {
        if (self.closed) return;
        var r = self.joined ? (reason === 'rate-limit' ? 'rate-limit' : 'netwerk')
          : (reason === 'room-full' ? 'vol' : reason === 'rate-limit' ? 'rate-limit' : 'onbereikbaar');
        self._end(r);
      }
    });
    this.timer = this.clock.setTimeout(function () { if (!self.joined) self._end('timeout'); }, LIMITS.joinTimeoutMs);
    this.link.start();
  };

  GuestSession.prototype._frame = function (f) {
    if (f.t === 'error') {
      if (f.type === 'peer-unavailable' && !this.joined) this._end('niet-gevonden');
      return;
    }
    if (f.t === 'connected') return;
    if (f.t === 'data') {
      if (f.from !== this.host || f.cid !== this.cid) { this.stats.ignored++; return; }
      var d = f.d;
      if (!isObj(d) || typeof d.k !== 'string') { this.stats.ignored++; return; }
      if (!this.joined) {
        if (d.k === 'welcome' && d.v === PROTO) {
          this.joined = true;
          if (this.timer) { this.clock.clearTimeout(this.timer); this.timer = 0; }
          this.emit('joined', { host: cleanName(d.host) || 'Host', you: cleanName(d.you) || this.name });
        } else if (d.k === 'reject') {
          this._end(d.reason === 'vol' || d.reason === 'versie' ? d.reason : 'geweigerd');
        }
        return;
      }
      if (d.k === 'hb') { this.send({ k: 'hb' }); return; }
      if (d.k === 'closed') { this._end('gesloten'); return; }
      this.emit('msg', d);
      return;
    }
    if ((f.t === 'close' && f.from === this.host && f.cid === this.cid) || (f.t === 'gone' && f.peer === this.host)) {
      this._end(this.joined ? 'host-weg' : 'geweigerd');
    }
  };

  GuestSession.prototype.send = function (msg) {
    if (this.closed || !this.joined || !this.link) return false;
    return this.link.send({ t: 'data', cid: this.cid, to: this.host, d: msg });
  };

  GuestSession.prototype._end = function (reason) {
    if (this.closed) return;
    this.closed = true;
    if (this.timer) { this.clock.clearTimeout(this.timer); this.timer = 0; }
    if (this.link) this.link.close();
    this.emit('down', { reason: reason, joined: this.joined });
  };

  /* Zelf weggaan: de host hoort het, daarna dicht. Geen 'down'. */
  GuestSession.prototype.close = function () {
    if (this.closed) return;
    this.closed = true;
    if (this.timer) { this.clock.clearTimeout(this.timer); this.timer = 0; }
    if (this.link) {
      if (this.joined) {
        this.link.send({ t: 'data', cid: this.cid, to: this.host, d: { k: 'bye' } });
        this.link.send({ t: 'close', cid: this.cid, to: this.host });
      }
      this.link.close();
    }
  };

  /* ─── Stand over de lijn ─────────────────────────────── */

  var PHASES = ['break', 'play', 'choice', 'over'];
  var CHOICE_TYPES = ['ongeldigeBreak', 'breakFout', 'achtBreak', 'achtBreakFout'];
  var FOULS = ['scratch', 'geenContact', 'verkeerdeEerste', 'keukenregel', 'geenBand'];

  /* Compacte kopie: ballen liggen stil, dus geen snelheden. */
  function packState(s) {
    return {
      v: s.v, mode: s.mode, names: s.names.slice(0, 2), turn: s.turn, breaker: s.breaker, phase: s.phase,
      groups: s.groups ? s.groups.slice() : null, ballInHand: s.ballInHand,
      choice: s.choice ? { type: s.choice.type, chooser: s.choice.chooser, options: s.choice.options.slice() } : null,
      winner: s.winner, endReason: s.endReason, shots: s.shots,
      balls: s.balls.map(function (b) { return { n: b.n, x: b.x, y: b.y, on: b.on, pocket: b.pocket }; }),
      last: s.last ? JSON.parse(JSON.stringify(s.last)) : null
    };
  }

  function readPlayer(v) { return v === 0 || v === 1 ? v : null; }
  function readGroups(g) {
    if (g === null || g === undefined) return null;
    if (!Array.isArray(g) || g.length !== 2) return undefined;
    if ((g[0] === 'vol' && g[1] === 'half') || (g[0] === 'half' && g[1] === 'vol')) return [g[0], g[1]];
    return undefined;
  }
  function readBallList(v) {
    if (!Array.isArray(v) || v.length > 16) return null;
    for (var i = 0; i < v.length; i++) if (!isInt(v[i]) || v[i] < 0 || v[i] > 15) return null;
    return v.slice();
  }
  function readCall(c, P) {
    if (c === null || c === undefined) return null;
    if (!isObj(c)) return undefined;
    if (c.safety === true) return { safety: true };
    if (isInt(c.ball) && c.ball >= 1 && c.ball <= 15 && P.POCKET_IDS.indexOf(c.pocket) >= 0) return { ball: c.ball, pocket: c.pocket };
    return undefined;
  }
  function readChoice(c, P) {
    if (!isObj(c) || CHOICE_TYPES.indexOf(c.type) < 0 || readPlayer(c.chooser) === null || !Array.isArray(c.options)) return null;
    if (!c.options.length || c.options.length > 4) return null;
    for (var i = 0; i < c.options.length; i++) if (!Object.prototype.hasOwnProperty.call(P.CHOICE_TEXT, c.options[i])) return null;
    return { type: c.type, chooser: c.chooser, options: c.options.slice() };
  }

  /* Alleen wat describeOutcome gebruikt, met gecontroleerde typen. Anders null. */
  function readOutcome(o, P) {
    if (!isObj(o)) return null;
    var shooter = readPlayer(o.shooter);
    if (shooter === null) return null;
    var fouls = Array.isArray(o.fouls) ? o.fouls.filter(function (f) { return FOULS.indexOf(f) >= 0; }) : [];
    var potted = readBallList(o.potted) || [];
    var call = readCall(o.call, P);
    var assign = null;
    if (isObj(o.assign) && readPlayer(o.assign.player) !== null && (o.assign.group === 'vol' || o.assign.group === 'half')) {
      assign = { player: o.assign.player, group: o.assign.group };
    }
    var winner = readPlayer(o.winner);
    var endReason = typeof o.endReason === 'string' && Object.prototype.hasOwnProperty.call(P.END_TEXT, o.endReason) ? o.endReason : null;
    if (winner !== null && !endReason) return null;
    var choice = o.choice ? readChoice(o.choice, P) : null;
    return {
      isBreak: o.isBreak === true, shooter: shooter, call: call === undefined ? null : call,
      fouls: fouls, foul: fouls.length > 0, potted: potted, calledMade: o.calledMade === true,
      assign: assign, winner: winner, loser: winner === null ? null : 1 - winner, endReason: endReason, choice: choice
    };
  }

  /*
   * Controleer een stand van de host (de gast vertrouwt de host, maar laat zich niet laten vastlopen
   * door kapotte data). Geeft een complete engine-stand terug of null.
   */
  function readState(o, P) {
    if (!isObj(o)) return null;
    if (PHASES.indexOf(o.phase) < 0) return null;
    var turn = readPlayer(o.turn), breaker = readPlayer(o.breaker);
    if (turn === null || breaker === null) return null;
    if (!Array.isArray(o.balls) || o.balls.length !== 16) return null;
    var seen = {}, balls = [];
    for (var i = 0; i < 16; i++) {
      var b = o.balls[i];
      if (!isObj(b) || !isInt(b.n) || b.n < 0 || b.n > 15 || seen[b.n]) return null;
      if (i === 0 && b.n !== 0) return null;
      if (!finite(b.x) || !finite(b.y) || Math.abs(b.x) > 5000 || Math.abs(b.y) > 5000) return null;
      if (typeof b.on !== 'boolean') return null;
      var pocket = b.pocket === null || b.pocket === undefined ? null : b.pocket;
      if (pocket !== null && P.POCKET_IDS.indexOf(pocket) < 0) return null;
      seen[b.n] = true;
      balls.push({ n: b.n, x: b.x, y: b.y, vx: 0, vy: 0, sx: 0, sy: 0, on: b.on, pocket: b.on ? null : pocket });
    }
    var groups = readGroups(o.groups);
    if (groups === undefined) return null;
    var bih = o.ballInHand === 'kitchen' || o.ballInHand === 'table' ? o.ballInHand : null;
    if (o.ballInHand !== null && o.ballInHand !== undefined && !bih) return null;
    var choice = null;
    if (o.phase === 'choice') { choice = readChoice(o.choice, P); if (!choice) return null; }
    var winner = readPlayer(o.winner);
    if (o.phase === 'over' && winner === null) return null;
    var names = Array.isArray(o.names) ? o.names : [];
    var n0 = cleanName(names[0]) || 'Speler 1', n1 = cleanName(names[1]) || 'Speler 2';
    var last = null;
    if (isObj(o.last)) {
      if (o.last.outcome) { var oc = readOutcome(o.last.outcome, P); if (oc) last = { outcome: oc }; }
      else if (typeof o.last.choice === 'string' && Object.prototype.hasOwnProperty.call(P.CHOICE_TEXT, o.last.choice)) {
        last = { choice: o.last.choice, chooser: readPlayer(o.last.chooser) };
      }
    }
    return {
      v: 1, mode: 'duo', names: [n0, n1], turn: turn, breaker: breaker, phase: o.phase, groups: groups,
      ballInHand: bih, choice: choice, winner: o.phase === 'over' ? winner : null,
      endReason: o.phase === 'over' && typeof o.endReason === 'string' && Object.prototype.hasOwnProperty.call(P.END_TEXT, o.endReason) ? o.endReason : null,
      shots: isInt(o.shots) && o.shots >= 0 ? o.shots : 0, balls: balls, last: last
    };
  }

  /* Een actie van een speler, streng gelezen. null als er iets niet klopt. */
  function readAction(a, P) {
    if (!isObj(a)) return null;
    if (a.type === 'place') {
      if (!finite(a.x) || !finite(a.y)) return null;
      return { type: 'place', x: a.x, y: a.y };
    }
    if (a.type === 'shoot') {
      if (!finite(a.angle) || !finite(a.speed) || Math.abs(a.angle) > 100) return null;
      if (a.speed < P.MIN_SPEED || a.speed > P.MAX_SPEED) return null;
      var call = readCall(a.call, P);
      if (call === undefined) return null;
      return { type: 'shoot', angle: a.angle, speed: a.speed, call: call };
    }
    if (a.type === 'choice') {
      if (typeof a.opt !== 'string' || !Object.prototype.hasOwnProperty.call(P.CHOICE_TEXT, a.opt)) return null;
      return { type: 'choice', opt: a.opt };
    }
    return null;
  }

  /* ─── Gezaghebbende partij (alleen bij de host) ──────── */

  /*
   * De host speelt zelf ook via apply(0, ...); de gast via apply(1, ...). Alles wat de stand verandert,
   * gaat hierdoorheen. opts = { rng, newId }.
   */
  function Authority(P, opts) {
    opts = opts || {};
    this.P = P;
    this.rng = opts.rng;
    this.newId = opts.newId || function () { return randomId(8); };
    this.match = null;
    this.rev = 0;
    this.state = null;
    this.lastId = [0, 0];
    this.ready = [false, false];
    this.nextBreaker = 0;
    this.paused = false;
    this.placed = false;
  }

  Authority.prototype.start = function (names) {
    this.match = this.newId();
    this.rev = 0;
    this.lastId = [0, 0];
    this.ready = [false, false];
    this.paused = false;
    this.placed = false;
    this.state = this.P.newGame({ mode: 'duo', names: [cleanName(names[0]) || 'Host', cleanName(names[1]) || 'Gast'], breaker: this.nextBreaker, rng: this.rng });
    this.nextBreaker = 1 - this.nextBreaker;
    return this.snapshot(null);
  };

  /* Wie mag nu iets doen: 0, 1, of -1 (niemand: partij voorbij of geen partij). */
  Authority.prototype.mover = function () {
    var s = this.state;
    if (!s || s.phase === 'over') return -1;
    if (s.phase === 'choice') return s.choice ? s.choice.chooser : -1;
    return s.turn;
  };

  Authority.prototype.snapshot = function (anim) {
    return {
      k: 'state', match: this.match, rev: this.rev, state: packState(this.state),
      placed: this.placed, ready: this.ready.slice(), anim: anim || null
    };
  };

  function fail(reason) { return { ok: false, reason: reason }; }

  Authority.prototype.apply = function (seat, msg) {
    var P = this.P;
    if (seat !== 0 && seat !== 1) return fail('ongeldig');
    if (!this.state) return fail('geen-partij');
    if (!isObj(msg)) return fail('ongeldig');
    if (msg.match !== this.match) return fail('andere-partij');
    if (!isInt(msg.id) || msg.id <= this.lastId[seat]) return fail('dubbel');
    if (msg.rev !== this.rev) return fail('verouderd');
    if (this.paused) return fail('pauze');
    var a = readAction(msg.a, P);
    if (!a) return fail('ongeldig');
    if (seat !== this.mover()) return fail('niet-jouw-beurt');
    var s = this.state, next, anim = null, placed = false;
    if (a.type === 'place') {
      if (s.phase !== 'break' && s.phase !== 'play') return fail('fase');
      if (!s.ballInHand) return fail('geen-bal-in-hand');
      var r = P.placeCue(s, a.x, a.y);
      if (!r.ok) return fail('plaats-' + r.reason);
      next = r.state;
      placed = true;
    } else if (a.type === 'shoot') {
      if (s.phase !== 'break' && s.phase !== 'play') return fail('fase');
      var call = s.phase === 'break' ? null : a.call;
      if (s.phase === 'play' && !P.isValidCall(s.groups, P.remainingOf(s), s.turn, call)) return fail('aankondiging');
      try {
        var ctx = P.beginShot(s, { angle: a.angle, speed: a.speed, call: call });
        P.runShot(ctx);
        next = P.finishShot(ctx).state;
      } catch (_) {
        return fail('stoot');
      }
      anim = { from: this.rev, shot: { angle: a.angle, speed: a.speed, call: call } };
    } else {
      if (s.phase !== 'choice' || !s.choice) return fail('fase');
      if (s.choice.options.indexOf(a.opt) < 0) return fail('keuze');
      next = P.applyChoice(s, a.opt, this.rng);
    }
    this.lastId[seat] = msg.id;
    this.state = next;
    this.placed = placed;
    this.rev += 1;
    return { ok: true, out: this.snapshot(anim) };
  };

  /* Instemming met een nieuwe partij. Geeft true als beide spelers akkoord zijn. */
  Authority.prototype.setReady = function (seat, on) {
    if (!this.state || (seat !== 0 && seat !== 1)) return false;
    this.ready[seat] = !!on;
    return this.ready[0] && this.ready[1];
  };

  /* Nieuwe verbinding op een stoel: oude actie-id's gelden niet meer. */
  Authority.prototype.resetSeat = function (seat) { if (seat === 0 || seat === 1) { this.lastId[seat] = 0; this.ready[seat] = false; } };

  /*
   * Alleen voor de testinterface (?test=1, bij de host): zet een stand als gezaghebbende nieuwe
   * revisie. Er is geen netwerkbericht dat dit aanroept. patch zoals PoolTest.setState.
   */
  Authority.prototype.fixture = function (patch) {
    var P = this.P;
    if (!this.state) throw new Error('Geen partij');
    var s = P.cloneState(this.state);
    patch = patch || {};
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
    ['turn', 'groups', 'phase', 'ballInHand', 'choice', 'breaker', 'shots', 'winner', 'endReason'].forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) s[k] = patch[k];
    });
    if (s.phase !== 'over') { s.winner = null; s.endReason = null; }
    this.state = s;
    this.placed = false;
    this.rev += 1;
    return this.snapshot(null);
  };

  return {
    PROTO: PROTO, ROOM_PREFIX: ROOM_PREFIX, PEER_PREFIX: PEER_PREFIX, LABEL: LABEL,
    CODE_ALPHABET: CODE_ALPHABET, CODE_LENGTH: CODE_LENGTH, DEFAULT_RELAY: DEFAULT_RELAY, NAME_MAX: NAME_MAX,
    LIMITS: LIMITS,
    makeRoomCode: makeRoomCode, normalizeRoomCode: normalizeRoomCode, cleanName: cleanName,
    validRelayUrl: validRelayUrl, relayFromSearch: relayFromSearch, codeFromSearch: codeFromSearch,
    roomUrl: roomUrl, hostPeerId: hostPeerId, inviteUrl: inviteUrl, randomId: randomId,
    Link: Link, HostSession: HostSession, GuestSession: GuestSession,
    packState: packState, readState: readState, readAction: readAction, readOutcome: readOutcome,
    Authority: Authority
  };
});
