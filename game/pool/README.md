# Pool (8-ball)

Een 8-ballpoolspel voor de spelletjespagina van FM Atlas. Tegen de computer, met z'n tweeën op één
laptop of telefoon, of online met z'n tweeën op eigen apparaten. Geen dependencies, geen build, geen
eigen server: `index.html` werkt ook via `file://` (online spelen dan niet, zie onder).

| Bestand | Wat |
|---|---|
| `index.html` | De pagina: kop, spelers, tafel, stootbediening, regels, en de panelen (menu, hulp, instellingen, speelwijze, online) |
| `style.css` | Crème FM Atlas-stijl met Nunito (systeemfont als terugval); de tafel is de enige donkere plek |
| `engine.js` | Tafelgeometrie, simulatie, spelregels en beurtverloop. Pure functies, ook in Node te laden |
| `bot.js` | De computertegenstander (gebruikt alleen `engine.js`) |
| `net.js` | Online: kamercodes, de client voor de relay, host en gast, en de gezaghebbende partij. Geen DOM, ook in Node te laden |
| `app.js` | Canvas, bediening, geluid, voorkeuren, menu en pauze, de online besturing en de testinterface |
| `kaart.svg` | Beeld voor de kaart op `game/index.html` (960 x 540) |

Scripts laden in deze volgorde als klassieke scripts: `engine.js` (`window.PoolEngine`), `bot.js`
(`window.PoolBot`), `net.js` (`window.PoolNet`), `app.js`. Zonder `net.js` werkt alles behalve online.

## Menu, hulp en instellingen

- **Menu**: knop in de kop of `Esc`. Hervatten, besturing en regels, instellingen, nieuwe partij,
  andere speelwijze, volledig scherm (alleen als de browser het ondersteunt), kamer verlaten (online)
  en terug naar Spelletjes. Zolang een paneel open is, zijn kop, spel en voet `inert`, blijft `Tab`
  in het paneel en gaat de focus bij sluiten terug naar waar hij was.
- **Pauze**: offline staat het spel stil zolang een paneel open is. De tekenlus loopt niet, de keu- en
  richtanimaties schuiven op met de pauzeduur en de denktijd van de computer (`later()` in `app.js`)
  loopt na de pauze verder met wat er nog over was. Online loopt de partij door; het menu zegt dat.
- **Hulp**: de vraagtekenknop in de kop opent besturing en de regels in het kort, met een knop naar
  de volledige spelregels onder de tafel.
- **Instellingen**: naam (voor online), geluid aan/uit (dezelfde waarde als de knop in de kop),
  volume, en de richtlijn aan/uit (zonder richtlijn tekent de tafel geen stippellijn, spookbal en
  baan van de geraakte bal; de keu blijft). Lukt opslaan niet, dan gelden ze tot de pagina sluit en
  zegt het paneel dat.

## Online

Eén speler maakt een kamer (de host), de ander doet mee met de code van vijf tekens (alfabet
`ABCDEFGHJKMNPQRSTUVWXYZ23456789`, zoals de andere games) of met de uitnodigingslink
`index.html?kamer=CODE`. Die link vult de code alleen in; meedoen gebeurt pas na een klik. De host
start de partij zodra de tweede speler er is. Hooguit twee spelers; een derde krijgt "vol".

**Verbinding.** De bestaande relay van Slipstroom en Stadsstorm,
`wss://slipstroom.jochem-35e.workers.dev/relay`, in eigen kamers: relaykamer `PL` + code, host-id
`pool-CODE`. Wire protocol van de relay: zie `prive/repos/slipstroom/relay/RelayRoom.ts` (frames
`hello`, `connect`, `data`, `close`; terug `open`, `connection`, `connected`, `data`, `close`, `gone`,
`error`). `net.js` bundelt uitgaande frames (hooguit één socketbericht per 50 ms, nooit meer dan
12 KiB), stuurt een kale `ping` na 20 s stilte en geeft de socket op als een ping twee controles op
rij geen antwoord krijgt. De host stuurt elke 5 s een hartslag; een gast die twee keer 20 s niet
antwoordt (telefoon in slaap terwijl de socket openblijft) geldt als vertrokken.

