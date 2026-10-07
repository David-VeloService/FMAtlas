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

## Firebase

Project `fmkompas-ff8bc` (Google-login en Firestore).

- `scores/{uid}`: naam, foto, punten. Publiek leesbaar voor het leaderboard.
- `voortgang/{uid}`: voortgang per vak, reeks, laatst geopend. Alleen voor de eigenaar (en leesbaar voor de beheerder, voor het dashboard).
- `statistiek/{dag}` met `paginas/{pagina}` en `toetsen/{toets}`: anonieme tellers (bezoekers per
  dag, weergaven per pagina, ingeleverde toetsen en de som van hun scores). Geschreven door
  `js/statistiek.js`, gelezen door het dashboard in `beheer.html`. Geen namen, accounts of IP-adressen.

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
