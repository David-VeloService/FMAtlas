/* Evenementenlogistiek (EM2) — data voor begrippen en flashcards */

window.EVLOG = window.EVLOG || {};

/* ─── Categorieën ─────────────────────────── */
EVLOG.cats = [
  { key:"schillenmodel", label:"Schillenmodel & mobiliteit", short:"Schillenmodel", color:"#3b82f6" },
  { key:"proces",        label:"Proces & capaciteit",        short:"Proces",        color:"#10b981" },
  { key:"toegang",       label:"Toegang & hospitality",      short:"Toegang",       color:"#8b5cf6" },
  { key:"sitedesign",    label:"Site design & crowd safety", short:"Site design",   color:"#f97316" },
  { key:"veiligheid",    label:"Risico & veiligheid",        short:"Veiligheid",    color:"#ef4444" },
  { key:"marketing",     label:"Marketing & doelgroep",      short:"Marketing",     color:"#ec4899" },
  { key:"draaiboek",     label:"Opbouw, afbouw & draaiboek", short:"Draaiboek",     color:"#d97706" },
];

/* ─── Begrippen ─────────────────────────── */
EVLOG.begrippen = [
  /* 1. Schillenmodel & mobiliteit */
  {cat:"schillenmodel", term:"Schillenmodel (4-schillenmodel)", def:"Model dat de logistieke keten van een evenement indeelt in vier concentrische lagen: schil 1 (beïnvloeding vervoerskeuze), schil 2 (sturing bereikbaarheid), schil 3 (toegangsprocessen) en de kern (evenementprocessen). Ook omschreven als 'van bed naar bar en van bar naar bed'."},
  {cat:"schillenmodel", term:"Mobiliteitsplan", def:"Plan dat de personenstromen naar en van het evenement organiseert door vraag- en aanbodfactoren te combineren: doelgroepen, modal split, locatiemaatregelen en bereikbaarheid. Hoort bij schil 1 en schil 2."},
  {cat:"schillenmodel", term:"Modal split", def:"De verwachte verdeling van bezoekers over de verschillende vervoersmiddelen (auto, fiets, OV, pendel), geschat op basis van kennis van de doelgroep en de locatie."},
  {cat:"schillenmodel", term:"Modal shift", def:"De gewenste verandering van de daadwerkelijke vervoerskeuze richting alternatief vervoer (OV, fiets, pendel), bereikt door dat alternatief goedkoper, betrouwbaarder en sneller te maken."},
  {cat:"schillenmodel", term:"Mental shift", def:"De verandering in de mentale perceptie van een bezoeker die voorafgaat aan een modal shift: iemand moet eerst geloven dat alternatief vervoer aantrekkelijk is, voordat hij zijn gedrag aanpast."},
  {cat:"schillenmodel", term:"Postenplan", def:"Kaart of schema dat aangeeft waar verkeersregelaars worden ingezet om de bereikbaarheid rond het evenement te sturen en aanrijdroutes voor hulpdiensten vrij te houden. Hoort bij schil 2 (sturingsprocessen)."},

  /* 2. Proces & capaciteit */
  {cat:"proces", term:"Evenementenlogistiek", def:"De eenmalige of frequente organisatie, planning en uitvoering van goederen- en mensenstromen bij een evenement, waarbij bezoekers tegelijk product én klant zijn en gebruik wordt gemaakt van inhuur en uitbesteding (Van Rijn & Van Damme, 2012)."},
  {cat:"proces", term:"Five rights", def:"Logistiek principe van Lambert en Stock: het juiste product, in de juiste hoeveelheid, op de juiste plaats, op het juiste moment, in de juiste conditie, tegen de juiste kosten. De naam 'five rights' is historisch; in de meeste uitwerkingen staan er zes."},
  {cat:"proces", term:"Beleveniseconomie", def:"Economische fase waarin ervaringen meer waarde hebben dan tastbare producten of diensten. Evenementen zijn bij uitstek het domein van de beleveniseconomie omdat ze niet-tastbaar en tijdelijk zijn."},
  {cat:"proces", term:"Procesanalyse", def:"Methode om alle stappen in een handeling in kaart te brengen, de capaciteit per stap te bepalen en de bottleneck te identificeren die de totale doorstroom beperkt."},
  {cat:"proces", term:"Bottleneck", def:"De schakel in een procesketen met de kleinste capaciteit, die daarmee de totale doorstroming van het hele proces bepaalt. Het versnellen van andere schakels heeft pas zin als de bottleneck is opgelost."},
  {cat:"proces", term:"Capaciteitsberekening", def:"Methode om op basis van procestijden, bezoekersdichtheid en tijdsvensters het benodigde aantal medewerkers, ingangen, voorzieningen of vierkante meters te bepalen voor een gewenste doorstroom."},
  {cat:"proces", term:"Instroomcapaciteit", def:"De maximale hoeveelheid bezoekers die per tijdseenheid via de beschikbare ingangen het terrein kan betreden, mede bepaald door de gemiddelde verblijfsduur. Vaak de beperkende factor naast de terreincapaciteit."},
  {cat:"proces", term:"Kengetallen", def:"Gemiddelde ervaringswaarden uit de praktijk, zoals het gemiddeld aantal consumpties per persoon of het gemiddeld aantal personen per auto, die als basis dienen voor capaciteitsberekeningen."},
  {cat:"proces", term:"Wachtrijtheorie", def:"Gebruik van gemiddelde verwerkingstijden per handeling om te berekenen hoeveel parallelle processen (medewerkers, poorten, kassa's) nodig zijn om een gewenste doorstroom te halen binnen een tijdsvenster."},
  {cat:"proces", term:"Supply chain management (SCM)", def:"Het coördineren en optimaliseren van integrale materiaal-, geld- en informatiestromen van leverancier tot eindgebruiker. Bij evenementen zijn relaties met leveranciers sterk afhankelijk van vertrouwen en de omvang van het evenement."},

  /* 3. Toegang & hospitality */
  {cat:"toegang", term:"Accreditatie", def:"Systeem waarmee personen op een evenementterrein worden gecategoriseerd en toegang krijgen tot specifieke zones op basis van hun rol (bezoeker, crew, pers, VIP, artiest)."},
  {cat:"toegang", term:"Visitatie", def:"Het controleren van tassen en jassen van bezoekers door beveiligingspersoneel aan de ingang. Vrijwillig van aard en onderscheiden van fouilleren, dat het lichaam betreft."},
  {cat:"toegang", term:"Fouilleren", def:"Lichamelijk onderzoek door gediplomeerde beveiligers aan het lichaam en de kleding van een bezoeker. Verschilt van visitatie (tassen en jassen). De bevoegdheid om te fouilleren moet vooraf zijn gecommuniceerd en in de huisregels staan; weigert de bezoeker, dan kan de toegang worden geweigerd."},
  {cat:"toegang", term:"Hospitality (MOP-model)", def:"Gastvrijheid op een evenement, opgebouwd uit drie elementen: Mens (personeel en training), Omgeving (fysieke en digitale uitstraling) en Proces (logistieke organisatie van de gastvrije ontvangst)."},
  {cat:"toegang", term:"Customer journey", def:"Overzicht van de volledige belevingsreis van een bezoeker langs alle schillen van het evenement, van de oriëntatiefase thuis tot en met de nafase. Gebruikt persona's om knelpunten in de beleving te identificeren."},
  {cat:"toegang", term:"Persona", def:"Fictief maar realistisch profiel van een typische bezoeker uit een doelgroepsegment, gebruikt om de customer journey vanuit het perspectief van die bezoeker te doorlopen en knelpunten te ontdekken."},

  /* 4. Site design & crowd safety */
  {cat:"sitedesign", term:"PQRST-sleutel", def:"Systematisch kader voor het ontwerpen van een terreinindeling met vijf elementen: P (personen en producten), Q (omvang stromen), R (routering), S (steunverlenende diensten) en T (tijd)."},
  {cat:"sitedesign", term:"Relatieschema (relatiediagram)", def:"Overzicht dat aangeeft welke service- en attractiepunten op het terrein absoluut nabij of juist ver van elkaar moeten liggen. Vormt de basis voor de eerste terreinschets."},
  {cat:"sitedesign", term:"Bezoekersdichtheid", def:"Maatstaf voor het aantal personen per vierkante meter. Vanaf 0,27 m² per persoon ontstaan onvrijwillige aanrakingen en bij 0,18 m² per persoon potentieel gevaarlijke krachten in de menigte. De norm 2,5 m² per persoon staat voor vrij bewegen."},
  {cat:"sitedesign", term:"Crowd safety (crowd management)", def:"Het geheel van maatregelen om menigten veilig te geleiden en gevaarlijke bezoekersdichtheden te voorkomen, waaronder compartimenteren, bewegwijzering en het vermijden van kruisende stromen."},
  {cat:"sitedesign", term:"Managing flows", def:"Het actief beheersen van bezoekersstromen door eenvoudig terreinontwerp, goede bewegwijzering, het vermijden van kruisende routes, bufferzones en een centrale controlekamer."},
  {cat:"sitedesign", term:"Bufferzone", def:"Wachtruimte buiten het evenementterrein waar vrachtwagens of bezoekers tijdelijk kunnen worden opgevangen om piekbelasting op het terrein te voorkomen."},
  {cat:"sitedesign", term:"FOH (Front of House)", def:"Het eerste publieksvak direct voor het podium. Een specifieke attractiezone met eigen capaciteitsberekening en veiligheidsmaatregelen."},

  /* 5. Risico & veiligheid */
  {cat:"veiligheid", term:"FMEA (Failure Mode and Effect Analysis)", def:"Risicoanalysemethode waarbij risico's worden gekwantificeerd op drie factoren: kans (1-10), effect (1-10) en hersteltijd. De uitkomst is het Risico Prioriteits Getal (RPN = Kans × Effect × Hersteltijd)."},
  {cat:"veiligheid", term:"Risico Prioriteits Getal (RPN)", def:"Uitkomst van de FMEA-methode, berekend als Kans × Effect × Hersteltijd. Hoe hoger het getal, hoe urgenter de maatregel die nodig is."},
  {cat:"veiligheid", term:"Veiligheidsketen", def:"Indeling van veiligheidsmaatregelen in vijf opeenvolgende fasen: proactief (oorzaak wegnemen), preventief (incident voorkomen), preparatief (voorbereiden op incident), repressief (schade beperken tijdens incident) en nazorg (afwikkeling achteraf)."},
  {cat:"veiligheid", term:"Calamiteitenplan", def:"Document dat de crisisstructuur, het communicatieprotocol en de locatiegegevens (vluchtwegen, EHBO-posten, AED, nooduitgangen) vastlegt voor het geval van een incident tijdens een evenement."},
  {cat:"veiligheid", term:"GRIP", def:"Gecoördineerde Regionale Incidentenbestrijdings Procedure: landelijk opschalingsmodel voor hulpdiensten met de niveaus GRIP 1 tot en met 5 en GRIP Rijk, waarbij elke stap meer coördinatie en beslissingsbevoegdheid samenbrengt bij grotere incidenten."},
  {cat:"veiligheid", term:"Publieksprofiel", def:"Risicobepalend profiel dat kenmerken van het publiek beschrijft, zoals leeftijdsopbouw, omvang, verblijfsduur, homogeniteit en de kans op ongewenst groepsgedrag."},
  {cat:"veiligheid", term:"Activiteitenprofiel", def:"Risicoprofiel dat het type evenement beschrijft: groot versus kleinschalig, één partij versus meerdere partijen, geprogrammeerd versus ongestructureerd publiek en middelengebruik."},
  {cat:"veiligheid", term:"Ruimtelijk profiel", def:"Risicofactor die betrekking heeft op de fysieke locatiekenmerken, zoals bereikbaarheid, complexe inrichting, zichtlijnen, brandveiligheid en publiek versus privaat terrein."},
  {cat:"veiligheid", term:"Extern profiel", def:"Risicofactor buiten de directe invloedssfeer van de organisatie, zoals extreem weer, stroomuitval of openbare-ordeverstoringen, die onderdeel uitmaakt van de risicoprofielanalyse."},

  /* 6. Marketing & doelgroep */
  {cat:"marketing", term:"Marketingdoelstellingen (drie-componentenmodel)", def:"Formulering van wat marketing moet bereiken in drie componenten: kennis (wat weet de doelgroep), houding (wat voelt de doelgroep) en gedrag (wat doet de doelgroep) als gevolg van de marketingactiviteiten."},
  {cat:"marketing", term:"Marktsegmentatie", def:"Het opdelen van een totale markt in homogene groepen op basis van geografische, demografische, psychografische of gedragskenmerken, zodat gerichte marketing mogelijk is."},
  {cat:"marketing", term:"Empathy map", def:"Visualisatiehulpmiddel waarmee de behoeften, gedachten, gevoelens en handelingen van een specifiek doelgroepsegment in kaart worden gebracht."},
  {cat:"marketing", term:"Communicatieactieplan", def:"Stappenplan voor de communicatie rondom een evenement: vaststellen van middelen en planning, taakverdeling, budget, monitoren van campagnes en evaluatie. Voedt het draaiboek."},

  /* 7. Opbouw, afbouw & draaiboek */
  {cat:"draaiboek", term:"Draaiboek", def:"Planningstechniek die de uitvoering van een evenement in drie delen beschrijft (opbouw, evenement, afbouw) en naast het balkenschema bijlagen bevat zoals plattegrond, communicatieplan, evacuatieplan en materialenlijst."},
  {cat:"draaiboek", term:"Balkenschema", def:"Chronologisch tijdschema dat de basis vormt van een draaiboek en per activiteit vastlegt: tijdstip, locatie, wat er gebeurt en wie verantwoordelijk is."},
  {cat:"draaiboek", term:"LIFO-principe (Last In, First Out)", def:"Afbouwregel waarbij het element dat als laatste is opgebouwd als eerste wordt afgebroken, zodat de afbouw efficiënt en ordelijk verloopt. Afval wordt als eerste opgeruimd."},
  {cat:"draaiboek", term:"Dropzone", def:"Aangewezen plek op het terrein waar leveranciers materialen kunnen lossen of verzamelen voordat zij op de definitieve locatie worden opgebouwd of opgehaald."},
  {cat:"draaiboek", term:"Logistiek coördinatiecentrum", def:"Tijdelijk kantoor op het evenementterrein dat als eerste wordt geplaatst en dient als aansturingspost voor leveranciers en opbouwcoördinatie."},
  {cat:"draaiboek", term:"Reverse logistics", def:"De logistiek van terugstromen na het evenement, zoals het ophalen van materialen, afvoeren van afval en opleveren van het terrein in originele staat."},
  {cat:"draaiboek", term:"Rijplaten", def:"Tijdelijke verhardingsplaten van kunststof of metaal die toe- en afritten geschikt maken voor zwaar verkeer en voorkomen dat voertuigen wegzakken in zachte ondergrond."},
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
EVLOG.flashcards = EVLOG.begrippen;

/* ─── Oefentoets ─────────────────────────────
   Zelfde opbouw als het tentamen: 25 meerkeuze + 5 open.
   Meerkeuze: answer = index van het juiste antwoord (0-based).
   Open: zelfnakijk met modelantwoord, pas zichtbaar na de poging. */
EVLOG.oefentoets = {
  mc: [
    { section: "Schillenmodel & mobiliteit", num: 1,
      text: "Wat beschrijft het schillenmodel?",
      options: [
        "De financiële opbouw van een evenementbegroting",
        "De logistieke keten van een evenement in vier concentrische schillen",
        "De vijf schakels van de veiligheidsketen",
        "De fasering van een project van initiatief tot nazorg"
      ], answer: 1,
      explanation: "Het schillenmodel beschrijft de logistieke keten 'van bed naar bar en van bar naar bed' in vier schillen, van buiten naar binnen doorlopen." },

    { section: null, num: 2,
      text: "In welke schil vallen de beïnvloedingsprocessen rond de vervoerskeuze, zoals een OV-combiticket?",
      options: ["Schil 1", "Schil 2", "Schil 3", "De kern"], answer: 0,
      explanation: "Schil 1 = beïnvloeding van de vervoerskeuze. Schil 2 = sturing openbare infrastructuur, schil 3 = toegangsprocessen, kern = de evenementprocessen zelf." },

    { section: null, num: 3,
      text: "Omwonenden klagen over parkeeroverlast in de openbare straten rondom een festival. In welke schil speelt dit vooral?",
      options: ["Schil 1", "Schil 2", "Schil 3", "De kern"], answer: 1,
      explanation: "Overlast in de openbare ruimte (bereikbaarheid en infrastructuur) hoort bij schil 2, de sturingsprocessen. Een postenplan en OV-beïnvloeding (schil 1) horen bij de aanpak." },

    { section: "Proces & capaciteit", num: 4,
      text: "Wat is een bottleneck in een procesketen?",
      options: [
        "De schakel met de grootste capaciteit",
        "De schakel met de kleinste capaciteit, die de totale doorstroming bepaalt",
        "Het moment waarop de meeste bezoekers tegelijk arriveren",
        "De wachtrij die bij de entree ontstaat"
      ], answer: 1,
      explanation: "De bottleneck is de schakel met de kleinste capaciteit. Andere schakels versnellen helpt pas als de bottleneck is opgelost; extra capaciteit stapelt anders op als wachtrij." },

    { section: null, num: 5,
      text: "Het omdoen van een polsbandje duurt 10 seconden. Hoeveel bezoekers verwerkt één medewerker hiermee per uur?",
      options: ["240", "360", "480", "600"], answer: 1,
      explanation: "3600 seconden / 10 seconden = 360 bezoekers per medewerker per uur." },

    { section: null, num: 6,
      text: "Een biertap tapt 8 biertjes per minuut. Een bezoeker drinkt 3 biertjes per uur. Hoeveel bezoekers bedient één tap per uur?",
      options: ["96", "120", "160", "240"], answer: 2,
      explanation: "8 × 60 = 480 biertjes per uur. 480 / 3 = 160 bezoekers per tap per uur." },

    { section: null, num: 7,
      text: "Een terrein is 20.000 m², waarvan 30% niet voor publiek beschikbaar is. De gemeente hanteert een veiligheidsnorm van maximaal 2,5 personen per m². Wat is de maximale terreincapaciteit?",
      options: ["35.000", "14.000", "5.600", "12.000"], answer: 0,
      explanation: "20.000 × 0,30 = 6.000 m² niet beschikbaar, dus 14.000 m² publiek. 14.000 × 2,5 = 35.000 personen (rekenwijze uit de les, week 3 dia 38). Let op: in de Fruin-tabel (week 4) staat 2,5 juist als m² per persoon voor 'relatief vrij bewegen'. Lees dus goed welke eenheid er in de opgave staat." },

    { section: null, num: 8,
      text: "Waarom zijn processen bij evenementen lastiger te beheersen dan in een fabriek?",
      options: [
        "Omdat evenementen altijd binnen plaatsvinden",
        "Omdat de uitvoering eenmalig is en bezoekers tegelijk product én klant zijn",
        "Omdat er bij evenementen nooit leveranciers betrokken zijn",
        "Omdat de capaciteit van processen niet te berekenen valt"
      ], answer: 1,
      explanation: "Een evenement is eenmalig: één kans om het goed te doen. Bezoekers zijn tegelijk product én klant, met piekbelasting en afhankelijkheid van externe leveranciers." },

    { section: null, num: 9,
      text: "Waar gaan de 'five rights' van Lambert & Stock over?",
      options: [
        "De vijf schakels van de veiligheidsketen",
        "Het juiste product, op de juiste plaats, op het juiste moment, in de juiste conditie, tegen de juiste kosten, voor de juiste klant",
        "De vier segmentatiecriteria plus de doelgroep",
        "De vijf vaste bijlagen van een draaiboek"
      ], answer: 1,
      explanation: "De 'five rights' beschrijven logistieke kwaliteit: het juiste product, op de juiste plaats en het juiste moment, in de juiste conditie, tegen de juiste kosten, voor de juiste klant." },

    { section: "Marketing & gedrag", num: 10,
      text: "Uit welke drie componenten bestaat het model voor marketingdoelstellingen?",
      options: [
        "Kennis, houding en gedrag",
        "Geografisch, demografisch en psychografisch",
        "Mens, omgeving en proces",
        "Proactief, preventief en repressief"
      ], answer: 0,
      explanation: "Het drie-componentenmodel: kennis (wat weet de doelgroep), houding (wat voelt de doelgroep) en gedrag (wat doet de doelgroep)." },

    { section: null, num: 11,
      text: "'40% van de doelgroep koopt binnen twee weken een ticket' is een doelstelling op het niveau van:",
      options: ["Kennis", "Houding", "Gedrag", "Bereik"], answer: 2,
      explanation: "Gedrag betreft wat de doelgroep daadwerkelijk doet, zoals een ticket kopen. Kennis = weten, houding = voelen." },

    { section: null, num: 12,
      text: "Leeftijd, geslacht en opleiding zijn voorbeelden van welk segmentatiecriterium?",
      options: ["Geografisch", "Demografisch", "Psychografisch", "Gedrag"], answer: 1,
      explanation: "Demografische criteria zijn meetbare persoonskenmerken zoals leeftijd, geslacht en opleiding. Psychografisch gaat over levensstijl en persoonlijkheid." },

    { section: null, num: 13,
      text: "Wat is een modal shift?",
      options: [
        "De huidige verdeling van bezoekers over vervoerwijzen",
        "De gewenste verschuiving naar alternatief vervoer",
        "De bewustzijnsverandering bij de bezoeker",
        "Het verbieden van autoverkeer rond het terrein"
      ], answer: 1,
      explanation: "Modal split = de huidige verdeling, modal shift = de gewenste verschuiving naar alternatief vervoer, mental shift = de bewustzijnsverandering die daarvoor nodig is." },

    { section: null, num: 14,
      text: "Waarom werkt 'verleiden' beter dan 'afdwingen' bij mobiliteitssturing?",
      options: [
        "Omdat afdwingen wettelijk verboden is",
        "Omdat afdwingen het risico vergroot dat bezoekers helemaal wegblijven",
        "Omdat verleiden altijd goedkoper is voor de organisatie",
        "Omdat bezoekers geen gewoontegedrag vertonen"
      ], answer: 1,
      explanation: "Mobiliteit is gewoontegedrag. Afdwingen vergroot de kans dat bezoekers wegblijven; verleiden maakt het alternatief goedkoper, betrouwbaarder en sneller." },

    { section: "Bereikbaarheid, toegang & hospitality", num: 15,
      text: "Wat zijn de minimale breedte en hoogte van een aanrijdroute voor hulpdiensten?",
      options: [
        "3,0 m breed en 4,0 m hoog",
        "3,5 m breed en 4,2 m hoog",
        "4,0 m breed en 4,5 m hoog",
        "2,5 m breed en 3,5 m hoog"
      ], answer: 1,
      explanation: "De minimale doorgang is 3,5 m breed en 4,2 m hoog. Calamiteitenroutes moeten altijd vrij blijven." },

    { section: null, num: 16,
      text: "Wat is juist over visitatie en fouilleren?",
      options: [
        "Beide zijn verplicht voor elke bezoeker",
        "Beide zijn vrijwillig; bij weigering kan de toegang worden geweigerd",
        "Fouilleren is controle van tassen, visitatie is onderzoek aan het lichaam",
        "Alleen de politie mag bezoekers visiteren"
      ], answer: 1,
      explanation: "Visitatie = controle van tassen en jassen, fouilleren = onderzoek aan lichaam en kleding. Beide zijn vrijwillig; weigert een bezoeker, dan kan de toegang worden geweigerd." },

    { section: null, num: 17,
      text: "Waar staat het MOP-model voor hospitality voor?",
      options: ["Mens, Omgeving, Proces", "Markt, Organisatie, Product", "Modal, Operationeel, Plan", "Mens, Onderhoud, Planning"], answer: 0,
      explanation: "MOP = Mens (omgang met gasten), Omgeving (fysieke en digitale ruimtes) en Proces (organisatie rond de gastvrijheidsbeleving)." },

    { section: null, num: 18,
      text: "Waarom staan visitatie en fouilleren op gespannen voet met hospitality?",
      options: [
        "Ze kosten te veel personeel",
        "Het zijn controlemomenten die de bezoeker als wantrouwend kan ervaren, terwijl hospitality juist aandacht en een welkomstgevoel vraagt",
        "Ze vinden plaats in schil 1, ver van het terrein",
        "Ze zijn wettelijk verplicht en daarom onpersoonlijk"
      ], answer: 1,
      explanation: "Het moment waarop de vervoersstroom bezoekersstroom wordt, is waar hospitality begint, maar dat wordt direct doorkruist door een controlemoment dat als wantrouwend kan voelen." },

    { section: "Site design", num: 19,
      text: "Waar staat de R in de PQRST-sleutel voor?",
      options: ["Risico", "Routering tussen service- en attractiepunten", "Respons van hulpdiensten", "Ruimte per persoon"], answer: 1,
      explanation: "P = publiek/personen/producten, Q = quantity (omvang stromen), R = routering, S = steunverlenende diensten, T = tijd." },

    { section: null, num: 20,
      text: "Vanaf welke bezoekersdichtheid ontstaan potentieel gevaarlijke krachten in de menigte?",
      options: ["2,5 m² per persoon", "1,85 m² per persoon", "0,46 m² per persoon", "0,18 m² per persoon"], answer: 3,
      explanation: "Bij 0,18 m² per persoon ontstaan gevaarlijke krachten en psychologische stress. Bij 2,5 m² per persoon kun je volgens de Fruin-tabel nog relatief vrij bewegen." },

    { section: null, num: 21,
      text: "Welke maatregel voorkomt kruisende bezoekersstromen op een terrein?",
      options: ["Een hogere biertapcapaciteit", "One-way-routing via een lus", "Meer visitatieposten", "Een hoger entreetarief"], answer: 1,
      explanation: "Met one-way-routing (een lus) lopen bezoekers steeds dezelfde richting op, zodat kruisende stromen en gedrang worden voorkomen." },

    { section: "Risico & veiligheid", num: 22,
      text: "Onder welk risicoprofiel vallen factoren als het weer en stroomuitval?",
      options: ["Publieksprofiel", "Activiteitenprofiel", "Ruimtelijk profiel", "Extern profiel"], answer: 3,
      explanation: "Het externe profiel omvat factoren van buiten het evenement: ordeverstoringen, weer en stroomuitval." },

    { section: null, num: 23,
      text: "Hoe bereken je het RPN in een FMEA?",
      options: ["Kans + Effect + Hersteltijd", "Kans × Effect × Hersteltijd", "Kans × Effect", "Effect × Hersteltijd"], answer: 1,
      explanation: "RPN = Kans × Effect × Hersteltijd. Hoe hoger het getal, hoe urgenter de maatregel." },

    { section: null, num: 24,
      text: "Welke schakel van de veiligheidsketen richt zich op handelen tíjdens het incident om schade te beperken?",
      options: ["Proactief", "Preventief", "Repressief", "Nazorg"], answer: 2,
      explanation: "De volgorde is proactief → preventief → preparatief → repressief → nazorg. Repressief = handelen tijdens het incident." },

    { section: "Opbouw & draaiboek", num: 25,
      text: "Wat houdt het LIFO-principe bij de afbouw in?",
      options: [
        "Het afval wordt als laatste opgeruimd",
        "Wat als eerste is opgebouwd, wordt als eerste afgebroken",
        "Wat als laatste is opgebouwd, wordt als eerste afgebroken",
        "Alle leveranciers bouwen tegelijk af"
      ], answer: 2,
      explanation: "LIFO = Last In, First Out: wat als laatste is opgebouwd, wordt als eerste afgebroken. Het afval wordt juist als eerste opgeruimd." },
  ],

  open: [
    { num: 26,
      text: "Leg uit waarom je het schillenmodel van buiten naar binnen doorloopt bij het ontwerpen van een evenement, in plaats van bij de kern te beginnen.",
      model: "De buitenste schillen zijn randvoorwaardelijk voor de binnenste: kloppen bereikbaarheid en toegang niet, dan heeft een perfecte kern geen waarde. Iedere schil voedt de volgende — een verkeerde vervoerskeuze (schil 1) geeft files in schil 2, waardoor de toegangsprocessen in schil 3 vastlopen. Een perfect programma op het terrein helpt niets als bezoekers er niet op tijd of gestrest aankomen. Bovendien hangen de buitenste schillen af van derden (gemeente, NS, verkeersmanagement) waarvoor vroeg overleg nodig is. Door van buiten naar binnen te werken pak je de grootste logistieke risico's als eerste aan." },

    { num: 27,
      text: "Bij accreditatie zijn de procestijden: scannen 5 s, polsbandje 10 s, fouilleren 15 s en visiteren 15 s. Er moeten 5.000 bezoekers in 60 minuten naar binnen. Bereken het aantal medewerkers per deelproces en benoem de bottleneck.",
      model: "Capaciteit per medewerker per uur = 3600 / procestijd. Scannen: 3600/5 = 720 → 5000/720 ≈ 7 medewerkers. Polsbandje: 3600/10 = 360 → 5000/360 ≈ 14 medewerkers. Fouilleren: 3600/15 = 240 → 5000/240 ≈ 21 medewerkers. Visiteren: 3600/15 = 240 → 5000/240 ≈ 21 medewerkers. Totaal ongeveer 63 medewerkers (naar boven afronden). Fouilleren en visiteren zijn de bottleneck: de laagste capaciteit per medewerker, dus daar zijn de meeste mensen nodig." },

    { num: 28,
      text: "Bij een danceparty schat je de kans op overmatig alcoholgebruik op 8, het effect op 6 en de hersteltijd op 7. Bereken het RPN en noem twee passende maatregelen.",
      model: "RPN = 8 × 6 × 7 = 336, een hoge score die prioriteit vraagt. Passende maatregelen, gespreid over de veiligheidsketen: preventief de drankuitgifte beperken (munten- of pasjessysteem) en chill-rooms inrichten; preparatief extra EHBO en een protocol voor het afvoeren van onwel geworden bezoekers, inclusief ruimte voor ambulances; repressief een vaste procedure zodra iemand onwel wordt. De hoge hersteltijd (7) maakt het preventieve en preparatieve werk extra belangrijk." },

    { num: 29,
      text: "Zware regen dreigt tijdens een openluchtfestival met 20.000 bezoekers. Beschrijf per schakel van de veiligheidsketen (proactief tot nazorg) één passende maatregel.",
      model: "Proactief: bij locatiekeuze en vergunning al rekening houden met slecht weer via overdekte zones en drainage. Preventief: weersmonitoring en een procedure om bezoekers te waarschuwen (schermen, omroep). Preparatief: extra rijplaten voor modderige paden en een geoefend evacuatieplan voor vroeg vertrek. Repressief: zodra de regen begint de OV-pendel opschalen en extra verkeersregelaars inzetten, zodat bezoekers snel kunnen vertrekken zonder samen te drommen. Nazorg: communiceren over terugbetaling of vervangend programma en de weerscalamiteit evalueren." },

    { num: 30,
      text: "Waarom zijn persona's bij een customer journey nuttiger dan het beschrijven van 'de gemiddelde bezoeker'?",
      model: "Een gemiddelde bezoeker is een abstractie die de diversiteit van het publiek wegmiddelt en voor niemand precies klopt. Een persona is een gedetailleerd profiel van een specifiek type bezoeker, gebaseerd op segmentatie en de empathy map. Door de customer journey vanuit meerdere persona's te doorlopen ontdek je dat een gezin met kinderen andere knelpunten ervaart dan een jonge festivalganger of iemand in een rolstoel. Knelpunten die voor het ene segment onzichtbaar zijn, zijn voor het andere cruciaal. Zo maak je de belevingsreis langs alle schillen concreet en kun je gericht verbeteren." },
  ],
};
