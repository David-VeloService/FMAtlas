/* EM1 — Eventmanagement 1 (Projectmanagement) — data voor begrippen, flashcards, oefentoets 1 */

window.EM1 = window.EM1 || {};

/* ─── Categorieën ─────────────────────────── */
EM1.cats = [
  { key:"project",     label:"Basis projectmanagement", short:"Projectbasis", color:"#3b82f6" },
  { key:"fasering",    label:"Traditionele fasering",   short:"Fasering",     color:"#10b981" },
  { key:"planning",    label:"Planning & beheersaspecten", short:"Planning",  color:"#d97706" },
  { key:"evm",         label:"EVM-berekeningen",        short:"EVM",          color:"#8b5cf6" },
  { key:"risico",      label:"Risicobeheersing",        short:"Risico",       color:"#ef4444" },
  { key:"organisatie", label:"Organisatie & MVO",       short:"Organisatie",  color:"#f97316" },
  { key:"belbin",      label:"Belbin-rollen",           short:"Belbin",       color:"#ec4899" },
  { key:"scrum",       label:"Agile & Scrum",           short:"Scrum",        color:"#06b6d4" },
  { key:"kwaliteit",   label:"Kwaliteit & FAT/SAT",     short:"Kwaliteit",    color:"#16a34a" },
  { key:"overig",      label:"Overige begrippen",       short:"Overig",       color:"#64748b" },
];