Voor tests kan een andere relay met `?relay=ws://...` of `?relay=wss://...` (alleen host, poort en
pad; anders wordt hij genegeerd). Een uitnodigingslink neemt zo'n eigen relay mee. De relay laat
alleen bekende origins toe; vanaf `file://` meldt het paneel dat online alleen op de site werkt.

**Gezag.** De host is de enige autoriteit (`PoolNet.Authority`). Ook de eigen zetten van de host gaan
erdoorheen. Een actie is `{ k:'act', match, rev, id, a }` met `a` één van
`{ type:'place', x, y }`, `{ type:'shoot', angle, speed, call }` of `{ type:'choice', opt }`. De host
weigert (met `{ k:'nack', id, reason }` en een verse stand) als de partij-id of revisie niet klopt,
de actie-id niet hoger is dan de vorige van die speler, de speler niet aan de beurt is, de fase
niet past, er geen bal in hand is, de plaatsing of aankondiging ongeldig is, of een getal niet
eindig of buiten bereik is. Extra velden (een stand, een winnaar) worden genegeerd: de gast stuurt
nooit een stand.

Na elke geldige actie stuurt de host `{ k:'state', match, rev, state, placed, ready, anim }` naar
beide kanten. Bij een stoot bevat `anim` de stoot zelf (`{ from, shot:{ angle, speed, call } }`):
beide apparaten spelen hem af met dezelfde engine vanaf de vorige stand, en daarna geldt de stand
van de host (op een andere browser kan de laatste decimaal verschillen; dan schuift een bal aan het
eind een fractie). Oude of dubbele standen worden genegeerd, een achterstand wordt in één keer
ingehaald. Omdat de host de stoot direct bij ontvangst doorrekent, zetten een verborgen tabblad of
een open menu bij de host de partij niet vast. `placed` zegt dat de witte bal deze beurt al is
gelegd, zodat de speler daarna richt in plaats van opnieuw te plaatsen. `{ k:'room', phase,
players, ready, match }` houdt de wachtruimte en de instemming bij.

**Nieuwe partij.** Alleen als beide spelers akkoord zijn (`{ k:'ready', match, on }`, weigeren met
`{ k:'decline', match }`); dan start de host. De breker wisselt per partij.

**Vertrekken.** Gast weg (zelf, pagina dicht, netwerk, hartslag): de partij staat stil en de host
ziet de wachtruimte. Doet er weer iemand mee met de code, dan kiest de host zelf tussen hervatten of
een nieuwe partij; de gast krijgt eerst de stand en kan pas na hervatten iets. Host weg: de gast
krijgt een scherm met opnieuw proberen, lokaal spelen of terug naar Spelletjes. Verlaten tijdens een
lopende partij vraagt eerst bevestiging. Bij `pagehide` gaan sockets en timers netjes dicht.

## Indeling op het scherm

Kop, spelers, tafel en stootbediening passen samen op één scherm, zonder scrollen. `app.js` meet
daarvoor de echte ruimte (`measureSpace()` en `resize()`): de binnenbreedte van het podium, en de
schermhoogte min alles boven het podium, de binnenrand en de bediening als die eronder staat. De tafel
ligt of staat, afhankelijk van wat de grootste tafel geeft. Een `ResizeObserver` op kop, spelers en
bediening meet opnieuw als die van hoogte veranderen (keuzepaneel na de break, lettertype geladen);
de tafelmaat zelf verandert hun hoogte niet, dus dat kan niet in een lus raken.

Drie standen in `style.css`: breed (alles onder elkaar, bediening in één rij), smal (telefoon staand:
compacte kop met `Nieuw`, spelers naast elkaar, bediening in twee rijen; onder 520px krijgt de
modusschakelaar een eigen rij) en laag (liggend en hooguit 560px hoog: tafel links, spelers en
bediening in een kolom rechts). Groep en ballen staan per speler op één regel met vaste hoogte, en
bij bal in hand ligt het plaatspaneel over de onzichtbaar blijvende stootrij heen, zodat de tafel
niet verspringt tijdens het spel.

## Spelregels

Gebaseerd op de 8-ballregels van de WPA (World Pool-Billiard Association), uitgave januari 2026:
<https://www.wpapool.com/wp-content/uploads/2026/01/2026.01.02-WPA-Rules.pdf>, hoofdstuk 4 en de
algemene regels 1.5–1.7, 3.1–3.3 en 3.11. Hier in eigen woorden, zoals het spel ze toepast.

