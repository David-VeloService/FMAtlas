// Richting B: KOMPAS — speels/Duolingo-achtig, kleur per vak, streak prominent
// Licht crème-wit basis, ronde vormen, duidelijke mascotte-gevoel, levendige accenten

const kompasTokens = {
  bg:       '#faf7f2',
  surface:  '#ffffff',
  ink:      '#1f2a2e',
  inkSoft:  '#5b6b70',
  muted:    '#9aa5a9',
  line:     '#e8e2d7',
  // vak-kleuren
  coral:    '#ff6b57',    // evenementenlogistiek
  teal:     '#2dbd9b',    // projectvaardigheden
  yellow:   '#ffc94d',    // eventmanagement
  purple:   '#8b6df5',    // facilitaire inkoop
  sky:      '#4ab4ff',    // FM-B
  pink:     '#ff85ae',    // bedrijfsproject
  green:    '#7bc96f',    // bedrijfseconomie
  orange:   '#ff9840',    // FM-A
  olive:    '#b5a74a',    // trendwatchers
  streakRed:'#ff5733',
  xpGold:   '#f5b318',
};

const KompasLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{flexShrink:0}}>
    <circle cx="24" cy="24" r="22" fill="#ffc94d"/>
    <circle cx="24" cy="24" r="16" fill="#faf7f2" stroke="#1f2a2e" strokeWidth="2"/>
    <path d="M24 10 L28 24 L24 38 L20 24 Z" fill="#ff6b57"/>
    <path d="M24 10 L28 24 L24 24 Z" fill="#ff4a2d"/>
    <circle cx="24" cy="24" r="2.5" fill="#1f2a2e"/>
    {/* friendly eyes on the N point */}
  </svg>
);

// Cute compass mascot illustration
const KompasMascot = ({ size = 180 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* body */}
    <circle cx="100" cy="110" r="78" fill="#ffc94d"/>
    <circle cx="100" cy="110" r="78" fill="none" stroke="#1f2a2e" strokeWidth="3"/>
    {/* inner face */}
    <circle cx="100" cy="110" r="58" fill="#faf7f2" stroke="#1f2a2e" strokeWidth="2.5"/>
    {/* N E S W markers */}
    <text x="100" y="62" fontSize="11" fontWeight="800" textAnchor="middle" fill="#1f2a2e" fontFamily="system-ui">N</text>
    <text x="148" y="114" fontSize="11" fontWeight="800" textAnchor="middle" fill="#1f2a2e" fontFamily="system-ui">O</text>
    <text x="100" y="166" fontSize="11" fontWeight="800" textAnchor="middle" fill="#1f2a2e" fontFamily="system-ui">Z</text>
    <text x="52" y="114" fontSize="11" fontWeight="800" textAnchor="middle" fill="#1f2a2e" fontFamily="system-ui">W</text>
    {/* arrow */}
    <path d="M100 72 L112 110 L100 102 Z" fill="#ff6b57" stroke="#1f2a2e" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M100 148 L88 110 L100 118 Z" fill="#ffffff" stroke="#1f2a2e" strokeWidth="2" strokeLinejoin="round"/>
    {/* eyes on the top of the compass body */}
    <circle cx="82" cy="86" r="4" fill="#1f2a2e"/>
    <circle cx="83" cy="85" r="1.2" fill="#fff"/>
    <circle cx="118" cy="86" r="4" fill="#1f2a2e"/>
    <circle cx="119" cy="85" r="1.2" fill="#fff"/>
    {/* smile */}
    <path d="M88 96 Q100 104 112 96" stroke="#1f2a2e" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {/* blush */}
    <circle cx="74" cy="100" r="5" fill="#ff6b57" opacity="0.35"/>
    <circle cx="126" cy="100" r="5" fill="#ff6b57" opacity="0.35"/>
    {/* shadow */}
    <ellipse cx="100" cy="196" rx="60" ry="4" fill="#1f2a2e" opacity="0.1"/>
  </svg>
);

