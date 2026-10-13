# FM Atlas

Gratis studiehulp voor HAN Facilitair Management: samenvattingen, begrippenlijsten, flashcards en
oefentoetsen per vak. Live op https://fmatlas.nl via GitHub Pages vanaf `main`.

## Opbouw

- `index.html`: landingspagina. Ingelogde bezoekers gaan door naar `app.html`.
- `app.html`: vakkenoverzicht, reeks, leaderboard en contactformulier. De vakken staan in `VAKKEN`.
- `<vak>.html`: vakpagina (hub). Per vak `-samenvatting`, `-begrippen` en `-flashcards`.
- `js/data-<vak>.js`: begrippen, categorieën en flashcards per vak. `js/data-oefentoetsN.js`: oefentoetsen.
- `js/fmatlas.js`: gedeelde header, zoekindex (`FA_SEARCH_INDEX`), reeks, XP en cloud-sync.
- `css/fmatlas.css`: gedeelde stijl.
- `_design/`: oude ontwerpbestanden. Jekyll publiceert mappen met `_` niet.

Een nieuwe pagina komt ook in `sitemap.xml` en in `FA_SEARCH_INDEX`.

## Game: Hoge Inzet

`game/hoge-inzet/`: roulette (Amerikaans wiel, 0, 00 en 1 t/m 36) en blackjack (zes decks) met één
gedeelde bank van 1000 speelfiches. Alleen speelfiches: geen echt geld, geen Firebase, geen XP, niets
wordt gedeeld. Geen dependencies of build: `index.html`, `style.css`, `engine.js`,
`app.js` en `kaart.svg`, plus het gedeelde `js/spel-reclame.js`. Lokaal openen kan door `game/hoge-inzet/index.html` in de browser te openen (ook via
`file://`).

- Inzetten: fiches van 10, 25, 50, 100, 500 en 1000, plus `Alles` (het hele saldo, naar beneden
  afgerond op hele fiches). De engine neemt elke hele inzet van minstens 1 aan (`E.isInzet`).
- Roulette: een nummer betaalt 36x de inzet terug, rood/zwart/even/oneven/1–18/19–36 betalen 2x. Op
  0 en 00 verliezen alle buitenkansen. Huisvoordeel 5,3%. Intern heet de 00 nummer 37 (`E.DOUBLE_ZERO`);
  `E.numberLabel` maakt er voor de weergave '00' van.
- Blackjack: blackjack betaalt 6:5 (naar beneden afgerond), winst 2x terug, gelijk geeft de inzet terug. De dealer kijkt bij
  het delen of hij blackjack heeft, trekt onder 17 en ook op soft 17. Verdubbelen met de eerste twee
  kaarten, ook na splitsen. Splitsen met twee kaarten van gelijke waarde, tot vier handen; gesplitste
  azen krijgen één kaart. Geen verzekeren of opgeven. Nieuw schudden als de helft van de shoe op is.
  Met basisstrategie verlies je zo'n 2% per inzet (gemeten met een simulatie van twee miljoen handen).
- Opslag: `localStorage` onder `fa_hoge_inzet_v1` (saldo, topsaldo, rondes, uitslagen, lopende
  inzet of hand). Een uitslag wordt eerst afgerekend en bewaard, daarna pas geanimeerd: herladen
  tijdens een draai of dealerbeurt geeft dus nooit een dubbele of gemiste uitbetaling. De shoe gaat
  niet mee (`E.forStorage`) en een opgeslagen shoe wordt nooit ingelezen: na herladen wordt er
  nieuw geschud, zodat niemand via localStorage de volgende kaarten kan lezen of kiezen. Een tweede
  tabblad of een pagina uit de terugknop-cache neemt eerst de bewaarde stand over (`storage`- en
  `pageshow`-event), zodat je een verloren ronde niet ongedaan maakt door elders verder te spelen.
- Reclame: een video van JonasMS (`js/spel-reclame.js`, zie hieronder). Een video uitkijken
  levert 500 fiches op (`E.bonus`); na een ronde komt er soms vanzelf een video (kans 0,2, hooguit
  één per 3 minuten), behalve als de speler reclamevrij heeft.
- `engine.js` bevat alle spelregels als pure functies en is ook in Node te laden:
  `const E = require('./game/hoge-inzet/engine.js')`.

## Game: Pool

