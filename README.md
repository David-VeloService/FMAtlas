# FM Atlas

Gratis studiehulp voor HAN Facilitair Management: samenvattingen, begrippenlijsten, flashcards en
oefentoetsen per vak. Live op https://fmatlas.nl via GitHub Pages vanaf `main`.

## Opbouw

- `index.html`: vakkenoverzicht per jaar en periode.
- `vak.html?v=<key>`: vakpagina; de vakken en onderdelen staan in `js/atlas-data.js`.
- `begrippentoets.html?vak=<key>`: begrippentoets per vak.
- Gegenereerde vakpagina's: samenvattingen, begrippen, flashcards, oefentoetsen, toetsinformatie
  en lesvideo's. De oude vakadressen verwijzen door naar `vak.html`.
- `js/atlas.js`: topbalk, zoeken, thema en vakkenoverzicht.
- `js/atlas-account.js`: optionele Google-login, kaartvoortgang en beste toetsscores.
- `js/data-<vak>.js`: de begrippen, flashcards en toetsvragen die de leerpagina's laden.
- `css/atlas.css`, `css/leer.css`, `css/toets.css`: de huidige stijl.
- `404.html` en `privacy.html`: dezelfde topbalk en achtergrond als het vakkenoverzicht.
- `app.html` en `game/index.html`: doorverwijzingen naar `/`. De oude loginquery wordt niet
  verwerkt; inloggen gaat via de knop in de nieuwe topbalk.
- `beheer.html`: de bestaande beheerpagina. `js/fmatlas.js` en `css/fmatlas.css` blijven daarvoor
  staan. De oude dashboardberekeningen zijn niet aangepast aan de nieuwe voortgangsvelden.
- `media/`, `video/` en `p/`: lesmateriaal en de niet-vermelde podcastfeed blijven staan.
- `_design/`, `_legacy/`, `_beheer/`: archief en beheerbronnen. Jekyll publiceert mappen met `_`
  niet; voeg geen `.nojekyll` toe.

Nieuwe onderdelen komen in `js/atlas-data.js` en `sitemap.xml`. De zoekindex `FA_SEARCH_INDEX`
in `js/fmatlas.js` wordt nog door de beheerpagina gebruikt.

## Firebase

Project `fmkompas-ff8bc` (Google-login en Firestore).

- `voortgang/{uid}.kaarten`: kaartvoortgang en historie per vak, via `js/atlas-account.js`.
- `voortgang/{uid}.toetsen`: beste toetsscores, via dezelfde accountcode.
- `statistiek/{dag}` met `paginas/{pagina}` en `toetsen/{toets}`: anonieme tellers (bezoekers per
  dag, weergaven per pagina, ingeleverde toetsen en de som van hun scores). Geschreven door
  `js/atlas-meten.js`, gelezen door het dashboard in `beheer.html`. Geen namen, accounts of IP-adressen.
- `activiteit/{uid}_{dag}`: actieve tijd, geopende onderdelen en toetsscores per ingelogde student
  per dag, ook via `js/atlas-meten.js`. Zie "Meten" hieronder.
- `statistiek/{dag}/spel/{teller}`: anonieme tellers van de game Slipstroom in `game/slipstroom/` (keer geopend,
  races, kamers, baan, apparaat, kwaliteit). De game stuurt alleen window-events `slipstroom:stat`;
  `js/spel-statistiek.js` (alleen geladen door de FM Atlas-build van de game) telt ze als `n` (+1) en
  bij online races `som` (+aantal spelers, hooguit 6). Getoond in het blok "Game: Slipstroom" op
  `beheer.html`.
- De beheerpagina leest daarnaast de bestaande collecties `scores` en `feedback`, en de oude velden
  `progress`, `streak` en `last`. Die oude velden worden door de nieuwe leerpagina's niet meer
  bijgewerkt.

Onderstaande regels zijn de bestaande beheerconfiguratie uit de oude site. Ze zijn bij de
opruiming niet gewijzigd; de daadwerkelijk ingestelde regels zijn hier niet opnieuw gecontroleerd.

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
    // Historische anonieme tellers: alleen +1 per schrijfactie, alleen de beheerder leest.
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
      // Historische spelstatistiek van Slipstroom: n +1, som (spelers) +0..6.
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

De update-regel voor `scores` hoort bij de oude site. De nieuwe accountcode bewaart zijn
voortgang in `voortgang/{uid}`.

## Meten in de nieuwe site

