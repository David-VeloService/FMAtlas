/* Basis van FM A — data voor begrippen en flashcards */

window.BVFMA = window.BVFMA || {};

/* ─── Categorieën ─────────────────────────── */
BVFMA.cats = [
  { key:"basisprincipes", label:"Basisprincipes FM",            short:"Basis",        color:"#3b82f6" },
  { key:"dienstverlening", label:"Dienstverlening & processen", short:"Diensten",     color:"#10b981" },
  { key:"huisvesting",    label:"Huisvesting & werkplekken",    short:"Huisvesting",  color:"#f59e0b" },
  { key:"hospitality",    label:"Hospitality & gastvrijheid",   short:"Hospitality",  color:"#8b5cf6" },
  { key:"inkoop",         label:"Inkoop & kwaliteit",           short:"Inkoop",       color:"#ef4444" },
];

/* ─── Begrippen ─────────────────────────── */
BVFMA.begrippen = [
  /* 1. Basisprincipes FM */
  {cat:"basisprincipes", term:"Facility management", def:"Zorgen dat mensen hun werk beter kunnen doen door een fit-for-use omgeving te realiseren — afgestemd op de wensen en behoeften van de organisatie."},
  {cat:"basisprincipes", term:"Interne klant", def:"Medewerkers van de organisatie die gebruik maken van de facilitaire diensten."},
  {cat:"basisprincipes", term:"Externe klant", def:"Klanten van buiten de organisatie, zoals bezoekers of patiënten. Niet te verwarren met de interne klant (medewerkers)."},
  {cat:"basisprincipes", term:"Soft services", def:"Facilitaire diensten gericht op mensen, zoals catering, schoonmaak, beveiliging en receptie."},
  {cat:"basisprincipes", term:"Hard services", def:"Facilitaire diensten gericht op gebouwen en installaties, zoals onderhoud, verbouwingen en verduurzaming."},
  {cat:"basisprincipes", term:"Facilitaire rollen", def:"Vier hoofdrollen in FM: (1) Facility manager – geeft sturing en draagt eindverantwoordelijkheid. (2) Specialist – diepgaande kennis van één onderdeel. (3) Adviseur – ingeschakeld bij complexe vraagstukken. (4) Ondernemer – breed en zelfstandig, gericht op winst."},
  {cat:"basisprincipes", term:"Single service provider", def:"Bedrijf dat gespecialiseerd is in precies één facilitaire dienst (bijv. alleen schoonmaak)."},
  {cat:"basisprincipes", term:"Multi service provider", def:"Bedrijf dat meerdere facilitaire diensten aanbiedt onder één dak."},
  {cat:"basisprincipes", term:"Integrated service provider", def:"Bedrijf dat zorgt voor complete facilitaire ontzorging: alle diensten worden geïntegreerd aangeboden."},
  {cat:"basisprincipes", term:"Toegevoegde waarde van FM", def:"FM levert 12 vormen van waarde: tevredenheid, productiviteit, kosten, risico's, MVO, duurzaamheid, imago, cultuur, flexibiliteit, innovatie, vitaliteit en waardestijging vastgoed."},

  /* 2. Dienstverlening & processen */
  {cat:"dienstverlening", term:"Proces", def:"Een opvolging van afhankelijke activiteiten met een begin, een eind en een duidelijk omschreven input en output. Drie stappen: input (mensen/middelen) → throughput (verwerking) → output (resultaat)."},
  {cat:"dienstverlening", term:"Primair proces", def:"De kernactiviteit van een organisatie. Facility management ondersteunt dit proces maar voert het zelf niet uit."},
  {cat:"dienstverlening", term:"KSF (Kritische Succesfactor)", def:"Kwalitatieve factor die beschrijft waarin een organisatie of dienst moet uitblinken om haar doel te behalen. Richtinggevend, niet zelf meetbaar — vraagt om vertaling naar KPI's."},
  {cat:"dienstverlening", term:"KPI (Kritieke Prestatie Indicator)", def:"Meetbaar getal dat aangeeft of een KSF wordt gerealiseerd. Een goede KPI is SMART (Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden)."},
  {cat:"dienstverlening", term:"SLA (Service Level Agreement)", def:"Schriftelijke afspraak (dienstverleningsovereenkomst) tussen leverancier en afnemer over wat geleverd wordt, op welk niveau, tegen welke prijs, gemeten via welke KPI's en met welke gevolgen bij overschrijding."},
  {cat:"dienstverlening", term:"NEN 2748", def:"Nederlandse norm die facilitaire kosten en prestaties indeelt in vijf hoofdrubrieken: huisvesting, diensten en middelen, ICT, externe voorzieningen en facility management. Maakt benchmarking tussen FM-organisaties mogelijk."},
  {cat:"dienstverlening", term:"Schillenmodel", def:"Concentrische voorstelling van een organisatie: in het hart het primaire proces, daaromheen schillen van direct ondersteunende processen, algemeen ondersteunende diensten (waaronder FM) en management/strategie. Hoe verder van de kern, hoe makkelijker uit te besteden."},
  {cat:"dienstverlening", term:"Sourcingmodel", def:"Keuze hoe een dienst geleverd wordt: in-house (zelf doen), out-tasking (losse taak uitbesteden, regie blijft intern), outsourcing (volledige dienst extern, sturen via SLA) of co-sourcing (gedeeld eigenaarschap)."},
  {cat:"dienstverlening", term:"Regiefunctie", def:"Interne FM-rol die de externe leveranciers aanstuurt en de SLA en KPI's bewaakt. Onmisbaar bij outsourcing: zonder regie verliest de organisatie grip op kwaliteit en kosten."},
  {cat:"dienstverlening", term:"R-ladder", def:"Circulair-economiemodel met 6 treden: Refuse/Rethink → Reduce → Reuse → Repair/Refurbish/Remanufacture → Recycle → Recover. Van meest duurzaam naar minst duurzaam."},
  {cat:"dienstverlening", term:"Facilitaire servicedesk", def:"Centraal aanspreekpunt van het facilitair bedrijf. Verwerkt meldingen (reserveringen, klachten, aanvragen) via selfservice, telefoon, balie of chatbot."},
  {cat:"dienstverlening", term:"BHV (Bedrijfshulpverlening)", def:"Verplichte organisatie voor noodsituaties: eerste hulp verlenen, beginnende brand bestrijden, medewerkers evacueren. Gebaseerd op de RI&E."},
  {cat:"dienstverlening", term:"RI&E (Risico-Inventarisatie & -Evaluatie)", def:"Verplicht instrument om risico's voor veiligheid en gezondheid op de werkplek in kaart te brengen en te beoordelen."},
  {cat:"dienstverlening", term:"Seamless security", def:"Trend waarbij technologie onopvallend wordt ingezet om veiligheid te waarborgen zonder het gevoel van gastvrijheid te verstoren."},
  {cat:"dienstverlening", term:"Crowd management vs. crowd control", def:"Crowd management = planning en organisatie van bezoekersstromen (proactief). Crowd control = beheersing van gedrag en veiligheid op het moment zelf (reactief)."},
  {cat:"dienstverlening", term:"Inspanningsgericht vs. resultaatgericht contract (schoonmaak)", def:"Inspanningsgericht: alles wordt volgens vaste instructies schoongemaakt. Resultaatgericht: er wordt alleen schoongemaakt als dat nodig is, gemeten via reinheidsgraad."},

  /* 3. Huisvesting & werkplekken */
  {cat:"huisvesting", term:"BVO (Bruto vloeroppervlak)", def:"Totale oppervlakte van alle verdiepingen, gemeten vanaf de buitenkant van de gevels, inclusief muren, gangen en trappenhuizen. Grootste oppervlaktemaat."},
  {cat:"huisvesting", term:"NVO (Netto vloeroppervlak)", def:"BVO minus bouwdelen en ruimtes lager dan 1,5 meter."},
  {cat:"huisvesting", term:"FNO (Functioneel nuttig vloeroppervlak)", def:"Alleen de bruikbare ruimte voor het primaire proces, exclusief indelingsverlies. Kleinste nuttige oppervlaktemaat."},
  {cat:"huisvesting", term:"Flexfactor", def:"Aantal werkplekken gedeeld door het aantal fte's. Een waarde onder 1 duidt op flexibel werken; bij ABW daalt de flexfactor verder."},
  {cat:"huisvesting", term:"Activiteitgebonden werken (ABW)", def:"Werkplekconcept waarbij medewerkers zelf kiezen welke werkplek past bij hun activiteit: concentratie, overleg of ontspanning. Vereist mix van ruimtetypen."},
  {cat:"huisvesting", term:"Hybride werken / TPAW", def:"Tijd-, Plaats- en Apparaatonafhankelijk Werken. Medewerkers werken deels op locatie, deels op afstand. Technologie speelt een sleutelrol."},
  {cat:"huisvesting", term:"Clean desk policy", def:"Beleid waarbij medewerkers na gebruik hun werkplek volledig opgeruimd achterlaten, zodat anderen de plek direct kunnen gebruiken."},
  {cat:"huisvesting", term:"Programma van eisen (PvE) — huisvesting", def:"Document dat de functionele, ruimtelijke en esthetische wensen en eisen van de organisatie beschrijft als basis voor huisvestingsinrichting. Drie stappen: functioneel PvE → ruimtelijk PvE → ruimtelijk ontwerp."},
  {cat:"huisvesting", term:"Vlekkenplan", def:"Eerste ontwerpstap: schematische plattegrond waarbij functies als 'vlekken' worden weergegeven op basis van gevraagde oppervlakte, relaties en beschikbare ruimte."},
  {cat:"huisvesting", term:"Wandenplan", def:"Tweede ontwerpstap, na het vlekkenplan: de vlekken worden uitgewerkt tot daadwerkelijke ruimtes door wanden te plaatsen. Bepaalt definitieve afmetingen en doorgangen per ruimte."},
  {cat:"huisvesting", term:"Inrichtingsplan", def:"Derde en laatste ontwerpstap: per ruimte wordt het meubilair, de werkplekken en de verdere inrichting ingetekend. Output is de uitvoeringstekening voor de huisvesting."},
  {cat:"huisvesting", term:"Relatiediagram", def:"Schema dat de relaties tussen functies in kaart brengt: primair (p) = sterke relatie, secundair (s) = minder sterk, anti-relatie (a) = moeten juist niet naast elkaar."},

  /* 4. Hospitality & gastvrijheid */
  {cat:"hospitality", term:"Hospitality", def:"Het bieden van oprechte aandacht, veiligheid en comfort aan klanten. Draait om de wisselwerking tussen gast en medewerker. Altijd maatwerk, passend bij de context van de organisatie."},
  {cat:"hospitality", term:"Beleveniseconomie", def:"Trend waarbij beleving steeds centraler staat in dienstverlening — ook buiten de horeca. Aanleiding voor een groeiende aandacht voor hospitality in FM."},
  {cat:"hospitality", term:"Drie dimensies van gastvrijheid (Pijls)", def:"(1) Inviting – welkom voelen, uitnodiging. (2) Care – zorg en service tijdens het verblijf. (3) Comfort – een prettige, aangename omgeving."},
  {cat:"hospitality", term:"Guest journey / customer journey", def:"Visualisatie van alle contactmomenten van een klant: onderweg (bereikbaarheid), aankomst (ontvangst), verblijf (service, omgeving), vertrek (nazorg)."},
  {cat:"hospitality", term:"Touchpoints", def:"Momenten van interactie tussen klant en organisatie, zoals gedrag van medewerkers, gebruik van werkplekken, digitale processen en services."},
  {cat:"hospitality", term:"Persona", def:"Fictief klantprofiel gebaseerd op onderzoek, dat inzicht geeft in motieven, behoeften en werkstijlen van een gebruikersgroep. Hulpmiddel bij het ontwerpen van dienstverlening."},
  {cat:"hospitality", term:"Service design thinking", def:"Methode om services te ontwikkelen vanuit klantperspectief. Vijf stappen: empathize (inleven) → define → ideate → prototype → test. Iteratief proces."},
  {cat:"hospitality", term:"Tolerantiezone", def:"Het verschil tussen gewenste en acceptabele kwaliteit. Door stijgende verwachtingen wordt deze zone steeds kleiner: wat vroeger luxe was, is nu standaard."},
  {cat:"hospitality", term:"Scripting", def:"Vaste gedrags- en communicatieroutines die medewerkers houvast geven om gastvrij te handelen, met ruimte voor persoonlijke interpretatie en authenticiteit."},
  {cat:"hospitality", term:"Klanttypen (Zweeds onderzoek)", def:"Andersson (50%): wil uitgebreide informatie en duidelijke procedures. Svensson (25%): verwacht dat de basis op orde is. Hansson (25%): regelt zaken impulsief en ter plekke."},

  /* 5. Inkoop & kwaliteit */
  {cat:"inkoop", term:"Facilitaire inkoop", def:"Het selecteren en contracteren van leveranciers voor producten en diensten die niet direct bijdragen aan het primaire proces, zoals catering, schoonmaak en huisvesting."},
  {cat:"inkoop", term:"Make-or-buy beslissing", def:"Afweging of een dienst intern wordt uitgevoerd (make), uitbesteed (buy) of gecombineerd. Afwegingscriteria: impact op primair proces, kwalitatieve meerwaarde, financieel voordeel en MVO."},
  {cat:"inkoop", term:"Cyclisch inkoopproces (4 fasen)", def:"Fase 1: inkoopanalyse & strategie. Fase 2: inkoop & contracteren. Fase 3: implementatie. Fase 4: beheer (operationele inkoop + contractmanagement). Na afloop start het proces opnieuw."},
  {cat:"inkoop", term:"Verantwoordelijk opdrachtgeverschap", def:"Als facilitaire opdrachtgever blijf je eindverantwoordelijk voor kwaliteit en arbeidsomstandigheden, ook als de uitvoering is uitbesteed."},
  {cat:"inkoop", term:"Kraljic-matrix", def:"Model met vier productcategorieën op basis van impact en risico: (1) Hefboom – hoog impact, laag risico → concurrentiestelling. (2) Strategisch – hoog impact, hoog risico → partnerschap. (3) Routine – laag impact, laag risico → raamcontracten. (4) Knelpunt – laag impact, hoog risico → leveringszekerheid."},
  {cat:"inkoop", term:"MVOI (Maatschappelijk Verantwoord Opdrachtgeven en Inkopen)", def:"Duurzaam en sociaal inkopen. De overheid is aanjager met een inkoopvolume van 85 miljard euro per jaar. Vraagt betrokkenheid van de hele organisatie."},
  {cat:"inkoop", term:"Europees aanbesteden", def:"Verplichte aanbestedingsprocedure boven bepaalde drempelbedragen bij overheidsopdrachten. Beginselen: gelijke behandeling, non-discriminatie, transparantie en proportionaliteit."},
  {cat:"inkoop", term:"Kwaliteitsmanagement (PDCA)", def:"Continue verbetering via Plan-Do-Check-Act: zeg wat je doet, doe wat je zegt, toon aan dat je doet wat je zegt. Basis van ISO 9001."},
  {cat:"inkoop", term:"ISO 9001", def:"Internationale norm voor kwaliteitsmanagementsystemen. Kernprincipe: Plan-Do-Check-Act cyclus (PDCA). Toont aan dat een organisatie consequent voldoet aan kwaliteitseisen."},
  {cat:"inkoop", term:"Risicomanagement (ISO 31000)", def:"Systematisch proces van herkennen, analyseren, beoordelen en beheersen van risico's. Pas effectief als het verweven is met de processen van de organisatie."},
];

/* ─── Flashcards (= begrippen hergebruikt) ──── */
BVFMA.flashcards = BVFMA.begrippen;