`game/pool/`: 8-ball pool, tegen de computer, met z'n tweeën op één scherm, of online met z'n tweeën
op eigen apparaten (laptop en telefoon). Geen dependencies, build of eigen server: `index.html`,
`style.css`, `engine.js`, `bot.js`, `net.js`, `app.js` en `kaart.svg`. Lokaal openen kan door
`game/pool/index.html` in de browser te openen (ook via `file://`); online spelen werkt alleen vanaf
de site zelf, omdat de relay alleen bekende origins toelaat.

- Hoofdregels: pot al je volle of halve ballen en daarna de 8 als laatste. Elke stoot na de break
  kondig je aan (bal en pocket, of safety). Bij een fout krijgt de tegenstander bal in hand.
- Online: kamer met een code van vijf tekens via de bestaande WebSocket-relay van Slipstroom en
  Stadsstorm (`wss://slipstroom.jochem-35e.workers.dev/relay`), in eigen kamers met voorvoegsel `PL`.
  Hooguit twee spelers; de host is de autoriteit over de partij. Geen Firebase.
- Opslag: alleen `localStorage` met voorkeuren (`fa_pool_v1`: speelvorm, geluid, volume, richtlijn,
  kracht, naam) en de laatste game (`fa_laatste_game`). Een lopende partij wordt niet bewaard. Geen
  Firebase, XP of tellers.
- API van de engine, de computer, het online protocol, de testinterface en de uitzonderingen op de
  regels staan in `game/pool/README.md`.

## Firebase

Project `fmkompas-ff8bc` (Google-login en Firestore).

- `scores/{uid}`: naam, foto, punten. Publiek leesbaar voor het leaderboard.
- `voortgang/{uid}`: voortgang per vak, reeks, laatst geopend. Alleen voor de eigenaar (en leesbaar voor de beheerder, voor het dashboard).
- `statistiek/{dag}` met `paginas/{pagina}` en `toetsen/{toets}`: anonieme tellers (bezoekers per
  dag, weergaven per pagina, ingeleverde toetsen en de som van hun scores). Geschreven door
  `js/statistiek.js`, gelezen door het dashboard in `beheer.html`. Geen namen, accounts of IP-adressen.
- `statistiek/{dag}/spel/{teller}`: anonieme tellers van de game Slipstroom in `game/slipstroom/` (keer geopend,
  races, kamers, baan, apparaat, kwaliteit). De game stuurt alleen window-events `slipstroom:stat`;
  `js/spel-statistiek.js` (alleen geladen door de FM Atlas-build van de game) telt ze als `n` (+1) en
  bij online races `som` (+aantal spelers, hooguit 6). Getoond in het blok "Game: Slipstroom" op
  `beheer.html`.