/* ─── Begrippen ─────────────────────────── */
EM1.begrippen = [
  /* 1. Projectmanagement basis */
  {cat:"project", term:"Project", def:"Een tijdelijke, unieke samenwerking gericht op een vooraf bepaald resultaat, binnen afgesproken randvoorwaarden van tijd, geld en kwaliteit."},
  {cat:"project", term:"Projectkenmerken", def:"Tijdelijk, uniek, eenmalig, gericht op een concreet resultaat, met een projectteam, budget en deadline."},
  {cat:"project", term:"Lijnorganisatie", def:"De vaste, permanente organisatiestructuur van een bedrijf; tegenover projectorganisatie (tijdelijk)."},
  {cat:"project", term:"Opdrachtgever", def:"De persoon of organisatie die het project opdraagt, het budget verstrekt en het eindresultaat accepteert. Staat buiten het projectteam."},
  {cat:"project", term:"Projectleider", def:"Verantwoordelijk voor de dagelijkse uitvoering, planning en coördinatie van het project. Rapporteert aan de opdrachtgever."},
  {cat:"project", term:"Stuurgroep", def:"Strategisch beslisorgaan bestaande uit de opdrachtgever en andere beslissingsbevoegde stakeholders. Neemt go/no-go beslissingen bij faseovergangen."},
  {cat:"project", term:"Stakeholder", def:"Iedereen die belang heeft bij of invloed uitoefent op het project. Niet per se financieel — ook organisatorisch, maatschappelijk of persoonlijk."},
  {cat:"project", term:"Projectresultaat", def:"Het tastbare of ontastbare eindproduct van het project: kan een product, dienst, rapport, evenement of verandering zijn."},
  {cat:"project", term:"Kick-off meeting", def:"Officiële startbijeenkomst aan het begin van een project. Alle betrokkenen worden geïnformeerd over doel, aanpak en rolverdeling."},
  {cat:"project", term:"Go/no-go beslissing", def:"Formele beslissing aan het einde van een projectfase: gaan we door naar de volgende fase of stoppen we? Genomen door de stuurgroep."},
  {cat:"project", term:"Mijlpaal", def:"Meetbaar tussentijds resultaat of formeel beslismoment binnen een project. Geen doorlooptijd, wel een concreet resultaat."},
  {cat:"project", term:"Scope creep", def:"Ongecontroleerde, niet-geplande uitbreiding van de projectomvang zonder formele goedkeuring of aanpassing van budget en doorlooptijd."},
  {cat:"project", term:"Deliverable", def:"Een op te leveren resultaat (product, rapport, ontwerp). Niet hetzelfde als een activiteit — dat is de taak die nodig is om de deliverable te maken."},
  {cat:"project", term:"P6-methode", def:"Projectaanpak van Roel Grit met zes stappen: 1) Opstarten (idee/initiatief), 2) Inrichten (team en afspraken), 3) Plan van Aanpak (resultaat en aanpak vaststellen), 4) Uitvoeren (TGKIO bewaken), 5) Opleveren (testen en goedkeuren), 6) Afsluiten (overdracht, evaluatie). Verschil met traditioneel: ontwerp, voorbereiding en realisatie zijn samengevoegd in stap 4."},
  {cat:"project", term:"Plan van Aanpak", def:"Het centrale projectdocument. Bevat: aanleiding, doelstelling, resultaat, aanpak, planning, begroting, risicoanalyse en organisatie."},
  {cat:"project", term:"SMART", def:"Methode om doelstellingen concreet te formuleren: Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden. Garandeert niet dat een doel haalbaar is."},

  /* 2. Traditionele fasering */
  {cat:"fasering", term:"Traditionele fasering (volgorde)", def:"Definitie → Ontwerp → Voorbereiding → Realisatie → Nazorg. Let op: Ontwerp komt vóór Voorbereiding!"},
  {cat:"fasering", term:"Definitiefase", def:"Eerste fase: doel, haalbaarheid en opdracht worden bepaald. Levert het Plan van Aanpak op."},
  {cat:"fasering", term:"Ontwerpfase", def:"Tweede fase: uitwerken wat er gemaakt wordt. Levert een functioneel of technisch ontwerp (document), niet standaard een fysiek prototype."},
  {cat:"fasering", term:"Voorbereidingsfase", def:"Derde fase: inkoop, aanbesteding, detailplanning en organisatie klaarstomen voor uitvoering."},
  {cat:"fasering", term:"Realisatiefase", def:"Vierde fase: de daadwerkelijke uitvoering. Hier wordt het eindresultaat gebouwd of gerealiseerd."},
  {cat:"fasering", term:"Nazorgfase", def:"Vijfde fase: overdracht, evaluatie en afbouw van de projectorganisatie. Het resultaat wordt overgedragen aan de opdrachtgever of beheerorganisatie."},
  {cat:"fasering", term:"Watervalmodel", def:"Lineaire, sequentiële aanpak waarbij elke fase volledig wordt afgerond voor de volgende begint. Moeilijk om halverwege grote wijzigingen door te voeren."},
  {cat:"fasering", term:"Fase-gate", def:"Controlemoment aan het einde van elke fase. De stuurgroep beoordeelt of aan de criteria is voldaan en neemt een go/no-go beslissing."},

  /* 3. Planning & beheersaspecten */
  {cat:"planning", term:"GOKIT", def:"Afkorting voor de vijf beheersaspecten van een project: Geld, Organisatie, Kwaliteit, Informatie, Tijd. Inhoudelijk gelijk aan TGKIO (alleen andere volgorde)."},
  {cat:"planning", term:"TGKIO", def:"Alternatieve volgorde van dezelfde vijf beheersaspecten: Tijd, Geld, Kwaliteit, Informatie, Organisatie. Inhoudelijk identiek aan GOKIT."},
  {cat:"planning", term:"KOFTIG", def:"Variant met zes beheersaspecten, specifiek voor evenementen: Kwaliteit, Organisatie, Facilitair, Tijd, Informatie, Geld. Bevat dezelfde aspecten als GOKIT/TGKIO plus één extra: Facilitair (faciliteiten/locatie/voorzieningen)."},
  {cat:"planning", term:"Duivelsdriehoek (IJzeren driehoek)", def:"Model dat de drie basisbeperkingen van een project toont: Geld, Tijd en Kwaliteit/Scope. Als één kant verandert zonder aanpassing van de andere, daalt de kwaliteit."},
  {cat:"planning", term:"Gantt-chart", def:"Balkplanningsdiagram waarbij activiteiten als balken in de tijd worden weergegeven. Toont tijdsvolgorde, maar niet de inhoudelijke afhankelijkheid tussen activiteiten."},
  {cat:"planning", term:"WBS (Werkbreakdownstructuur)", def:"Hiërarchische opdeling van alle projectactiviteiten en -resultaten. Toont structuur, géén chronologische volgorde — dat doet een Gantt-chart."},
  {cat:"planning", term:"Kritiek pad (CPM)", def:"De langste reeks afhankelijke activiteiten zonder tijdsspeling (float). Vertraging op het kritieke pad leidt direct tot vertraging van het hele project."},
  {cat:"planning", term:"Float / tijdsspeling", def:"De hoeveelheid tijd die een activiteit mag uitlopen zonder het eindmoment van het project te beïnvloeden. Activiteiten op het kritieke pad hebben float = 0."},
  {cat:"planning", term:"Lead (voorsprong)", def:"In netwerkplanning: een opvolgende activiteit mag eerder starten dan normaal — er is overlap. Lead = versnelling/overlap."},
  {cat:"planning", term:"Lag (vertraging)", def:"In netwerkplanning: een wachttijd tussen twee activiteiten. De opvolgende activiteit moet wachten voordat zij kan beginnen. Lag = vertraging."},
  {cat:"planning", term:"PERT", def:"Planningstechniek die onzekerheid meeneemt via drie tijdschattingen per activiteit: optimistisch, meest waarschijnlijk en pessimistisch. Verschil met CPM: CPM gebruikt één schatting."},

  /* 4. EVM */
  {cat:"evm", term:"BAC (Budget at Completion)", def:"Het totale, goedgekeurde projectbudget. Uitgangspunt voor EVM-berekeningen.", formula:"BAC = totaalbudget"},
  {cat:"evm", term:"PV (Planned Value) = BCWS", def:"Het gebudgetteerde bedrag voor het werk dat op dit moment gepland stond te zijn afgerond.", formula:"PV = gepland werk × uurtarief"},
  {cat:"evm", term:"EV (Earned Value) = BCWP", def:"De budgetwaarde van het werk dat daadwerkelijk is uitgevoerd. Wat heeft het team 'verdiend' in termen van budget?", formula:"EV = % klaar × BAC"},
  {cat:"evm", term:"AC (Actual Cost) = ACWP", def:"De werkelijke kosten van het tot nu toe uitgevoerde werk.", formula:"AC = daadwerkelijk uitgegeven"},
  {cat:"evm", term:"CPI (Cost Performance Index)", def:"Meet kostenefficiëntie. CPI > 1 = onder budget. CPI < 1 = over budget.", formula:"CPI = EV ÷ AC"},
  {cat:"evm", term:"SPI (Schedule Performance Index)", def:"Meet planningsefficiëntie. SPI > 1 = voor op schema. SPI < 1 = achter op schema.", formula:"SPI = EV ÷ PV"},
  {cat:"evm", term:"CV (Cost Variance)", def:"Kostenverschil. Negatief = meer uitgegeven dan verdiend = over budget.", formula:"CV = EV − AC"},
  {cat:"evm", term:"SV (Schedule Variance)", def:"Planningsverschil. Negatief = minder gedaan dan gepland = achter op schema.", formula:"SV = EV − PV"},
  {cat:"evm", term:"EAC (Estimate at Completion)", def:"Verwachte totale projectkosten op basis van huidige CPI. Als CPI = 0,80 en BAC = €200k, dan EAC = €250k — meer dan gepland!", formula:"EAC = BAC ÷ CPI"},
  {cat:"evm", term:"ETC (Estimate to Complete)", def:"Verwachte resterende kosten om het project af te ronden.", formula:"ETC = EAC − AC"},

  /* 4b. Stakeholdermanagement */
  {cat:"project", term:"Stakeholder", def:"Persoon of partij die invloed heeft op het project of erdoor beïnvloed wordt: opdrachtgever, gebruikers, leveranciers, omwonenden, vergunningverleners, eigen medewerkers."},
  {cat:"project", term:"Stakeholderanalyse", def:"Stelselmatig in kaart brengen van alle stakeholders en hun belangen. Werkwijze: lijst opstellen → scoren op macht en belang → in matrix plotten → strategie per kwadrant kiezen → herzien per fase."},
  {cat:"project", term:"Power/interest-matrix", def:"Stakeholdermatrix met twee assen — macht (kunnen ze beslissingen forceren?) en belang (raakt het project hen direct?). Vier kwadranten: hoge macht/hoog belang = manage closely; hoge macht/laag belang = tevreden houden; lage macht/hoog belang = informeren; lage macht/laag belang = monitoren."},

  /* 5. Risicobeheersing */
  {cat:"risico", term:"Risico", def:"Een onzekere gebeurtenis die een positief (kans) of negatief (bedreiging) effect kan hebben op projectdoelen."},
  {cat:"risico", term:"Risicoscore", def:"Maatstaf voor de prioriteit van een risico. Hoger = urgenter.", formula:"Risicoscore = kans × impact"},
  {cat:"risico", term:"Risicomatrix", def:"Visueel hulpmiddel om risico's te prioriteren op basis van kans én impact. Hoge kans + hoge impact = hoge prioriteit."},
  {cat:"risico", term:"Risicorespons: Vermijden", def:"De projectactiviteit of -aanpak zo aanpassen dat het risico niet meer bestaat. Niet hetzelfde als een noodplan!"},
  {cat:"risico", term:"Risicorespons: Mitigeren", def:"De kans en/of impact van een risico verkleinen. Elimineert het risico niet volledig."},
  {cat:"risico", term:"Risicorespons: Overdragen (Transfer)", def:"Het risico neerleggen bij een andere partij, bijv. via verzekering of uitbesteding. Kost doorgaans extra geld (premie, contractkosten)."},
  {cat:"risico", term:"Risicorespons: Accepteren", def:"Het risico bewust accepteren, eventueel met een contingency plan (noodplan) als het toch optreedt."},
  {cat:"risico", term:"Contingency plan (noodplan)", def:"Vooraf opgesteld plan dat in werking treedt als een geaccepteerd risico zich daadwerkelijk voordoet."},
  {cat:"risico", term:"Oorzaak-gevolgdiagram (visgraatdiagram / Ishikawa)", def:"Hulpmiddel om oorzaken van een probleem systematisch in kaart te brengen. Categorieën: mens, machine, methode, materiaal, milieu, management."},

  /* 6. Organisatie & MVO */
  {cat:"organisatie", term:"Matrixorganisatie", def:"Organisatievorm waarbij een medewerker rapporteert aan zowel de lijnmanager (functioneel) als de projectleider (projectmatig). Dubbele rapportagelijn."},
  {cat:"organisatie", term:"Zuivere projectorganisatie", def:"Medewerkers worden volledig losgemaakt van de lijnorganisatie voor de duur van het project. Projectleider heeft volledige zeggenschap."},
  {cat:"organisatie", term:"Stafprojectorganisatie", def:"Projectleider heeft een adviserende rol zonder directe bevoegdheid over de medewerkers; die blijven in de lijn."},
  {cat:"organisatie", term:"MVO (Maatschappelijk Verantwoord Ondernemen)", def:"Bedrijfsvoering waarbij rekening wordt gehouden met People (sociaal), Planet (milieu) en Profit (economisch). Standaardmodel heeft drie P's."},
  {cat:"organisatie", term:"People (MVO)", def:"De sociale dimensie van MVO: eerlijke arbeidsomstandigheden, mensenrechten, maatschappelijke bijdrage."},
  {cat:"organisatie", term:"Planet (MVO)", def:"De ecologische dimensie van MVO: milieubescherming, CO₂-reductie, duurzame grondstofgebruik."},
  {cat:"organisatie", term:"Profit (MVO)", def:"De economische dimensie van MVO: financieel gezonde bedrijfsvoering die waarde creëert voor alle stakeholders."},

  /* 7. Belbin */
  {cat:"belbin", term:"Belbin — overzicht", def:"Meredith Belbin onderscheidt 9 teamrollen verdeeld over 3 categorieën. Één persoon kan meerdere rollen vervullen."},
  {cat:"belbin", term:"Vormer (Shaper) — actiegericht", def:"Drijvende kracht, zet druk op resultaten, pakt obstakels aan. Zonder Vormer mist het team urgentie en richting."},
  {cat:"belbin", term:"Bedrijfsman / Zetter (Implementer) — actiegericht", def:"Vertaalt ideeën naar praktische actie, werkt gedisciplineerd en efficiënt."},
  {cat:"belbin", term:"Afmaker (Completer Finisher) — actiegericht", def:"Let op details, zorgt dat alles foutloos wordt opgeleverd, deadlinegericht."},
  {cat:"belbin", term:"Coördinator (Coordinator) — mensgeoriënteerd", def:"Leidt het team, delegeert goed, bewaakt de doelen. Vroeger ook 'Voorzitter' genaamd."},
  {cat:"belbin", term:"Groepswerker (Teamworker) — mensgeoriënteerd", def:"Houdt de teamsfeer goed, lost conflicten op, is diplomatiek en ondersteunend."},
  {cat:"belbin", term:"Brononderzoeker (Resource Investigator) — mensgeoriënteerd", def:"Enthousiast, netwerkt buiten het team, brengt kansen en ideeën van buiten naar binnen. Sociale/externe rol — geen taakgerichte rol!"},
  {cat:"belbin", term:"Plant / Bedenker (Plant) — cerebraal", def:"Creatief, origineel denker. Genereert vernieuwende ideeën maar communiceert slecht."},
  {cat:"belbin", term:"Monitor / Waarschuwer (Monitor Evaluator) — cerebraal", def:"Analytisch, objectief, beoordeelt opties kritisch. Heeft geen besluitvaardigheid maar wel goed oordeel."},
  {cat:"belbin", term:"Specialist (Specialist) — cerebraal", def:"Diepgaande vakkennis op een specifiek gebied. Scoort niet breed maar wel diep."},

  /* 8. Agile & Scrum */
  {cat:"scrum", term:"Agile", def:"Verzameling van waarden en principes voor flexibele softwareontwikkeling (Agile Manifesto 2001). Geschikt voor veranderende of onduidelijke eisen."},
  {cat:"scrum", term:"Agile Manifesto — 4 kernwaarden", def:"1) Mensen & interactie > processen & tools. 2) Werkende software > uitgebreide documentatie. 3) Klantcollaboratie > contractonderhandeling. 4) Inspelen op verandering > plan volgen."},
  {cat:"scrum", term:"Scrum", def:"Agile framework met vaste rollen, ceremonies en artefacten. Werk in sprints van 1–4 weken."},
  {cat:"scrum", term:"Sprint", def:"Timeboxed iteratie van 1–4 weken. Het team levert aan het einde een werkend increment op. De duur is vast gedurende het project."},
  {cat:"scrum", term:"Product Owner", def:"Verantwoordelijk voor de product backlog: prioriteert, beheert en communiceert wat er gebouwd moet worden. Vertegenwoordigt de klant/business."},
  {cat:"scrum", term:"Scrum Master", def:"Dienende leider die het Scrum-proces begeleidt en obstakels wegneemt. Heeft geen inhoudelijke bevoegdheid en is niet verantwoordelijk voor de backlog."},
  {cat:"scrum", term:"Development Team", def:"Zelforganiserend, cross-functioneel team dat het werk uitvoert. Bepaalt zelf hoeveel werk het in een sprint kan verwerken (velocity)."},
  {cat:"scrum", term:"Product Backlog", def:"Geprioriteerde lijst van alle gewenste functionaliteiten, bugs en verbeteringen. Bevat zowel voltooide als nog te doen items. Eigendom van de Product Owner."},
  {cat:"scrum", term:"Sprint Backlog", def:"De subset van de product backlog die het team in de huidige sprint gaat realiseren."},
  {cat:"scrum", term:"Increment", def:"Het opgeleverde, werkende product aan het einde van een sprint. Moet voldoen aan de Definition of Done."},
  {cat:"scrum", term:"Sprint Planning", def:"Ceremonie aan het begin van een sprint: team kiest werk uit de backlog en maakt een plan voor de sprint."},
  {cat:"scrum", term:"Daily Scrum (standup)", def:"Dagelijkse afstemming van maximaal 15 minuten: wat heb ik gisteren gedaan, wat doe ik vandaag, welke obstakels heb ik?"},
  {cat:"scrum", term:"Sprint Review", def:"Ceremonie aan het einde van de sprint: het team demonstreert het opgeleverde increment aan de Product Owner en stakeholders. Over het PRODUCT."},
  {cat:"scrum", term:"Sprint Retrospective", def:"Ceremonie na de Sprint Review: het team reflecteert intern op het WERKPROCES. Hoe kunnen we beter samenwerken? Niet over het product."},
  {cat:"scrum", term:"Definition of Done (DoD)", def:"Gedeelde afspraak over de kwaliteitscriteria waaraan een increment moet voldoen om als 'klaar' te gelden. Transparant en formeel vastgelegd."},
  {cat:"scrum", term:"Velocity", def:"De gemiddelde hoeveelheid werk (in story points) die een team per sprint verwerkt. Basis voor capaciteitsplanning."},

  /* 9. Kwaliteit */
  {cat:"kwaliteit", term:"Kwaliteitsmanagement", def:"Omvat drie onderdelen: kwaliteitsplanning (wat zijn de eisen?), kwaliteitsborging (procedures) en kwaliteitscontrole (meten of er aan is voldaan)."},
  {cat:"kwaliteit", term:"FAT (Factory Acceptance Test)", def:"Acceptatietest die plaatsvindt bij de LEVERANCIER/fabrikant. De klant controleert of het product aan de eisen voldoet voordat het verzonden wordt."},
  {cat:"kwaliteit", term:"SAT (Site Acceptance Test)", def:"Acceptatietest die plaatsvindt bij de KLANT/locatie. Controle of het geïnstalleerde systeem correct werkt in de echte omgeving."},

  /* 10. Overig */
  {cat:"overig", term:"Probleemstelling", def:"Beschrijving van de aanleiding en het probleem dat het project moet oplossen. Wordt vastgesteld in stap 1 (Opstarten) van de P6-methode en uitgewerkt in het Plan van Aanpak (stap 3)."},
  {cat:"overig", term:"Projectdoelstelling", def:"SMART geformuleerde beschrijving van wat het project beoogt te bereiken. Antwoord op: waarom doen we dit project?"},
  {cat:"overig", term:"Businesscase", def:"Onderbouwing van de toegevoegde waarde van het project: kosten, baten, risico's en alternatieve opties."},
  {cat:"overig", term:"Vergaderen — voorzitter", def:"De voorzitter stelt de agenda op, leidt de vergadering, bewaakt de tijd en zorgt voor besluiten. De notulist legt besluiten vast."},
  {cat:"overig", term:"Agendabeheer", def:"De voorzitter stelt de agenda op en verstuurt die vooraf. Deelnemers kunnen punten toevoegen. Vergadering begint en eindigt op tijd."},
  {cat:"overig", term:"Presenteren — structuur", def:"Inleiding (wat ga ik vertellen), kern (de boodschap), afsluiting (samenvatting + conclusie/actie). Vertel wat je gaat vertellen, vertel het, vat samen."},
  {cat:"overig", term:"Netwerken", def:"Actief opbouwen en onderhouden van professionele contacten die van waarde kunnen zijn voor het project of de eigen carrière."},
];

