// FMAtlas — finale richting
// B's kleuren/vriendelijkheid + A's editorial layout
// Nunito overal, line icons, één accent (coral), neutrale vakken, strakkere cards

const tokens = {
  bg:       '#f7f3ec',
  surface:  '#ffffff',
  surfaceAlt:'#f1ece2',
  ink:      '#1a2024',
  inkSoft:  '#4a5258',
  muted:    '#8a9299',
  line:     '#e3ddd1',
  lineSoft: '#ede7db',

  // één accent — warme coral
  accent:   '#ef5a3f',
  accentSoft:'#fde4dd',
  accentDeep:'#c83f24',

  // signaalkleuren (sober)
  streak:   '#ef5a3f',  // zelfde als accent
  xp:       '#d4a017',
  ok:       '#3a8a5c',
};

// ── Line icons ───────────────────────────────────────────
const Icon = ({name, size=18, stroke=2, color='currentColor', style={}}) => {
  const props = {width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round', style};
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></>,
    flame:  <path d="M12 2c1 4-3 5-3 9a5 5 0 0 0 10 0c0-2-1-4-3-5 1 4-2 4-2 7a2 2 0 1 1-4 0c0-2 2-3 2-5 0-4 0-6 0-6Z"/>,
    bolt:   <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>,
    play:   <path d="M6 4v16l14-8L6 4Z"/>,
    arrow:  <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    arrowL: <><path d="M19 12H5"/><path d="m11 19-7-7 7-7"/></>,
    book:   <><path d="M4 4h12a4 4 0 0 1 4 4v12"/><path d="M4 4v16h14a2 2 0 0 0 2-2"/></>,
    cards:  <><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 2h12a2 2 0 0 1 2 2v12"/></>,
    check:  <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
    coffee: <><path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M7 3v2M11 3v2"/></>,
    send:   <><path d="m4 12 16-8-6 16-2.5-6.5L4 12Z"/><path d="m11 13 4-4"/></>,
    trophy: <><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 4H3v2a3 3 0 0 0 3 3"/><path d="M18 4h3v2a3 3 0 0 1-3 3"/><path d="M12 14v4"/><path d="M8 20h8"/></>,
    sparkle:<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></>,
    event:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>,
    mic:    <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></>,
    cart:   <><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h3l2.5 12h10L21 7H6"/></>,
    building:<><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></>,
    chart:  <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></>,
    coin:   <><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10h5a2 2 0 0 1 0 4H9"/></>,
    compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/></>,
    scope:  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
    clock:  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chat:   <><path d="M4 4h16v12H8l-4 4V4Z"/></>,
    lock:   <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    grid:   <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    kb:     <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h0M11 10h0M15 10h0M7 14h10"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

// ── Mascotte — vriendelijker/bescheidener, niet cartoony ───
// Kleine kompas met subtiel gezichtje, rustige vormen
const Mascot = ({size=150}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* soft glow */}
    <circle cx="100" cy="105" r="88" fill={tokens.accentSoft}/>
    {/* compass body */}
    <circle cx="100" cy="105" r="72" fill={tokens.surface} stroke={tokens.ink} strokeWidth="2.5"/>
    {/* tick marks */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
      const rad = (a-90) * Math.PI/180;
      const x1 = 100 + Math.cos(rad) * 62;
      const y1 = 105 + Math.sin(rad) * 62;
      const x2 = 100 + Math.cos(rad) * (a%90===0 ? 55 : 58);
      const y2 = 105 + Math.sin(rad) * (a%90===0 ? 55 : 58);
      return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tokens.inkSoft} strokeWidth={a%90===0 ? 2.5 : 1.5} strokeLinecap="round"/>;
    })}
    {/* N letter subtle */}
    <text x="100" y="55" textAnchor="middle" fontSize="11" fontWeight="800" fill={tokens.accent} fontFamily="Nunito, sans-serif">N</text>
    {/* needle */}
    <path d="M100 65 L108 105 L100 100 Z" fill={tokens.accent} stroke={tokens.ink} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M100 145 L92 105 L100 110 Z" fill={tokens.surfaceAlt} stroke={tokens.ink} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="100" cy="105" r="4" fill={tokens.ink}/>
    {/* subtle face — on the outer ring, tiny */}
    <circle cx="82" cy="88" r="1.8" fill={tokens.ink}/>
    <circle cx="118" cy="88" r="1.8" fill={tokens.ink}/>
    <path d="M93 97 Q100 101 107 97" stroke={tokens.ink} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// ── Logo ──────────────────────────────────────────────────
