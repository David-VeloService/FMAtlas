// data-bvfmb.js — gedeelde data (Basis van FM B)
window.BVFMB = window.BVFMB || {};

BVFMB.cats = [
  {
    "key": "schoonmaak",
    "label": "Schoonmaak",
    "short": "Schoonmaak",
    "color": "#3b82f6"
  },
  {
    "key": "catering",
    "label": "Catering",
    "short": "Catering",
    "color": "#22c55e"
  },
  {
    "key": "veiligheid",
    "label": "Veiligheidszorg",
    "short": "Veiligheid",
    "color": "#a855f7"
  }
];

BVFMB.begrippen = [

  /* ══════════════════════════════════════════
     SCHOONMAAK (Les 1–4)
  ══════════════════════════════════════════ */
  {cat:"schoonmaak", term:"Sinner-cirkel",
   def:"De vier factoren die samen de schoonmaakkwaliteit bepalen: Temperatuur, Arbeid, Chemie en Tijd (TACT). Het is een principe van uitwisseling: dezelfde prestatie kan via verschillende combinaties bereikt worden — als één factor afneemt, kunnen de andere ter compensatie worden verhoogd. Geen wiskundige optelsom, maar een ontwerpregel."},

  {cat:"schoonmaak", term:"Temperatuur (Sinner)",
   def:"Warmte bevordert de werking van chemicaliën en lost vet en vuil op. Eén van de vier factoren van de Sinner-cirkel."},

  {cat:"schoonmaak", term:"Arbeid (Sinner)",
   def:"Mechanische kracht zoals wrijven, schrobben en borstelen. Eén van de vier factoren van de Sinner-cirkel."},

  {cat:"schoonmaak", term:"Chemie (Sinner)",
   def:"Schoonmaakmiddelen die ontvetten en desinfecteren. Eén van de vier factoren van de Sinner-cirkel."},

  {cat:"schoonmaak", term:"Tijd (Sinner)",
   def:"De inwerktijd van middelen en de duur van de bewerking. Eén van de vier factoren van de Sinner-cirkel."},

  {cat:"schoonmaak", term:"Reinheidsgraad",
   def:"Het gewenste schoonmaakpeil, afgestemd op de functie van de ruimte. De drie niveaus zijn: Microbiologisch schoon (zorgsector, voedselbereidingsruimten), Huishoudelijk schoon (kantoren, leslokalen) en Ruw schoon (opslag, parkeergarages, buiten)."},

  {cat:"schoonmaak", term:"Microbiologisch schoon",
   def:"De hoogste reinheidsgraad. Bacteriologisch gecontroleerd. Van toepassing in de zorgsector en bij bereiding van voedsel."},

  {cat:"schoonmaak", term:"Huishoudelijk schoon",
   def:"Standaard schoonmaakpeil voor kantoren, leslokalen en vergaderruimtes. De meest gangbare reinheidsgraad."},

  {cat:"schoonmaak", term:"Ruw schoon",
   def:"Het basisniveau van reinheid voor opslag, parkeergarages en buitenruimten."},

  {cat:"schoonmaak", term:"Inspanningsgericht contract",
   def:"Schoonmaakcontract waarbij is vastgelegd welke taken met welke frequentie worden uitgevoerd (schoonmaakplan). Gedetailleerd en objectief controleerbaar, maar speelt minder in op wisselende bezetting."},

  {cat:"schoonmaak", term:"Resultaatgericht contract",
   def:"Schoonmaakcontract waarbij is vastgelegd hoe schoon het moet zijn (kwaliteitsniveau). De schoonmaker beoordeelt zelf wanneer actie nodig is. Meer flexibel, maar afhankelijker van de subjectieve beoordeling van de schoonmaker."},

  {cat:"schoonmaak", term:"PvE schoonmaak",
   def:"Programma van Eisen voor schoonmaak. Bevat elementen als: object/gebouwkenmerken, type organisatie, gewenste reinheidsgraad, te verwachten vervuiling, gebruiksintensiteit, afwerkingsmaterialen en beschikbaar budget."},

  {cat:"schoonmaak", term:"Schoonmaak werkprogramma",
   def:"Gestructureerd overzicht van taken en activiteiten die nodig zijn om een ruimte, gebouw of object schoon te houden. Bevat planning, frequenties, taakverdeling, verantwoordelijkheden en tijdschema. Heeft drie doelen: taakomschrijving medewerkers, vastleggen afspraken opdrachtgever en communicatie naar eindgebruiker."},

  {cat:"schoonmaak", term:"m² prestatie (productienorm)",
   def:"Hoeveel vierkante meter een schoonmaker per uur kan reinigen. Varieert per ruimtesoort. Doel: basis voor de kostprijs (uurtarief × benodigde uren) én voor de inzet van het aantal medewerkers en de taakverdeling."},

  {cat:"schoonmaak", term:"Microvezelsystematiek",
   def:"Schoonmaakmethode waarbij microvezeldoeken vuil mechanisch hechten. Vereist minder chemie dan de traditionele katoenen moppenmethode en werkt efficiënter."},

  {cat:"schoonmaak", term:"Kleurcodering materialen",
   def:"Indeling van schoonmaakmiddelen en -materialen in de les: interieur (blauw), sanitair (rood), vloer (groen) en desinfectanten (geen kleur genoemd)."},

  {cat:"schoonmaak", term:"VSR-KMS",
   def:"Kwaliteits Meetsysteem van de VSR. Een visuele kwaliteitscontrolemethode waarbij de schoonheid van oppervlakken objectief wordt gemeten. Vergelijkbaar met DKS."},

  {cat:"schoonmaak", term:"VSR-KBS",
   def:"Klant Beleving Survey van de VSR. Een belevingsonderzoek waarbij wordt gemeten hoe gebruikers de schoonmaak ervaren. Aanvulling op de objectieve VSR-KMS meting."},

  {cat:"schoonmaak", term:"DKS",
   def:"Visuele kwaliteitscontrolemethode voor schoonmaak. Meet de zichtbare schoonheid van oppervlakken. Vergelijkbaar met VSR-KMS."},

  {cat:"schoonmaak", term:"Geografische taakverdeling",
   def:"Taakverdeling waarbij een schoonmaakmedewerker verantwoordelijk is voor een vaste zone, vloer of afdeling."},

  {cat:"schoonmaak", term:"Specialistische taakverdeling",
   def:"Taakverdeling waarbij een schoonmaakmedewerker uitsluitend één specifieke taak uitvoert, zoals alleen sanitair of alleen vloeren."},

  {cat:"schoonmaak", term:"Zelfsturend team (schoonmaak)",
   def:"Taakverdeling waarbij het team zelf de taken en verantwoordelijkheden onderling verdeelt, zonder tussenkomst van een leidinggevende."},

  {cat:"schoonmaak", term:"Schoonmaakkosten",
   def:"80% van de schoonmaakkosten bestaat uit personele kosten. Overige elementen: machines/materialen/middelen, opleidingskosten, dienstkleding en kosten van kwaliteitsmetingen."},

  {cat:"schoonmaak", term:"3 K's schoonmaak",
   def:"De drie effecten van schoonmaak die moeten worden geborgd: Klanten (tevredenheid), Kwaliteit (niveau) en Kosten (efficiëntie)."},

  {cat:"schoonmaak", term:"Managementinformatie (MI) schoonmaak",
   def:"Kwartaalrapportage over de schoonmaakdienst. Bevat: medewerkerinfo (uren, ziekteverzuim, verloop, opleiding), kwaliteitsmetingen (VSR-KMS/KBS), klachten, planning periodieke werkzaamheden, technische updates en innovaties/trends."},

  {cat:"schoonmaak", term:"Code Verantwoordelijk Marktgedrag",
   def:"Vrijwillig convenant in de schoonmaakbranche, ondertekend door werkgevers, werknemers, opdrachtgevers en rijksoverheid. Doel: bij aanbestedingen niet uitsluitend op prijs concurreren, maar ook op kwaliteit van uitvoering en arbeidsomstandigheden."},

  /* ══════════════════════════════════════════
     CATERING (Les 5–8)
  ══════════════════════════════════════════ */
  {cat:"catering", term:"Catering",
   def:"De georganiseerde bereiding en verstrekking van voedsel en dranken aan grote groepen op andere dan horecalocaties."},

  {cat:"catering", term:"PvE catering",
   def:"Programma van Eisen voor catering. Bevat elementen als: algemene gegevens (aantal gebruikers, afwezigheidspercentage), restauratieve dienst, assortiment, prijsbeleid, gratis verstrekkingen, uitgiftesysteem, verstrekkingswijze, afrekenmethode, afruimen en uitwerking verstrekkingen."},

  {cat:"catering", term:"8 cateringdoelgroepen",
   def:"De acht cateringtypen: Bedrijfscatering (kantoor/bedrijf), Institutionele catering (zorg), Onderwijscatering, Remote site catering (boorplatform/bouwplaats), Transportcatering (vliegtuig/trein), Party- en eventcatering, Automatencatering (vending) en Leisure catering (pretpark/sport)."},

  {cat:"catering", term:"Bedrijfscatering",
   def:"Cateringdienstverlening in kantoor- en bedrijfsrestaurants. Één van de acht cateringdoelgroepen."},

  {cat:"catering", term:"Institutionele catering",
   def:"Cateringdienstverlening in ziekenhuizen en zorginstellingen. Speciale eisen vanwege diëten, allergieën en medische omstandigheden. Één van de acht cateringdoelgroepen."},

  {cat:"catering", term:"Remote site catering",
   def:"Cateringdienstverlening op locaties ver van bewoonde gebieden, zoals een boorplatform of bouwplaats. Eén van de acht cateringdoelgroepen."},

  {cat:"catering", term:"7 P's (catering)",
   def:"De zeven marketingmix-elementen voor catering: Product (maaltijden/dranken), Prijs (kostprijs/subsidie), Plaats (locatie/looproutes), Promotie (communicatie aanbod), Personeel/People (gastvrij, deskundig), Proces (routing, wachttijden) en Presentatie/Physical evidence (inrichting, sfeer)."},

  {cat:"catering", term:"Uitbesteden vs eigen beheer",
   def:"Voordelen uitbesteden: externe kennis, geen belasting eigen afdeling, collectieve inkoop, betere kostenbeheersing. Nadelen: kostbaar voor kleine organisaties (<50 medewerkers), afhankelijkheid van derden, verlies van kennis, monitoringskosten en management fee."},

  {cat:"catering", term:"Persona (catering)",
   def:"Visuele weergave van de doelgroep aan de hand van een fictief persoon. Doel: een eenduidig klantbeeld creëren, communicatie over klantbehoeften makkelijker maken en wensen en problemen beter begrijpen. Wordt door de FM'er gebruikt om klanten optimaal te faciliteren."},

  {cat:"catering", term:"Routing",
   def:"De gang van een product door de verschillende ruimten. Omvat vier logistieke stromen: goederenstroom, serviesstroom, afvalstroom en consumentenstroom. Plus de hygiënerouting: scheiding schoon/vuil, rauw/bereid en warm/koud."},

  {cat:"catering", term:"4 logistieke stromen",
   def:"De vier stromen in een cateringkeuken: Goederenstroom (ingrediënten → gereed product), Serviesstroom (vuil servies → schoon servies), Afvalstroom (verwerking resten en verpakkingen) en Consumentenstroom (looproute gasten)."},

  {cat:"catering", term:"Goederenstroom",
   def:"Één van de vier logistieke stromen in catering. Loopt van de aankomst van ingrediënten tot de uitgifte van het gereed product."},

  {cat:"catering", term:"Consumentenstroom",
   def:"De looproute van gasten door het restaurant. Eén van de vier logistieke stromen in catering. Bepaalt drukte, wachttijden en beleving."},

  {cat:"catering", term:"Vlekkenplan",
   def:"Eerste stap in de ruimtelijke indeling van een cateringkeuken. Grove indeling: wat komt waar. Hierbij worden primaire relaties (ruimtes die naast elkaar moeten) en antirelaties (ruimtes die niet naast elkaar mogen) vastgesteld."},

  {cat:"catering", term:"Wandenplan",
   def:"Tweede stap in de ruimtelijke indeling, na het vlekkenplan. Wanden worden geplaatst: welke ruimtes worden afgesloten?"},

  {cat:"catering", term:"Inrichtingsplan",
   def:"Derde en laatste stap in de ruimtelijke indeling. Een gedetailleerde tekening met de plaatsing van meubilair en apparatuur in elke ruimte."},

  {cat:"catering", term:"Kengetallen catering",
   def:"Normen voor ruimtelijke planning: bedrijfskeuken maximaal 1/3 van de totale ruimte, zitruimte 1,25 m² per zitplaats (krap), 1,40 m² (normaal) of 1,60 m² (bij bediening). Omdat niet alle tafels helemaal bezet zijn: × 120%."},

  {cat:"catering", term:"Correctie niet-volle tafels (catering)",
   def:"Niet alle tafels raken helemaal bezet, daarom reken je het benodigde aantal zitplaatsen × 120% (les 6, dia algemene kengetallen).",
   formula:"Zitplaatsen × 120%"},

  {cat:"catering", term:"HACCP",
   def:"Hazard Analysis and Critical Control Points. Verplicht voedselveiligheidssysteem op basis van de Europese Hygiëneverordening (2006). Elke cateringorganisatie moet een HACCP-plan en een branchespecifieke Hygiënecode hanteren."},

  {cat:"catering", term:"NVWA",
   def:"Nederlandse Voedsel en Waren Autoriteit. De toezichthoudende instantie die controleert of cateringorganisaties voldoen aan de hygiëne- en voedselveiligheidswetgeving, waaronder het HACCP-plan."},

  {cat:"catering", term:"Dieet",
   def:"Voorkeur, keuze, overtuiging of tijdelijke vermijding van bepaalde voedingsmiddelen. Het product kan wel gegeten worden, maar iemand kiest dit (tijdelijk) te vermijden. Geen medische noodzaak."},

  {cat:"catering", term:"Allergie",
   def:"Het lichaam reageert overgevoelig op bepaalde stoffen (allergenen). Klachten variëren van mild tot ernstig. Kan levensbedreigend zijn (bijv. pinda-allergie). Medisch van aard."},

  {cat:"catering", term:"Intolerantie",
   def:"Het lichaam verteert een bepaalde voedingsstof onvoldoende (bijv. lactose-intolerantie). Medisch van aard, maar niet levensbedreigend in tegenstelling tot een allergie."},

  {cat:"catering", term:"FIFO-systeem",
   def:"First In First Out. Principe waarbij het oudste product als eerste wordt gebruikt. Essentieel voor voedselveiligheid en het voorkomen van overschreden houdbaarheidsdatums."},

  {cat:"catering", term:"EU-Verordening 1169/2011 (Voedselinformatieverordening)",
   def:"Europese wet die aanbieders van voedsel verplicht om de aanwezigheid van 14 erkende allergenen kenbaar te maken aan de gast — zowel op verpakte producten (etiket) als bij onverpakt aangeboden voedsel (kaart, bord of mondeling met schriftelijke werkwijze)."},

  {cat:"catering", term:"14 verplichte allergenen",
   def:"Glutenbevattende granen, schaaldieren, eieren, vis, pinda's, soja, melk (incl. lactose), noten, selderij, mosterd, sesamzaad, sulfiet (>10 mg/kg), lupine en weekdieren. Vermelding is wettelijk verplicht (EU 1169/2011)."},

  {cat:"catering", term:"Kruisbesmetting (allergenen)",
   def:"Onbedoelde overdracht van een allergeen op een product dat dit allergeen niet als ingrediënt heeft, bijvoorbeeld via gedeeld snijgerei of werkvlak. Moet gemeld worden ('kan sporen bevatten van …') wanneer het risico niet is uitgesloten."},

  {cat:"catering", term:"Traceerbaarheid (EU 178/2002)",
   def:"Wettelijke verplichting voor levensmiddelenbedrijven om elke grondstof en elk product 'één stap terug en één stap vooruit' te kunnen traceren. Maakt snelle terugroepacties mogelijk bij een voedselveiligheidsincident."},

  {cat:"catering", term:"Lotnummer / batch-code",
   def:"Uniek nummer per productiebatch dat bij bereiding bewaard blijft. Onmisbaar voor traceerbaarheid: zonder lotnummer is een gerichte recall niet uitvoerbaar."},

  {cat:"catering", term:"Recall-procedure",
   def:"Vooraf vastgelegde werkwijze om besmet of onveilig voedsel terug te halen: wie meldt aan NVWA, hoe wordt de gast geïnformeerd, hoe wordt resterend product geblokkeerd en hoe wordt afgevoerd. Onderdeel van het HACCP-plan."},

  {cat:"catering", term:"10 kritische gevaren (catering)",
   def:"Tien meetpunten in het cateringproces: (1) kerntemperatuur bij ontvangst, (2) verpakking/etiket/THT, (3) temperatuur in opslag, (4) kerntemperatuur na bereiding, (5) temperatuur na assembleren, (6) terugkoeltijd en -temperatuur, (7) kerntemperatuur na regenereren, (8) kerntemperatuur tijdens uitgifte, (9) duur ongekoeld uitgifte, (10) temperatuur na distribueren en serveren."},

  {cat:"catering", term:"Kostprijsberekening catering",
   def:"Formule: ingrediënten + toeslag (richtlijn circa 25% voor dekking personeel, overhead en apparatuur) + vaste non-foodkosten per portie (servies, bestek, verpakking, schoonmaak; indicatie €0,25–€0,40, actualiseren aan de hand van eigen inkoopcijfers) + BTW 9%.",
   formula:"Ingrediënten + circa 25% toeslag + vaste non-food per portie + 9% BTW"},

  {cat:"catering", term:"Prijsbeleid catering",
   def:"Door de opdrachtgever vastgestelde methode voor berekening van de verkoopprijs op basis van vooraf vastgestelde uitgangspunten: inkoopprijs grondstoffen, jaarbudget catering, onderscheid luxe/sociaal pakket, bedrijfssubsidie en bedrijfsfilosofie."},

  {cat:"catering", term:"Opencalculatiecontract",
   def:"Cateringcontractvorm waarbij alle kosten volledig inzichtelijk zijn voor de opdrachtgever (openboek). Het financiële risico ligt bij de opdrachtgever."},

  {cat:"catering", term:"Vaste aanneemsomcontract",
   def:"Cateringcontractvorm waarbij een vaste prijs is afgesproken voor de hele opdracht of dienst. Het financiële risico ligt bij de opdrachtnemer."},

  {cat:"catering", term:"Prestatiecontract",
   def:"Cateringcontractvorm waarbij wordt afgerekend op resultaten, niet op uren of middelen. Het financiële risico ligt bij de opdrachtnemer."},

  {cat:"catering", term:"Commercieel contract",
   def:"Cateringcontractvorm waarbij de cateringpartij het volledige ondernemersrisico draagt en inkomsten haalt uit directe verkoop aan gebruikers (geen vergoeding van opdrachtgever)."},

  /* ══════════════════════════════════════════
     VEILIGHEIDSZORG (Les 9–12)
  ══════════════════════════════════════════ */
  {cat:"veiligheid", term:"Safety",
   def:"Veiligheid tegen fysieke en niet-opzettelijke risico's. Gericht op brandveiligheid, Arbo, BHV en interne veiligheidsplannen. Onderscheid van 'security' dat gaat om opzettelijk menselijk handelen."},

  {cat:"veiligheid", term:"Security",
   def:"Beveiliging tegen opzettelijk menselijk handelen gericht op schade aan middelen, informatie of personen. Denk aan bewaking, toegangscontrole en cameratoezicht. Verschilt van 'safety' dat gaat om niet-opzettelijke risico's."},

  {cat:"veiligheid", term:"Arbo (3 dimensies)",
   def:"De Arbeidsomstandighedenwet richt zich op drie dimensies: Veiligheid (veilige middelen en instructies), Welzijn (prettig werkklimaat, autonomie) en Gezondheid (ergonomie, werkhouding, voorkomen arbeidsgerelateerde ziekten)."},

  {cat:"veiligheid", term:"Arbo-catalogus",
   def:"Document waarin werkgevers en werknemers op eigen initiatief beschrijven hoe zij voldoen aan de doelvoorschriften van de overheid voor gezond en veilig werken. Minder regels, meer eigen verantwoordelijkheid."},

  {cat:"veiligheid", term:"BHV (Bedrijfshulpverlening)",
   def:"Elke werkgever is verplicht minimaal één BHV-er aan te wijzen. Vier kerntaken: (1) EHBO, (2) brand beperken en bestrijden, (3) ontruiming van het gebouw, (4) communicatie bij incident met intern en hulpdiensten."},

  {cat:"veiligheid", term:"RI&E (Risico Inventarisatie & Evaluatie)",
   def:"Het continu en systematisch doorlopen van de organisatie op risico's, met als doel de gevolgen te verminderen en de kans te verkleinen. Drie stappen: (1) Inventarisatie — alle risico's identificeren, (2) Evaluatie — risico's kwantificeren en sorteren op prioriteit, (3) Plan van Aanpak — beheersmaatregelen bepalen."},

  {cat:"veiligheid", term:"Risico = Kans × Schade",
   def:"De basisformule voor risicobeoordeling. Risico's zijn niet te meten maar wel in te schatten op basis van kans dat een incident optreedt en de schade die het veroorzaakt.",
   formula:"Risico = Kans × Schade"},

  {cat:"veiligheid", term:"Risicomatrix (4 kwadranten)",
   def:"Heatmap met kans en schade. Kwadrant 1 (kleine kans, hoge schade): verzekeren (calamiteitenrisico, bijv. brand en inboedel). Kwadrant 2 (grote kans, hoge schade): vermijden, want niet te verzekeren en preventie is niet voldoende. Kwadrant 3 (kleine kans, lage schade): aanvaarden, zelf het financiële risico dragen. Kwadrant 4 (grote kans, lage schade): beveiligen/schade beperken met OBE-maatregelen."},

  {cat:"veiligheid", term:"OBE-maatregelen",
   def:"Driedeling van beveiligingsmaatregelen: O = Organisatorisch (procedures, bewustwording, bewaking), B = Bouwkundig (situering, hang- en sluitwerk, slagbomen) en E = Elektrotechnisch (alarmsystemen, toegangscontrole, camerabewaking)."},

  {cat:"veiligheid", term:"Organisatorische maatregel (O)",
   def:"Beveiligingsmaatregel in de OBE-driedeling. Voorbeelden: procedures en protocollen, aanwezigheid beveiliging, bewustwording medewerkers en incidentenregistratie."},

  {cat:"veiligheid", term:"Bouwkundige maatregel (B)",
   def:"Beveiligingsmaatregel in de OBE-driedeling. Voorbeelden: situering van werkplekken, hang- en sluitwerk met SKG-keurmerk, meeneembeperkende maatregelen en slagbomen/rolluiken."},

  {cat:"veiligheid", term:"Elektrotechnische maatregel (E)",
   def:"Beveiligingsmaatregel in de OBE-driedeling. Voorbeelden: alarmsystemen, toegangscontrolesystemen, camerabewaking en brandmeld- en ontruimingssystemen."},

  {cat:"veiligheid", term:"Plantoetsingscriteria (8)",
   def:"Acht criteria voor het beoordelen van de veiligheid van een ruimtelijk plan of gebouw: attractiviteit van de omgeving, toegankelijkheid/vluchtwegen, aantrekkelijkheid van het doelwit, aanwezigheid potentiële daders, aanwezigheid sociale ogen (toezicht), betrokkenheid/verantwoordelijkheidsgevoel, fysieke kwetsbaarheid van het doelwit en zichtbaarheid."},

  {cat:"veiligheid", term:"Sociale onveiligheid",
   def:"Omvat drie uitingsvormen: (1) persoonsgerichte criminaliteit (schade aan persoon of eigendom), (2) overlast (rondhangend gedrag, vandalisme, bedreigingen) en (3) subjectieve onveiligheid (gevoel van onveiligheid zonder concreet incident)."},

  {cat:"veiligheid", term:"Objectieve onveiligheid",
   def:"De feitelijke onveiligheid op basis van daadwerkelijke slachtoffers en geregistreerde incidenten. Meetbaar en aantoonbaar."},

  {cat:"veiligheid", term:"Subjectieve onveiligheid",
   def:"Het gevoel van onveiligheid zonder dat er sprake is van een concreet incident of daadwerkelijk slachtofferschap. Psychologisch van aard, maar ook een aandachtspunt voor de FM'er."},

  {cat:"veiligheid", term:"Externe veiligheid",
   def:"Het beheersen van risico's voor de omgeving bij productie, vervoer, opslag en gebruik van gevaarlijke stoffen. Publiek domein: coördinatie door ministerie van Infrastructuur en Waterstaat. Privaat domein: veiligheids- en/of milieucoördinator."},

  {cat:"veiligheid", term:"PvE security",
   def:"Set van criteria, passend binnen het wettelijk kader, waaraan een beveiligingsmaatregel moet voldoen. Maakt vaak deel uit van een omvangrijker PvE (bijv. bij bouw- of verbouwprojecten)."},

  {cat:"veiligheid", term:"BCM (Business Continuity Management)",
   def:"Beheer van de continuïteit van de kritieke (primaire) bedrijfsprocessen. Gericht op risico's die een plotselinge en ernstige verstoring kunnen veroorzaken, met preventieve, repressieve en correctieve maatregelen. Omvat ook het uitwijkplan (alternatieve locatie of werkwijze bij calamiteit). Eén van de belangrijkste trends in FM."},

  {cat:"veiligheid", term:"Veiligheidsmanagementproces (8 stappen)",
   def:"De acht stappen zijn: (1) Strategische oriëntatie, (2) Risico-inventarisatie safety & security, (3) Risico-evaluatie safety & security, (4) Formuleren veiligheidszorgbeleid, (5) Ontwerpen, implementeren en onderhouden VZG-systeem, (6) Maatregelen nemen (OBE), (7) Periodieke controle, (8) Verstrekking informatie aan management."},

  {cat:"veiligheid", term:"K-A-M-V",
   def:"De vier domeinen van Integrale Veiligheidszorg: Kwaliteitsmanagement, Arbobeleid, Milieumanagement en Veiligheidsmanagement. Geïntegreerd zorgt dit voor minder procedures, minder coördinatielast en een efficiëntere aanpak dan wanneer elk domein apart opereert."},

  {cat:"veiligheid", term:"Integrale Veiligheidszorg",
   def:"De hele organisatie beveiligen tegen alle bedreigingen die als reëel worden beschouwd, door een pakket van maatregelen dat regelmatig wordt gecontroleerd en geëvalueerd. Vier K-A-M-V-domeinen worden geïntegreerd aangestuurd."},

  {cat:"veiligheid", term:"Calamiteitenplan (6 deelplannen)",
   def:"Het bedrijfsnood- of calamiteitenplan bestaat uit zes deelplannen: (1) BHV-plan, (2) Beveiligings-/securityplan (OBE voor opzettelijke incidenten), (3) Veiligheids-/safetyplan (niet-opzettelijke incidenten), (4) Ontruimings-/evacuatieplan (Besluit bouwwerken leefomgeving + Arbowet), (5) Aanvalsplan brandweer en (6) Informatie-securityplan."},

  {cat:"veiligheid", term:"BHV-plan",
   def:"Deelplan 1 van het calamiteitenplan. Beschrijft de vier BHV-kerntaken: EHBO, brand beperken en bestrijden, ontruiming en communicatie bij incident. Verplicht voor elke werkgever."},

  {cat:"veiligheid", term:"Ontruimings-/evacuatieplan",
   def:"Deelplan 4 van het calamiteitenplan. Wettelijk kader: Besluit bouwwerken leefomgeving (Bbl, sinds 2024 onder de Omgevingswet) en Arbowet. Wordt getoetst door de brandweer en de arbeidsinspectie."},

  {cat:"veiligheid", term:"Aanvalsplan brandweer",
   def:"Deelplan 5 van het calamiteitenplan. Bevat informatie over bluswater, brandmeldcentrale, aanrijdroutes en opslag van gevaarlijke stoffen. Wordt in overleg met de brandweer opgesteld."},

  {cat:"veiligheid", term:"Informatie-securityplan",
   def:"Deelplan 6 van het calamiteitenplan. Richt zich op preventie van fraude (intern), beveiliging van bedrijfsgegevens, uitwijkmogelijkheden (ICT), herstelplannen en antivirusmaatregelen."},

  {cat:"veiligheid", term:"Cybercrime",
   def:"Elke misdaad die wordt gefaciliteerd of gepleegd met gebruik van een computer, netwerk of hardware device. Twee typen: Type I (vooral technologisch, bijv. phishing, hacking, malware) en Type II (meer uitgesproken menselijke factor, bijv. cyberstalking, afpersing)."},

  {cat:"veiligheid", term:"Cybercrime Type I",
   def:"Cybercrime dat voornamelijk technologisch van aard is, meestal een losse gebeurtenis met malware. Voorbeelden (indeling Gordon & Ford; de les noemt zelf geen voorbeelden): phishing, identiteits- of datadiefstal, bankfraude, hacking."},

  {cat:"veiligheid", term:"Cybercrime Type II",
   def:"Cybercrime met een meer uitgesproken menselijke factor, vaak herhaald contact met het slachtoffer. Voorbeelden (indeling Gordon & Ford): cyberstalking, intimidatie, afpersing en chantage, bedrijfsspionage."},

  {cat:"veiligheid", term:"EC3",
   def:"Europol's European CyberCrime Center. Europese instantie die de opsporing van cybercriminaliteit coördineert tussen de EU-lidstaten."},

  {cat:"veiligheid", term:"NCSC",
   def:"Nationaal Cyber Security Centrum. Volgens de les gericht op de rijksoverheid en de vitale infrastructuur. Sinds 1 januari 2026 is het DTC opgegaan in het NCSC, dat nu het aanspreekpunt is voor alle Nederlandse organisaties."},

  {cat:"veiligheid", term:"DTC (Digital Trust Centre)",
   def:"Digital Trust Center. Volgens de les gericht op ondernemers. Taken: response (monitoren, waarschuwen, adviseren), weerbaarder maken (bewust worden, kennis overdragen) en samenwerken per regio, branche of sector. Sinds 1 januari 2026 opgegaan in het NCSC."},

  {cat:"veiligheid", term:"Veiligheidscultuur",
   def:"Alle aspecten van de organisatiecultuur die impact hebben op houding en gedrag in relatie tot het vergroten of verkleinen van risico's. Drie niveaus: (1) zichtbaar/tastbaar, (2) uitgesproken meningen, (3) impliciet/onzichtbaar."},

  {cat:"veiligheid", term:"Niveau 1 — zichtbaar/tastbaar",
   def:"Het zichtbare niveau van veiligheidscultuur. Voorbeelden: slogans, posters, procedures, persoonlijke beschermingsmiddelen, incidentenrapportages en functiebeschrijvingen. Direct waarneembaar en meetbaar."},

  {cat:"veiligheid", term:"Niveau 2 — uitgesproken meningen",
   def:"Het tweede niveau van veiligheidscultuur: wat mensen zeggen over veiligheid. Voorbeelden: statements in vergaderingen en rechtvaardigingen vastgelegd in notulen."},

  {cat:"veiligheid", term:"Niveau 3 — impliciet/onzichtbaar",
   def:"Het diepste niveau van veiligheidscultuur: onderliggende aannames en overtuigingen die alleen via observatie zijn af te leiden. Voorbeelden: onuitgesproken verwachtingen over 'zo doen wij dat hier'."}

];

/* Flashcards = zelfde dataset */
BVFMB.flashcards = BVFMB.begrippen;
