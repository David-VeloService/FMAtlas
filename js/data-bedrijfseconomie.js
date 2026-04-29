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
  {cat:"overzichten", term:"Kasstroomoverzicht (liquiditeitsbegroting)", def:"Overzicht van ontvangsten en uitgaven over een bepaalde periode. Let op: niet kosten en opbrengsten, maar daadwerkelijke geldstromen."},
  {cat:"overzichten", term:"Crediteur", def:"Een leverancier die jij nog moet betalen. Staat op de creditzijde van de balans als schuld, altijd inclusief BTW."},
  {cat:"overzichten", term:"Debiteur", def:"Een klant die jou nog moet betalen. Staat op de debetzijde van de balans als vordering, altijd inclusief BTW."},

  /* 3. Kosten en geldstromen */
  {cat:"kosten", term:"BTW (omzetbelasting)", def:"Bij inkoop mag de ondernemer de betaalde BTW terugvragen (te vorderen BTW, debetzijde). Bij verkoop moet de ontvangen BTW worden afgedragen (te betalen BTW, creditzijde). Factuurstelsel: BTW boeken op moment van factuur."},
  {cat:"kosten", term:"BTW berekening", def:"Bedrag excl. BTW = Bedrag incl. BTW / 1,21. Bedrag incl. BTW = Bedrag excl. BTW × 1,21. BTW-bedrag = Bedrag excl. × 0,21."},
  {cat:"kosten", term:"Vennootschapsbelasting (VPB)", def:"Belasting die een onderneming betaalt over de winst. Berekening: EBT × VPB-percentage."},
  {cat:"kosten", term:"Voorziening", def:"Een financiële reserve op de balans voor verwachte maar nog onzekere toekomstige kosten. Per jaar: totale voorziene kosten / aantal jaren. Is een kost, maar GEEN uitgave."},
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
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
BECO.flashcards = BECO.begrippen;
