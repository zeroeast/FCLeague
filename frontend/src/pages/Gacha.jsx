import { useState, useRef } from 'react';
import { PlayerCard } from '../components/PlayerCard.jsx';
import { PlayerSlot } from '../components/PlayerSlot.jsx';
import { getEnhanceColor, getOvrSlotStyle, getPositionColor } from '../constants/playerColors.js';

// ── 상수 ──────────────────────────────────────────────────────────────────────
const RARITY = {
  S: { color:'#FFD700', glow:'rgba(255,215,0,.5)',  bg:'rgba(255,215,0,.07)',  label:'S급' },
  A: { color:'#a855f7', glow:'rgba(168,85,247,.5)', bg:'rgba(168,85,247,.07)', label:'A급' },
  B: { color:'#00d97e', glow:'rgba(0,217,126,.5)',  bg:'rgba(0,217,126,.07)',  label:'B급' },
};
const POS_GROUPS = {
  '공격수':  ['ST','LW','RW','CF'],
  '미드필더':['CM','CAM','CDM','LM','RM'],
  '수비수':  ['CB','LB','RB','LWB','RWB'],
  '골키퍼':  ['GK'],
};
const DRAW_PLAYERS = [
  { id:1,  name:'손흥민',    pos:'LW',  ovr:93, rarity:'S', nation:'한국',    club:'토트넘' },
  { id:2,  name:'음바페',    pos:'ST',  ovr:95, rarity:'S', nation:'프랑스',  club:'PSG' },
  { id:3,  name:'홀란드',    pos:'ST',  ovr:97, rarity:'S', nation:'노르웨이',club:'맨시티' },
  { id:4,  name:'살라',      pos:'RW',  ovr:91, rarity:'S', nation:'이집트',  club:'리버풀' },
  { id:5,  name:'비니시우스',pos:'LW',  ovr:92, rarity:'S', nation:'브라질',  club:'레알' },
  { id:6,  name:'로드리',    pos:'CM',  ovr:91, rarity:'A', nation:'스페인',  club:'맨시티' },
  { id:7,  name:'반다이크',  pos:'CB',  ovr:90, rarity:'A', nation:'네덜란드',club:'리버풀' },
  { id:8,  name:'알리송',    pos:'GK',  ovr:90, rarity:'A', nation:'브라질',  club:'리버풀' },
  { id:9,  name:'사카',      pos:'RW',  ovr:87, rarity:'A', nation:'잉글랜드',club:'아스날' },
  { id:10, name:'트렌트',    pos:'RB',  ovr:88, rarity:'A', nation:'잉글랜드',club:'리버풀' },
  { id:11, name:'김민재',    pos:'CB',  ovr:87, rarity:'B', nation:'한국',    club:'뮌헨' },
  { id:12, name:'황희찬',    pos:'LW',  ovr:82, rarity:'B', nation:'한국',    club:'울버햄튼' },
  { id:13, name:'이강인',    pos:'CAM', ovr:83, rarity:'B', nation:'한국',    club:'PSG' },
  { id:14, name:'가비',      pos:'CM',  ovr:86, rarity:'B', nation:'스페인',  club:'바르셀로나' },
  { id:15, name:'루카쿠',    pos:'ST',  ovr:85, rarity:'B', nation:'벨기에',  club:'로마' },
];
const ENHANCE_TABLE = [
  { lv:5,  rate:70, cost:200  },
  { lv:6,  rate:55, cost:350  },
  { lv:7,  rate:40, cost:500  },
  { lv:8,  rate:25, cost:750  },
  { lv:9,  rate:15, cost:1000 },
  { lv:10, rate:8,  cost:1500 },
];
const INIT_SQUAD = [
  { id:1, name:'홀란드',     pos:'ST',  ovr:97, enhance:7 },
  { id:2, name:'손흥민',     pos:'LW',  ovr:93, enhance:5 },
  { id:3, name:'살라',       pos:'RW',  ovr:91, enhance:6 },
  { id:4, name:'데브라이너', pos:'CAM', ovr:91, enhance:8 },
  { id:5, name:'반다이크',   pos:'CB',  ovr:90, enhance:5 },
  { id:6, name:'알리송',     pos:'GK',  ovr:90, enhance:6 },
];
const ALL_PLAYERS = [
  { name:'홀란드',        pos:'ST',  ovr:97, season:'24-25' },
  { name:'음바페',        pos:'ST',  ovr:95, season:'24-25' },
  { name:'비니시우스',    pos:'LW',  ovr:92, season:'24-25' },
  { name:'손흥민',        pos:'LW',  ovr:93, season:'24-25' },
  { name:'살라',          pos:'RW',  ovr:91, season:'24-25' },
  { name:'데브라이너',    pos:'CAM', ovr:91, season:'24-25' },
  { name:'로드리',        pos:'CM',  ovr:91, season:'24-25' },
  { name:'반다이크',      pos:'CB',  ovr:90, season:'24-25' },
  { name:'알리송',        pos:'GK',  ovr:90, season:'24-25' },
  { name:'사카',          pos:'RW',  ovr:87, season:'24-25' },
  { name:'트렌트',        pos:'RB',  ovr:88, season:'24-25' },
  { name:'김민재',        pos:'CB',  ovr:87, season:'24-25' },
  { name:'황희찬',        pos:'LW',  ovr:82, season:'24-25' },
  { name:'이강인',        pos:'CAM', ovr:83, season:'24-25' },
  { name:'가비',          pos:'CM',  ovr:86, season:'24-25' },
  { name:'루카쿠',        pos:'ST',  ovr:85, season:'24-25' },
  { name:'황인범',        pos:'CM',  ovr:80, season:'24-25' },
  { name:'조규성',        pos:'ST',  ovr:80, season:'24-25' },
  { name:'레반도프스키',  pos:'ST',  ovr:91, season:'23-24' },
  { name:'벨링엄',        pos:'CAM', ovr:89, season:'23-24' },
  { name:'베르나르두',    pos:'RW',  ovr:87, season:'23-24' },
  { name:'모드리치',      pos:'CM',  ovr:87, season:'23-24' },
  { name:'네이마르',      pos:'LW',  ovr:87, season:'23-24' },
  { name:'밀리탕',        pos:'CB',  ovr:87, season:'23-24' },
  { name:'쿠르투아',      pos:'GK',  ovr:90, season:'23-24' },
  { name:'카르바할',      pos:'RB',  ovr:85, season:'23-24' },
  { name:'라피냐',        pos:'RW',  ovr:86, season:'22-23' },
  { name:'그리즈만',      pos:'CAM', ovr:86, season:'22-23' },
  { name:'마틴델리흐트',  pos:'CB',  ovr:85, season:'22-23' },
  { name:'슐라거',        pos:'GK',  ovr:83, season:'22-23' },
  { name:'조르지뉴',      pos:'CM',  ovr:84, season:'22-23' },
  { name:'막시모비치',    pos:'CM',  ovr:82, season:'22-23' },
];
const MANAGERS = ['영동','준현','종성','민혁','삼주','영모','진수','기성'];
const SEASONS  = ['22-23','23-24','24-25'];

