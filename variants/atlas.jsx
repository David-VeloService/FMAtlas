// Richting A: ATLAS — editorial, magazine-achtig, studieplek met karakter
// Warme crème basis, inkt-zwart, terracotta accent, serif display + sans body

const atlasTokens = {
  paper:    '#f4ede1',   // warm crème
  paperAlt: '#ebe2d3',   // iets dieper
  ink:      '#1a1410',   // bijna zwart, warme ondertoon
  inkSoft:  '#5c4d3f',
  muted:    '#8a7a67',
  line:     'rgba(26, 20, 16, 0.12)',
  accent:   '#c2452d',   // terracotta/brick
  accentSoft:'#e8a595',
  olive:    '#6b6f3f',
  navy:     '#2b3a5f',
  ochre:    '#c88a2e',
};

const AtlasLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{flexShrink:0}}>
    <circle cx="20" cy="20" r="18" stroke={atlasTokens.ink} strokeWidth="1.5" fill={atlasTokens.paper}/>
    <path d="M20 6 L24 20 L20 34 L16 20 Z" fill={atlasTokens.accent}/>
    <circle cx="20" cy="20" r="2" fill={atlasTokens.ink}/>
    <line x1="20" y1="2" x2="20" y2="5" stroke={atlasTokens.ink} strokeWidth="1.5"/>
    <line x1="20" y1="35" x2="20" y2="38" stroke={atlasTokens.ink} strokeWidth="1.5"/>
    <line x1="2" y1="20" x2="5" y2="20" stroke={atlasTokens.ink} strokeWidth="1.5"/>
    <line x1="35" y1="20" x2="38" y2="20" stroke={atlasTokens.ink} strokeWidth="1.5"/>
  </svg>
);

