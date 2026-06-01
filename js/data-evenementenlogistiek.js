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
  {cat:"proces", term:"Five rights", def:"Logistiek principe van Lamberts en Stock: het juiste product, op de juiste plaats, op het juiste moment, in de juiste conditie, tegen de juiste kosten aan de juiste klant."},
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
  {cat:"toegang", term:"Fouilleren", def:"Lichamelijk onderzoek door gediplomeerde beveiligers aan het lichaam en de kleding van een bezoeker. Juridisch onderscheiden van visitatie en gebaseerd op de Wet particuliere beveiligingsorganisaties."},
  {cat:"toegang", term:"Hospitality (MOP-model)", def:"Gastvrijheid op een evenement, opgebouwd uit drie elementen: Mens (personeel en training), Omgeving (fysieke en digitale uitstraling) en Proces (logistieke organisatie van de gastvrije ontvangst)."},
  {cat:"toegang", term:"Customer journey", def:"Overzicht van de volledige belevingsreis van een bezoeker langs alle schillen van het evenement, van de oriëntatiefase thuis tot en met de nafase. Gebruikt persona's om knelpunten in de beleving te identificeren."},
  {cat:"toegang", term:"Persona", def:"Fictief maar realistisch profiel van een typische bezoeker uit een doelgroepsegment, gebruikt om de customer journey vanuit het perspectief van die bezoeker te doorlopen en knelpunten te ontdekken."},

  /* 4. Site design & crowd safety */
  {cat:"sitedesign", term:"PQRST-sleutel", def:"Systematisch kader voor het ontwerpen van een terreinindeling met vijf elementen: P (personen en producten), Q (omvang stromen), R (routering), S (steunverlenende diensten) en T (tijd)."},
  {cat:"sitedesign", term:"Relatieschema (relatiediagram)", def:"Overzicht dat aangeeft welke service- en attractiepunten op het terrein absoluut nabij of juist ver van elkaar moeten liggen. Vormt de basis voor de eerste terreinschets."},
  {cat:"sitedesign", term:"Bezoekersdichtheid", def:"Maatstaf voor het aantal personen per vierkante meter. Vanaf 0,27 m² per persoon ontstaan onvrijwillige aanrakingen en bij 0,18 m² per persoon potentieel gevaarlijke krachten in de menigte. De norm 2,5 m² per persoon staat voor vrij bewegen."},
  {cat:"sitedesign", term:"Crowd safety (crowd control)", def:"Het geheel van maatregelen om menigten veilig te geleiden en gevaarlijke bezoekersdichtheden te voorkomen, waaronder compartimenteren, bewegwijzering en het vermijden van kruisende stromen."},
  {cat:"sitedesign", term:"Managing flows", def:"Het actief beheersen van bezoekersstromen door eenvoudig terreinontwerp, goede bewegwijzering, het vermijden van kruisende routes, bufferzones en een centrale controlekamer."},
  {cat:"sitedesign", term:"Bufferzone", def:"Wachtruimte buiten het evenementterrein waar vrachtwagens of bezoekers tijdelijk kunnen worden opgevangen om piekbelasting op het terrein te voorkomen."},
  {cat:"sitedesign", term:"FOH (Front of House)", def:"Het eerste publieksvak direct voor het podium. Een specifieke attractiezone met eigen capaciteitsberekening en veiligheidsmaatregelen."},

  /* 5. Risico & veiligheid */
  {cat:"veiligheid", term:"FMEA (Failure Mode and Effect Analysis)", def:"Risicoanalysemethode waarbij risico's worden gekwantificeerd op drie factoren: kans (1-10), effect (1-10) en hersteltijd. De uitkomst is het Risico Prioriteits Getal (RPN = Kans × Effect × Hersteltijd)."},
  {cat:"veiligheid", term:"Risico Prioriteits Getal (RPN)", def:"Uitkomst van de FMEA-methode, berekend als Kans × Effect × Hersteltijd. Hoe hoger het getal, hoe urgenter de maatregel die nodig is."},
  {cat:"veiligheid", term:"Veiligheidsketen", def:"Indeling van veiligheidsmaatregelen in vijf opeenvolgende fasen: proactief (oorzaak wegnemen), preventief (incident voorkomen), preparatief (voorbereiden op incident), repressief (schade beperken tijdens incident) en nazorg (afwikkeling achteraf)."},
  {cat:"veiligheid", term:"Calamiteitenplan", def:"Document dat de crisisstructuur, het communicatieprotocol en de locatiegegevens (vluchtwegen, EHBO-posten, AED, nooduitgangen) vastlegt voor het geval van een incident tijdens een evenement."},
  {cat:"veiligheid", term:"GRIP", def:"Gecoördineerde Regionale Incidentenbestrijdings Procedure: landelijk opschalingsmodel voor hulpdiensten met niveaus 0 tot 3, waarbij elke stap meer coördinatie en beslissingsbevoegdheid samenbrengt bij grotere incidenten."},
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