- **Break.** De witte bal ligt achter de koplijn (het eerste kwart van de tafel): strikt erachter,
  met het middelpunt niet óp de lijn (3.10). Datzelfde geldt voor elke bal in hand achter de koplijn.
  Aankondigen hoeft
  niet en de break bepaalt geen groep. Geldig als er een objectbal valt of als minstens vier
  verschillende objectballen een band raken. Wie op een geldige break iets pot zonder fout, gaat door.
- **Ongeldige break zonder fout:** de ander kiest: tafel accepteren en stoten, zelf opnieuw breken, of
  de breker nog eens laten breken.
- **8 op een geldige break:** de breker kiest: de 8 terugzetten en doorspelen, of opnieuw breken.
- **8 op de break met een fout:** de ander kiest: de 8 terug met bal in hand achter de koplijn, of
  opnieuw breken (de kiezer breekt).
- **Andere fout op de break** (scratch, of geen bal geraakt): de ander krijgt bal in hand achter de
  koplijn, of mag de tafel accepteren als de witte bal nog op tafel ligt. Bij één mogelijke optie
  (de witte bal viel) wordt die direct toegepast en aangekondigd.
- **Keukenregel (3.11).** Wie bal in hand achter de koplijn heeft, mag niet direct een objectbal raken
  die zelf achter de koplijn ligt (middelpunt strikt achter de lijn bij het begin van de stoot), tenzij
  de witte bal vóór dat eerste contact over de koplijn is geweest. Een objectbal met het middelpunt
  precies óp de koplijn telt als buiten de keuken en mag direct gespeeld worden (1.6 en 3.11).
- **8 terugzetten.** Op het voetpunt; is dat bezet, dan zo dichtbij mogelijk erachter op de lange
  lijn, anders ervoor.
- **Aankondigen.** Elke stoot na de break: een bal en een pocket, of *Safety*. Alleen ballen die je mag
  potten zijn aan te kondigen: bij een open tafel alles behalve de 8, met een eigen groep alleen die
  groep, de 8 pas als de eigen groep vóór de stoot leeg is.
- **Open tafel.** Elke objectbal mag als eerste geraakt worden behalve de 8. De groep wordt pas
  bepaald als de aangekondigde bal (niet de 8) zonder fout in de aangekondigde pocket valt. Niet bij
  een fout, een safety of een bal die toevallig valt. Is een hele groep al weg terwijl de tafel open
  is, dan mag de speler de 8 aankondigen: bij een stoot zonder fout krijgt hij de lege groep.
- **Beurt.** Door als de aangekondigde bal in de aangekondigde pocket valt en er geen fout is.
  Andere ballen die vallen blijven weg (ook die van de tegenstander), maar geven geen extra beurt.
  Safety beëindigt de beurt, ook als er een bal valt.
- **Fouten.** De witte bal valt; de witte bal raakt niets; het eerste contact is geen bal die je mag
  raken; na het eerste contact raakt geen enkele bal een band en valt er niets (een band vóór het
  contact telt niet); de keukenregel. Na een fout krijgt de ander bal in hand op de hele tafel.
- **De 8.** Wint als de speler op de 8 staat, de 8 aankondigt en hem zonder fout in die pocket pot.
  Verliest bij de 8 met een fout, de 8 in een andere pocket, de 8 zonder aankondiging, of de 8 te
  vroeg (ook tegelijk met de laatste eigen bal: de groep moet vóór de stoot leeg zijn). Een fout op
  de 8 zonder dat de 8 valt is een gewone fout.

### Wat in deze 2D-simulatie niet van toepassing is

- Geen lag om de break, geen scheidsrechter, geen regels over het lichaam, kleding of de keu van de
  speler (aanraken van ballen, voeten op de vloer, dubbel raken, push shots).
- Geen springen, massé of effect (zij-, trek- of doorloopeffect met de keu). De witte bal wordt altijd
  in het midden geraakt. Een rollende witte bal loopt na een volle raak wel natuurlijk door.
- Geen ballen van tafel, geen "frozen ball"-regels, geen drie-foutenregel, geen tijdslimiet.
- Een spel wordt niet opgeslagen; herladen begint een nieuwe partij. De breker wisselt per partij in
  deze sessie (de eerste partij breekt speler 1 / Jij).

## Simulatie