const AtlasHome = () => {
  const periods = [
    { label: 'Periode IV', note: 'Lopend — week 6', active: true, courses: [
      { n: '01', title: 'Evenementenlogistiek', sub: 'Schillenmodel · mobiliteit · toegang', progress: 0.72, last: '2 uur geleden', color: atlasTokens.accent },
      { n: '02', title: 'Projectvaardigheden', sub: 'Observeren · interviewen · rapporteren', progress: 0.34, last: 'gisteren', color: atlasTokens.navy },
    ]},
    { label: 'Periode III', note: 'Afgerond', courses: [
      { n: '03', title: 'Eventmanagement I', sub: 'Inleiding op eventprocessen', progress: 1, grade: '7,8', color: atlasTokens.olive },
      { n: '04', title: 'Facilitaire Inkoop', sub: 'Inkoop + verbintenissenrecht', progress: 1, grade: '6,4', color: atlasTokens.ochre },
    ]},
    { label: 'Periode II', note: 'Afgerond', courses: [
      { n: '05', title: 'Basis van FM — B', sub: 'Verdieping processen & dienstverlening', progress: 1, grade: '7,2', color: atlasTokens.inkSoft },
      { n: '06', title: 'Facilitair Bedrijfsproject', sub: 'Groepsproject praktijk', progress: 1, grade: '8,1', color: atlasTokens.inkSoft },
      { n: '07', title: 'Facilitaire Bedrijfseconomie', sub: 'Begroting & kosten', progress: 1, grade: '6,9', color: atlasTokens.inkSoft },
    ]},
    { label: 'Periode I', note: 'Afgerond', courses: [
      { n: '08', title: 'Basis van FM — A', sub: 'Introductie beroepsprofiel', progress: 1, grade: '7,5', color: atlasTokens.inkSoft },
      { n: '09', title: 'Trendwatchers', sub: 'Trends & impact op FM', progress: 1, grade: '8,0', color: atlasTokens.inkSoft },
    ]},
  ];

  const leaderboard = [
    { rank: 1, name: 'Lieke van Dam', pts: 2840 },
    { rank: 2, name: 'Jay Patel', pts: 2612 },
    { rank: 3, name: 'David K.', pts: 2487, me: true },
    { rank: 4, name: 'Sanne B.', pts: 2340 },
    { rank: 5, name: 'Milan de Groot', pts: 2105 },
  ];

  return (
    <div style={{
      width: 1280, minHeight: 900, background: atlasTokens.paper, color: atlasTokens.ink,
      fontFamily: '"Inter", system-ui, sans-serif', fontFeatureSettings: '"ss01","cv11"',
    }}>
      {/* Paper grain texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.35,
        backgroundImage:`radial-gradient(circle at 20% 30%, rgba(194,69,45,0.04) 0, transparent 40%),
                         radial-gradient(circle at 80% 70%, rgba(43,58,95,0.04) 0, transparent 40%)`,
      }}/>

      {/* TOP BAR — nameplate masthead */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'18px 40px', borderBottom:`1px solid ${atlasTokens.line}`,
      }}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <AtlasLogo size={24}/>
          <span style={{fontFamily:'"Instrument Serif", serif', fontSize:22, letterSpacing:'-0.01em'}}>
            Atlas
          </span>
          <span style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:atlasTokens.muted, marginLeft:8}}>
            — studiekompas voor FM
          </span>
        </div>

        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background:atlasTokens.paperAlt, border:`1px solid ${atlasTokens.line}`,
          borderRadius:999, padding:'6px 14px 6px 12px', fontSize:13, color:atlasTokens.muted,
          minWidth:320,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/>
          </svg>
          <span>Zoek in begrippen, samenvattingen, flashcards…</span>
          <span style={{marginLeft:'auto', fontSize:10, padding:'1px 6px', border:`1px solid ${atlasTokens.line}`, borderRadius:4, background:atlasTokens.paper}}>⌘K</span>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:14, fontSize:13}}>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={atlasTokens.accent}>
              <path d="M13.5 2c-1.5 4.5 2 6 2 9.5a3.5 3.5 0 1 1-7 0c0-1.5.5-2.5 1.5-3-1 3 1.5 3.5 1.5 6a2 2 0 0 0 4 0c0-2-2.5-3-2.5-6 0-3 2-4.5 2-4.5s-2 .5-2 4.5Z"/>
            </svg>
            <strong style={{fontWeight:600}}>14</strong>
            <span style={{color:atlasTokens.muted, fontSize:12}}>dagen</span>
          </div>
          <div style={{width:28, height:28, borderRadius:'50%', background:atlasTokens.accent, color:atlasTokens.paper, display:'grid', placeItems:'center', fontSize:12, fontWeight:600}}>
            DK
          </div>
        </div>
      </div>

      {/* MASTHEAD HERO — editorial */}
      <div style={{padding:'56px 40px 40px', borderBottom:`1px solid ${atlasTokens.line}`, position:'relative'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:12}}>
          <div style={{fontSize:11, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted}}>
            Vol. III · Jaar 1 · Week 24
          </div>
          <div style={{fontSize:11, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted}}>
            Dinsdag, 24 april 2026
          </div>
        </div>

        <h1 style={{
          fontFamily:'"Instrument Serif", "Times New Roman", serif',
          fontSize:112, lineHeight:0.92, letterSpacing:'-0.035em', fontWeight:400,
          marginBottom:20, maxWidth:1100,
        }}>
          Goedemiddag, David.<br/>
          <em style={{color:atlasTokens.accent, fontStyle:'italic'}}>Vandaag lees je verder</em><br/>
          in Evenementenlogistiek.
        </h1>

        <div style={{display:'flex', gap:48, marginTop:40, alignItems:'flex-start'}}>
          <div style={{maxWidth:480, fontSize:15, lineHeight:1.65, color:atlasTokens.inkSoft}}>
            Een archief van samenvattingen, begrippen, oefentoetsen en flashcards voor elk vak binnen Facilitair Management. Opgebouwd uit collegestof, boeken en praktijk.
          </div>

          {/* Continue reading card */}
          <div style={{
            marginLeft:'auto', border:`1px solid ${atlasTokens.line}`, background:atlasTokens.paperAlt,
            padding:'18px 22px', minWidth:340, position:'relative',
          }}>
            <div style={{fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:atlasTokens.muted, marginBottom:10}}>
              Verder lezen
            </div>
            <div style={{fontFamily:'"Instrument Serif", serif', fontSize:24, lineHeight:1.15, marginBottom:6}}>
              Schil 3 — Toegangsprocessen
            </div>
            <div style={{fontSize:12, color:atlasTokens.muted, marginBottom:14}}>
              Evenementenlogistiek · §3 van 4 · 2 uur geleden
            </div>
            <div style={{height:2, background:atlasTokens.line, position:'relative', marginBottom:12}}>
              <div style={{position:'absolute', left:0, top:0, bottom:0, width:'72%', background:atlasTokens.accent}}/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontSize:12, color:atlasTokens.muted}}>72% gelezen</span>
              <button style={{
                background:atlasTokens.ink, color:atlasTokens.paper, border:'none',
                padding:'8px 16px', fontSize:12, letterSpacing:'0.04em', cursor:'pointer',
                fontFamily:'inherit',
              }}>
                Ga verder →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:0}}>

        {/* LEFT — course archive */}
        <div style={{padding:'40px', borderRight:`1px solid ${atlasTokens.line}`}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:28}}>
            <h2 style={{fontFamily:'"Instrument Serif", serif', fontSize:44, fontWeight:400, letterSpacing:'-0.02em'}}>
              Het archief
            </h2>
            <div style={{display:'flex', gap:6, fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase'}}>
              <button style={{background:atlasTokens.ink, color:atlasTokens.paper, border:'none', padding:'5px 11px', fontFamily:'inherit', cursor:'pointer'}}>Alles</button>
              <button style={{background:'transparent', color:atlasTokens.muted, border:`1px solid ${atlasTokens.line}`, padding:'5px 11px', fontFamily:'inherit', cursor:'pointer'}}>Lopend</button>
              <button style={{background:'transparent', color:atlasTokens.muted, border:`1px solid ${atlasTokens.line}`, padding:'5px 11px', fontFamily:'inherit', cursor:'pointer'}}>Afgerond</button>
            </div>
          </div>

          {periods.map((p, pi) => (
            <div key={pi} style={{marginBottom:36}}>
              <div style={{
                display:'flex', alignItems:'center', gap:14, marginBottom:14,
                borderBottom:`1px solid ${atlasTokens.ink}`, paddingBottom:8,
              }}>
                <span style={{fontFamily:'"Instrument Serif", serif', fontSize:22, letterSpacing:'-0.01em'}}>
                  {p.label}
                </span>
                <span style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:atlasTokens.muted, marginLeft:'auto'}}>
                  {p.note}
                </span>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0}}>
                {p.courses.map((c, ci) => (
                  <div key={ci} style={{
                    padding:'18px 20px 18px 0',
                    borderRight: ci % 2 === 0 ? `1px solid ${atlasTokens.line}` : 'none',
                    borderBottom: `1px dashed ${atlasTokens.line}`,
                    paddingLeft: ci % 2 === 0 ? 0 : 20,
                    position:'relative', cursor:'pointer',
                  }}>
                    <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:6}}>
                      <span style={{fontFamily:'"Instrument Serif", serif', fontSize:14, color:atlasTokens.muted, fontStyle:'italic'}}>
                        № {c.n}
                      </span>
                      {p.active && <span style={{
                        fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase',
                        background:atlasTokens.accent, color:atlasTokens.paper, padding:'2px 6px',
                      }}>Lopend</span>}
                      {c.grade && <span style={{fontSize:11, color:atlasTokens.muted, marginLeft:'auto'}}>cijfer {c.grade}</span>}
                    </div>
                    <h3 style={{
                      fontFamily:'"Instrument Serif", serif', fontSize:26, fontWeight:400,
                      letterSpacing:'-0.015em', lineHeight:1.1, marginBottom:6,
                    }}>
                      {c.title}
                    </h3>
                    <p style={{fontSize:13, color:atlasTokens.inkSoft, lineHeight:1.5, marginBottom:12}}>
                      {c.sub}
                    </p>

                    {/* Progress line */}
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{flex:1, height:1, background:atlasTokens.line, position:'relative'}}>
                        <div style={{position:'absolute', left:0, top:-1, bottom:-1, width:`${c.progress*100}%`, background:c.color}}/>
                      </div>
                      <span style={{fontSize:11, color:atlasTokens.muted, fontVariantNumeric:'tabular-nums'}}>
                        {Math.round(c.progress*100)}%
                      </span>
                    </div>
                    {c.last && <div style={{fontSize:11, color:atlasTokens.muted, marginTop:6, fontStyle:'italic'}}>Laatst open: {c.last}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{padding:'40px 32px', background:atlasTokens.paperAlt}}>

          {/* Streak */}
          <div style={{marginBottom:36, paddingBottom:28, borderBottom:`1px solid ${atlasTokens.line}`}}>
            <div style={{fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted, marginBottom:12}}>
              Leesreeks
            </div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginBottom:14}}>
              <span style={{fontFamily:'"Instrument Serif", serif', fontSize:72, lineHeight:1, color:atlasTokens.accent}}>14</span>
              <span style={{fontSize:13, color:atlasTokens.inkSoft}}>dagen op rij</span>
            </div>
            <div style={{display:'flex', gap:4, marginBottom:8}}>
              {['M','D','W','D','V','Z','Z'].map((d,i) => (
                <div key={i} style={{flex:1, textAlign:'center'}}>
                  <div style={{
                    width:'100%', aspectRatio:'1', background: i<5 ? atlasTokens.ink : (i===5 ? atlasTokens.accent : atlasTokens.paper),
                    border:`1px solid ${i===6 ? atlasTokens.line : 'transparent'}`,
                    marginBottom:4,
                  }}/>
                  <span style={{fontSize:10, color:atlasTokens.muted, letterSpacing:'0.1em'}}>{d}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:11, color:atlasTokens.muted, fontStyle:'italic', lineHeight:1.5}}>
              Rond vandaag nog één sessie af om je reeks te houden.
            </p>
          </div>

          {/* Leaderboard */}
          <div style={{marginBottom:36, paddingBottom:28, borderBottom:`1px solid ${atlasTokens.line}`}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
              <div style={{fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted}}>
                Het klassement
              </div>
              <div style={{fontSize:10, color:atlasTokens.muted, fontStyle:'italic'}}>deze week</div>
            </div>
            {leaderboard.map(e => (
              <div key={e.rank} style={{
                display:'flex', alignItems:'baseline', gap:10, padding:'8px 0',
                borderBottom:`1px dotted ${atlasTokens.line}`,
                color: e.me ? atlasTokens.accent : atlasTokens.ink,
                fontWeight: e.me ? 600 : 400,
              }}>
                <span style={{fontFamily:'"Instrument Serif", serif', fontSize:14, fontStyle:'italic', width:18, textAlign:'right', color:atlasTokens.muted}}>
                  {e.rank}.
                </span>
                <span style={{fontSize:14, flex:1}}>{e.name}{e.me && <em style={{color:atlasTokens.muted, fontWeight:400, marginLeft:6}}>— jij</em>}</span>
                <span style={{fontSize:12, fontVariantNumeric:'tabular-nums', color:atlasTokens.muted}}>{e.pts.toLocaleString('nl-NL')}</span>
              </div>
            ))}
          </div>

          {/* Ko-fi */}
          <div style={{marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${atlasTokens.line}`}}>
            <div style={{fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted, marginBottom:10}}>
              Colofon
            </div>
            <p style={{fontFamily:'"Instrument Serif", serif', fontSize:18, fontStyle:'italic', lineHeight:1.35, marginBottom:14, color:atlasTokens.inkSoft}}>
              "Atlas is gratis en blijft gratis. Mocht je iets willen teruggeven — een koffie waardeer ik enorm."
            </p>
            <button style={{
              background:'transparent', color:atlasTokens.ink, border:`1px solid ${atlasTokens.ink}`,
              padding:'8px 14px', fontSize:12, letterSpacing:'0.06em', cursor:'pointer', fontFamily:'inherit',
              textTransform:'uppercase',
            }}>
              ☕ Ko-fi →
            </button>
          </div>

          {/* Contact snippet */}
          <div>
            <div style={{fontSize:10, letterSpacing:'0.24em', textTransform:'uppercase', color:atlasTokens.muted, marginBottom:10}}>
              Ingezonden brief
            </div>
            <p style={{fontSize:12, color:atlasTokens.inkSoft, lineHeight:1.55, marginBottom:10}}>
              Een vraag over een onderwerp, suggestie voor een samenvatting, of fout gespot?
            </p>
            <div style={{borderTop:`1px solid ${atlasTokens.line}`, paddingTop:10}}>
              <div style={{fontSize:11, color:atlasTokens.muted, marginBottom:6}}>Onderwerp</div>
              <div style={{fontSize:13, borderBottom:`1px solid ${atlasTokens.line}`, padding:'4px 0 8px', marginBottom:10, color:atlasTokens.muted, fontStyle:'italic'}}>
                Bijv. Schillenmodel schil 2
              </div>
              <div style={{fontSize:11, color:atlasTokens.muted, marginBottom:6}}>Bericht</div>
              <div style={{fontSize:13, borderBottom:`1px solid ${atlasTokens.line}`, padding:'4px 0 30px', marginBottom:10, color:atlasTokens.muted, fontStyle:'italic'}}>
                Typ hier…
              </div>
              <button style={{
                background:atlasTokens.ink, color:atlasTokens.paper, border:'none',
                padding:'8px 14px', fontSize:12, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em',
              }}>
                Verstuur →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        padding:'20px 40px', borderTop:`1px solid ${atlasTokens.ink}`,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:atlasTokens.muted,
      }}>
        <span>Atlas — een editie van David Koolstra</span>
        <span>HAN · Facilitair Management · MMXXVI</span>
      </div>
    </div>
  );
};

window.AtlasHome = AtlasHome;
