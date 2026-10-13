/*
 * Hoge Inzet: een advertentie kijken voor extra fiches.
 *
 * Werkt via Google H5 Games Ads (de Ad Placement API van AdSense), type 'reward': de speler kiest
 * zelf of hij een advertentie kijkt, en alleen een uitgekeken advertentie levert fiches op.
 * https://developers.google.com/ad-placement/apis/adbreak
 *
 * Zolang CONFIG.client leeg is, gebeurt er niets: er wordt geen script van Google geladen en de
 * knop blijft verborgen. Om het aan te zetten:
 *   1. een AdSense-account met goedkeuring voor fmatlas.nl, en een goedgekeurde aanmelding voor
 *      H5 Games Ads (https://developers.google.com/ad-placement/docs/beta);
 *   2. in AdSense onder Privacy en berichten een cookiemelding (CMP) voor de EER aanzetten;
 *   3. de uitgeverscode hieronder invullen en `ads.txt` in de root van de site zetten;
 *   4. eerst met test: true proberen, daarna test op false.
 *
 * Dit bestand weet niets van fiches of spelregels; app.js geeft de callbacks mee.
 */
(function () {
  'use strict';

  var CONFIG = {
    client: '',   // AdSense-uitgeverscode, bijvoorbeeld 'ca-pub-1234567890123456'. Leeg: geen advertenties.
    test: true    // testmodus van Google: proefadvertenties, er wordt niets vertoond of betaald
  };

  var OPNIEUW_NA_KIJKEN = 5000;   // ms tot een nieuw aanbod na een (afgebroken) advertentie
  var OPNIEUW_ZONDER = 60000;     // ms tot een nieuwe poging als er geen advertentie klaarstond

  var cb = null;
  var aanbod = null;      // showAdFn van Google zolang er een advertentie klaarstaat
  var vraagLoopt = false; // er loopt een adBreak-aanvraag; niet opnieuw vragen, anders vervalt die
  var timer = null;

  function actief() { return /^ca-pub-\d{10,20}$/.test(CONFIG.client); }

  function adsbygoogle(o) {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push(o);
  }

  function laadScript() {
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(CONFIG.client);
    if (CONFIG.test) s.setAttribute('data-adbreak-test', 'on');
    document.head.appendChild(s);
  }

  function zetAanbod(fn) {
    aanbod = fn;
    if (cb) cb.beschikbaar(!!fn);
  }

  function vraagAan() {
    timer = null;
    if (vraagLoopt) return;
    vraagLoopt = true;
    adsbygoogle({
      type: 'reward',
      name: 'extra-fiches',
      beforeReward: function (showAdFn) { zetAanbod(showAdFn); },
      beforeAd: function () { zetAanbod(null); cb.voor(); },
      adViewed: function () { cb.beloning(); },
      adDismissed: function () { cb.afgebroken(); },
      afterAd: function () { cb.na(); },
      adBreakDone: function (info) {
        vraagLoopt = false;
        zetAanbod(null);
        var st = info && info.breakStatus;
        timer = setTimeout(vraagAan, st === 'viewed' || st === 'dismissed' ? OPNIEUW_NA_KIJKEN : OPNIEUW_ZONDER);
      }
    });
  }

  window.HogeInzetReclame = {
    actief: actief,
    // callbacks: beschikbaar(bool), voor(), na(), beloning(), afgebroken()
    start: function (callbacks, geluidAan) {
      if (!actief() || cb) return false;
      cb = callbacks;
      laadScript();
      adsbygoogle({ preloadAdBreaks: 'on', sound: geluidAan ? 'on' : 'off' });
      vraagAan();
      return true;
    },
    // De speler klikte op de knop: toon de advertentie die klaarstaat.
    kijk: function () {
      if (!aanbod) return false;
      var fn = aanbod;
      zetAanbod(null);
      fn();
      return true;
    },
    geluid: function (aan) {
      if (cb) adsbygoogle({ sound: aan ? 'on' : 'off' });
    }
  };
})();