Millimeters en seconden. Speelvlak 2540 x 1270 mm (9-voets, 2:1), bal 57,15 mm, hoekbek 116 mm,
middenbek 128 mm. De banden zijn zes lijnstukken tussen de bekken, plus twaalf schuine bekzijden: een
bal die op de punt van een bek komt kaatst terug. Een bal valt als zijn middelpunt een stuk voorbij de
bek is; daarachter ligt het gat.

- Vaste stap `DT = 1/240 s`; per stap zoveel substappen dat geen bal meer dan een kwart straal
  beweegt. Op maximale kracht (7,5 m/s) zijn dat er ongeveer vijf. Een frame telt voor hooguit
  `MAX_FRAME = 0,1 s`, zodat een tabwissel geen sprong geeft. Een stoot stopt hoe dan ook na 45 s.
- Elke bal heeft een snelheid en een rolsnelheid. Glijden kost veel (0,2 g wrijving), rollen weinig;
  een geraakte bal glijdt eerst en rolt daarna met 5/7 van zijn snelheid.
- Bal tegen bal: gelijke massa, restitutie 0,95, alleen de normaalcomponent. Naderende contacten in
  dezelfde substap worden samen opgelost (projected Gauss-Seidel), het raakmoment wordt binnen de
  substap teruggerekend en overlap wordt daarna gelijk verdeeld opgeheven.
- Band: restitutie 0,78, langs de band 6% verlies.
- Rust: onder 4 mm/s staat een bal stil.

## Engine-API (`engine.js`)

Constanten: `W, H, R, D, HEAD_X, FOOT_X, MID_Y, DT, MAX_SPEED, MIN_SPEED, MAX_FRAME, MAX_SHOT_TIME,
STORAGE_KEY ('fa_pool_v1'), PHYS, CUSHIONS, POCKETS, POCKET_IDS ('LB','MB','RB','LO','MO','RO')`.

**Stand.** `newGame({ mode: 'cpu'|'duo', breaker: 0|1, rng })` geeft een gewoon JSON-object:

```js
{ mode, names, turn, breaker, phase: 'break'|'play'|'choice'|'over', groups: null | ['vol','half'],
  ballInHand: null|'kitchen'|'table', choice: null | { type, chooser, options }, winner, endReason,
  shots, balls: [{ n, x, y, vx, vy, sx, sy, on, pocket }], last }
```

`balls[0]` is altijd de witte bal. Functies die de stand veranderen geven een nieuwe stand terug.

**Een beurt.**

```js
const ctx = P.beginShot(state, { angle, speed, call });   // gooit bij ongeldige plaatsing of aankondiging
P.stepShot(ctx, frameSeconden);                           // true als alles stil ligt
const { state: nieuw, outcome, log } = P.finishShot(ctx);
// of in één keer:
const r = P.playShot(state, { angle, speed, call });
```

`call` is `{ ball, pocket }`, `{ safety: true }`, of `null` bij de break.

- `placeCue(state, x, y)` → `{ ok, reason: null|'buiten'|'koplijn'|'overlap', state }`
- `applyChoice(state, optie, rng)` met optie uit `state.choice.options`: `accepteren`, `keuken`,
  `zelfBreken`, `laatBreken`, `achtTerugDoor`, `achtTerugKeuken`, `opnieuwBreken`.

**Regels, puur.** `evaluateShot(log)` beoordeelt één stootverslag:

```js
log = { isBreak, shooter, call, groups, remaining,          // stand vóór de stoot
        fromKitchen, behindHead, cueCrossed,                 // keukenregel
        firstHit,                                            // eerste bal die de witte raakte, of null
        events: [{ t: 'hit'|'rail'|'pot', ball, pocket }] }  // in volgorde
```

Uitkomst: `{ foul, fouls: ['scratch'|'geenContact'|'verkeerdeEerste'|'keukenregel'|'geenBand'],
potted, calledMade, legalBreak, railedObjects, assign: null|{player, group}, winner, loser,
endReason, next, ballInHand, choice }`. `describeOutcome(outcome, state, pocketName)` maakt er
Nederlandse zinnen van.

Verder: `legalTargets(groups, remaining, speler)`, `isValidCall(...)`, `isOnEight(...)`,
`emptyGroups(remaining)`, `validateCuePlacement(ballen, x, y, 'kitchen'|'table')`, `findFreeSpot`,
`spotPosition`, `rack(rng)` en `rackSlots()`, `simulate(ballen, ctx)`, `physicsStep`, `castAim(ballen,
x, y, hoek)` (eerste bal of band, ghost-ballpositie, vertrekrichtingen), `seededRng(seed)`.

