/* Trendwatchers — data voor begrippen en flashcards */

window.TRDW = window.TRDW || {};

/* ─── Categorieën ─────────────────────────── */
TRDW.cats = [
  { key:"destep",    label:"DESTEP-model & onderzoek",   short:"DESTEP",     color:"#3b82f6" },
  { key:"trends",    label:"Trends per factor",           short:"Trends",     color:"#10b981" },
  { key:"risico",    label:"Prioritering & risico's",     short:"Risico's",   color:"#f59e0b" },
  { key:"ethiek",    label:"Ethiek & waarden",            short:"Ethiek",     color:"#8b5cf6" },
  { key:"impact",    label:"Impact & duurzaamheid",       short:"Impact",     color:"#ef4444" },
];

/* ─── Begrippen ─────────────────────────── */
TRDW.begrippen = [
  /* 1. DESTEP-model & onderzoek */
  {cat:"destep", term:"DESTEP-model", def:"Gestructureerde methode om de externe omgeving van een organisatie te analyseren. Staat voor: Demografisch, Economisch, Sociaal-cultureel, Technologisch, Ecologisch, Politiek-juridisch."},
  {cat:"destep", term:"Macro-omgeving", def:"Externe factoren die buiten de controle van de organisatie liggen. DESTEP analyseert altijd de macro-omgeving — trends zijn in beweging, nooit statische feiten."},
  {cat:"destep", term:"Deskresearch", def:"Onderzoeksmethode waarbij bestaande informatie (literatuur, data, trendrapporten) wordt gebruikt. Vaak de eerste stap, vóór veldonderzoek zoals interviews of enquêtes."},
  {cat:"destep", term:"AAOCC-criteria", def:"Criteria voor het beoordelen van bronnen: Autoriteit (wie schrijft het?), Accuraatheid (kloppen de gegevens?), Objectiviteit (is het neutraal?), Actualiteit (hoe actueel?), Compleetheid (is het volledig?)."},
  {cat:"destep", term:"Versterkend verband (feedback loop)", def:"Twee of meer DESTEP-factoren die elkaar positief beïnvloeden. Circulair, bidirectioneel (A ↔ B). Succes leidt tot meer succes — opwaartse spiraal. Voorbeeld: subsidies (P) → betere technologie (T) → duurzamere gebouwen (E) → lagere kosten (Ec)."},
  {cat:"destep", term:"Verzwakkend verband", def:"DESTEP-factoren die elkaar tegenwerken of afremmen. Conflicterende doelen. Voorbeeld: ecologie eist duurzame renovatie (E) ↔ economie beperkt door hoge kosten (Ec)."},
  {cat:"destep", term:"Cascade-effect (domino-effect)", def:"Één DESTEP-factor triggert een reeks opeenvolgende veranderingen in andere factoren. Lineair (A → B → C → D). Vaak onvoorspelbaar. Voorbeeld: COVID-virus (D) → thuiswerken (S) → technologievraag (T) → kantoorcrash (Ec) → nieuwe wetgeving (P)."},
  {cat:"destep", term:"Trendrapporten", def:"Rapporten over trends op facilitair gebied, gepubliceerd door brancheverenigingen (FMN, IFMA), consultancies (Deloitte, PwC), technologiebedrijven (Planon), academische instellingen en vastgoeddienstverleners. Elk met eigen doel (professionalisering, lead gen, kennisvorming)."},
  {cat:"destep", term:"CBS StatLine", def:"Interactieve databank van het Centraal Bureau voor de Statistiek. Biedt tabellen op basis van thema, jaar en regio. Belangrijke bron voor demografische en economische data."},
  {cat:"destep", term:"Conjunctuurklok (CBS)", def:"Instrument dat de stand van de economie weergeeft via 13 indicatoren: verwachtingsindicatoren (consumentenvertrouwen, producentenvertrouwen), economische indicatoren (BBP, consumptie, investeringen) en arbeidsmarktindicatoren (werkloosheid, vacatures). Indicatoren bewegen met de klok mee door vier fasen: hoogconjunctuur, afnemende groei, laagconjunctuur en herstel."},

  /* 1b. Signalen, drivers en scenario's */
  {cat:"destep", term:"Weak signal (zwak signaal)", def:"Vroegtijdige aanwijzing dat er iets verandert: klein, ambigu en vaak in de marge waarneembaar (niche-experiment, eerste artikel in een vakblad). Dient als bril om trends te zien voordat ze massaal zichtbaar worden."},
  {cat:"destep", term:"Driver (drijfkracht)", def:"Onderliggende kracht die meerdere trends voedt en zich over decennia ontwikkelt. Voorbeelden: vergrijzing, klimaatverandering, digitalisering, individualisering. Drivers veranderen traag maar grondig."},
  {cat:"destep", term:"Trend", def:"Waarneembare verandering met richting en bewijs in meerdere bronnen. Beweegt door tijd, niet hetzelfde als een hype. Voorbeelden: hybride werken, plantaardig eten, regenererende landbouw."},
  {cat:"destep", term:"Hype", def:"Korte piek van aandacht, vaak technologie-gedreven (zie Gartner Hype Cycle). Het grootste deel zakt weer weg; een klein deel volwaardige trend. Verschil met trend: hype is intensiteit zonder beproefde duurzaamheid."},
  {cat:"destep", term:"Scenarioplanning", def:"Strategische methode om met onzekerheid om te gaan. Twee onzekere kerndrivers worden tegen elkaar afgezet als assen, zodat vier mogelijke toekomsten ontstaan. Per kwadrant wordt de strategie getoetst: welke beslissingen werken in alle scenario's (robuust) en welke alleen in één toekomst (kwetsbaar). Geen voorspelling, maar een denkraam."},
  {cat:"destep", term:"PESTEL", def:"Internationale variant van DESTEP: Political, Economic, Social, Technological, Environmental, Legal. Splitst Politiek-juridisch in twee aparte factoren (P en L); Demografisch valt bij PESTEL onder Social. Inhoudelijk dekt PESTEL hetzelfde bereik als DESTEP."},

  /* 2. Trends per DESTEP-factor */
  {cat:"trends", term:"Demografische factor (D)", def:"Richt zich op bevolkingskenmerken: leeftijdsopbouw, geslacht, gezinssamenstelling, migratie. Vergrijzing, gezinsverdunning en diversiteit beïnvloeden marktvraag, personeelsbehoefte en dienstenaanbod."},
  {cat:"trends", term:"Economische factor (E)", def:"Studie van hoe schaarse middelen verdeeld worden. Relevante indicatoren: BBP, inflatie, consumentenvertrouwen, koopkracht, werkloosheid. Conjunctuur kent vier fasen: laagconjunctuur, opgaand, hoogconjunctuur, neergaand."},
  {cat:"trends", term:"Conjunctuur", def:"De golfbeweging in de economie. Wordt bepaald door de verhouding tussen besteding en productiecapaciteit. Vier fasen: laagconjunctuur (onderbezetting + dalende besteding), conjuncturele opgang, hoogconjunctuur (overbezetting + stijgende besteding), conjuncturele neergang."},
  {cat:"trends", term:"Sociaal-culturele factor (S)", def:"Waarden, normen, tradities, levensstijlen en generatieverschillen die gedrag en organisatiecultuur bepalen. Denk aan inclusiviteit, werk-privébalans, communicatiestijlen en diversiteit als FM-thema's."},
  {cat:"trends", term:"Technologische factor (T)", def:"Opkomende technologieën en innovaties die werken en leven veranderen. Sleutelelementen voor FM: digitalisering, automatisering, IoT, AI en data-analyse. Leiden tot efficiëntere processen, kostenbesparing en nieuwe businessmodellen."},
  {cat:"trends", term:"Ecologische factor (E)", def:"Duurzaamheid, milieueffecten, energieverbruik, biodiversiteit en afvalbeheer. Ecologische trends leiden tot strengere milieunormen, druk van consumenten/stakeholders en verplichte duurzame rapportage (CSRD)."},
  {cat:"trends", term:"Politiek-juridische factor (P)", def:"Veranderingen in wet- en regelgeving met directe gevolgen voor organisaties. Beleidsbeslissingen (belastingen, subsidies, handelsverdragen), juridische hervormingen (dataprivacy, arbeidsrecht) en de brug die overheidsbeleid vormt."},
  {cat:"trends", term:"Hybride werken & werkplektransformatie", def:"Sociaal-culturele trend: medewerkers werken deels thuis, deels op kantoor. Impact op FM: workplace experience, wellbeing services en flexibele werkplekconcepten worden steeds belangrijker."},
  {cat:"trends", term:"Digitalisering & Smart Buildings", def:"Technologische trend: sensortechnologie, predictive maintenance en geautomatiseerde gebouwen. Risico's: investeringsdruk, cybersecurity en omscholingsbehoefte van medewerkers."},
  {cat:"trends", term:"Artificial Intelligence (AI) in FM", def:"AI vervangt repetitieve taken en ondersteunt datagedreven besluitvorming. Kansen: efficiëntie en voorspellend onderhoud. Risico's: baanverlies, bias in algoritmes en ethische vragen over privacy en transparantie."},

  /* 3. Prioritering & risico's */
  {cat:"risico", term:"Kansen en bedreigingen", def:"Kansen ontstaan wanneer een trend nieuwe markten creëert, efficiëntie verbetert of nieuwe businessmodellen mogelijk maakt. Bedreigingen ontstaan wanneer een trend bestaande diensten overbodig maakt, concurrenten bevoordeelt of gedrag fundamenteel verandert."},
  {cat:"risico", term:"Prioriteren van DESTEP-factoren", def:"Niet alle factoren zijn even relevant. Prioritering op basis van: (1) welke risico's de grootste impact hebben op het organisatiedoel en (2) op welke risico's de kans het grootst is. Helpt organisaties proactief te sturen in plaats van reactief te reageren."},
  {cat:"risico", term:"Risicomatrix (kans × impact)", def:"Instrument om risico's te prioriteren op basis van twee assen: kans en impact, elk op een schaal. De combinatie geeft een risiconiveau: verwaarloosbaar, laag risico, gemiddeld risico, hoog risico, extreem hoog risico."},
  {cat:"risico", term:"Risico vermijden (Avoid)", def:"Risicostrategie: het risico volledig uitsluiten door de activiteit niet uit te voeren of anders in te richten. Voorbeeld FM: werk alleen met gecertificeerde, duurzame leveranciers om reputatieschade te vermijden."},
  {cat:"risico", term:"Risico accepteren (Accept)", def:"Risicostrategie: het risico bewust accepteren omdat de kosten van maatregelen hoger zijn dan de potentiële schade. Voorbeeld FM: accepteren dat oude liften regelmatig storen, omdat vervangen veel duurder is."},
  {cat:"risico", term:"Risico overdragen (Transfer)", def:"Risicostrategie: het risico verplaatsen naar een andere partij, via verzekeringen of contractuele aansprakelijkheidsbepalingen. Voorbeeld FM: leveranciers moeten eigen reputatierisico contractueel dekken."},
  {cat:"risico", term:"Risico reduceren (Reduce/Mitigate)", def:"Risicostrategie: maatregelen nemen om de kans op het risico of de impact ervan te verkleinen. Voorbeeld FM: trainingen, ergonomische aanpassingen en flexibele arbeidsvoorwaarden om personeelstekort door vergrijzing te beperken."},
  {cat:"risico", term:"Proactief vs. reactief sturen", def:"Proactief: op basis van trends vooraf inspelen op risico's en kansen (gewenst). Reactief: pas handelen nadat een probleem zich heeft voorgedaan. Prioritering van DESTEP-factoren maakt proactief sturen mogelijk."},
  {cat:"risico", term:"Maatschappelijk dilemma", def:"Situatie waarin trends en ontwikkelingen facility managers dwingen om keuzes te maken waarbij verschillende waarden of belangen met elkaar conflicteren. Vraagt ethische reflectie."},
  {cat:"risico", term:"Kans–impact analyse", def:"Methode om te bepalen welke DESTEP-factoren de hoogste prioriteit verdienen: (1) wat is de kans dat dit risico zich voordoet? (2) wat is de impact op de organisatie? Factoren met hoge kans én hoge impact krijgen hoogste prioriteit."},

  /* 4. Ethiek & waarden */
  {cat:"ethiek", term:"Ethiek", def:"Verzameling van regels, normen en waarden die bepalen wat juist of onjuist handelen is. Fundamentele vraag: 'Wat is goed en wat is fout?' Ethiek gaat dieper dan de wet: iets kan wettelijk zijn maar ethisch incorrect."},
  {cat:"ethiek", term:"Moraal", def:"Gedragsregels, heersende zeden en gebruiken binnen een samenleving. Meer gericht op wat 'gebruikelijk' is. Verschilt van ethiek, dat dieper ingaat op waaróm iets goed of fout is."},
  {cat:"ethiek", term:"Consequentialisme (gevolgenethiek)", def:"Ethische benadering waarbij een handeling juist is als deze de beste uitkomst oplevert voor zoveel mogelijk mensen. Kernvraag: 'Wat levert de beste uitkomst op?' Voordeel: praktisch en meetbaar. Nadeel: goede doelen kunnen slechte middelen rechtvaardigen."},
  {cat:"ethiek", term:"Deontologie (plichtenethiek)", def:"Ethische benadering waarbij regels, plichten en principes leidend zijn — ongeacht de gevolgen. Kernvraag: 'Respecteer ik fundamentele rechten?' Voordeel: beschermt fundamentele waarden. Nadeel: kan leiden tot rigide beslissingen."},
  {cat:"ethiek", term:"Deugdenethiek (karakterethiek)", def:"Ethische benadering waarbij het karakter van de persoon centraal staat: handelen vanuit goede eigenschappen (eerlijkheid, moed, rechtvaardigheid). Kernvraag: 'Wat zou een integer persoon doen?' Voordeel: integere beslissingen. Nadeel: kan vaag zijn."},
  {cat:"ethiek", term:"Ethisch dilemma in FM", def:"Situatie waarbij waarden botsen en er geen eenduidig juist antwoord is. Voorbeelden: camera's op de werkvloer (veiligheid vs. privacy), goedkope vs. lokale leverancier (kosten vs. gemeenschapsgevoel), open kantoortuin vs. afgesloten kantoren."},
  {cat:"ethiek", term:"Drie P's (People, Planet, Profit)", def:"Kader voor maatschappelijk verantwoord ondernemen (MVO): People = eerlijke arbeidsomstandigheden en sociale betrokkenheid. Planet = duurzame keuzes en ecologische voetafdruk. Profit = financiële én sociale winst. Balans tussen alle drie is essentieel."},

  /* 5. Impact & duurzaamheid */
  {cat:"impact", term:"Waardecreatie", def:"Bijdragen aan iets dat betekenisvol is voor mensen, de planeet of de samenleving — zonder dat dit ten koste gaat van andere zaken. In FM: het toevoegen van meervoudige waarde (niet alleen financieel)."},
  {cat:"impact", term:"Meervoudige waardecreatie", def:"Organisaties creëren waarde op meerdere fronten tegelijk: economisch (profit), sociaal (people) en ecologisch (planet). Verschuiving weg van zuivere winstmaximalisatie naar gebalanceerde bijdrage aan mens, milieu en economie."},
  {cat:"impact", term:"SDG's (Sustainable Development Goals)", def:"17 duurzame ontwikkelingsdoelen van de VN, te herleiden naar de 3 P's. Voorbeelden: armoedebestrijding, klimaatactie, gendergelijkheid, kwaliteitsonderwijs. FM-professionals kunnen actief bijdragen aan deze doelen."},
  {cat:"impact", term:"ESG (Environmental, Social, Governance)", def:"Raamwerk om duurzaamheid van een organisatie te meten. Environmental: CO₂, energie, water, afval. Social: diversiteit, arbeidsomstandigheden, veiligheid. Governance: transparantie, ethisch handelen, compliance."},
  {cat:"impact", term:"CSRD (Corporate Sustainability Reporting Directive)", def:"Europese richtlijn (EU 2022/2464) die grote bedrijven verplicht over duurzaamheid (ESG) te rapporteren. Gefaseerde invoering: rapportage over boekjaar 2024 voor de grootste beursgenoteerde bedrijven. Door de stop-the-clock-richtlijn (EU) 2025/794 zijn de overige grote bedrijven uitgesteld naar boekjaar 2027 en het beursgenoteerde mkb naar boekjaar 2028."},
  {cat:"impact", term:"Macro Economische Verkenning (MEV)", def:"Jaarlijkse analyse van het Centraal Planbureau (CPB) met een overzicht van de economische situatie en vooruitzichten van Nederland. Belangrijk instrument voor overheidsbeleid en strategische planning."},
  {cat:"impact", term:"Planbureau voor de Leefomgeving (PBL)", def:"Nederlands onderzoeksinstituut dat onderzoek doet naar de leefomgeving en leefomgevingsbeleid. Belangrijke bron voor ecologische en ruimtelijke data in een DESTEP-analyse."},
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
TRDW.flashcards = TRDW.begrippen;