Regels die horen bij de huidige code (Firebase-console → Firestore → Regels):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isBeheerder() { return request.auth != null && request.auth.uid == 'EFkA4kexkLNjBKCGuKD9eiyUvfM2'; }

    match /scores/{uid} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid
        && request.resource.data.pts is int && request.resource.data.pts <= 2000;
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.pts is int
        && request.resource.data.pts >= resource.data.pts
        && request.resource.data.pts - resource.data.pts <= 60;
    }
    match /voortgang/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if isBeheerder();  // dashboard in beheer.html
    }
    // Anonieme tellers (js/statistiek.js): alleen +1 per schrijfactie, alleen de beheerder leest.
    match /statistiek/{dag} {
      allow read: if isBeheerder();
      allow create: if dag.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
        && request.resource.data.keys().hasOnly(['bezoekers']) && request.resource.data.bezoekers == 1;
      allow update: if request.resource.data.keys().hasOnly(['bezoekers'])
        && request.resource.data.bezoekers == resource.data.bezoekers + 1;
      match /paginas/{pagina} {
        allow read: if isBeheerder();
        allow create: if pagina.size() <= 80 && request.resource.data.keys().hasOnly(['n']) && request.resource.data.n == 1;
        allow update: if request.resource.data.keys().hasOnly(['n']) && request.resource.data.n == resource.data.n + 1;
      }
      match /toetsen/{toets} {
        allow read: if isBeheerder();
        allow create: if toets.size() <= 80 && request.resource.data.keys().hasOnly(['n', 'som'])
          && request.resource.data.n == 1 && request.resource.data.som >= 0 && request.resource.data.som <= 100;
        allow update: if request.resource.data.keys().hasOnly(['n', 'som'])
          && request.resource.data.n == resource.data.n + 1
          && request.resource.data.som >= resource.data.som && request.resource.data.som - resource.data.som <= 100;
      }
      // Spelstatistiek van Slipstroom (js/spel-statistiek.js): n +1, som (spelers) +0..6.
      match /spel/{teller} {
        allow read: if isBeheerder();
        allow create: if teller.size() <= 40 && teller.matches('^[a-z0-9-]+$')
          && request.resource.data.keys().hasOnly(['n', 'som']) && request.resource.data.n == 1
          && (!('som' in request.resource.data) || (request.resource.data.som >= 0 && request.resource.data.som <= 6));
        allow update: if request.resource.data.keys().hasOnly(['n', 'som'])
          && request.resource.data.n == resource.data.n + 1
          && (!('som' in request.resource.data)
            || (request.resource.data.som >= resource.data.get('som', 0)
              && request.resource.data.som - resource.data.get('som', 0) <= 6));
      }
    }
    match /feedback/{id} {
      // Iedereen mag een melding toevoegen (ook zonder login), maar niets lezen.
      allow create: if request.resource.data.keys().hasOnly(['type','bericht','pagina','titel','selectie','email','uid','status','aangemaakt'])
        && request.resource.data.type in ['feedback','onjuistheid']
        && request.resource.data.bericht is string
        && request.resource.data.bericht.size() >= 5 && request.resource.data.bericht.size() <= 2000
        && request.resource.data.pagina is string && request.resource.data.pagina.size() <= 300
        && request.resource.data.status == 'nieuw'
        && request.resource.data.aangemaakt == request.time
        && (!('titel' in request.resource.data) || request.resource.data.titel.size() <= 200)
        && (!('selectie' in request.resource.data) || request.resource.data.selectie.size() <= 500)
        && (!('email' in request.resource.data) || request.resource.data.email.size() <= 200)
        && (!('uid' in request.resource.data) || request.resource.data.uid.size() <= 128);
      allow read, update, delete: if isBeheerder();
    }
  }
}
```

De update-regel laat per schrijfactie hooguit 60 punten bij (de grootste beloning is de bonus van
50) en nooit minder punten. Zonder de `voortgang`-regel weigert Firestore de sync; de site werkt dan
gewoon door met alleen lokale voortgang.

## Feedback en automatische verwerking

Op elke pagina die `js/fmatlas.js` laadt staan twee knoppen (`js/feedback.js`): "Feedback" en
"Meld een onjuistheid". Een melding komt in Firestore `feedback/{id}` met status `nieuw`.
`beheer.html` toont alles aan de beheerder.

Zolang de Firestore-regel voor `feedback` er niet staat, gaat een melding via Formspree naar de
mail van de beheerder (met pagina en geselecteerde tekst).

In voorbereiding: een verwerker op de Mac mini die nieuwe meldingen toetst aan de tekst van het
lesmateriaal (`_beheer/feedback/bronnen-tekst.py` maakt die tekst), een correctie op een branch
`feedback/<id>` klaarzet en die pas na "Live zetten" op `beheer.html` naar main brengt. Vincent
meldt via `vincent.py --meld david "..."` wat er openstaat. Jaar 2 wordt gegenereerd uit
`fmatlas-vakken` en gaat daarom naar status `voor_david`.

## Reclame in de spelletjes

`js/spel-reclame.js` toont in Hoge Inzet, Slipstroom en Stadsstorm een willekeurige video van
JonasMS (youtube.com/@JonasMeloSousa), via youtube-nocookie.com, met een timer van 30 seconden.
Er draait geen advertentienetwerk: FM Atlas promoot het kanaal van Jonas, met zijn akkoord.

- `FMReclame.toon({ beloning })` toont meteen een video en geeft een Promise die `true` oplevert als
  de timer is afgelopen. `FMReclame.misschien({ kans, minTussen })` doet dat soms (standaard kans
  0,5 en niet binnen 120 seconden na de vorige).
- Slipstroom en Stadsstorm weten niets van FM Atlas: hun FM Atlas-build laadt het script en de game
  stuurt bij de uitslag het window-event `fmatlas:tussen-potjes`.
- De timer loopt alleen als de pagina in beeld is. Zolang de video openstaat gaan toetsen niet naar
  het spel.
- De video-ids staan in `VIDEOS` (alle 30 video's op 13-10-2026). Een nieuwe video van Jonas: id
  toevoegen.
- Reclamevrij (€2, via Mollie) staat in `localStorage` als `fa_reclamevrij`. Zolang `BETAAL_URL` leeg
  is, is er geen knop om het te kopen.
