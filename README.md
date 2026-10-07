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
- `voortgang/{uid}`: voortgang per vak, reeks, laatst geopend. Alleen voor de eigenaar.

Regels die horen bij de huidige code (Firebase-console → Firestore → Regels):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
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
    }
  }
}
```

De update-regel laat per schrijfactie hooguit 60 punten bij (de grootste beloning is de bonus van
50) en nooit minder punten. Zonder de `voortgang`-regel weigert Firestore de sync; de site werkt dan
gewoon door met alleen lokale voortgang.
