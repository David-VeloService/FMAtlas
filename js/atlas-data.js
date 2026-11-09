/* FM Atlas: alle vakken en hun onderdelen.
 * Eén object per vak. `periods` = de periodes waarin het vak loopt (een praktijkproject loopt
 * over P1 en P2). `leren`, `oefenen` en `toetsen` zijn de drie kolommen op de vakpagina.
 * Een vak zonder onderdelen toont "stof volgt".
 */
window.ATLAS_HUIDIG = { year: 2, period: 2 };

window.ATLAS_VAKKEN = [
  // ── Jaar 2 · periode 2 ─────────────────────────────
  {
    key: 'facilitair-verandermanagement', code: 'FACVMM01',
    title: 'Facilitair verandermanagement',
    sub: 'IOV-model · niveaus van verandering · verandervermogen · veranderplan',
    year: 2, periods: [2], icon: 'shift',
    leren: [], oefenen: [], toetsen: [],
  },
  {
    key: 'facilitaire-economie-veranderingen', code: 'WPMBEC01',
    title: 'Facilitaire economie bij veranderingen',
    sub: 'Businesscase in zes stappen · kasstromen · terugverdientijd · NCW',
    year: 2, periods: [2], icon: 'coin',
    leren: [], oefenen: [], toetsen: [],
  },

  // ── Jaar 2 · periode 1 ─────────────────────────────
  {
    key: 'huisvesting', title: 'Huisvesting',
    sub: 'Mensgericht huisvesten · bouwkunde · PvE en ruimteplanning · MJOP',
    year: 2, periods: [1], icon: 'building',
    leren: [
      ['Samenvatting', 'huisvesting-samenvatting.html', 'book'],
      ['Begrippenlijst', 'huisvesting-begrippen.html', 'list'],
      ['Lesvideo\'s', 'huisvesting-video.html', 'play'],
    ],
    oefenen: [
      ['Flashcards', 'huisvesting-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=huisvesting', 'check'],
    ],
    toetsen: [
      ['Oefentoets 1 · week 1 t/m 3', 'huisvesting-oefentoets.html', 'quiz'],
      ['Oefentoets 2 · week 4 t/m 7', 'huisvesting-oefentoets-2.html', 'quiz'],
      ['Proeftentamen · hele stof', 'huisvesting-oefentoets-3.html', 'quiz'],
      ['Oefenvragen van de docent', 'huisvesting-oefentoets-4.html', 'quiz'],
      ['Oefentoets 5 · masterniveau', 'huisvesting-oefentoets-5.html', 'quiz'],
      ['Oefentoets 6 · inzicht met afbeeldingen', 'huisvesting-oefentoets-6.html', 'quiz'],
      ['Toetsing en beoordeling', 'huisvesting-toetsing.html', 'info'],
    ],
  },
  {
    key: 'facilitaire-bedrijfskunde', title: 'Facilitaire bedrijfskunde',
    sub: '7S-model · strategie, structuur, personeel en cultuur · ondernemingsrecht',
    year: 2, periods: [1], icon: 'chart',
    leren: [
      ['Samenvatting', 'facilitaire-bedrijfskunde-samenvatting.html', 'book'],
      ['Begrippenlijst', 'facilitaire-bedrijfskunde-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'facilitaire-bedrijfskunde-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=facilitaire-bedrijfskunde', 'check'],
    ],
    toetsen: [
      ['Oefentoets 1 · kennis en herkennen', 'facilitaire-bedrijfskunde-oefentoets.html', 'quiz'],
      ['Oefentoets 2 · casustoets 7S', 'facilitaire-bedrijfskunde-oefentoets-2.html', 'quiz'],
      ['Oefentoets 3 · casustoets met recht', 'facilitaire-bedrijfskunde-oefentoets-3.html', 'quiz'],
      ['Toetsing en beoordeling', 'facilitaire-bedrijfskunde-toetsing.html', 'info'],
    ],
  },
  {
    key: 'fm-tech', title: 'FM Tech',
    sub: 'Technologieadoptie · benchmark · workshops · technologieadvies',
    year: 2, periods: [1], icon: 'bolt',
    leren: [
      ['Samenvatting', 'fm-tech-samenvatting.html', 'book'],
      ['Begrippenlijst', 'fm-tech-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'fm-tech-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=fm-tech', 'check'],
    ],
    toetsen: [
      ['Kennisquiz FM Tech', 'fm-tech-oefentoets.html', 'quiz'],
      ['Oefening adviesgesprek', 'fm-tech-oefentoets-2.html', 'chat'],
      ['Toetsing en beoordeling', 'fm-tech-toetsing.html', 'info'],
    ],
  },

  // ── Jaar 1 ─────────────────────────────────────────
  {
    key: 'basis-van-fm-a', title: 'Basis van FM A',
    sub: 'FM-basisprincipes · dienstverlening · huisvesting',
    year: 1, periods: [1], icon: 'compass',
    leren: [
      ['Samenvatting', 'bvfma-samenvatting.html', 'book'],
      ['Begrippenlijst', 'bvfma-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'bvfma-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=bvfma', 'check'],
    ],
    toetsen: [],
  },
  {
    key: 'trendwatchers', title: 'Trendwatchers',
    sub: 'DESTEP · trends · impact op FM',
    year: 1, periods: [1], icon: 'scope',
    leren: [
      ['Samenvatting', 'trendwatchers-samenvatting.html', 'book'],
      ['Begrippenlijst', 'trendwatchers-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'trendwatchers-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=trendwatchers', 'check'],
    ],
    toetsen: [],
  },
  {
    key: 'basis-van-fm-b', title: 'Basis van FM B',
    sub: 'Schoonmaak · catering · veiligheidszorg',
    year: 1, periods: [2], icon: 'building',
    leren: [
      ['Samenvatting', 'bvfmb-samenvatting.html', 'book'],
      ['Begrippenlijst', 'bvfmb-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'bvfmb-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=bvfmb', 'check'],
    ],
    toetsen: [],
  },
  {
    key: 'facilitaire-bedrijfseconomie', title: 'Facilitaire bedrijfseconomie',
    sub: 'Investeren · terugverdientijd · kostprijs',
    year: 1, periods: [1, 2], icon: 'coin',
    leren: [
      ['Samenvatting', 'bedrijfseconomie-samenvatting.html', 'book'],
      ['Begrippenlijst', 'bedrijfseconomie-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'bedrijfseconomie-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=bedrijfseconomie', 'check'],
    ],
    toetsen: [],
  },
  {
    key: 'eventmanagement1', title: 'Eventmanagement 1',
    sub: 'Projectmanagement (Grit) · projectvaardigheden',
    year: 1, periods: [3], icon: 'event',
    leren: [
      ['Samenvatting', 'em1-samenvatting.html', 'book'],
      ['Begrippenlijst', 'em1-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'em1-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=em1', 'check'],
    ],
    toetsen: [
      ['Oefentoets 1', 'em1-oefentoets.html', 'quiz'],
      ['Oefentoets 4 · extra moeilijk', 'em1-oefentoets-2.html', 'quiz'],
      ['Oefentoets 5 · tentamenformat', 'em1-oefentoets-3.html', 'quiz'],
    ],
  },
  {
    key: 'facilitaire-inkoop', title: 'Facilitaire inkoop',
    sub: 'Inkoopmanagement · verbintenissenrecht',
    year: 1, periods: [3], icon: 'cart',
    leren: [
      ['Samenvatting inkoop', 'inkoop-samenvatting.html', 'book'],
      ['Begrippenlijst inkoop', 'inkoop-begrippen.html', 'list'],
      ['Samenvatting recht', 'recht-samenvatting.html', 'book'],
      ['Begrippenlijst recht', 'recht-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards inkoop', 'inkoop-flashcards.html', 'cards'],
      ['Begrippentoets inkoop', 'begrippentoets.html?vak=inkoop', 'check'],
      ['Flashcards recht', 'recht-flashcards.html', 'cards'],
      ['Begrippentoets recht', 'begrippentoets.html?vak=recht', 'check'],
    ],
    toetsen: [],
  },
  {
    key: 'evenementenlogistiek', title: 'Evenementenlogistiek',
    sub: 'Eventmanagement 2 · schillenmodel · site design',
    year: 1, periods: [4], icon: 'event',
    leren: [
      ['Samenvatting', 'evenementenlogistiek-samenvatting.html', 'book'],
      ['Begrippenlijst', 'evenementenlogistiek-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'evenementenlogistiek-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=evenementenlogistiek', 'check'],
    ],
    toetsen: [
      ['Oefentoets 1 · evenementenlogistiek', 'evenementenlogistiek-oefentoets.html', 'quiz'],
      ['Oefentoets 2 · eventmanagement 2', 'evenementenlogistiek-oefentoets-2.html', 'quiz'],
      ['Oefentoets 3 · eventmanagement 2', 'evenementenlogistiek-oefentoets-3.html', 'quiz'],
    ],
  },
  {
    key: 'projectvaardigheden', title: 'Projectvaardigheden',
    sub: 'Eventmanagement 2 · observeren · interviewen',
    year: 1, periods: [4], icon: 'mic',
    leren: [
      ['Samenvatting', 'projectvaardigheden-samenvatting.html', 'book'],
      ['Begrippenlijst', 'projectvaardigheden-begrippen.html', 'list'],
    ],
    oefenen: [
      ['Flashcards', 'projectvaardigheden-flashcards.html', 'cards'],
      ['Begrippentoets', 'begrippentoets.html?vak=projectvaardigheden', 'check'],
    ],
    toetsen: [
      ['Oefentoets 2 · eventmanagement 2', 'evenementenlogistiek-oefentoets-2.html?from=projectvaardigheden', 'quiz'],
      ['Oefentoets 3 · eventmanagement 2', 'evenementenlogistiek-oefentoets-3.html?from=projectvaardigheden', 'quiz'],
    ],
  },
];