const Logo = ({size=26}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill={tokens.surface} stroke={tokens.ink} strokeWidth="2"/>
    <path d="M16 7 L20 16 L16 15 Z" fill={tokens.accent} stroke={tokens.ink} strokeWidth="1" strokeLinejoin="round"/>
    <path d="M16 25 L12 16 L16 17 Z" fill={tokens.surfaceAlt} stroke={tokens.ink} strokeWidth="1" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="1.4" fill={tokens.ink}/>
  </svg>
);

const FMAtlasHome = () => {
  const currentCourse = {
    title:'Evenementenlogistiek', section:'Schil 3 — Toegangsprocessen',
    chapter:'§3 van 4', progress:72, timeLeft:'≈ 8 min resterend',
    lastOpened:'2 uur geleden',
  };

  const allPeriods = [
    { label:'Periode 4', note:'Lopend · week 6', courses:[
      { title:'Evenementenlogistiek', sub:'Schillenmodel · mobiliteit · toegang', progress:72, active:true, icon:'event', last:true },
      { title:'Projectvaardigheden', sub:'Observeren · interviewen · rapporteren', progress:34, active:true, icon:'mic' },
    ]},
    { label:'Periode 3', note:'Afgerond', courses:[
      { title:'Eventmanagement 1', sub:'Inleiding op eventprocessen', progress:100, grade:'7,8', icon:'book' },
      { title:'Facilitaire Inkoop', sub:'Inkoop + verbintenissenrecht', progress:100, grade:'6,4', icon:'cart' },
    ]},
    { label:'Periode 2', note:'Afgerond', courses:[
      { title:'Basis van FM — B', sub:'Verdieping processen', progress:100, grade:'7,2', icon:'building' },
      { title:'Facilitair Bedrijfsproject', sub:'Groepsproject praktijk', progress:100, grade:'8,1', icon:'chart' },
      { title:'Facilitaire Bedrijfseconomie', sub:'Begroting & kosten', progress:100, grade:'6,9', icon:'coin' },
    ]},
    { label:'Periode 1', note:'Afgerond', courses:[
      { title:'Basis van FM — A', sub:'Introductie beroepsprofiel', progress:100, grade:'7,5', icon:'compass' },
      { title:'Trendwatchers', sub:'Trends & impact op FM', progress:100, grade:'8,0', icon:'scope' },
    ]},
  ];

  const leaderboard = [
    { rank:1, name:'Lieke van Dam', pts:2840, initials:'LD' },
    { rank:2, name:'Jay Patel', pts:2612, initials:'JP' },
    { rank:3, name:'David Koolstra', pts:2487, initials:'DK', me:true },
    { rank:4, name:'Sanne Bakker', pts:2340, initials:'SB' },
    { rank:5, name:'Milan de Groot', pts:2105, initials:'MG' },
  ];

  const cardBase = {
    background:tokens.surface, border:`1.5px solid ${tokens.line}`,
    borderRadius:18,
  };

  return (
    <div style={{
      width:1280, minHeight:900, background:tokens.bg, color:tokens.ink,
      fontFamily:'"Nunito", system-ui, sans-serif',
    }}>
      {/* HEADER */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 32px', background:tokens.surface, borderBottom:`1.5px solid ${tokens.line}`,
        position:'sticky', top:0, zIndex:5,
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <Logo size={28}/>
          <span style={{fontSize:19, fontWeight:800, letterSpacing:'-0.015em'}}>FMAtlas</span>
          <span style={{fontSize:11, color:tokens.muted, fontWeight:700, marginLeft:6, letterSpacing:'0.04em'}}>
            · studiehulp FM
          </span>
        </div>

        <div style={{
          display:'flex', alignItems:'center', gap:10, background:tokens.bg,
          border:`1.5px solid ${tokens.line}`, borderRadius:12, padding:'9px 14px',
          flex:'0 1 440px', fontSize:13.5, color:tokens.muted, fontWeight:600,
        }}>
          <Icon name="search" size={16} stroke={2} color={tokens.muted}/>
          <span>Zoek samenvattingen, begrippen, flashcards…</span>
          <span style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:3, fontSize:10, color:tokens.muted, background:tokens.surface, border:`1px solid ${tokens.line}`, borderRadius:6, padding:'2px 6px', fontWeight:700}}>
            ⌘ K
          </span>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{display:'flex', alignItems:'center', gap:6, background:tokens.surface, border:`1.5px solid ${tokens.line}`, borderRadius:999, padding:'6px 12px', fontWeight:800, fontSize:13}}>
            <Icon name="flame" size={15} color={tokens.streak}/>
            <span style={{color:tokens.ink}}>14</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:6, background:tokens.surface, border:`1.5px solid ${tokens.line}`, borderRadius:999, padding:'6px 12px', fontWeight:800, fontSize:13}}>
            <Icon name="bolt" size={15} color={tokens.xp}/>
            <span style={{color:tokens.ink}}>2 487</span>
          </div>
          <div style={{width:34, height:34, borderRadius:'50%', background:tokens.accent, color:tokens.surface, display:'grid', placeItems:'center', fontWeight:800, fontSize:13, border:`1.5px solid ${tokens.ink}`}}>
            DK
          </div>
        </div>
      </div>

      {/* HERO — Ga verder waar je was */}
      <div style={{padding:'32px 32px 0'}}>
        <div style={{
          background:tokens.ink, color:tokens.surface, borderRadius:24,
          padding:'36px 40px', display:'grid', gridTemplateColumns:'1fr auto',
          gap:32, alignItems:'center', position:'relative', overflow:'hidden',
        }}>
          {/* soft decorative grid */}
          <svg style={{position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06, pointerEvents:'none'}}>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-grid)"/>
          </svg>

          <div style={{position:'relative'}}>
            <div style={{display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, padding:'5px 12px 5px 10px', fontSize:11, fontWeight:800, letterSpacing:'0.06em', marginBottom:16, color:tokens.accentSoft}}>
              <span style={{width:6, height:6, background:tokens.accent, borderRadius:'50%', display:'inline-block', boxShadow:`0 0 0 3px ${tokens.accent}33`}}></span>
              GA VERDER WAAR JE WAS
            </div>

            <h1 style={{fontSize:44, fontWeight:900, lineHeight:1.05, letterSpacing:'-0.025em', marginBottom:10, color:tokens.surface}}>
              Goedemiddag David,<br/>
              <span style={{color:tokens.accent}}>{currentCourse.section}</span> wacht op je.
            </h1>
            <p style={{fontSize:15, color:'rgba(255,255,255,0.65)', lineHeight:1.55, marginBottom:20, maxWidth:520}}>
              Je stopte gisteren bij {currentCourse.chapter} van <strong style={{color:tokens.surface, fontWeight:700}}>{currentCourse.title}</strong>. Nog één hoofdstuk en schil 3 is af.
            </p>

            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:20}}>
              <div style={{flex:'0 1 340px', position:'relative'}}>
                <div style={{height:8, background:'rgba(255,255,255,0.12)', borderRadius:999, overflow:'hidden'}}>
                  <div style={{height:'100%', width:`${currentCourse.progress}%`, background:tokens.accent, borderRadius:999}}/>
                </div>
              </div>
              <span style={{fontSize:13, fontWeight:800, color:tokens.surface, fontVariantNumeric:'tabular-nums'}}>
                {currentCourse.progress}%
              </span>
              <span style={{fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600}}>
                · {currentCourse.timeLeft}
              </span>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
              <button style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:tokens.accent, color:tokens.surface, border:'none',
                borderRadius:12, padding:'12px 18px', fontSize:14, fontWeight:800,
                cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.01em',
              }}>
                <Icon name="play" size={15} stroke={2.5}/>
                Verder gaan
              </button>
              <button style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'transparent', color:tokens.surface,
                border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:12,
                padding:'12px 18px', fontSize:14, fontWeight:700, cursor:'pointer',
                fontFamily:'inherit',
              }}>
                <Icon name="cards" size={15}/>
                Oefen flashcards
              </button>
              <span style={{fontSize:12, color:'rgba(255,255,255,0.4)', marginLeft:4, fontWeight:600}}>
                · laatst open {currentCourse.lastOpened}
              </span>
            </div>
          </div>

          <div style={{position:'relative', zIndex:1}}>
            <Mascot size={180}/>
          </div>
        </div>
      </div>

      {/* TWO COLUMN BODY */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:24, padding:'28px 32px 40px'}}>

        {/* LEFT: Vakken */}
        <div>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18}}>
            <h2 style={{fontSize:22, fontWeight:900, letterSpacing:'-0.015em'}}>
              Jouw vakken
            </h2>
            <div style={{display:'flex', gap:6, fontSize:12, fontWeight:700}}>
              <button style={{background:tokens.ink, color:tokens.surface, border:'none', borderRadius:8, padding:'5px 12px', fontFamily:'inherit', cursor:'pointer'}}>
                Alles
              </button>
              <button style={{background:'transparent', color:tokens.inkSoft, border:`1.5px solid ${tokens.line}`, borderRadius:8, padding:'5px 12px', fontFamily:'inherit', cursor:'pointer'}}>
                Lopend
              </button>
              <button style={{background:'transparent', color:tokens.inkSoft, border:`1.5px solid ${tokens.line}`, borderRadius:8, padding:'5px 12px', fontFamily:'inherit', cursor:'pointer'}}>
                Afgerond
              </button>
            </div>
          </div>

          {allPeriods.map((p, pi) => (
            <div key={pi} style={{marginBottom:28}}>
              <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
                <span style={{fontSize:12, fontWeight:800, color:tokens.inkSoft, letterSpacing:'0.04em', textTransform:'uppercase'}}>
                  {p.label}
                </span>
                <div style={{flex:1, height:1, background:tokens.line}}/>
                <span style={{fontSize:11, color:tokens.muted, fontWeight:700, letterSpacing:'0.04em'}}>
                  {p.note}
                </span>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                {p.courses.map((c, ci) => (
                  <div key={ci} style={{
                    ...cardBase, padding:'16px 18px', cursor:'pointer',
                    position:'relative',
                    borderColor: c.last ? tokens.accent : tokens.line,
                    boxShadow: c.last ? `0 0 0 2px ${tokens.accentSoft}` : 'none',
                  }}>
                    {c.last && (
                      <span style={{
                        position:'absolute', top:-9, right:14,
                        background:tokens.accent, color:tokens.surface,
                        fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:999,
                        letterSpacing:'0.06em',
                      }}>
                        LAATST OPEN
                      </span>
                    )}

                    <div style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:10}}>
                      <div style={{
                        width:42, height:42, borderRadius:11, flexShrink:0,
                        background: c.active ? tokens.accentSoft : tokens.surfaceAlt,
                        color: c.active ? tokens.accentDeep : tokens.inkSoft,
                        display:'grid', placeItems:'center',
                        border:`1.5px solid ${c.active ? tokens.accent+'40' : tokens.line}`,
                      }}>
                        <Icon name={c.icon} size={20} stroke={2}/>
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <h3 style={{fontSize:15, fontWeight:800, letterSpacing:'-0.01em', marginBottom:3, lineHeight:1.2}}>
                          {c.title}
                        </h3>
                        <p style={{fontSize:12, color:tokens.muted, fontWeight:600, lineHeight:1.4}}>
                          {c.sub}
                        </p>
                      </div>
                      {c.grade && (
                        <div style={{
                          flexShrink:0, background:tokens.surfaceAlt, border:`1px solid ${tokens.line}`,
                          borderRadius:8, padding:'4px 8px', fontSize:11, fontWeight:800, color:tokens.inkSoft,
                        }}>
                          {c.grade}
                        </div>
                      )}
                    </div>

                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{flex:1, height:5, background:tokens.lineSoft, borderRadius:999, overflow:'hidden'}}>
                        <div style={{
                          height:'100%', width:`${c.progress}%`,
                          background: c.active ? tokens.accent : tokens.inkSoft,
                          borderRadius:999,
                        }}/>
                      </div>
                      <span style={{fontSize:11, fontWeight:800, color: c.active ? tokens.accent : tokens.muted, fontVariantNumeric:'tabular-nums', width:32, textAlign:'right'}}>
                        {c.progress}%
                      </span>
                    </div>

                    {c.active && (
                      <div style={{display:'flex', gap:6, marginTop:12, paddingTop:12, borderTop:`1px dashed ${tokens.line}`}}>
                        <button style={{
                          flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
                          background:tokens.bg, color:tokens.inkSoft, border:`1px solid ${tokens.line}`,
                          borderRadius:8, padding:'6px 10px', fontSize:11.5, fontWeight:800, fontFamily:'inherit', cursor:'pointer',
                        }}>
                          <Icon name="book" size={13}/> Samenvatting
                        </button>
                        <button style={{
                          flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
                          background:tokens.bg, color:tokens.inkSoft, border:`1px solid ${tokens.line}`,
                          borderRadius:8, padding:'6px 10px', fontSize:11.5, fontWeight:800, fontFamily:'inherit', cursor:'pointer',
                        }}>
                          <Icon name="cards" size={13}/> Flashcards
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CONTACT */}
          <div style={{...cardBase, padding:'22px 24px', marginTop:12}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
              <div style={{width:36, height:36, background:tokens.accentSoft, color:tokens.accentDeep, borderRadius:10, display:'grid', placeItems:'center', border:`1.5px solid ${tokens.accent}30`}}>
                <Icon name="chat" size={18}/>
              </div>
              <div>
                <h3 style={{fontSize:16, fontWeight:800, marginBottom:2}}>Stel een vraag</h3>
                <p style={{fontSize:12, color:tokens.muted, fontWeight:600}}>
                  Iets onduidelijk, tip of fout gespot? Laat het weten.
                </p>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10}}>
              <div style={{background:tokens.bg, border:`1.5px solid ${tokens.line}`, borderRadius:10, padding:'10px 14px', fontSize:13, color:tokens.muted, fontWeight:600}}>
                Je naam
              </div>
              <div style={{background:tokens.bg, border:`1.5px solid ${tokens.line}`, borderRadius:10, padding:'10px 14px', fontSize:13, color:tokens.muted, fontWeight:600}}>
                E-mailadres
              </div>
            </div>
            <div style={{background:tokens.bg, border:`1.5px solid ${tokens.line}`, borderRadius:10, padding:'10px 14px', minHeight:72, fontSize:13, color:tokens.muted, fontWeight:600, marginBottom:12}}>
              Typ hier je vraag…
            </div>
            <button style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:tokens.ink, color:tokens.surface, border:'none',
              borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:800, cursor:'pointer',
              fontFamily:'inherit',
            }}>
              <Icon name="send" size={14}/>
              Verstuur bericht
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{display:'flex', flexDirection:'column', gap:16}}>

          {/* Streak */}
          <div style={{...cardBase, padding:22}}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14}}>
              <div>
                <div style={{fontSize:11, fontWeight:800, color:tokens.accent, letterSpacing:'0.06em', marginBottom:4, display:'flex', alignItems:'center', gap:6}}>
                  <Icon name="flame" size={13} color={tokens.accent}/>
                  HUIDIGE REEKS
                </div>
                <div style={{fontSize:48, fontWeight:900, lineHeight:1, letterSpacing:'-0.03em', marginTop:2}}>
                  14
                </div>
                <div style={{fontSize:12, color:tokens.inkSoft, fontWeight:700, marginTop:4}}>
                  dagen op rij
                </div>
              </div>
              <div style={{
                width:56, height:56, background:tokens.accentSoft, borderRadius:14,
                display:'grid', placeItems:'center', border:`1.5px solid ${tokens.accent}30`,
              }}>
                <Icon name="flame" size={26} color={tokens.accent} stroke={2}/>
              </div>
            </div>
            <div style={{display:'flex', gap:5, marginBottom:10}}>
              {['M','D','W','D','V','Z','Z'].map((d, i) => {
                const done = i < 5;
                const today = i === 5;
                return (
                  <div key={i} style={{flex:1, textAlign:'center'}}>
                    <div style={{
                      width:'100%', aspectRatio:'1', borderRadius:8,
                      background: done ? tokens.accent : (today ? tokens.surface : tokens.lineSoft),
                      border: today ? `1.5px dashed ${tokens.accent}` : `1.5px solid ${done ? tokens.accent : 'transparent'}`,
                      display:'grid', placeItems:'center', color:tokens.surface, marginBottom:4,
                    }}>
                      {done && <Icon name="check" size={12} stroke={3} color={tokens.surface}/>}
                    </div>
                    <span style={{fontSize:10, color:tokens.inkSoft, fontWeight:800, letterSpacing:'0.04em'}}>{d}</span>
                  </div>
                );
              })}
            </div>
            <p style={{fontSize:12, color:tokens.inkSoft, fontWeight:600, lineHeight:1.5, background:tokens.surfaceAlt, padding:'8px 12px', borderRadius:8, marginTop:4}}>
              <strong style={{color:tokens.ink}}>Nog één sessie</strong> vandaag en je reeks blijft staan.
            </p>
          </div>

          {/* Leaderboard */}
          <div style={{...cardBase, padding:22}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <Icon name="trophy" size={16} color={tokens.ink}/>
                <h3 style={{fontSize:15, fontWeight:800, letterSpacing:'-0.01em'}}>Leaderboard</h3>
              </div>
              <span style={{fontSize:11, color:tokens.muted, fontWeight:700, letterSpacing:'0.04em'}}>DEZE WEEK</span>
            </div>
            {leaderboard.map(e => (
              <div key={e.rank} style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                borderRadius:10, marginBottom:2,
                background: e.me ? tokens.accentSoft : 'transparent',
                border: e.me ? `1.5px solid ${tokens.accent}40` : '1.5px solid transparent',
              }}>
                <span style={{
                  width:22, height:22, borderRadius:6,
                  background: e.rank === 1 ? '#fde68a' : e.rank === 2 ? '#e5e7eb' : e.rank === 3 ? '#fed7aa' : tokens.surfaceAlt,
                  color:tokens.ink, display:'grid', placeItems:'center',
                  fontSize:11, fontWeight:900,
                }}>
                  {e.rank}
                </span>
                <div style={{width:28, height:28, borderRadius:'50%', background:tokens.ink, color:tokens.surface, display:'grid', placeItems:'center', fontSize:10, fontWeight:800}}>
                  {e.initials}
                </div>
                <span style={{flex:1, fontSize:13, fontWeight: e.me ? 800 : 700, color:tokens.ink, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {e.name}{e.me && <span style={{color:tokens.accent, fontWeight:800, marginLeft:4}}>· jij</span>}
                </span>
                <span style={{fontSize:11.5, fontWeight:800, color:tokens.inkSoft, fontVariantNumeric:'tabular-nums', display:'flex', alignItems:'center', gap:3}}>
                  <Icon name="bolt" size={11} color={tokens.xp}/>
                  {e.pts.toLocaleString('nl-NL').replace(',', ' ')}
                </span>
              </div>
            ))}
            <button style={{
              width:'100%', marginTop:10, background:'transparent', color:tokens.inkSoft,
              border:`1.5px dashed ${tokens.line}`, borderRadius:10, padding:'8px',
              fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit',
            }}>
              Volledig klassement →
            </button>
          </div>

          {/* Ko-fi */}
          <div style={{
            ...cardBase, padding:22, background:tokens.accentSoft,
            borderColor:tokens.accent+'40',
          }}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
              <div style={{width:36, height:36, background:tokens.surface, color:tokens.accent, borderRadius:10, display:'grid', placeItems:'center', border:`1.5px solid ${tokens.accent}40`}}>
                <Icon name="coffee" size={18}/>
              </div>
              <div>
                <h3 style={{fontSize:15, fontWeight:800, letterSpacing:'-0.01em'}}>Trakteer op koffie</h3>
                <p style={{fontSize:11, color:tokens.accentDeep, fontWeight:700, marginTop:1}}>Optioneel — altijd gewaardeerd</p>
              </div>
            </div>
            <p style={{fontSize:12.5, color:tokens.inkSoft, fontWeight:600, lineHeight:1.5, marginBottom:14}}>
              FMAtlas is en blijft gratis voor alle HAN FM-studenten. Helpt het je bij je studie? Dan is een kleine bijdrage erg welkom.
            </p>
            <button style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:tokens.ink, color:tokens.surface, border:'none',
              borderRadius:10, padding:'10px 16px', fontSize:13, fontWeight:800, cursor:'pointer',
              fontFamily:'inherit',
            }}>
              Steun op Ko-fi
              <Icon name="arrow" size={14} stroke={2.5}/>
            </button>
          </div>

          {/* Tip card */}
          <div style={{...cardBase, padding:'18px 22px'}}>
            <div style={{fontSize:11, fontWeight:800, color:tokens.muted, letterSpacing:'0.06em', marginBottom:8, display:'flex', alignItems:'center', gap:6}}>
              <Icon name="sparkle" size={13} color={tokens.accent}/>
              TIP VAN VANDAAG
            </div>
            <p style={{fontSize:13, color:tokens.ink, fontWeight:600, lineHeight:1.5, marginBottom:10}}>
              Korte sessies van 10–15 min werken beter dan lange marathons. Doe er vandaag twee.
            </p>
            <div style={{fontSize:11, color:tokens.muted, fontWeight:700, display:'flex', alignItems:'center', gap:4}}>
              <Icon name="clock" size={11}/>
              volgende tip morgen
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop:`1.5px solid ${tokens.line}`, padding:'18px 32px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        fontSize:12, color:tokens.muted, fontWeight:600, background:tokens.surface,
      }}>
        <span>FMAtlas · gemaakt door David Koolstra</span>
        <span>HAN · Facilitair Management · 2026</span>
      </div>
    </div>
  );
};

window.FMAtlasHome = FMAtlasHome;