## Computer (`bot.js`)

- `planTurn(state, { rng, noise, verify })` → `{ place: {x,y}|null, angle, speed, call, kind }`.
  `kind` is `break`, `pot`, `safety`, `kick` of `nood`. Gooit nooit.
- `chooseOption(state)` → een optie uit `state.choice.options`.

Hij zoekt per eigen bal en pocket een vrije lijn naar een punt in de pocket, de ghost-ballpositie en
een vrije lijn voor de witte bal, schat de kracht met hetzelfde wrijvingsmodel in 1D, en rekent de
vier beste kansen één keer na met de echte simulatie. Zonder potkans speelt hij safety (volle raak
met genoeg kracht voor een band) of een stoot via één band. De bediening gebruikt ruis van 0,006 rad
op de richting en 3% op de kracht, zodat hij te verslaan is.

## Testinterface

Alleen met `?test=1` in de adresbalk (`index.html?test=1`) bestaat `window.PoolTest`. Er komen geen
knoppen bij in beeld.

| Functie | Wat |
|---|---|
| `state()` | kopie van de stand |
| `ui()` | `placing`, `aiming`, `shooting`, `cpu`, `choice`, `over` |
| `setState(patch)` | zet `balls: [{n, x, y, on}]`, `turn`, `groups`, `phase`, `ballInHand`, `choice`, `mode`, `shots` en start de juiste beurt |
| `pauseCpu(true/false)` | computer even stilzetten (voor gerichte tests) |
| `place(x, y, bevestig=true)` | witte bal plaatsen bij bal in hand; geeft `{ ok, reason }` |
| `aim(hoek)`, `power(p)` | richten (radialen) en kracht (5–100) |
| `shoot({ angle, power \| speed, call, instant })` | stoten via dezelfde weg als de knop; `instant` rekent de stoot meteen af |
| `choose(optie)` | breakkeuze maken |
| `call()` | huidige aankondiging |
| `toScreen(x, y)`, `toWorld(clientX, clientY)` | tafel- naar paginacoördinaten en terug, voor echte pointer-events |
| `pocketName(id)`, `view()`, `rafActive()` | naam zoals in beeld, weergave (gedraaid op telefoon-portret), draait de tekenlus |
| `paused()`, `layer()`, `prefs()` | offline pauze aan, open panelen (bovenste laatst), kopie van de voorkeuren |
| `net.status()` | online: `{ room: 'none'\|'connecting'\|'lobby'\|'match'\|'paused', role, seat, code, match, rev, authRev, placed, pending, animating, queued, synced, players, ready, ui, lastError, relay, invite }` |
| `net.fixture(patch)` | alleen bij de host met een partij: zet een stand (zelfde `patch` als `setState`) als nieuwe gezaghebbende revisie voor beide kanten |
| `net.relay()` | de gebruikte relay |

Online werkt `setState` niet (gebruik `net.fixture` bij de host); `place`, `shoot` en `choose` gaan
online via dezelfde weg als de knoppen, dus als verzoek naar de host. Er is geen netwerkbericht dat een
fixture zet: een gast kan er niets mee.

## Opslag

Alleen in `localStorage`: `fa_laatste_game = 'pool'` (voor "Verder spelen" op de spelletjespagina) en
`fa_pool_v1` met `{ mode, sound, power, volume, guide, name }`. Kapotte waarden vallen terug op de
standaard. Lukt opslaan niet, dan speelt het spel gewoon door. Geen Firebase, geen XP, geen tellers.
Online partijen worden niet bewaard.

## Tests

Buiten de gepubliceerde map, in de run-maps:

- `2026-10-11-fmatlas-pool`: `node --test tests/pool.test.cjs tests/app-smoke.test.cjs` (regels, computer, lay-out).
- `2026-10-11-fmatlas-pool-online`: `node --test tests/builder-net.test.cjs tests/builder-app.test.cjs
  tests/builder-regression.test.cjs` (online protocol en autoriteit met een nagebouwde relay, twee
  app-vensters tegen elkaar, menu, pauze en instellingen, en de oude tests tegen deze map).
