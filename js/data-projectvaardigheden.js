/* Projectvaardigheden (EM2) — data voor begrippen en flashcards */

window.PVRD = window.PVRD || {};

/* ─── Categorieën ─────────────────────────── */
PVRD.cats = [
  { key:"observeren",    label:"Observeren",              short:"Observeren",    color:"#3b82f6" },
  { key:"communiceren",  label:"Zakelijk communiceren",   short:"Communiceren",  color:"#10b981" },
  { key:"interviewen",   label:"Interviewen",             short:"Interviewen",   color:"#8b5cf6" },
  { key:"enquêteren",    label:"Enquêteren",              short:"Enquêteren",    color:"#f97316" },
  { key:"analyse",       label:"Steekproef en analyse",   short:"Analyse",       color:"#ef4444" },
];

/* ─── Begrippen ─────────────────────────── */
PVRD.begrippen = [
  /* 1. Observeren */
  {cat:"observeren", term:"Onderzoek", def:"Het verkennen, verklaren of veranderen van de bestaande situatie. Je bedenkt een plan van aanpak, raadpleegt bronnen, verzamelt gegevens, trekt conclusies en levert een bijdrage aan de oplossing (Baarda, 2025)."},
  {cat:"observeren", term:"Kwantitatief onderzoek", def:"Smalle vraagstelling, vaste richtlijnen, gesloten categorieën. Data zijn getallen. Stelt de 'wat' en 'hoeveel'-vraag. Generaliseren naar een grote groep."},
  {cat:"observeren", term:"Kwalitatief onderzoek", def:"Brede vraagstelling, open en flexibel, gericht op inzicht. Data zijn teksten, foto's, verslagen. Stelt de 'waarom' en 'hoe'-vraag. Kleine 'n', patronen herkennen."},
  {cat:"observeren", term:"Mixed methods", def:"Combinatie van kwantitatief en kwalitatief onderzoek in één onderzoek. Niet hetzelfde als triangulatie: dat is in de les een manier om de betrouwbaarheid te borgen door meerdere methoden of bronnen te combineren."},
  {cat:"observeren", term:"Observatieonderzoek", def:"Een onderzoeksmethode gericht op systematische waarneming van gedrag. De onderzoeker verandert de bestaande situatie niet, maar observeert en legt observaties vast."},
  {cat:"observeren", term:"Participerende observatie", def:"De onderzoeker neemt actief deel aan het onderzochte proces of de groep. Meer begrip voor context, maar groter risico op subjectiviteit."},
  {cat:"observeren", term:"Niet-participerende observatie", def:"De onderzoeker observeert van buitenaf, zonder deel te nemen. Meer objectief, maar minder diep begrip van de context."},
  {cat:"observeren", term:"Verhulde observatie", def:"De onderzoeksgroep is niet op de hoogte van de observatie. Voordeel: sociale wenselijkheid speelt geen rol."},
  {cat:"observeren", term:"Onverhulde observatie", def:"De onderzoeksgroep weet dat ze geobserveerd worden. Nadeel: gedrag kan beïnvloed zijn door het observator-effect."},
  {cat:"observeren", term:"Gestructureerde observatie", def:"Er wordt gebruik gemaakt van een vooraf vastgesteld observatieschema of turflijst. Zorgt voor objectieve, standaard data."},
  {cat:"observeren", term:"Niet-gestructureerde observatie", def:"De onderzoeker noteert open wat hij waarneemt, zonder vast schema. Meer flexibel maar minder vergelijkbaar."},
  {cat:"observeren", term:"Shadowing", def:"Een observatiemethode waarbij je iemand volgt tijdens een actie om gedrag te bestuderen. Je verzamelt data over keuzes, routes, houding en interacties."},
  {cat:"observeren", term:"Turflijst / scoreformulier", def:"Een gestructureerd formulier waarop je per categorie turfjes zet. Zorgt voor gestandaardiseerde, objectieve dataverzameling."},
  {cat:"observeren", term:"Time sampling", def:"Je observeert alleen tijdens afgebakende, van tevoren vastgestelde perioden."},
  {cat:"observeren", term:"Event sampling", def:"Je noteert alles wat er gebeurt gedurende een specifieke gebeurtenis of situatie."},
  {cat:"observeren", term:"Operationaliseren (observeren)", def:"Vooraf bepalen wat je precies gaat observeren: frequentie, duur, kwaliteit en richting van gedrag. Categorieën moeten concreet, classificeerbaar en objectief zijn."},

  /* 2. Zakelijk communiceren */
  {cat:"communiceren", term:"5 communicatiedoelen", def:"Informeren (weten), Overtuigen (geloven), Appelleren (doen), Instrueren (kunnen), Motiveren (willen)."},
  {cat:"communiceren", term:"Informeren", def:"Communicatiedoel: de ander iets laten weten."},
  {cat:"communiceren", term:"Overtuigen", def:"Communicatiedoel: de ander iets laten geloven."},
  {cat:"communiceren", term:"Appelleren", def:"Communicatiedoel: de ander iets laten doen."},
  {cat:"communiceren", term:"Instrueren", def:"Communicatiedoel: de ander iets laten kunnen."},
  {cat:"communiceren", term:"Motiveren", def:"Communicatiedoel: de ander iets laten willen."},
  {cat:"communiceren", term:"KNCA", def:"Criteria voor een goede boodschap: Kort (niet langer dan een tweet), Concreet (woorden die je kunt 'zien'), Nieuws (iets dat de lezer nog niet weet), Actief (geen hulpwerkwoorden, actieve zinnen)."},
  {cat:"communiceren", term:"Kernzin", def:"De zin waarin het onderwerp van de alinea staat én een uitspraak over dat onderwerp wordt gedaan. De meest algemene zin — staat meestal als eerste in de alinea."},
  {cat:"communiceren", term:"Alineaondersteuning", def:"Alles in de alinea behalve de kernzin. Dient ter onderbouwing of uitwerking van de kernzin. Een goede alinea beperkt zich tot één onderwerp."},
  {cat:"communiceren", term:"Tekstmodel", def:"Structuur van een zakelijke tekst: Inleiding (kop) — aanleiding, doel, opbouw; Kern (romp) — alinea's per deelonderwerp; Slot (staart) — samenvatting en pakkende afsluiting."},
  {cat:"communiceren", term:"Beeldtaal", def:"De combinatie van verbale elementen en visuele elementen. Doel: niet versimpelen, maar verhelderen."},
  {cat:"communiceren", term:"Gestalttheorie", def:"Beschrijft hoe het oog patronen, groepen en figuren herkent. Beantwoordt de vraag: 'Wat zie je?' Principes: nabijheid, gelijkenis, sluiting, continuïteit."},
  {cat:"communiceren", term:"Semiotiek", def:"De studie van tekens en symbolen en hun betekenis. Beelden communiceren op meerdere niveaus: denotatie (letterlijk) en connotatie (bijbetekenis). Beantwoordt de vraag: 'Wat betekent het?'"},
  {cat:"communiceren", term:"Retorica", def:"De kunst van het overtuigen via beelden en taal. Drie middelen: Ethos (geloofwaardigheid), Pathos (emotie), Logos (feiten/logica). Beantwoordt de vraag: 'Waarvan overtuigt het?'"},
  {cat:"communiceren", term:"Denotatie", def:"De letterlijke, directe betekenis van een beeld of teken."},
  {cat:"communiceren", term:"Connotatie", def:"De bijbetekenislaag van een beeld — associaties en emoties die het oproept."},
  {cat:"communiceren", term:"Ethos", def:"Het retorische middel van geloofwaardigheid: de uitstraling en deskundigheid van de afzender."},
  {cat:"communiceren", term:"Pathos", def:"Het retorische middel van emotie: het aanspreken van gevoelens bij het publiek."},
  {cat:"communiceren", term:"Logos", def:"Het retorische middel van logica: het gebruik van feiten, argumenten en redeneringen."},

  /* 3. Interviewen */
  {cat:"interviewen", term:"Topiclijst", def:"Een lijst met thema's die tijdens het interview aan bod moeten komen. Dient als leidraad zodat alle thema's worden besproken zonder dat het een verhoor wordt."},
  {cat:"interviewen", term:"Open (ongestructureerd) interview", def:"Start met een vaste open startvraag. Vervolgvragen hangen af van het antwoord van de respondent. Soms gebruik van een topiclijst. Veel ruimte voor persoonlijke inbreng."},
  {cat:"interviewen", term:"Gesloten (gestructureerd) interview", def:"Vragen staan op voorhand vast. Respondent heeft enkele antwoordmogelijkheden. Weinig ruimte voor persoonlijke inbreng. Sterk gericht op een bepaalde richting."},
  {cat:"interviewen", term:"Focusgroepgesprek", def:"Een gesprek tussen één onderzoeker en een groep respondenten. Respondenten kunnen elkaar inspireren. Risico: dominante groepsleden overheersen; mensen uiten zich minder vrij."},
  {cat:"interviewen", term:"LSD-techniek", def:"Luisteren, Samenvatten, Doorvragen. Techniek om de regie in het interview te houden en de geïnterviewde te helpen zonder te sturen."},
  {cat:"interviewen", term:"Post-it methode", def:"Interviewtechniek waarbij de geïnterviewde zelf de analyse uitvoert door trefwoorden op post-its te schrijven en te ordenen. Transcripten worden overbodig."},
  {cat:"interviewen", term:"Member check", def:"Goedkeuring van de respondent achteraf over de weergave van zijn of haar antwoorden. Verhoogt de validiteit van het onderzoek."},
  {cat:"interviewen", term:"Wanneer kiezen voor interviewen?", def:"Als het aantal respondenten overzichtelijk is (vuistregel circa 10–25, afhankelijk van onderzoeksopzet en saturatie), als je het 'waarom' en 'hoe' wilt begrijpen, als je op zoek bent naar patronen, en als je niet wilt generaliseren naar een hele groep."},

  /* 4. Enquêteren */
  {cat:"enquêteren", term:"Operationaliseren (enquête)", def:"Een abstract begrip meetbaar maken door het op te splitsen in dimensies, indicatoren en enquêtevragen. Gebruik bronnen bij het opstellen van een operationaliseringsschema."},
  {cat:"enquêteren", term:"Dimensie", def:"Een deelaspect van een abstract begrip. Bijv. bij 'culturele belangstelling': 'bezoek theater', 'lezen'."},
  {cat:"enquêteren", term:"Indicator", def:"Een concreet, observeerbaar gegeven dat een dimensie meetbaar maakt. Bijv. 'hoe vaak' of 'soort voorstelling'."},
  {cat:"enquêteren", term:"Antwoordcategorieën", def:"Vier typen: Één keuze (respondent kiest één optie), Meerdere keuzes (meerdere opties aanvinken), Schaal/tegenstellingen (positie op een schaal), Open (respondent formuleert zelf)."},
  {cat:"enquêteren", term:"Centrummaten", def:"Statistische maten die het midden van een dataverzameling aangeven: Gemiddelde, Mediaan en Modus."},
  {cat:"enquêteren", term:"Gemiddelde", def:"Centrummaat: de som van alle waarden gedeeld door het aantal waarden."},
  {cat:"enquêteren", term:"Mediaan", def:"Centrummaat: de middelste waarde bij een gesorteerde reeks."},
  {cat:"enquêteren", term:"Modus", def:"Centrummaat: de meest voorkomende waarde in een reeks."},
  {cat:"enquêteren", term:"Validiteit", def:"Meet je wat je wilt meten? Je onderzoek is valide als het instrument bij de juiste doelgroep, met de juiste steekproef en goede operationalisatie daadwerkelijk meet wat je wilt weten."},
  {cat:"enquêteren", term:"Betrouwbaarheid", def:"Is het onderzoek vrij van toevallige fouten? Kwantitatief: levert herhaling hetzelfde resultaat? Kwalitatief: heeft de onderzoeker niet te veel gestuurd en zijn de data goed vastgelegd?"},
  {cat:"enquêteren", term:"Meest gemaakte fouten bij enquêtes", def:"Suggestieve vragen, dubbele vragen, dubbele ontkenningen, slechte antwoordopties, ontbrekende inleiding, verkeerde doelgroep, te veel open vragen."},
  {cat:"enquêteren", term:"Selecte steekproef", def:"Een niet-representatieve steekproef waarbij de respondenten niet goed aansluiten bij de onderzoeksgroep. Maakt het onderzoek niet valide."},

  /* 5. Steekproef en data-analyse */
  {cat:"analyse", term:"Steekproefgrootte (formule)", def:"n = (Z² × p × (1−p)) / e². Z = z-score (95% → 1,96), p = verwachte spreiding (onbekend → 0,5), e = foutmarge. Voor 95% betrouwbaarheid en 5% foutmarge bij onbekende verdeling: n ≈ 385. Bij eindige populatie corrigeren met n_corr = n / (1 + (n−1)/N)."},
  {cat:"analyse", term:"Aselecte (random) steekproef", def:"Elk lid van de populatie maakt evenveel kans om geselecteerd te worden. Voorwaarde voor representativiteit en generalisatie."},
  {cat:"analyse", term:"Gestratificeerde steekproef", def:"Populatie wordt verdeeld in groepen (strata: leeftijd, afdeling) en in elk stratum wordt aselect getrokken. Garandeert dat alle relevante subgroepen vertegenwoordigd zijn."},
  {cat:"analyse", term:"Clustersteekproef", def:"Eerst clusters trekken (bijv. afdelingen), dan binnen elk cluster alle leden onderzoeken. Praktisch wanneer een lijst van alle individuen ontbreekt."},
  {cat:"analyse", term:"Standaarddeviatie", def:"Maat voor de spreiding rond het gemiddelde. Kleine standaarddeviatie = consistente antwoorden; grote standaarddeviatie = sterk uiteenlopende antwoorden."},
  {cat:"analyse", term:"Open coderen", def:"Eerste stap in kwalitatieve data-analyse: fragment voor fragment een label (code) toekennen. Eén code per begrip of zin. Levert een lange, ruwe codelijst op."},
  {cat:"analyse", term:"Axiaal coderen", def:"Tweede stap: open codes groeperen in thema's of categorieën die bij elkaar horen. Verbindt losse codes tot een structuur."},
  {cat:"analyse", term:"Selectief coderen", def:"Derde stap: kernthema's destilleren die antwoord geven op de onderzoeksvraag. Hier verbind je de analyse weer met je oorspronkelijke probleemstelling."},
  {cat:"analyse", term:"Codeboek", def:"Document waarin je vastlegt welke code welke betekenis heeft. Maakt analyse reproduceerbaar: een tweede onderzoeker zou dezelfde fragmenten op dezelfde manier moeten coderen. Belangrijke betrouwbaarheids­borging."},
  {cat:"analyse", term:"Triangulatie", def:"Methode om de geloofwaardigheid van onderzoek te versterken door meerdere methoden, bronnen of onderzoekers te combineren. Methode-triangulatie: interview + observatie + enquête. Bron-triangulatie: managers, medewerkers en klanten. Onderzoeker-triangulatie: twee onderzoekers analyseren onafhankelijk."},
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
PVRD.flashcards = PVRD.begrippen;