`js/atlas.js` laadt `js/atlas-meten.js` na het accountscript, zonder aanpassingen aan de HTML.
De module houdt de bestaande anonieme dag-, pagina- en toetstellers bij via REST-increments.
Iedere aanroep van `AtlasAccount.saveTest` geeft een `atlas:toets-ingeleverd`-event; alleen geldige
scores worden geteld, ook als de score lager is dan een eerdere poging. `AtlasAccount.currentUser`
is `undefined` tijdens accountherstel, daarna `null` of `{uid, getIdToken}`. `atlas:account` meldt
de accountstatus. De meting wacht daarop, zodat de beheerder nergens meetelt.

Voor ingelogde studenten komt er daarnaast `activiteit/{uid}_{dag}`: uid, lokale dag, actieve
seconden, opens en seconden per vak/onderdeel, en aantal/som van toetspercentages per toets.
Pagina's worden via bestandsnaam en query aan `ATLAS_VAKKEN` gekoppeld; zonder vak vallen ze onder
`_site`. Elke 15 seconden telt een zichtbare pagina mee als de laatste interactie hooguit 60 seconden
geleden is, bij video's 15 minuten. Bij later inloggen begint de studentmeting op dat moment.
Activiteit wordt per 60 seconden gebundeld, met extra flushes bij verbergen, sluiten en uitloggen.
Wijzigingen gebruiken increments; ontbrekende nulwaarden worden met `maximum: 0` geïnitialiseerd
zonder bestaande totalen te verlagen. Lege batches worden niet verstuurd. `bijgewerkt` gebruikt de
servertijd. REST-verzoeken gebruiken `keepalive`; het ID-token blijft in het geheugen en wordt via
de accountgetter ververst. Netwerkfouten blijven stil en mislukte/ongelijke antwoorden worden niet
automatisch herhaald om dubbele increments te voorkomen.

De beheerder (`EFkA4kexkLNjBKCGuKD9eiyUvfM2`), localhost, `127.0.0.1`, `file:` en browsers met
`localStorage.fa_stats_uit === '1'` worden uitgesloten. De bestaande pagina-attributen `data-no-stats`
en `data-no-feedback` blijven gerespecteerd. Zet `localStorage.fa_meten_debug = '1'` en herlaad voor
debugmodus: ook lokaal actief, alle payloads naar `console.debug('[meten]', ...)`, geen meetverzoeken
en geen tokens in de log. De bezoekersmarkering `fa_stats_dag` wordt in debugmodus niet aangepast.
Met `localStorage.removeItem('fa_meten_debug')` en herladen zet je debugmodus uit.

**De beheerder plakt zelf onderstaande nieuwe regel in de Firebase-console**, binnen
`match /databases/{database}/documents`, naast de bestaande regels hierboven. Die blijven
ongewijzigd. Zonder deze toevoeging weigert Firestore de studentactiviteit; de anonieme tellers
blijven werken.

```
match /activiteit/{id} {
  allow read: if isBeheerder()
    || (request.auth != null && resource.data.uid == request.auth.uid);
  allow create, update: if request.auth != null
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.dag is string
    && request.resource.data.dag.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
    && id == request.auth.uid + '_' + request.resource.data.dag
    && request.resource.data.keys().hasOnly(['uid','dag','sec','vakken','toetsen','bijgewerkt']);
  allow delete: if false;
}
```

Controle: `node --test tests/meten.test.mjs` en `node --check js/atlas-meten.js`, `node --check js/atlas.js`,
`node --check js/atlas-account.js`. REST-increments en authenticatie volgen de
[Firestore Write-referentie](https://firebase.google.com/docs/firestore/reference/rest/v1/Write)
en de [REST-documentatie](https://firebase.google.com/docs/firestore/use-rest-api).

## Feedback en automatische verwerking

`beheer.html` toont bestaande meldingen uit Firestore `feedback/{id}` aan de beheerder.
De nieuwe leerpagina's laden de oude feedbackknoppen en het oude contactformulier niet.

In voorbereiding: een verwerker op de Mac mini die nieuwe meldingen toetst aan de tekst van het
lesmateriaal (`_beheer/feedback/bronnen-tekst.py` maakt die tekst), een correctie op een branch
`feedback/<id>` klaarzet en die pas na "Live zetten" op `beheer.html` naar main brengt. Vincent
meldt via `vincent.py --meld david "..."` wat er openstaat. Jaar 2 wordt gegenereerd uit
`fmatlas-vakken` en gaat daarom naar status `voor_david`.