/* ─── Flashcards (subset van begrippen, zelfde structuur) ─── */
EM1.flashcards = EM1.begrippen.slice();

/* ─── Oefentoets 1 — 80 juist/onjuist vragen ─────────── */
EM1.oefentoets1 = [
  // H1 — Het Project
  { section: "H1 — Het Project", num: 1, text: "Routinematig werken is eenmalig en tijdelijk van aard.", answer: false, explanation: "Projectmatig werken is eenmalig en tijdelijk. Routinematig werken is juist herhaaldelijk en wordt uitgevoerd volgens vaste procedures." },
  { section: null, num: 2, text: "Een project heeft altijd een vooraf vastgesteld budget.", answer: true, explanation: "Correct. Een eigen budget — een vooraf gemaakte schatting van de kosten — is een van de kenmerken van een project." },
  { section: null, num: 3, text: "Evenementen zijn een apart soort project waarbij het projectresultaat op een vast moment ontstaat.", answer: true, explanation: "Correct. Evenementen zijn een van de vijf soorten projecten. Het projectresultaat (bijv. een festival) ontstaat op een vastgesteld moment." },
  { section: null, num: 4, text: "In de definitiefase van een project wordt een ontwerprapport opgeleverd.", answer: false, explanation: "De definitiefase levert een Plan van Aanpak op. Het ontwerprapport is het product van de ontwerpfase." },
  { section: null, num: 5, text: "SMART staat voor Specifiek, Meetbaar, Aanwijsbaar, Realistisch en Tijdgebonden.", answer: true, explanation: "Correct. Dit zijn de vijf criteria waaraan een SMART-doel moet voldoen." },
  { section: null, num: 6, text: "De levenscyclus van een project eindigt op het moment dat het projectresultaat wordt opgeleverd.", answer: false, explanation: "De levenscyclus loopt door tot na de oplevering. Daarna volgen exploitatie (gebruik), nazorg/onderhoud en uiteindelijk stagnatie — waarna een nieuw project kan starten." },
  { section: null, num: 7, text: "Bij maatschappelijk verantwoord projectmanagement (MVP) staan de vier P's voor Project, People, Plant en Profit.", answer: true, explanation: "Correct. Deze vier P's vormen samen het kader voor maatschappelijk verantwoord projectmanagement." },
  { section: null, num: 8, text: "Het doel van fasering is om de opdrachtgever aan het einde van elke fase de mogelijkheid te geven het project bij te sturen.", answer: true, explanation: "Correct. Door fasering worden beslismomenten ingebouwd. De opdrachtgever kan dan beslissen: doorgaan, doorgaan met aanpassingen of stoppen." },

  // H2 — Mensen en Projecten
  { section: "H2 — Mensen en Projecten", num: 9, text: "Een stafafdeling heeft bevelsbevoegdheid over de lijnafdelingen.", answer: false, explanation: "Een stafafdeling (bijv. P&O, administratie) geeft advies en ondersteuning, maar kan zaken niet dwingend voorschrijven aan lijnafdelingen." },
  { section: null, num: 10, text: "Het twee-bazen-probleem ontstaat doordat een projectlid zowel een afdelingshoofd als een projectleider als leidinggevende heeft.", answer: true, explanation: "Correct. Projectleden werken vaak parttime in een project en hebben daardoor twee leidinggevenden tegelijk." },
  { section: null, num: 11, text: "De Plant is een sociale rol binnen het Belbin-model.", answer: false, explanation: "De Plant is een denkrol. Sociale rollen zijn: Voorzitter, Groepswerker en Brononderzoeker." },
  { section: null, num: 12, text: "Bij consensusbesluitvorming wordt gestemd en wint de meerderheid.", answer: false, explanation: "Bij consensus wordt juist niet gestemd. Het kost veel tijd, maar is effectief omdat iedereen ermee kan leven. Meerderheid van stemmen is een andere besluitvormingsvorm." },
  { section: null, num: 13, text: "De Monitor is een actierol in het Belbin-model.", answer: false, explanation: "De Monitor is een denkrol: kritisch, nuchter en goed in beoordelen. Actierollen zijn: Afmaker, Bedrijfsman en Vormer." },
  { section: null, num: 14, text: "Eén persoon kan slechts één Belbin-rol vervullen.", answer: false, explanation: "Van de negen rollen die Belbin onderscheidt kan een persoon er meerdere vervullen, afhankelijk van karakter en ervaring." },
  { section: null, num: 15, text: "Een Brononderzoeker is nieuwsgierig, enthousiast en legt gemakkelijk contacten.", answer: true, explanation: "Correct. De Brononderzoeker is een sociale rol: extravert, communicatief en maakt gemakkelijk contacten." },
  { section: null, num: 16, text: "De stuurgroep beheert meerdere projecten, zorgt voor informatie-uitwisseling en bestaat uit een directielid én projectleiders.", answer: true, explanation: "Correct. Dit zijn de kenmerken van een stuurgroep, die wordt ingezet bij meerdere van elkaar afhankelijke projecten." },

  // H3 — Begin tot Eind
  { section: "H3 — Het Project van Begin tot Eind", num: 17, text: "GOKIT en TGKIO zijn twee verschillende sets beheersaspecten met elk een andere inhoud.", answer: false, explanation: "GOKIT en TGKIO zijn dezelfde vijf beheersaspecten, alleen in een andere volgorde gespeld: Geld, Organisatie, Kwaliteit, Informatie en Tijd." },
  { section: null, num: 18, text: "Bij risicobeheersing betekent 'overdragen' dat je een risico accepteert en er niets aan doet.", answer: false, explanation: "Overdragen betekent dat je het risico bij een andere partij neerlegt, bijvoorbeeld via een verzekering. Accepteren is de strategie waarbij je niets doet." },
  { section: null, num: 19, text: "Een projectstart-up vergadering wordt ook wel een kick-off vergadering genoemd.", answer: true, explanation: "Correct. De projectstart-up vergadering (kick-off) is het officiële begin van een project en creëert saamhorigheid onder betrokkenen." },
  { section: null, num: 20, text: "Scrum wordt aanbevolen wanneer de opdrachtgever precies weet wat hij wil.", answer: false, explanation: "Scrum wordt juist aanbevolen als de opdrachtgever niet precies weet wat hij wil. De flexibele aanpak maakt het mogelijk om gaandeweg bij te sturen." },
  { section: null, num: 21, text: "Een risico wordt bepaald door de kans vermenigvuldigd met het gevolg.", answer: true, explanation: "Correct. Risico = kans × gevolg. Dit bepaalt hoe groot de impact van een risico op het project is." },
  { section: null, num: 22, text: "De duivelsdriehoek beschrijft de spanning tussen Tijd, Geld en Kwaliteit.", answer: true, explanation: "Correct. Deze drie factoren staan op gespannen voet met elkaar. Als je één aanpast, heeft dat altijd effect op de andere twee." },
  { section: null, num: 23, text: "De P6-methode is een projectmanagementmethode die specifiek is ontwikkeld voor grote internationale projecten.", answer: false, explanation: "De P6-methode is een synthese van verschillende methoden en is juist bruikbaar voor kleine en middelgrote projecten." },
  { section: null, num: 24, text: "Risicobeheersing bestaat uit vier strategieën: voorkomen, verminderen, overdragen en accepteren.", answer: true, explanation: "Correct. Dit zijn de vier manieren om met risico's om te gaan bij het uitvoeren van een project." },

  // H4 — Planning
  { section: "H4 — Planning", num: 25, text: "Een strokenplanning wordt ook wel een Gantt-chart genoemd.", answer: true, explanation: "Correct. Een strokenplanning (Gantt-chart) toont activiteiten in een tijdsbalk en geeft een visueel overzicht van wie wat wanneer doet." },
  { section: null, num: 26, text: "Een netwerkplanning toont de afhankelijkheden tussen activiteiten en helpt het kritische pad te bepalen.", answer: true, explanation: "Correct. Het kritische pad is de langste route door de netwerkplanning en bepaalt de minimale projectduur." },
  { section: null, num: 27, text: "De doorlooptijd en de werktijd van een activiteit zijn altijd gelijk aan elkaar.", answer: false, explanation: "Doorlooptijd is de kalendertijd van start tot eind. Werktijd is het aantal uren dat daadwerkelijk aan de activiteit besteed wordt. Ze kunnen sterk van elkaar verschillen." },
  { section: null, num: 28, text: "Een mijlpaal in een planning is een belangrijk tussenresultaat.", answer: true, explanation: "Correct. Een mijlpaal (milestone) markeert een cruciaal punt in de planning, zoals de oplevering van een deelresultaat." },
  { section: null, num: 29, text: "Een planning en een Plan van Aanpak zijn hetzelfde document.", answer: false, explanation: "Een planning is slechts één onderdeel van het Plan van Aanpak. Het PvA bevat ook activiteiten, organisatie, kosten-baten, risicoanalyse en meer." },

  // H5 — P6-Methode
  { section: "H5 — De P6-Methode", num: 30, text: "In de P6-methode worden de ontwerp-, voorbereidings- en realisatiefase samengevoegd tot stap 4 'Uitvoeren'.", answer: true, explanation: "Correct. De P6-methode wijkt hierin af van de traditionele watervalfasering, waarbij ontwerp, voorbereiding en realisatie drie afzonderlijke fasen zijn." },
  { section: null, num: 31, text: "In stap 4 van de P6-methode worden de beheersaspecten TGKIO bewaakt.", answer: true, explanation: "Correct. Per uitvoeringsfase worden Tijd, Geld, Kwaliteit, Informatie en Organisatie bewaakt." },
  { section: null, num: 32, text: "De zesde stap van de P6-methode heet 'Evalueren'.", answer: false, explanation: "De zesde stap heet 'Afsluiten'. In deze stap worden het project financieel afgehandeld, handleidingen gemaakt en projectleden teruggeleid naar de lijnorganisatie." },
  { section: null, num: 33, text: "Het Plan van Aanpak wordt opgesteld in stap 3 van de P6-methode.", answer: true, explanation: "Correct. Stap 3 is specifiek gewijd aan het maken van het Plan van Aanpak, inclusief de stakeholderanalyse en het vaststellen van het projectresultaat." },
  { section: null, num: 34, text: "In stap 5 van de P6-methode wordt het projectresultaat getest en formeel goedgekeurd door de opdrachtgever.", answer: true, explanation: "Correct. In stap 5 'Opleveren' wordt een testplan uitgevoerd en vindt formele acceptatie van het resultaat door de opdrachtgever plaats." },
  { section: null, num: 35, text: "De P6-methode kan alleen worden toegepast op projecten, niet op onderzoek.", answer: false, explanation: "De P6-methode kan ook worden toegepast op onderzoeksprojecten. De stappen blijven hetzelfde, maar de namen van producten veranderen (bijv. onderzoeksvoorstel i.p.v. projectvoorstel)." },
  { section: null, num: 36, text: "In stap 2 van de P6-methode wordt het projectteam samengesteld en worden afspraken gemaakt over de samenwerking.", answer: true, explanation: "Correct. Stap 2 heet 'Inrichten'. Hierin worden geschikte projectleden geselecteerd, taken verdeeld en communicatieafspraken vastgelegd." },

  // H6 — Plan van Aanpak
  { section: "H6 — Plan van Aanpak", num: 37, text: "Het Plan van Aanpak is het contract tussen het projectteam en de opdrachtgever.", answer: true, explanation: "Correct. Het PvA maakt voor iedereen duidelijk wat er gaat gebeuren en fungeert als formeel contract tussen projectmanager en opdrachtgever." },
  { section: null, num: 38, text: "Exploitatiekosten zijn kosten die gemaakt worden vóór de uitvoering van het project.", answer: false, explanation: "Exploitatiekosten zijn de kosten die worden gemaakt ná de oplevering van het projectresultaat, bij het gebruik en onderhoud ervan." },
  { section: null, num: 39, text: "Een projectdossier bevat alle inhoudelijke documenten van het project en behoudt na afloop veel waarde.", answer: false, explanation: "Dat beschrijft het systeemdossier. Het projectdossier bevat organisatie- en beheerdocumenten (PvA, notulen) en verliest na afloop snel waarde." },
  { section: null, num: 40, text: "De scope van een project beschrijft alles wat binnen het project valt.", answer: true, explanation: "Correct. Alles binnen de projectgrenzen wordt de 'scope' (omvang, draagwijdte, domein) genoemd." },
  { section: null, num: 41, text: "De projectdoelstelling (het 'waarom') is eigendom van de projectleider.", answer: false, explanation: "De projectdoelstelling is eigendom van de opdrachtgever. De projectleider is eigenaar van het projectresultaat (het 'wat')." },
  { section: null, num: 42, text: "Een risicoanalyse in het Plan van Aanpak maakt onderscheid tussen interne en externe risico's.", answer: true, explanation: "Correct. Interne risico's zijn bijv. gebrek aan kennis of slechte samenwerking. Externe risico's zijn bijv. afhankelijkheid van andere projecten of onduidelijke projectgrenzen." },
  { section: null, num: 43, text: "Een Plan van Aanpak Light wordt gebruikt bij projecten van beperkte omvang, waarbij hoofdstukken worden samengevoegd.", answer: true, explanation: "Correct. Bij kleine projecten kunnen bijv. Achtergronden, Projectresultaat en Projectgrenzen worden samengevat in één hoofdstuk." },
  { section: null, num: 44, text: "Randvoorwaarden zijn factoren waarop het projectteam zelf invloed kan uitoefenen.", answer: false, explanation: "Randvoorwaarden zijn juist factoren waarop het projectteam meestal géén invloed heeft, maar waaraan wel moet zijn voldaan om het project succesvol te maken." },

  // H7 — Agile en Scrum
  { section: "H7 — Agile en Scrum", num: 45, text: "Agile is een specifieke projectmanagementmethode met vaste stappen en procedures.", answer: false, explanation: "Agile is een manier van denken (mindset), een parapluterm voor verschillende methoden zoals Scrum. Het is geen methode op zichzelf." },
  { section: null, num: 46, text: "Een sprint duurt bij Scrum doorgaans 2 tot 4 weken.", answer: true, explanation: "Correct. Scrum werkt in korte, vaste werkcycli (sprints) van 2 tot 4 weken, waarbij aan het einde een werkend (tussen)product wordt opgeleverd." },
  { section: null, num: 47, text: "De Scrum Master wijst de taken toe aan de teamleden.", answer: false, explanation: "Het Scrum-team is zelfsturend en pakt zelf taken op. De Scrum Master coacht het proces en lost belemmeringen op, maar wijst geen taken toe." },
  { section: null, num: 48, text: "De Product Owner is de enige die de prioriteiten in de product backlog bepaalt.", answer: true, explanation: "Correct. De Product Owner vertegenwoordigt de stakeholders en bepaalt welke user stories worden gerealiseerd en in welke volgorde. Dit is zijn exclusieve bevoegdheid." },
  { section: null, num: 49, text: "De Daily Standup duurt maximaal 15 minuten.", answer: true, explanation: "Correct. De Daily Standup (daily scrum meeting) is een dagelijks overleg van maximaal 15 minuten waarbij teamleden rapporteren aan elkaar." },
  { section: null, num: 50, text: "Een Sprint Retrospective is een open bijeenkomst waarbij een demo wordt gegeven aan stakeholders.", answer: false, explanation: "Dat is de Sprint Review. De Sprint Retrospective is een interne evaluatie aan het einde van de sprint: wat ging goed, wat kan beter?" },
  { section: null, num: 51, text: "Bij agile werken worden producten vroeg en frequent opgeleverd.", answer: true, explanation: "Correct. Dit is één van de kernkenmerken van Agile: werkende producten worden al vroeg en regelmatig opgeleverd, wat snellere feedback mogelijk maakt." },
  { section: null, num: 52, text: "Een product backlog bevat een geprioriteerde lijst van alle user stories voor het gehele project.", answer: true, explanation: "Correct. De product backlog is de volledige to-dolijst van het project, geprioriteerd door de Product Owner met de belangrijkste items bovenaan." },

  // H8 — Vergaderen
  { section: "H8 — Projectvergaderingen", num: 53, text: "Het doel van een vergadering kan zijn: informatieverstrekking, meningsvorming of besluitvorming.", answer: true, explanation: "Correct. Dit zijn de drie mogelijke doelen van een projectvergadering." },
  { section: null, num: 54, text: "De notulist is verantwoordelijk voor de organisatie en leiding van de vergadering.", answer: false, explanation: "De voorzitter is verantwoordelijk voor de organisatie en leiding. De notulist legt beslissingen en actiepunten vast." },
  { section: null, num: 55, text: "Het is het beste om documenten pas tijdens de vergadering uit te delen, zodat de inhoud vers is.", answer: false, explanation: "Documenten moeten vooraf worden gestuurd, of er moet een leespauze worden ingelast. Uitdelen tijdens een vergadering verstoort het verloop." },
  { section: null, num: 56, text: "Bij online vergaderen zorgt de moderator voor het technisch goed verlopen van de bijeenkomst.", answer: true, explanation: "Correct. De moderator bezit technische kennis en zorgt ervoor dat de online vergadering (technisch) goed verloopt." },
  { section: null, num: 57, text: "Notulen moeten zo snel mogelijk ná de vergadering worden uitgewerkt.", answer: true, explanation: "Correct. Hoe eerder de notulen worden gemaakt, hoe beter alles nog in het geheugen zit en hoe sneller actiepunten ten uitvoer gebracht kunnen worden." },

  // H9 — Interview
  { section: "H9 — Een Interview Afnemen", num: 58, text: "Het gestandaardiseerde interview heeft als voordeel dat er ongeremd informatie verzameld kan worden.", answer: false, explanation: "Ongeremd informatie verzamelen is juist het voordeel van het vrije interview. Het gestandaardiseerde interview heeft als voordeel: systematische verwerking en controle over het gesprek." },
  { section: null, num: 59, text: "Het is aanbevolen om met twee personen een interview af te nemen: één die vraagt en één die schrijft.", answer: true, explanation: "Correct. Met twee personen kan de vragensteller zich volledig concentreren op het gesprek, terwijl de ander aantekeningen maakt." },
  { section: null, num: 60, text: "Na afloop van een interview stuur je een kopie van het verslag naar de geïnterviewde.", answer: true, explanation: "Correct. De geïnterviewde kan het verslag controleren op juistheid en commentaar geven. Dit verhoogt de betrouwbaarheid van de informatie." },

  // H10 — Rapport schrijven
  { section: "H10 — Een Rapport Schrijven", num: 61, text: "Bijlagen in een rapport worden aangeduid met letters (A, B, C), niet met cijfers.", answer: true, explanation: "Correct. Bijlagen krijgen letters (Bijlage A, Bijlage B). Aanduiding met cijfers is een veelgemaakte fout." },
  { section: null, num: 62, text: "In een rapport mag je persoonlijke voornaamwoorden zoals 'ik', 'we' en 'je' gebruiken voor een informele toon.", answer: false, explanation: "Een rapport wordt geschreven in zakelijke stijl. Persoonlijke voornaamwoorden (ik, je, we, me) zijn niet toegestaan." },
  { section: null, num: 63, text: "Een inhoudsopgave in een rapport mag maximaal drie niveaus bevatten.", answer: true, explanation: "Correct. De inhoudsopgave bevat paginaverwijzingen naar hoofdstukken en paragrafen, met maximaal drie niveaus." },
  { section: null, num: 64, text: "Een hoofdstuk in een rapport mag direct beginnen met een paragraaf, zonder aparte inleiding.", answer: false, explanation: "Elk hoofdstuk moet beginnen met een korte inleiding voordat de eerste paragraaf start. Direct beginnen met een paragraaf is een veelgemaakte fout." },
  { section: null, num: 65, text: "Bij APA-bronvermelding staat de punt ná de bron, niet ervóór.", answer: true, explanation: "Correct. De punt wordt geplaatst achter de bronvermelding, niet vóór. Dit is een veelgemaakte fout." },

  // H11 — Presentatie
  { section: "H11 — Een Presentatie Houden", num: 66, text: "Een pitch bestaat onder andere uit een aantrekkelijke opening, een probleemstelling, een oplossing en een USP.", answer: true, explanation: "Correct. Dit zijn de kernelementen van een goede pitch, samen met bewijs (onderbouwing) en een call-to-action." },
  { section: null, num: 67, text: "Tijdens de afsluiting van een presentatie herhaal je de boodschap en geef je gelegenheid tot vragen.", answer: true, explanation: "Correct. De afsluiting bestaat uit: samenvatting, conclusies herhalen, een pakkende uitsmijter en ruimte voor vragen." },
  { section: null, num: 68, text: "Je moet bij een presentatie zo veel mogelijk informatie op één dia plaatsen, zodat het publiek alles kan lezen.", answer: false, explanation: "Je zet juist niet te veel informatie op één dia. Overvolle dia's zijn slecht leesbaar en afleidend. Houd het overzichtelijk." },
  { section: null, num: 69, text: "Het is aanbevolen om de apparatuur en leesbaarheid van de presentatie vooraf te testen.", answer: true, explanation: "Correct. Vooraf testen voorkomt technische problemen op het moment van presenteren." },

  // H12 — Managementsamenvatting
  { section: "H12 — Een Managementsamenvatting Maken", num: 70, text: "Een managementsamenvatting is een vooruitblik op een aankomend project.", answer: false, explanation: "Een managementsamenvatting is een rapportage achteraf over een uitgevoerd projectonderdeel. Het bevat een verantwoording van het resultaat, conclusies en aanbevelingen." },
  { section: null, num: 71, text: "Beslispunten in een managementsamenvatting maken duidelijk waar het management beslissingen over moet nemen.", answer: true, explanation: "Correct. Beslispunten zijn beslissingsvoorbereidend: goedkeuring van de afgelopen fase, akkoord voor de volgende fase of continueren/opheffen van de projectgroep." },
  { section: null, num: 72, text: "Een managementsamenvatting moet beperkt blijven tot maximaal 1 à 2 pagina's.", answer: true, explanation: "Correct. Het moet kort, bondig en direct begrijpelijk zijn voor de manager. Niet meer dan 1 à 2 pagina's." },
  { section: null, num: 73, text: "Een managementsamenvatting schrijf je voor vakspecialisten die diep in de materie zitten.", answer: false, explanation: "Je schrijft een managementsamenvatting voor de manager, niet voor een vakgenoot. Het moet zonder vakkennis direct te begrijpen zijn." },

  // Expert-colleges
  { section: "Expert-colleges", num: 74, text: "In Nederland bestaat een apart wettelijk rechtsgebied dat 'evenementenrecht' heet.", answer: false, explanation: "Evenementenrecht bestaat niet als apart rechtsgebied. Bij evenementen zijn meerdere rechtsgebieden betrokken: publiekrecht én privaatrecht." },
  { section: null, num: 75, text: "BUMA/STEMRA beheert de auteursrechten van componisten en tekstschrijvers bij muziekgebruik.", answer: true, explanation: "Correct. BUMA/STEMRA beheert auteursrechten. Sena beheert naburige rechten van uitvoerende artiesten en producenten. Voor een evenement heb je vaak licenties van beiden nodig." },
  { section: null, num: 76, text: "De 3 E's van eventmarketing staan voor Entertainment, Excitement en Enterprise.", answer: true, explanation: "Correct. Deze drie E's vormen de basis van eventmarketing: wat bied je (Entertainment), waar worden mensen enthousiast van (Excitement) en wat maakt het uniek (Enterprise)." },
  { section: null, num: 77, text: "KOFTIG staat voor Kwaliteit, Organisatie, Financieel, Tijd, Informatie en Geld.", answer: false, explanation: "KOFTIG staat voor Kwaliteit, Organisatie, Facilitair, Tijd, Informatie en Geld. Het is 'Facilitair', niet 'Financieel'. Geld staat apart als de G." },
  { section: null, num: 78, text: "Vaste kosten bij een evenement zijn onafhankelijk van het aantal bezoekers.", answer: true, explanation: "Correct. Vaste kosten (bijv. locatiehuur) blijven gelijk ongeacht het aantal bezoekers. Variabele kosten (bijv. catering per persoon) stijgen mee met het aantal bezoekers." },
  { section: null, num: 79, text: "Marktsegmentatie op basis van leeftijd, geslacht en inkomen is demografische segmentatie.", answer: true, explanation: "Correct. Demografische segmentatie omvat kenmerken zoals leeftijd, geslacht, gezinsgrootte, inkomen, beroep en opleiding." },
  { section: null, num: 80, text: "Als organisator van een evenement heb je een zorgplicht en kun je aansprakelijk worden gesteld voor schade.", answer: true, explanation: "Correct. De organisator heeft een juridische zorgplicht. Aansprakelijkheid wordt bepaald op basis van de kans op schade, de ernst ervan en de kosten van preventie." },
];
