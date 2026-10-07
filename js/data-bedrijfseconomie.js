/* Facilitaire Bedrijfseconomie — data voor begrippen en flashcards */

window.BECO = window.BECO || {};

/* ─── Categorieën ─────────────────────────── */
BECO.cats = [
  { key:"algemeen",     label:"Basisprincipes",            short:"Basis",        color:"#3b82f6" },
  { key:"overzichten",  label:"Financiële overzichten",    short:"Overzichten",  color:"#10b981" },
  { key:"kosten",       label:"Kosten en geldstromen",     short:"Kosten",       color:"#d97706" },
  { key:"managen",      label:"Managen en calculatie",     short:"Managen",      color:"#8b5cf6" },
  { key:"kengetallen",  label:"Financiële kengetallen",    short:"Kengetallen",  color:"#ec4899" },
  { key:"beoordelen",   label:"Investeringsbeoordeling",   short:"Investering",  color:"#ef4444" },
  { key:"fm-economie",  label:"FM-economie: TCO en NEN 2748", short:"FM-economie", color:"#0ea5e9" },
];

/* ─── Begrippen ─────────────────────────── */
BECO.begrippen = [
  /* 1. Basisprincipes */
  {cat:"algemeen", term:"Investering", def:"Een grote uitgave aan iets wat je voor een langere periode gebruikt. Bedoeld om geld mee te verdienen, te besparen of te voorkomen dat je geld gaat verliezen. Op het moment van investeren word je niet armer of rijker."},
  {cat:"algemeen", term:"Variabele kosten", def:"Kosten die meeveranderen met de productie- of omvang. Hoe meer je produceert, hoe hoger de variabele kosten. Symbool: v (per stuk)."},
  {cat:"algemeen", term:"Vaste (constante) kosten", def:"Kosten die gelijk blijven, ongeacht de hoeveelheid geproduceerde producten of diensten. Symbool: C."},
  {cat:"algemeen", term:"Directe kosten", def:"Kosten die direct zijn toe te wijzen aan een specifiek product of dienst (bijv. grondstoffen, directe arbeid)."},
  {cat:"algemeen", term:"Indirecte kosten", def:"Kosten die niet direct aan één product zijn toe te wijzen. Worden met een opslagmethode verdeeld (bijv. overhead, huur, management)."},
  {cat:"algemeen", term:"Primaire geldstroom", def:"Geldstromen die rechtstreeks te maken hebben met de productie en verkoop van goederen en diensten. Worden gebruikt bij investeringsbeoordelingen."},
  {cat:"algemeen", term:"Secundaire geldstroom", def:"Geldstromen die samenhangen met de vermogensmarkt: geleend geld (ontvangst lening, aflossingen, rente) of geld van eigenaren (aandelenkapitaal, dividend)."},
  {cat:"algemeen", term:"Kosten vs. uitgaven", def:"Kosten zijn aan perioden toegerekende uitgaven. Uitgaven zijn geld dat direct van je bankrekening of kas afgaat. Afschrijvingen zijn kosten maar GEEN uitgaven. Aflossingen zijn uitgaven maar GEEN kosten. Rente is zowel kosten als uitgaven."},
  {cat:"algemeen", term:"Opbrengsten vs. ontvangsten", def:"Opbrengsten zijn aan perioden toegerekende ontvangsten. Ontvangsten zijn geld dat direct op je bankrekening of kas binnenkomt. Geleend geld is GEEN opbrengst."},
  {cat:"algemeen", term:"Afschrijving", def:"De jaarlijkse waardevermindering van een vast activum. Is altijd een kost, nooit een uitgave. Formule: (Aanschafwaarde - Restwaarde) / Aantal jaren."},

  /* 2. Financiële overzichten */
  {cat:"overzichten", term:"Balans", def:"Overzicht van bezittingen en schulden op een bepaald moment. Debetzijde (links) = activa (bezittingen). Creditzijde (rechts) = passiva (eigen vermogen + vreemd vermogen). Totaal debet = Totaal credit."},
  {cat:"overzichten", term:"Vaste activa", def:"Bezittingen die langer dan één jaar in de onderneming blijven (machines, gebouwen, inventaris). Staan op de debetzijde van de balans."},
  {cat:"overzichten", term:"Vlottende activa", def:"Bezittingen die binnen één jaar omgezet worden in geld (voorraden, debiteuren, liquide middelen). Staan op de debetzijde van de balans."},
  {cat:"overzichten", term:"Eigen vermogen (EV)", def:"Het verschil tussen bezittingen en schulden: EV = Bezittingen - Schulden. Staat op de creditzijde van de balans."},
  {cat:"overzichten", term:"Vreemd vermogen (VV)", def:"Het totaal aan schulden aan derden (banklening, crediteuren). Wordt onderverdeeld in lang VV (looptijd > 1 jaar) en kort VV (looptijd < 1 jaar)."},
  {cat:"overzichten", term:"Resultatenrekening (winst- en verliesrekening)", def:"Overzicht van kosten en opbrengsten over een bepaalde periode. Resultaat = Opbrengsten - Kosten. Toont EBITDA, EBIT, EBT en EAT."},
  {cat:"overzichten", term:"EBITDA", def:"Earnings Before Interest, Taxes, Depreciation and Amortization. Winst vóórdat rente, belastingen en afschrijvingen eraf zijn gehaald."},
  {cat:"overzichten", term:"EBIT", def:"Earnings Before Interest and Taxes. Winst vóórdat rente en belastingen eraf zijn gehaald. EBIT = EBITDA - Afschrijvingen."},
  {cat:"overzichten", term:"EBT", def:"Earnings Before Taxes. Winst vóórdat de belasting eraf is gehaald. EBT = EBIT - Rentekosten."},
  {cat:"overzichten", term:"EAT", def:"Earnings After Taxes. Nettowinst nadat de vennootschapsbelasting eraf is gehaald. EAT = EBT - Vennootschapsbelasting."},
  {cat:"overzichten", term:"Kasstroomoverzicht en liquiditeitsbegroting", def:"Overzicht van ontvangsten en uitgaven over een periode. Het kasstroomoverzicht kijkt terug, de liquiditeitsbegroting kijkt vooruit. Let op: niet kosten en opbrengsten, maar daadwerkelijke geldstromen."},
  {cat:"overzichten", term:"Crediteur", def:"Een leverancier die jij nog moet betalen. Staat op de creditzijde van de balans als schuld, altijd inclusief BTW."},
  {cat:"overzichten", term:"Debiteur", def:"Een klant die jou nog moet betalen. Staat op de debetzijde van de balans als vordering, altijd inclusief BTW."},

  /* 3. Kosten en geldstromen */
  {cat:"kosten", term:"BTW (omzetbelasting)", def:"Bij inkoop mag de ondernemer de betaalde BTW terugvragen (te vorderen BTW, debetzijde). Bij verkoop moet de ontvangen BTW worden afgedragen (te betalen BTW, creditzijde). Factuurstelsel: BTW boeken op moment van factuur."},
  {cat:"kosten", term:"BTW berekening", def:"Bedrag excl. BTW = Bedrag incl. BTW / 1,21. Bedrag incl. BTW = Bedrag excl. BTW × 1,21. BTW-bedrag = Bedrag excl. × 0,21."},
  {cat:"kosten", term:"Vennootschapsbelasting (VPB)", def:"Belasting die een onderneming betaalt over de winst. Berekening: EBT × VPB-percentage."},
  {cat:"kosten", term:"Voorziening", def:"Post aan de creditzijde van de balans (geen eigen vermogen) voor verwachte maar nog onzekere toekomstige uitgaven. Per jaar: totale voorziene kosten / aantal jaren. Is een kost, maar GEEN uitgave."},
  {cat:"kosten", term:"Differentiële calculatie", def:"Rekenmethode waarbij je alleen kijkt naar kosten en opbrengsten die extra bij komen of wegvallen door een beslissing. Constante kosten en sunk costs worden niet meegenomen."},
  {cat:"kosten", term:"Sunk costs (verzonken kosten)", def:"Kosten die al gemaakt zijn vóór de beslissing en niet meer teruggehaald kunnen worden. Worden bij differentiële calculatie buiten beschouwing gelaten."},
  {cat:"kosten", term:"Dekkingsbijdrage", def:"Verkoopprijs per stuk minus variabele kosten per stuk. Geeft aan hoeveel elke verkochte eenheid bijdraagt aan het dekken van de vaste kosten. Formule: p - v."},

  /* 4. Managen en calculatie */
  {cat:"managen", term:"Break-even point (BEP)", def:"Het punt waarop totale opbrengsten gelijk zijn aan totale kosten. Winst noch verlies."},
  {cat:"managen", term:"Break-even afzet (BEA)", def:"Het aantal eenheden dat verkocht moet worden om break-even te draaien. Formule: C / (p - v) = Constante kosten / Dekkingsbijdrage. Altijd naar boven afronden."},
  {cat:"managen", term:"Break-even omzet (BEO)", def:"De omzet die behaald moet worden om break-even te draaien. Formule (één product): BEA × p. Formule (meerdere producten): C / Gemiddelde dekkingsbijdrage%."},
  {cat:"managen", term:"Veiligheidsmarge", def:"Het verschil tussen de werkelijke omzet/afzet en de break-even omzet/afzet. Geeft aan hoeveel de omzet kan dalen voordat verlies wordt geleden."},
  {cat:"managen", term:"Integrale kostprijs", def:"Kostprijsmethode die zowel variabele als constante kosten meeneemt. Formule: (C/N) + (V/W). C = totale constante kosten, N = normaal aantal, V = totale variabele kosten, W = werkelijk aantal."},
  {cat:"managen", term:"Enkelvoudige (primitieve) opslagmethode", def:"Methode waarbij één opslagpercentage wordt berekend voor alle indirecte kosten. Opslagpercentage = Totale indirecte kosten / Totale directe kosten × 100%."},
  {cat:"managen", term:"Meervoudige (verfijnde) opslagmethode", def:"Methode waarbij per kostensoort een apart opslagpercentage wordt berekend. Nauwkeuriger dan de enkelvoudige methode."},
  {cat:"managen", term:"Productieve uren", def:"Uren die een medewerker daadwerkelijk productief werkt. Berekening: contracturen - vakantiedagen - ziekteverzuim - pauze - leegloop."},
  {cat:"managen", term:"Werkgeverslasten", def:"Alle kosten die een werkgever heeft voor een medewerker: brutoloon + vakantiegeld + sociale lasten + overige kosten."},
  {cat:"managen", term:"Uurtarief", def:"De prijs die een klant betaalt per uur. Formule: Kostprijs per uur × (1 + overhead%) × (1 + winst%) × (1 + BTW%). Kostprijs per uur = werkgeverslasten / productieve uren."},

  /* 5. Financiële kengetallen */
  {cat:"kengetallen", term:"Solvabiliteit", def:"Of een bedrijf op lange termijn aan zijn financiële verplichtingen kan voldoen. Twee kengetallen: solvabiliteitspercentage (EV/TV × 100%) en debt ratio (VV/TV). Gebruik balansgegevens op één moment, geen gemiddelden."},
  {cat:"kengetallen", term:"Liquiditeit", def:"Of een bedrijf op korte termijn zijn rekeningen kan betalen. Drie kengetallen: Netto Werkkapitaal (NWK), Current Ratio (CR), Quick Ratio (QR). Gebruik balansgegevens op één moment, geen gemiddelden."},
  {cat:"kengetallen", term:"Netto Werkkapitaal (NWK)", def:"Vlottende activa - Kort vreemd vermogen. Geeft in euro's aan hoeveel buffer er is voor kortlopende schulden."},
  {cat:"kengetallen", term:"Current Ratio (CR)", def:"Vlottende activa / Kort vreemd vermogen. Geeft aan hoe makkelijk een bedrijf kortlopende schulden kan betalen."},
  {cat:"kengetallen", term:"Quick Ratio (QR)", def:"(Vlottende activa - Voorraden) / Kort vreemd vermogen. Geeft liquiditeit aan zonder voorraden, omdat die niet altijd snel te gelde gemaakt worden."},
  {cat:"kengetallen", term:"Rentabiliteit Eigen Vermogen (REV)", def:"Hoeveel winst een bedrijf maakt met het geld van de eigenaren. Formule: EAT / Gemiddeld EV × 100%. Interessant voor eigenaren en aandeelhouders."},
  {cat:"kengetallen", term:"Rentabiliteit Totaal Vermogen (RTV)", def:"Hoeveel winst een bedrijf haalt uit alle middelen (EV + VV). Formule: EBIT / Gemiddeld TV × 100%."},
  {cat:"kengetallen", term:"Kosten Vreemd Vermogen (KVV)", def:"Hoeveel het kost om geld te lenen. Formule: Rentekosten / Gemiddeld VV × 100%."},
  {cat:"kengetallen", term:"Waardecreatiemodel (6 waarden)", def:"Model om investeringen te beoordelen op meer dan alleen geld. 6 waarden: Financieel, Intellectueel, Menselijk, Materieel, Natuurlijk, Sociaal-relationeel. Ezelsbruggetje: FIM MNS."},

  /* 6. Investeringsbeoordeling */
  {cat:"beoordelen", term:"DPG (Differentiële Primaire Geldstromen)", def:"Alleen de primaire geldstromen die veranderen door jouw investering. Worden gebruikt bij BTP, ETP en NCW."},
  {cat:"beoordelen", term:"BTP (Boekhoudkundige Terugverdienperiode)", def:"Aantal jaren/maanden dat nodig is om de investering terug te verdienen. Houdt GEEN rekening met de tijdswaarde van geld. BTP in jaren: optellen DPG's totdat investeringsbedrag is overschreden."},
  {cat:"beoordelen", term:"Tijdswaarde van geld", def:"Geld dat je eerder krijgt is meer waard dan geld dat je later krijgt, omdat je geld meer geld kan maken. Vandaar: uitgaven zo laat mogelijk, ontvangsten zo vroeg mogelijk."},
  {cat:"beoordelen", term:"Contante waarde (CW)", def:"De waarde van een toekomstig bedrag in het heden. Formule: CW = TW / (1 + rente%)^jaren. Een contante waarde is altijd lager dan de toekomstige waarde."},
  {cat:"beoordelen", term:"Netto Contante Waarde (NCW)", def:"Som van alle contante waarden van toekomstige DPG's minus de investering. NCW > 0: investering is rendabel. NCW < 0: investering haalt gewenst rendement niet."},
  {cat:"beoordelen", term:"ETP (Economische Terugverdienperiode)", def:"Aantal jaren dat nodig is om investering terug te verdienen met contant gemaakte DPG's. Houdt WEL rekening met tijdswaarde (verschil met BTP)."},

  /* 7. FM-economie */
  {cat:"fm-economie", term:"TCO (Total Cost of Ownership)", def:"Alle kosten die een product of dienst gedurende zijn hele levensduur veroorzaakt: pre-transactie (selectie/aanbesteding), transactie (aanschaf/installatie) en post-transactie (gebruik, energie, onderhoud, afvoer) minus restwaarde. Bij FM-investeringen vaak doorslaggevend: de goedkoopste aanschaf is zelden de goedkoopste over de levensduur."},
  {cat:"fm-economie", term:"NEN 2748", def:"Nederlandse norm die facilitaire kosten en prestaties uniform indeelt in vijf rubrieken: huisvesting, diensten en middelen, ICT, externe voorzieningen en facility management. Maakt benchmarking tussen FM-organisaties mogelijk."},
  {cat:"fm-economie", term:"Benchmarking", def:"Vergelijken van eigen prestatiecijfers met die van anderen om verbeterpotentieel zichtbaar te maken. Intern: locaties of jaren onderling vergelijken. Extern: met sectorgenoten via bijvoorbeeld FMN. Vraagt om uniforme afbakening (NEN 2748)."},
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
BECO.flashcards = BECO.begrippen;

/* ─── Periode 2: offertes (bron: 02.01 Algemeen-student.pptx, les 2.1) ─── */
BECO.cats.push(
  { key:"offertes",     label:"Offertes: inhoud en rollen",     short:"Offertes",     color:"#14b8a6" },
  { key:"uurtarieven",  label:"Tarief opbouwen voor een offerte", short:"Tarieven",   color:"#65a30d" },
);

BECO.begrippen.push(
  /* 8. Offertes: inhoud en rollen */
  {cat:"offertes", term:"Offerte", def:"Een uitgebreide prijsopgave voor een (mogelijke) klant. Je laat zien wat de dienst of het product gaat kosten, hoe je de opdracht wilt uitvoeren en hoe je aan het bedrag komt: op basis van een uurtarief, materiaalkosten of een toeslag omdat het om een spoedklus gaat. Alleen een bedrag noemen is niet genoeg."},
  {cat:"offertes", term:"Dienst", def:"Werk dat iemand voor je doet, zoals schoonmaak, catering, beveiliging of advies. Een dienst kun je niet bewaren: hij is uitgevoerd of niet. Financieel is een dienst altijd een kostenpost en nooit een bezit op de balans."},
  {cat:"offertes", term:"Product", def:"Iets tastbaars dat je kunt vastpakken, bewaren en eventueel doorverkopen. Een product heeft financieel een waarde en kan als bezit op de balans staan. Tegenhanger van een dienst."},
  {cat:"offertes", term:"Verkopende kant", def:"De FM'er als aanbieder: je biedt zelf diensten als catering, schoonmaak, beveiliging of advies aan een klant aan. Vanuit deze kant stel je de offerte op en bepaal je de tarieven."},
  {cat:"offertes", term:"Inkopende kant", def:"De FM'er als afnemer: je koopt diensten als catering, schoonmaak of beveiliging in bij een andere partij, of je besluit het zelf te doen. Vanuit deze kant beoordeel je een offerte en vraag je je af of het niet beter zelf kan."},
  {cat:"offertes", term:"Uitbestedingspercentage", def:"Het deel van een facilitaire deelmarkt dat organisaties uitbesteden aan een externe leverancier. Volgens het marktonderzoek van Twijstra Gudde (2025) wordt schoonmaak voor 92% uitbesteed, technisch beheer voor 86% en beveiliging voor 81%. Daarom krijgt een FM'er zo vaak met offertes te maken."},
  {cat:"offertes", term:"Verplichte onderdelen van een offerte", def:"Je bedrijfsgegevens (met KvK-nummer en btw-id), de gegevens van de klant, een offertenummer, de datum en geldigheidsduur, een beschrijving van de diensten of producten, de totaalprijs exclusief btw, het btw-percentage, een verwijzing naar je algemene voorwaarden en de manier waarop de klant akkoord kan geven."},
  {cat:"offertes", term:"Omvang van de dienstverlening", def:"De specifieke taken en verantwoordelijkheden die de aanbieder gaat uitvoeren: wat er gedaan wordt en hoeveel. In de voorbeeldofferte van CleanUp B.V. is dat een lijst werkzaamheden (looproutes, kantoorruimtes, gevelglas, toezicht) met per regel aantal, eenheid en tarief."},
  {cat:"offertes", term:"Tarief en aantal", def:"Elke regel op een offerte combineert een prijs per eenheid met een hoeveelheid. Die eenheid kan een uur, functie, stuk, liter, keer of m² zijn. Voorbeeld CleanUp: 2.000 uur reiniging looproutes à € 30,55 is € 61.100,00.", formula:"Regelbedrag = aantal × tarief per eenheid"},
  {cat:"offertes", term:"Tarief per functie", def:"Een aanbieder rekent niet voor iedereen hetzelfde uurtarief, maar per soort medewerker. CleanUp B.V. rekent € 30,55 per uur voor schoonmaak categorie 1 en € 52,00 per uur voor specialistische schoonmaak en voor de leidinggevende (toezicht)."},
  {cat:"offertes", term:"Geldigheidsduur", def:"De periode waarin de offerte geldt; datum en geldigheidsduur moeten erop staan. De offerte van CleanUp B.V. is 30 dagen geldig: offertedatum 28-10-2025, vervaldag 27-11-2025.", formula:"Vervaldag = offertedatum + geldigheidsduur"},
  {cat:"offertes", term:"Totaalprijs exclusief btw", def:"Het bedrag zonder btw. Op een offerte staan de totaalprijs exclusief btw en het btw-percentage verplicht vermeld. Voorbeeld CleanUp: € 248.260,00 exclusief btw, plus 21% btw (€ 52.134,60), geeft een totaalbedrag van € 300.394,60.", formula:"Btw = bedrag excl. btw × btw%   |   Totaalbedrag = bedrag excl. btw + btw"},
  {cat:"offertes", term:"Btw op een offerte", def:"Btw is niet voor elke organisatie terug te vragen. Voor sommige organisaties is de btw op een offerte dus gewoon een kostenpost. Daarom is de btw van belang als je een offerte beoordeelt."},
  {cat:"offertes", term:"Onder voorbehoud van wijzigingen", def:"Zinsnede op een offerte die betekent dat de prijzen nog kunnen veranderen. CleanUp B.V. zet onder de offerte dat bedragen en tarieven onder voorbehoud van wijzigingen zijn."},
  {cat:"offertes", term:"Algemene voorwaarden", def:"De vaste afspraken van de aanbieder waar een offerte naar moet verwijzen. In het voorbeeld van CleanUp B.V. staan daar de wijze van aanvragen, uitvoeren en verrekenen van werk en de betalingsvoorwaarden in."},
  {cat:"offertes", term:"Extra werk op een offerte", def:"Werk dat buiten de vaste afspraken valt, zoals een calamiteit of een spoedklus, en dat apart betaald wordt. CleanUp B.V. noemt onder 'aanbod extra kosten' de tarieven voor eventueel extra werk: per uur voor schoonmaak en specialistische schoonmaak, per beurt voor gevelglas."},
  {cat:"offertes", term:"Offerte uit elkaar trekken", def:"Een offerte ontleden in haar onderdelen: wat staat erop, welke getallen worden gebruikt en wat moest de aanbieder weten om die getallen te bepalen. Startpunt van periode 2 en basis voor het later zelf opstellen en beoordelen van offertes."},
  {cat:"offertes", term:"Zelf doen of uitbesteden", def:"De vraag die de inkopende FM'er stelt bij een offerte: kunnen we deze dienst niet beter zelf doen in plaats van hem bij een andere partij in te kopen? Komt in periode 2 aan bod na het opstellen en beoordelen van offertes."},
  {cat:"offertes", term:"Offertes (KT) en investeringen (LT)", def:"Periode 1 van het vak gaat over investeren, beslissingen voor de lange termijn (LT). Periode 2 gaat over offertes, beslissingen voor de korte termijn (KT). Aan het eind van periode 2 komt de samenhang tussen offertes en investeringen (eenmalige opdrachten) aan bod."},

  /* 9. Tarief opbouwen voor een offerte */
  {cat:"uurtarieven", term:"Klantgegevens en eigen gegevens", def:"Om een offerte op te stellen heb je twee soorten getallen nodig. Hoeveelheden vraag je op bij de klant, zoals het aantal m² (CleanUp: 3.500 m² looproutes, 7.500 m² kantoor en lokalen, 5.700 m² gevelglas). Tarieven bepaal je zelf als aanbieder."},
  {cat:"uurtarieven", term:"Bouwstenen van een tarief", def:"Vijf vragen bepalen je tarief: wat kost een medewerker jou, hoeveel uur werkt die voor je klanten, wat ben je kwijt aan materiaal (zoals schoonmaakmiddelen), wat moet je verder nog terugverdienen (overhead) en hoeveel winst wil je maken."},
  {cat:"uurtarieven", term:"Loonkosten van een medewerker", def:"Wat een medewerker de werkgever kost. Dat is meer dan het uurloon: ook werkgeverslasten, vakantiegeld en vergoedingen tellen mee. Eerste bouwsteen van een tarief."},
  {cat:"uurtarieven", term:"Uren voor de klant", def:"Niet alle uren uit het contract zijn uren die een medewerker voor klanten werkt. Je begint bij de contracturen en houdt rekening met verlof (vrije dagen), ziekte en pauzes. Alleen de overgebleven uren kun je aan klanten doorberekenen."},
  {cat:"uurtarieven", term:"Materiaalkosten (schoonmaakkosten)", def:"Wat de aanbieder kwijt is aan middelen om het werk te doen. Bij schoonmaak: hoeveel liter schoonmaakmiddel en hoeveel sponsjes per m² nodig zijn en tegen welke inkoopprijs, plus de afschrijving op schoonmaakapparatuur."},
  {cat:"uurtarieven", term:"Overhead", def:"Kosten die niet bij één bepaalde klant horen, maar die je wel moet terugverdienen via je tarieven. Ook wel indirecte kosten. Voorbeelden: de directeur, het eigen hoofdkantoor (huur, schoonmaak, receptie, beveiliging, administratie) en marketing."},
  {cat:"uurtarieven", term:"Winstpercentage", def:"Het percentage winst dat je bovenop je kosten in je tarief verwerkt. Afweging: wordt het tarief daardoor te hoog, dan kan de klant de opdracht aan een andere leverancier geven."},
);