const KompasHome = () => {
  const currentCourses = [
    { title: 'Evenementenlogistiek', sub: 'Schillenmodel', progress: 72, total: 12, done: 9, color: kompasTokens.coral, icon: '🎪', last: true },
    { title: 'Projectvaardigheden', sub: 'Interviewen', progress: 34, total: 10, done: 3, color: kompasTokens.teal, icon: '🎤', last: false },
  ];

  const allPeriods = [
    { label: 'Periode 4 — nu', courses: [
      { title: 'Evenementenlogistiek', progress: 72, color: kompasTokens.coral, icon: '🎪' },
      { title: 'Projectvaardigheden', progress: 34, color: kompasTokens.teal, icon: '🎤' },
    ]},
    { label: 'Periode 3', courses: [
      { title: 'Eventmanagement 1', progress: 100, color: kompasTokens.yellow, icon: '📖' },
      { title: 'Facilitaire Inkoop', progress: 100, color: kompasTokens.purple, icon: '🛒' },
    ]},
    { label: 'Periode 2', courses: [
      { title: 'Basis FM — B', progress: 100, color: kompasTokens.sky, icon: '🏢' },
      { title: 'Bedrijfsproject', progress: 100, color: kompasTokens.pink, icon: '📊' },
      { title: 'Bedrijfseconomie', progress: 100, color: kompasTokens.green, icon: '💰' },
    ]},
    { label: 'Periode 1', courses: [
      { title: 'Basis FM — A', progress: 100, color: kompasTokens.orange, icon: '📚' },
      { title: 'Trendwatchers', progress: 100, color: kompasTokens.olive, icon: '🔭' },
    ]},
  ];

  const leaderboard = [
    { rank: 1, name: 'Lieke v.D.', pts: 2840, avatar: '🦊' },
    { rank: 2, name: 'Jay Patel', pts: 2612, avatar: '🐼' },
    { rank: 3, name: 'David (jij)', pts: 2487, avatar: '🦔', me: true },
    { rank: 4, name: 'Sanne B.', pts: 2340, avatar: '🐨' },
    { rank: 5, name: 'Milan G.', pts: 2105, avatar: '🦁' },
  ];

  return (
    <div style={{
      width:1280, minHeight:900, background: kompasTokens.bg, color: kompasTokens.ink,
      fontFamily:'"Nunito", "Inter", system-ui, sans-serif',
    }}>
      {/* HEADER */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 32px', background:kompasTokens.surface, borderBottom:`1px solid ${kompasTokens.line}`,
        position:'sticky', top:0, zIndex:5,
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <KompasLogo size={32}/>
          <span style={{fontSize:20, fontWeight:900, letterSpacing:'-0.01em'}}>Kompas</span>
        </div>

        {/* Search */}
        <div style={{
          display:'flex', alignItems:'center', gap:10, background:kompasTokens.bg,
          border:`2px solid ${kompasTokens.line}`, borderRadius:14, padding:'10px 16px',
          flex:'0 1 440px', fontSize:14, color:kompasTokens.muted,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/>
          </svg>
          <span>Zoek samenvattingen, begrippen, flashcards…</span>
        </div>

        {/* XP + streak + avatar pills */}
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{display:'flex', alignItems:'center', gap:6, background:'#fff6dc', border:`2px solid ${kompasTokens.xpGold}`, borderRadius:999, padding:'5px 12px 5px 8px', fontWeight:800, fontSize:13}}>
            <span style={{fontSize:16}}>⚡</span>
            <span style={{color:'#b4850a'}}>2 487 XP</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:6, background:'#ffe3dc', border:`2px solid ${kompasTokens.streakRed}`, borderRadius:999, padding:'5px 12px 5px 8px', fontWeight:800, fontSize:13}}>
            <span style={{fontSize:16}}>🔥</span>
            <span style={{color:kompasTokens.streakRed}}>14</span>
          </div>
          <div style={{width:36, height:36, borderRadius:'50%', background:kompasTokens.coral, color:'#fff', display:'grid', placeItems:'center', fontWeight:800, fontSize:14, border:`2px solid ${kompasTokens.ink}`}}>
            DK
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:24, padding:'28px 32px'}}>

        {/* LEFT COLUMN */}
        <div style={{display:'flex', flexDirection:'column', gap:24}}>

          {/* HERO with mascot */}
          <div style={{
            background:`linear-gradient(135deg, #ffe3a3 0%, #ffc94d 100%)`,
            border:`3px solid ${kompasTokens.ink}`, borderRadius:24, padding:'28px 32px',
            display:'flex', alignItems:'center', gap:20, position:'relative', overflow:'hidden',
            boxShadow:`0 6px 0 ${kompasTokens.ink}`,
          }}>
            {/* background dots */}
            <svg style={{position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.25}}>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill={kompasTokens.ink}/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>

            <div style={{flex:1, position:'relative'}}>
              <div style={{display:'inline-block', background:kompasTokens.ink, color:kompasTokens.bg, fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:999, marginBottom:10, letterSpacing:'0.04em'}}>
                GA VERDER WAAR JE WAS
              </div>
              <h1 style={{fontSize:36, fontWeight:900, lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:6}}>
                Hoi David! 👋<br/>
                <span style={{color:kompasTokens.coral}}>Schil 3</span> wacht op je.
              </h1>
              <p style={{fontSize:14, color:'#5b4420', marginBottom:16, maxWidth:380, lineHeight:1.5}}>
                Nog <strong>3 lessen</strong> om <em>Evenementenlogistiek</em> deze week af te ronden. Je bent bijna door het hoofdstuk over toegangsprocessen heen.
              </p>
              <button style={{
                background:kompasTokens.ink, color:kompasTokens.bg, border:'none',
                borderRadius:14, padding:'12px 20px', fontSize:14, fontWeight:800,
                cursor:'pointer', fontFamily:'inherit',
                boxShadow:`0 3px 0 #000`, letterSpacing:'0.01em',
              }}>
                ▶ Verder gaan — 8 min
              </button>
            </div>

            <div style={{flexShrink:0}}>
              <KompasMascot size={200}/>
            </div>
          </div>

          {/* CURRENT COURSES */}
          <div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
              <h2 style={{fontSize:22, fontWeight:900, letterSpacing:'-0.01em'}}>
                🎯 Waar je nu mee bezig bent
              </h2>
              <span style={{fontSize:12, color:kompasTokens.muted, fontWeight:700}}>Periode 4</span>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              {currentCourses.map((c, i) => (
                <div key={i} style={{
                  background:kompasTokens.surface, border:`3px solid ${kompasTokens.ink}`,
                  borderRadius:20, padding:'18px 20px', position:'relative', cursor:'pointer',
                  boxShadow:`0 4px 0 ${kompasTokens.ink}`,
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
                    <div style={{
                      width:52, height:52, background:c.color, border:`2.5px solid ${kompasTokens.ink}`,
                      borderRadius:14, display:'grid', placeItems:'center', fontSize:26,
                    }}>
                      {c.icon}
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <h3 style={{fontSize:16, fontWeight:900, letterSpacing:'-0.01em', marginBottom:2}}>{c.title}</h3>
                      <p style={{fontSize:12, color:kompasTokens.inkSoft, fontWeight:600}}>📍 {c.sub}</p>
                    </div>
                    {c.last && <span style={{fontSize:10, fontWeight:800, background:kompasTokens.streakRed, color:'#fff', padding:'3px 8px', borderRadius:999, letterSpacing:'0.04em'}}>
                      LAATST
                    </span>}
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
                    <div style={{flex:1, height:10, background:kompasTokens.line, borderRadius:999, overflow:'hidden', border:`1.5px solid ${kompasTokens.ink}`}}>
                      <div style={{height:'100%', width:`${c.progress}%`, background:c.color, borderRight: c.progress < 100 ? `1.5px solid ${kompasTokens.ink}` : 'none'}}/>
                    </div>
                    <span style={{fontSize:12, fontWeight:800, color:kompasTokens.ink, fontVariantNumeric:'tabular-nums'}}>{c.progress}%</span>
                  </div>
                  <p style={{fontSize:11, color:kompasTokens.muted, fontWeight:600}}>
                    {c.done}/{c.total} onderdelen af
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ALL COURSES BY PERIOD */}
          <div>
            <h2 style={{fontSize:22, fontWeight:900, letterSpacing:'-0.01em', marginBottom:14}}>
              📚 Alle vakken
            </h2>

            <div style={{display:'flex', flexDirection:'column', gap:20}}>
              {allPeriods.map((p, pi) => (
                <div key={pi}>
                  <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
                    <span style={{fontSize:13, fontWeight:800, color:kompasTokens.inkSoft}}>
                      {p.label}
                    </span>
                    <div style={{flex:1, height:2, background:kompasTokens.line, borderRadius:2}}/>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:10}}>
                    {p.courses.map((c, ci) => (
                      <div key={ci} style={{
                        background:kompasTokens.surface, border:`2.5px solid ${kompasTokens.ink}`,
                        borderRadius:16, padding:'12px 14px', cursor:'pointer',
                        boxShadow:`0 3px 0 ${kompasTokens.ink}`, display:'flex', alignItems:'center', gap:10,
                      }}>
                        <div style={{
                          width:40, height:40, background:c.color, border:`2px solid ${kompasTokens.ink}`,
                          borderRadius:10, display:'grid', placeItems:'center', fontSize:20, flexShrink:0,
                        }}>
                          {c.icon}
                        </div>
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{fontSize:13, fontWeight:800, marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                            {c.title}
                          </div>
                          <div style={{height:5, background:kompasTokens.line, borderRadius:999, overflow:'hidden'}}>
                            <div style={{height:'100%', width:`${c.progress}%`, background:c.color}}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div style={{
            background:kompasTokens.surface, border:`3px solid ${kompasTokens.ink}`,
            borderRadius:20, padding:24, boxShadow:`0 4px 0 ${kompasTokens.ink}`,
          }}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
              <div style={{fontSize:24}}>💬</div>
              <div>
                <h3 style={{fontSize:18, fontWeight:900, marginBottom:2}}>Stel een vraag</h3>
                <p style={{fontSize:12, color:kompasTokens.inkSoft, fontWeight:600}}>Iets niet duidelijk? Tip? Fout gespot? Laat het weten.</p>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10}}>
              <div style={{background:kompasTokens.bg, border:`2px solid ${kompasTokens.line}`, borderRadius:12, padding:'10px 14px', fontSize:13, color:kompasTokens.muted, fontWeight:600}}>
                Je naam
              </div>
              <div style={{background:kompasTokens.bg, border:`2px solid ${kompasTokens.line}`, borderRadius:12, padding:'10px 14px', fontSize:13, color:kompasTokens.muted, fontWeight:600}}>
                E-mail
              </div>
            </div>
            <div style={{background:kompasTokens.bg, border:`2px solid ${kompasTokens.line}`, borderRadius:12, padding:'10px 14px', minHeight:72, fontSize:13, color:kompasTokens.muted, fontWeight:600, marginBottom:12}}>
              Typ hier je vraag…
            </div>
            <button style={{
              background:kompasTokens.teal, color:'#fff', border:`2.5px solid ${kompasTokens.ink}`,
              borderRadius:12, padding:'10px 18px', fontSize:14, fontWeight:800, cursor:'pointer',
              fontFamily:'inherit', boxShadow:`0 3px 0 ${kompasTokens.ink}`,
            }}>
              Verstuur 🚀
            </button>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{display:'flex', flexDirection:'column', gap:20}}>

          {/* STREAK CARD */}
          <div style={{
            background:`linear-gradient(180deg, #fff1ec 0%, #ffe3dc 100%)`,
            border:`3px solid ${kompasTokens.ink}`, borderRadius:20, padding:22,
            boxShadow:`0 4px 0 ${kompasTokens.ink}`,
          }}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14}}>
              <div>
                <div style={{fontSize:12, fontWeight:800, color:kompasTokens.streakRed, letterSpacing:'0.04em', marginBottom:4}}>
                  🔥 HUIDIGE REEKS
                </div>
                <div style={{fontSize:52, fontWeight:900, lineHeight:1, color:kompasTokens.ink, letterSpacing:'-0.03em'}}>
                  14
                </div>
                <div style={{fontSize:13, color:kompasTokens.inkSoft, fontWeight:700, marginTop:2}}>
                  dagen op rij
                </div>
              </div>
              <div style={{fontSize:52, lineHeight:1, filter:'drop-shadow(0 3px 0 rgba(0,0,0,0.1))'}}>
                🔥
              </div>
            </div>
            <div style={{display:'flex', gap:5, marginBottom:10}}>
              {['M','D','W','D','V','Z','Z'].map((d,i) => {
                const done = i<5; const today = i===5;
                return (
                  <div key={i} style={{flex:1, textAlign:'center'}}>
                    <div style={{
                      width:'100%', aspectRatio:'1', borderRadius:'50%',
                      background: done ? kompasTokens.streakRed : (today ? '#fff' : kompasTokens.line),
                      border: today ? `2.5px dashed ${kompasTokens.streakRed}` : `2px solid ${done ? kompasTokens.ink : 'transparent'}`,
                      display:'grid', placeItems:'center', color:'#fff', fontSize:12, fontWeight:800,
                      marginBottom:4,
                    }}>
                      {done && '✓'}
                    </div>
                    <span style={{fontSize:10, color:kompasTokens.inkSoft, fontWeight:700}}>{d}</span>
                  </div>
                );
              })}
            </div>
            <p style={{fontSize:12, color:kompasTokens.inkSoft, fontWeight:600, lineHeight:1.4, marginTop:6}}>
              Nog één sessie vandaag en je reeks blijft staan! 💪
            </p>
          </div>

          {/* LEADERBOARD */}
          <div style={{
            background:kompasTokens.surface, border:`3px solid ${kompasTokens.ink}`, borderRadius:20, padding:22,
            boxShadow:`0 4px 0 ${kompasTokens.ink}`,
          }}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
              <h3 style={{fontSize:17, fontWeight:900, letterSpacing:'-0.01em'}}>
                🏆 Leaderboard
              </h3>
              <span style={{fontSize:11, color:kompasTokens.muted, fontWeight:700}}>week</span>
            </div>

            {leaderboard.map(e => (
              <div key={e.rank} style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                borderRadius:12, marginBottom:4,
                background: e.me ? kompasTokens.bg : 'transparent',
                border: e.me ? `2px solid ${kompasTokens.coral}` : '2px solid transparent',
              }}>
                <div style={{
                  width:26, height:26, borderRadius:'50%',
                  background: e.rank === 1 ? '#ffdd4a' : e.rank === 2 ? '#d9dcdf' : e.rank === 3 ? '#e8a976' : kompasTokens.line,
                  border:`2px solid ${kompasTokens.ink}`, display:'grid', placeItems:'center',
                  fontSize:11, fontWeight:900,
                }}>
                  {e.rank}
                </div>
                <div style={{
                  width:32, height:32, borderRadius:'50%', background:kompasTokens.bg,
                  border:`2px solid ${kompasTokens.ink}`, display:'grid', placeItems:'center', fontSize:16,
                }}>
                  {e.avatar}
                </div>
                <span style={{flex:1, fontSize:13, fontWeight:e.me ? 900 : 700, color:kompasTokens.ink, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  {e.name}
                </span>
                <span style={{fontSize:12, fontWeight:800, color:kompasTokens.xpGold, fontVariantNumeric:'tabular-nums'}}>
                  ⚡ {e.pts.toLocaleString('nl-NL').replace(',', ' ')}
                </span>
              </div>
            ))}

            <button style={{
              width:'100%', marginTop:10, background:'transparent', color:kompasTokens.inkSoft,
              border:`2px dashed ${kompasTokens.line}`, borderRadius:12, padding:'8px',
              fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'inherit',
            }}>
              Volledig klassement →
            </button>
          </div>

          {/* KO-FI */}
          <div style={{
            background:`linear-gradient(135deg, #ffe3dc, #ffd6c4)`,
            border:`3px solid ${kompasTokens.ink}`, borderRadius:20, padding:22,
            boxShadow:`0 4px 0 ${kompasTokens.ink}`, textAlign:'center',
          }}>
            <div style={{fontSize:40, marginBottom:4}}>☕</div>
            <h3 style={{fontSize:17, fontWeight:900, letterSpacing:'-0.01em', marginBottom:6}}>
              Trakteer op koffie
            </h3>
            <p style={{fontSize:12, color:kompasTokens.inkSoft, fontWeight:600, lineHeight:1.4, marginBottom:14}}>
              Kompas is en blijft gratis. Helpt het je bij je studie? Dan waardeer ik een klein gebaar!
            </p>
            <button style={{
              background:kompasTokens.ink, color:'#fff', border:'none', borderRadius:12,
              padding:'10px 18px', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'inherit',
              boxShadow:`0 3px 0 rgba(0,0,0,0.3)`,
            }}>
              Steun op Ko-fi →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

window.KompasHome = KompasHome;