// ── 공통 ──────────────────────────────────────────────────────────────────────
function TabBtn({ id, label, active, onClick }) {
  return (
    <button onClick={() => onClick(id)}
      className="px-5 py-2.5 text-sm font-bold transition-all shrink-0"
      style={{ color:active===id?'#00d97e':'#5a7490', borderBottom:active===id?'2px solid #00d97e':'2px solid transparent' }}>
      {label}
    </button>
  );
}

export default function Gacha() {
  const [tab, setTab]       = useState('draw');
  const [points, setPoints] = useState(2000);

  return (
    <>
      <style>{`
        @keyframes card-reveal  { 0%{transform:rotateY(90deg) scale(.8);opacity:0} 60%{transform:rotateY(-8deg) scale(1.05)} 100%{transform:rotateY(0) scale(1);opacity:1} }
        @keyframes shine-sweep  { 0%{left:-100%} 100%{left:200%} }
        @keyframes toast-drop   { 0%{transform:translateX(-50%) translateY(-16px);opacity:0} 100%{transform:translateX(-50%) translateY(0);opacity:1} }
        @keyframes card-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin-flicker { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes card-shake   { 0%,100%{transform:translate(0,0) rotate(0)} 20%{transform:translate(-5px,1px) rotate(-2deg)} 40%{transform:translate(5px,-1px) rotate(2deg)} 60%{transform:translate(-4px,0) rotate(-1deg)} 80%{transform:translate(4px,0) rotate(1deg)} }
        @keyframes shuffle-spin { 0%{transform:rotate(0) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes fade-in      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .anim-reveal  { animation:card-reveal  .6s cubic-bezier(.34,1.56,.64,1) forwards }
        .anim-float   { animation:card-float   3s ease-in-out infinite }
        .anim-flicker { animation:spin-flicker .14s ease-in-out infinite }
        .anim-shake   { animation:card-shake   .35s ease-in-out infinite }
        .anim-shuffle { animation:shuffle-spin .7s ease-in-out infinite }
        .anim-fadein  { animation:fade-in      .4s ease-out forwards }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">포인트 상점</h1>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest" style={{ color:'#5a7490' }}>보유 포인트</p>
            <p className="text-2xl font-black" style={{ color:'#00d97e' }}>{points.toLocaleString()}P</p>
          </div>
        </div>

        <div className="flex gap-0 border-b border-border">
          <TabBtn id="draw"    label="선수 뽑기" active={tab} onClick={setTab} />
          <TabBtn id="enhance" label="강화 시도" active={tab} onClick={setTab} />
          <TabBtn id="shuffle" label="선수 셔플" active={tab} onClick={setTab} />
        </div>

        {tab === 'draw'    && <DrawSection    points={points} setPoints={setPoints} />}
        {tab === 'enhance' && <EnhanceSection points={points} setPoints={setPoints} />}
        {tab === 'shuffle' && <ShuffleSection points={points} setPoints={setPoints} />}
      </div>
    </>
  );
}

// ── 탭1: 선수 뽑기 ────────────────────────────────────────────────────────────
function DrawSection({ points, setPoints }) {
  const [phase, setPhase]         = useState('idle');
  const [displayP, setDisplayP]   = useState(DRAW_PLAYERS[0]);
  const [result, setResult]       = useState(null);
  const [filterPos, setFilterPos] = useState('전체');
  const [showToast, setToast]     = useState(false);
  const timer = useRef(null);

  const pool = filterPos === '전체' ? DRAW_PLAYERS
    : DRAW_PLAYERS.filter(p => (POS_GROUPS[filterPos]||[]).includes(p.pos));

  const draw = () => {
    if (phase !== 'idle' || points < 100 || !pool.length) return;
    setPoints(p => p - 100); setPhase('spinning'); setResult(null);
    const final = pool[Math.floor(Math.random() * pool.length)];
    let elapsed = 0, delay = 60;
    const tick = () => {
      setDisplayP(DRAW_PLAYERS[Math.floor(Math.random() * DRAW_PLAYERS.length)]);
      elapsed += delay;
      if (elapsed > 2000) delay = Math.min(delay + 40, 500);
      if (elapsed >= 3500) {
        setDisplayP(final); setResult(final); setPhase('result');
        setToast(true); setTimeout(() => setToast(false), 3000); return;
      }
      timer.current = setTimeout(tick, delay);
    };
    timer.current = setTimeout(tick, delay);
  };
  const reset = () => { clearTimeout(timer.current); setPhase('idle'); setResult(null); };
  const r = result ? RARITY[result.rarity] : null;

  return (
    <div className="space-y-5">
      {showToast && result && (
        <div className="fixed top-20 z-50 px-6 py-3 rounded-xl font-black text-sm"
          style={{ left:'50%', background:RARITY[result.rarity].color, color:'#080c16', boxShadow:`0 0 32px ${RARITY[result.rarity].glow}`, animation:'toast-drop .3s ease-out forwards' }}>
          {result.name} 획득!
        </div>
      )}
      <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background:'#0d1526', border:'1px solid #1e2d45' }}>
        <span className="text-sm font-medium shrink-0" style={{ color:'#5a7490' }}>포지션</span>
        <div className="flex gap-2 flex-wrap">
          {['전체','공격수','미드필더','수비수','골키퍼'].map(pos => (
            <button key={pos} onClick={() => phase==='idle' && setFilterPos(pos)}
              className="px-3 py-1 rounded-lg text-xs font-bold"
              style={{ background:filterPos===pos?'#00d97e':'rgba(255,255,255,.04)', color:filterPos===pos?'#080c16':'#5a7490', border:`1px solid ${filterPos===pos?'#00d97e':'#1e2d45'}` }}>
              {pos}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs" style={{ color:'#5a7490' }}>{pool.length}명</span>
      </div>
      <div className="relative rounded-3xl flex flex-col items-center justify-center py-14"
        style={{ background:'linear-gradient(135deg,#0d1526,#111e38)', border:'1px solid #1e2d45', minHeight:340 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:phase==='result'&&r?`radial-gradient(ellipse at 50% 60%,${r.glow} 0%,transparent 60%)`:'radial-gradient(ellipse at 50% 60%,rgba(0,217,126,.07) 0%,transparent 60%)' }} />
        {phase==='idle' && (
          <div className="anim-float">
            <div className="w-40 h-56 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ background:'linear-gradient(135deg,#0a1628,#0d1f3c)', border:'2px solid #00d97e', boxShadow:'0 0 32px rgba(0,217,126,.3)' }}>
              <div className="text-5xl font-black" style={{ color:'#00d97e' }}>FC</div>
              <div className="text-xs tracking-widest uppercase" style={{ color:'#5a7490' }}>뽑기권</div>
            </div>
          </div>
        )}
        {phase==='spinning' && (
          <div className="anim-flicker">
            <PlayerCard player={displayP} rarity={RARITY[displayP.rarity]} />
          </div>
        )}
        {phase==='result' && result && (
          <div className="anim-reveal relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
              <div style={{ position:'absolute',top:0,width:'55%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',animation:'shine-sweep .9s ease-out .2s both' }} />
            </div>
            <PlayerCard player={result} rarity={r} large />
          </div>
        )}
        <p className="mt-6 text-sm" style={{ color:'#5a7490' }}>
          {phase==='idle'?'뽑기 1회 100P':phase==='spinning'?'뽑는 중...':result?`${result.name} 획득!`:''}
        </p>
      </div>
      <div className="flex gap-3">
        {phase==='result' ? (
          <>
            <button onClick={reset} className="flex-1 py-4 rounded-xl font-bold" style={{ background:'#141f35',color:'#e2eaf5',border:'1px solid #1e2d45' }}>다시 뽑기</button>
            <button className="flex-1 py-4 rounded-xl font-bold" style={{ background:'#00d97e',color:'#080c16' }}>선수단에 추가</button>
          </>
        ) : (
          <button onClick={draw} disabled={phase==='spinning'||points<100}
            className="w-full py-4 rounded-xl font-black text-lg"
            style={{ background:phase==='idle'&&points>=100?'#00d97e':'#1e2d45', color:phase==='idle'&&points>=100?'#080c16':'#5a7490', cursor:phase!=='idle'||points<100?'not-allowed':'pointer' }}>
            {phase==='spinning'?'뽑는 중...':points<100?'포인트 부족':'뽑기 (100P)'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── 탭2: 강화 시도 ────────────────────────────────────────────────────────────
function EnhanceSection({ points, setPoints }) {
  const [squad, setSquad]       = useState(INIT_SQUAD.map(p => ({...p})));
  const [selId, setSelId]       = useState(null);
  const [phase, setPhase]       = useState('idle'); // idle|trying|success|fail
  const timer = useRef(null);

  const player = squad.find(p => p.id === selId);
  const cfg    = player ? ENHANCE_TABLE.find(e => e.lv === player.enhance) : null;
  const maxed  = player && player.enhance >= 11;
  const enhBorder = player ? getEnhanceColor(player.enhance) : null;

  const tryEnhance = () => {
    if (!player || !cfg || points < cfg.cost || phase !== 'idle') return;
    setPoints(p => p - cfg.cost);
    setPhase('trying');
    timer.current = setTimeout(() => {
      const ok = Math.random() * 100 < cfg.rate;
      setPhase(ok ? 'success' : 'fail');
      if (ok) setSquad(sq => sq.map(p => p.id === selId ? {...p, enhance:p.enhance+1} : p));
      setTimeout(() => setPhase('idle'), 2200);
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border p-4" style={{ background:'#0d1526' }}>
        <p className="text-xs text-muted uppercase tracking-widest font-bold mb-3">내 선수단</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {squad.map(p => (
            <PlayerSlot
              key={p.id}
              name={p.name}
              pos={p.pos}
              ovr={p.ovr}
              enhance={p.enhance}
              selected={selId === p.id}
              onClick={phase === 'idle' ? () => setSelId(p.id) : undefined}
            />
          ))}
        </div>
      </div>

      {player && (
        <div className="rounded-2xl border overflow-hidden anim-fadein"
          style={{ background:'linear-gradient(135deg,#0d1526,#111e38)', borderColor:`${enhBorder}44` }}>
          <div className="p-6 flex flex-col items-center gap-5">
            <PlayerCard
              player={player}
              enhanceLevel={player.enhance}
              phase={phase}
              large
            />

            {!maxed && cfg && (
              <div className="w-full rounded-xl p-4 space-y-3" style={{ background:'rgba(255,255,255,.04)', border:'1px solid #1e2d45' }}>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">목표 강화</span>
                  <span className="font-black" style={{ color:getEnhanceColor(player.enhance + 1) }}>
                    +{player.enhance} → +{player.enhance + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">성공 확률</span>
                  <span className="font-black text-accent">{cfg.rate}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'#141f35' }}>
                  <div className="h-full rounded-full" style={{ width:`${cfg.rate}%`, background:'#00d97e' }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">소모 포인트</span>
                  <span className="font-black text-accent">{cfg.cost.toLocaleString()}P</span>
                </div>
              </div>
            )}
            {maxed && (
              <div className="w-full text-center py-3 rounded-xl font-bold text-sm"
                style={{ background:'rgba(255,215,0,.1)', color:'#FFD700', border:'1px solid rgba(255,215,0,.3)' }}>
                MAX 강화 완료
              </div>
            )}

            <button onClick={tryEnhance}
              disabled={!cfg || maxed || phase!=='idle' || points<(cfg?.cost||0)}
              className="w-full py-4 rounded-xl font-black text-lg transition-all"
              style={{
                background: maxed?'#1e2d45': phase==='success'?'#00d97e': phase==='fail'?'rgba(239,68,68,.3)': cfg&&points>=cfg.cost&&phase==='idle'?'#00d97e':'#1e2d45',
                color:      phase==='success'?'#080c16': phase==='fail'?'#ef4444': cfg&&points>=(cfg?.cost||0)&&phase==='idle'&&!maxed?'#080c16':'#5a7490',
                cursor:     !cfg||maxed||phase!=='idle'||points<(cfg?.cost||0)?'not-allowed':'pointer',
              }}>
              {phase==='trying'?'강화 중...': phase==='success'?`+${player.enhance} 강화 성공!`: phase==='fail'?'강화 실패...': maxed?'MAX 강화': !cfg?'강화 불가': points<cfg.cost?'포인트 부족': `강화 시도 (${cfg.cost.toLocaleString()}P)`}
            </button>
          </div>
        </div>
      )}
      {!player && (
        <div className="rounded-2xl border border-border p-12 text-center text-muted" style={{ background:'#0d1526' }}>
          강화할 선수를 선택하세요
        </div>
      )}
    </div>
  );
}

// ── 탭3: 선수 셔플 ────────────────────────────────────────────────────────────
function ShuffleSection({ points, setPoints }) {
  const [selSeasons, setSel] = useState(['24-25']);
  const [ovrMin, setMin]     = useState(80);
  const [ovrMax, setMax]     = useState(99);
  const [phase, setPhase]    = useState('idle'); // idle|shuffling|done
  const [result, setResult]  = useState(null);
  const COST = 300;

  const pool = ALL_PLAYERS.filter(p => selSeasons.includes(p.season) && p.ovr >= ovrMin && p.ovr <= ovrMax);

  const toggle = (s) => { if (phase==='idle') setSel(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]); };

  const doShuffle = () => {
    if (phase==='done') { setPhase('idle'); setResult(null); return; }
    if (phase!=='idle' || points<COST || !pool.length) return;
    setPoints(p => p - COST);
    setPhase('shuffling');
    setTimeout(() => {
      const shuffled = [...pool].sort(() => Math.random()-.5);
      const dist = Object.fromEntries(MANAGERS.map(m => [m,[]]));
      shuffled.forEach((p,i) => dist[MANAGERS[i % MANAGERS.length]].push(p));
      setResult(dist); setPhase('done');
    }, 2000);
  };

  const canRun = phase==='idle' && points>=COST && pool.length>0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border p-5 space-y-4" style={{ background:'#0d1526' }}>
        <div>
          <p className="text-xs text-muted uppercase tracking-widest font-bold mb-2">시즌 선택</p>
          <div className="flex gap-2">
            {SEASONS.map(s => (
              <button key={s} onClick={() => toggle(s)}
                className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{ background:selSeasons.includes(s)?'#00d97e':'rgba(255,255,255,.04)', color:selSeasons.includes(s)?'#080c16':'#5a7490', border:`1px solid ${selSeasons.includes(s)?'#00d97e':'#1e2d45'}` }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted uppercase tracking-widest font-bold mb-2">OVR 범위</p>
          <div className="flex items-center gap-3">
            <input type="number" min={70} max={99} value={ovrMin} onChange={e=>setMin(Number(e.target.value))}
              className="w-20 rounded-lg px-3 py-2 text-sm font-bold text-center"
              style={{ background:'#141f35', border:'1px solid #1e2d45', color:'#e2eaf5' }} />
            <span className="text-muted">~</span>
            <input type="number" min={70} max={99} value={ovrMax} onChange={e=>setMax(Number(e.target.value))}
              className="w-20 rounded-lg px-3 py-2 text-sm font-bold text-center"
              style={{ background:'#141f35', border:'1px solid #1e2d45', color:'#e2eaf5' }} />
            <span className="text-xs text-muted ml-1">
              해당 선수 <span className="font-black text-accent">{pool.length}명</span>
            </span>
          </div>
        </div>
        <div className="pt-1 text-xs text-muted">
          감독당 약 <span className="font-bold text-text">{pool.length ? Math.floor(pool.length/MANAGERS.length) : 0}~{pool.length ? Math.ceil(pool.length/MANAGERS.length) : 0}명</span> 배분 예정
        </div>
      </div>

      <div className="rounded-2xl border border-border p-8 flex flex-col items-center gap-5"
        style={{ background:'linear-gradient(135deg,#0d1526,#111e38)' }}>
        {phase==='shuffling' && (
          <div className="anim-shuffle w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{ background:'rgba(0,217,126,.1)', border:'2px solid #00d97e', color:'#00d97e' }}>
            S
          </div>
        )}
        {phase!=='shuffling' && (
          <p className="text-sm text-muted text-center">
            {phase==='done' ? '셔플 완료! 결과를 확인하세요.' : `${pool.length}명을 ${MANAGERS.length}명 감독에게 무작위 배분합니다.`}
          </p>
        )}
        <button onClick={doShuffle}
          disabled={!canRun && phase!=='done'}
          className="px-12 py-4 rounded-xl font-black text-lg transition-all"
          style={{
            background: phase==='done'?'rgba(0,217,126,.15)': canRun?'#00d97e':'#1e2d45',
            color:      phase==='done'?'#00d97e': canRun?'#080c16':'#5a7490',
            border:     phase==='done'?'1px solid #00d97e':'none',
            cursor:     !canRun && phase!=='done'?'not-allowed':'pointer',
          }}>
          {phase==='shuffling'?'셔플 중...': phase==='done'?'다시 셔플': !pool.length?'해당 선수 없음': `셔플 시작 (${COST}P)`}
        </button>
      </div>

      {phase==='done' && result && (
        <div className="space-y-3 anim-fadein">
          <p className="text-xs text-muted uppercase tracking-widest font-bold">배분 결과</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MANAGERS.map(m => (
              <div key={m} className="rounded-xl p-4 border" style={{ background:'rgba(255,255,255,.03)', border:'1px solid #1e2d45' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-accent">{m}</span>
                  <span className="text-xs text-muted">{result[m].length}명</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result[m].length ? result[m].map((p,i) => {
                    const slot = getOvrSlotStyle(p.ovr);
                    const posColor = getPositionColor(p.pos);
                    return (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
                        style={{ background:slot.background, color:slot.nameColor, border:`1px solid ${slot.border}` }}>
                        {p.name}
                        <span className="font-black" style={{ color:slot.accent }}>{p.ovr}</span>
                        <span className="w-0.5 h-3 rounded-full inline-block" style={{ background:posColor }} />
                      </span>
                    );
                  }) : <span className="text-xs text-muted">배분 없음</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
