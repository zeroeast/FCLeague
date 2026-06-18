import { useState, useRef, useEffect } from 'react';
import { PlayerCard } from '../components/PlayerCard.jsx';
import { PlayerSlot } from '../components/PlayerSlot.jsx';
import { Emblem } from '../components/Emblem.jsx';
import { PlayerName } from '../components/PlayerName.jsx';
import EnhanceRitual, { buildSoulOrbs } from '../components/EnhanceRitual.jsx';
import { getEnhanceColor, getEnhanceLabelStyle, getOvrSlotStyle, getPositionColor } from '../constants/playerColors.js';
import {
  ENHANCE_TRY_MS,
  ENHANCE_RESULT_MS,
  getTensionProgress,
  pickTensionCurve,
} from '../constants/enhanceTension.js';
import { getCardSeason } from '../constants/seasonTags.js';
import {
  MANAGER_NAMES,
  SAMPLE_CURRENT_MANAGER,
  getManagerPointsMap,
  calcSoulBonusRate,
  SOUL_POINT_STEP,
  formatPoints,
} from '../constants/managerPoints.js';

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
const MANAGERS = MANAGER_NAMES;
const SEASONS  = ['22-23','23-24','24-25'];

/** 프로토타입: 강화·영혼보내기 시 포인트 차감 없음 (디버깅용) */
const ENHANCE_PROTOTYPE_FREE = true;

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

export function GachaPanel({ className = '', fullWidth = false }) {
  const [tab, setTab] = useState('draw');
  const [managerPoints, setManagerPoints] = useState(() => ({ ...getManagerPointsMap() }));
  const currentUser = SAMPLE_CURRENT_MANAGER;
  const points = managerPoints[currentUser];

  const setMyPoints = (updater) => {
    setManagerPoints((mp) => ({
      ...mp,
      [currentUser]: typeof updater === 'function' ? updater(mp[currentUser]) : updater,
    }));
  };

  return (
    <div className={`space-y-5 ${fullWidth ? 'max-w-4xl mx-auto' : ''} ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Point Content</p>
          <h2 className={`font-black text-text ${fullWidth ? 'text-2xl' : 'text-lg'}`}>포인트 콘텐츠</h2>
          <p className="text-xs text-muted mt-0.5">{currentUser} 감독 · 뽑기 · 강화 · 셔플</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-muted">보유 포인트</p>
          <p className={`font-black text-accent ${fullWidth ? 'text-3xl' : 'text-xl'}`}>{formatPoints(points)}</p>
        </div>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        <TabBtn id="draw"    label="선수 뽑기" active={tab} onClick={setTab} />
        <TabBtn id="enhance" label="강화 시도" active={tab} onClick={setTab} />
        <TabBtn id="shuffle" label="선수 셔플" active={tab} onClick={setTab} />
      </div>

      {tab === 'draw'    && <DrawSection    points={points} setPoints={setMyPoints} fullWidth={fullWidth} />}
      {tab === 'enhance' && (
        <EnhanceSection
          points={points}
          currentUser={currentUser}
          managerPoints={managerPoints}
          setManagerPoints={setManagerPoints}
          fullWidth={fullWidth}
        />
      )}
      {tab === 'shuffle' && <ShuffleSection points={points} setPoints={setMyPoints} fullWidth={fullWidth} />}
    </div>
  );
}

/** @deprecated use GachaPanel inside Shop */
export default function Gacha() {
  return (
    <div className="max-w-2xl mx-auto">
      <GachaPanel />
    </div>
  );
}

// ── 탭1: 선수 뽑기 ────────────────────────────────────────────────────────────
function DrawSection({ points, setPoints, fullWidth }) {
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

  const stageClass = phase === 'spinning' ? 'gacha-stage gacha-stage--spinning' : phase === 'result' ? 'gacha-stage gacha-stage--result' : 'gacha-stage';

  return (
    <div className="space-y-5">
      {showToast && result && (
        <div
          className="fixed top-20 z-50 px-8 py-4 rounded-2xl font-black text-base gacha-toast-jackpot"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            background: RARITY[result.rarity].color,
            color: '#080c16',
            boxShadow: `0 0 48px ${RARITY[result.rarity].glow}, 0 0 96px ${RARITY[result.rarity].glow}`,
          }}
        >
          ★ {getCardSeason(result.name).code} {result.name} 획득! ★
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
      <div
        className={`relative rounded-3xl flex flex-col items-center justify-center py-14 overflow-hidden ${stageClass}`}
        style={{
          background: 'linear-gradient(135deg,#0a0e18,#0d1526,#111e38)',
          border: phase === 'result' && r ? `2px solid ${r.color}` : '1px solid #1e2d45',
          minHeight: fullWidth ? 400 : 340,
          boxShadow: phase === 'result' && r ? `0 0 60px ${r.glow}, 0 0 120px ${r.glow}` : 'none',
        }}
      >
        {phase === 'spinning' && (
          <div
            className="absolute inset-0 pointer-events-none gacha-radial-bg opacity-30"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(0,217,126,0.4), transparent, rgba(168,85,247,0.4), transparent)',
            }}
          />
        )}
        {phase === 'result' && (
          <div className="absolute inset-0 pointer-events-none gacha-screen-flash" style={{ background: 'rgba(255,255,255,0.15)' }} />
        )}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:phase==='result'&&r?`radial-gradient(ellipse at 50% 60%,${r.glow} 0%,transparent 65%)`:'radial-gradient(ellipse at 50% 60%,rgba(0,217,126,.1) 0%,transparent 60%)' }} />
        {phase==='idle' && (
          <div className="anim-float">
            <div className="w-40 h-56 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ background:'linear-gradient(135deg,#0a1628,#0d1f3c)', border:'2px solid #00d97e', boxShadow:'0 0 48px rgba(0,217,126,.45), 0 0 80px rgba(0,217,126,.2)' }}>
              <div className="text-5xl font-black" style={{ color:'#00d97e', textShadow:'0 0 24px rgba(0,217,126,.8)' }}>FC</div>
              <div className="text-xs tracking-widest uppercase" style={{ color:'#5a7490' }}>뽑기권</div>
            </div>
          </div>
        )}
        {phase==='spinning' && (
          <div className="gacha-vortex relative">
            <PlayerCard player={displayP} rarity={RARITY[displayP.rarity]} />
          </div>
        )}
        {phase==='result' && result && (
          <div className="anim-reveal-dopamine gacha-jackpot-pop relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 gacha-flash-burst" />
              <div style={{ position:'absolute',top:0,width:'55%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)',animation:'shine-sweep .9s ease-out .2s both' }} />
            </div>
            <PlayerCard player={result} rarity={r} large />
          </div>
        )}
        <p className="mt-6 text-sm" style={{ color:'#5a7490' }}>
          {phase==='idle'?'뽑기 1회 100P':phase==='spinning'?'뽑는 중...':result?`${getCardSeason(result.name).code} ${result.name} 획득!`:''}
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
function SoulSupportPanel({ currentUser, managerPoints, soulSupport, setSoulSupport, disabled }) {
  const helpers = MANAGER_NAMES.filter((n) => n !== currentUser);
  const totalSoul = helpers.reduce((sum, name) => sum + (soulSupport[name] || 0), 0);
  const bonus = calcSoulBonusRate(totalSoul);

  const adjust = (name, delta) => {
    setSoulSupport((prev) => {
      const cur = prev[name] || 0;
      const max = managerPoints[name];
      return { ...prev, [name]: Math.max(0, Math.min(cur + delta, max)) };
    });
  };

  return (
    <div
      className="w-full rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.35)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#c084fc' }}>
            👻 영혼보내기
          </p>
          <p className="text-[11px] text-muted mt-1 leading-relaxed">
            다른 감독이 10P 지원 시 성공률 +5% · 성공/실패 무관하게 지원 포인트 차감
          </p>
        </div>
        {bonus > 0 && (
          <span className="shrink-0 px-2 py-1 rounded-lg text-sm font-black text-accent bg-accent/10 border border-accent/30">
            +{bonus}%
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {helpers.map((name) => {
          const pledged = soulSupport[name] || 0;
          const canAdd = !disabled && pledged + SOUL_POINT_STEP <= managerPoints[name];
          const canSub = !disabled && pledged >= SOUL_POINT_STEP;
          return (
            <div
              key={name}
              className="flex items-center gap-2 p-2.5 rounded-lg"
              style={{ background: pledged > 0 ? 'rgba(168,85,247,0.12)' : 'rgba(0,0,0,0.2)' }}
            >
              <Emblem name={name} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold">{name}</p>
                <p className="text-[10px] text-muted">보유 {formatPoints(managerPoints[name])}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!canSub}
                  onClick={() => adjust(name, -SOUL_POINT_STEP)}
                  className="w-7 h-7 rounded-md text-sm font-black disabled:opacity-30"
                  style={{ background: '#141f35', color: '#e2eaf5', border: '1px solid #1e2d45' }}
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-black tabular-nums" style={{ color: pledged ? '#c084fc' : '#5a7490' }}>
                  {pledged}P
                </span>
                <button
                  type="button"
                  disabled={!canAdd}
                  onClick={() => adjust(name, SOUL_POINT_STEP)}
                  className="w-7 h-7 rounded-md text-sm font-black disabled:opacity-30"
                  style={{ background: '#a855f7', color: '#080c16' }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {totalSoul > 0 && (
        <p className="text-[10px] text-center text-muted border-t border-border/40 pt-2">
          영혼 합계 <span className="font-black text-accent">{totalSoul}P</span> · 확률 보너스{' '}
          <span className="font-black" style={{ color: '#c084fc' }}>+{bonus}%</span>
        </p>
      )}
    </div>
  );
}

function EnhanceSection({ points, currentUser, managerPoints, setManagerPoints, fullWidth }) {
  const [squad, setSquad] = useState(INIT_SQUAD.map((p) => ({ ...p })));
  const [selId, setSelId] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [soulSupport, setSoulSupport] = useState({});
  const [tryProgress, setTryProgress] = useState(0);
  const [curveKey, setCurveKey] = useState('linear');
  const [soulOrbs, setSoulOrbs] = useState([]);

  const rafRef = useRef(null);
  const resultTimerRef = useRef(null);
  const tryStartRef = useRef(0);
  const outcomeRef = useRef(false);
  const selIdRef = useRef(null);
  const effectiveRateRef = useRef(0);

  const player = squad.find((p) => p.id === selId);
  const cfg = player ? ENHANCE_TABLE.find((e) => e.lv === player.enhance) : null;
  const maxed = player && player.enhance >= 11;
  const enhBorder = player ? getEnhanceColor(player.enhance) : null;

  const totalSoul = Object.values(soulSupport).reduce((a, b) => a + b, 0);
  const soulBonus = calcSoulBonusRate(totalSoul);
  const effectiveRate = cfg ? Math.min(100, cfg.rate + soulBonus) : 0;

  const soulValid = Object.entries(soulSupport).every(([name, amt]) => amt <= managerPoints[name]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
  }, []);

  useEffect(() => {
    if (phase !== 'trying') return undefined;

    const tick = (now) => {
      const elapsed = now - tryStartRef.current;
      const progress = getTensionProgress(elapsed, ENHANCE_TRY_MS, curveKey);
      setTryProgress(progress);

      if (elapsed < ENHANCE_TRY_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const ok = outcomeRef.current;
      setPhase(ok ? 'success' : 'fail');
      if (ok) {
        const id = selIdRef.current;
        setSquad((sq) => sq.map((p) => (p.id === id ? { ...p, enhance: p.enhance + 1 } : p)));
      }
      resultTimerRef.current = setTimeout(() => {
        setPhase('idle');
        setTryProgress(0);
        setSoulOrbs([]);
      }, ENHANCE_RESULT_MS);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, curveKey]);

  const canAfford = ENHANCE_PROTOTYPE_FREE || points >= (cfg?.cost ?? 0);

  const tryEnhance = () => {
    if (!player || !cfg || !canAfford || phase !== 'idle' || !soulValid) return;

    const pledged = { ...soulSupport };
    outcomeRef.current = Math.random() * 100 < effectiveRate;
    selIdRef.current = selId;
    effectiveRateRef.current = effectiveRate;

    if (!ENHANCE_PROTOTYPE_FREE) {
      setManagerPoints((mp) => {
        const next = { ...mp, [currentUser]: mp[currentUser] - cfg.cost };
        Object.entries(pledged).forEach(([name, amt]) => {
          if (amt > 0) next[name] = next[name] - amt;
        });
        return next;
      });
    }

    setSoulOrbs(buildSoulOrbs(pledged));
    setCurveKey(pickTensionCurve(Date.now() + (player?.id ?? 0) + totalSoul));
    setSoulSupport({});
    setTryProgress(0);
    tryStartRef.current = performance.now();
    setPhase('trying');
  };

  const isTrying = phase === 'trying';

  return (
    <div className="space-y-5">
      {ENHANCE_PROTOTYPE_FREE && (
        <p
          className="text-[11px] font-bold text-center py-2 px-3 rounded-lg"
          style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          프로토타입 모드 — 강화·영혼보내기 포인트 차감 없음
        </p>
      )}
      <div className="rounded-2xl border border-border p-4" style={{ background: '#0d1526' }}>
        <p className="text-xs text-muted uppercase tracking-widest font-bold mb-3">내 선수단</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {squad.map((p) => (
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
        <div
          className={`rounded-2xl border overflow-hidden anim-fadein gacha-stage ${isTrying ? 'gacha-stage--spinning' : phase === 'success' ? 'gacha-stage--result' : ''}`}
          style={{
            background: 'linear-gradient(135deg,#0d1526,#111e38)',
            borderColor: `${enhBorder}66`,
            boxShadow: phase === 'success' ? `0 0 60px ${enhBorder}88` : 'none',
          }}
        >
          <div className="p-6 flex flex-col items-center gap-5">
            {isTrying ? (
              <EnhanceRitual
                progress={tryProgress}
                curveKey={curveKey}
                soulOrbs={soulOrbs}
                effectiveRate={effectiveRateRef.current}
                soulBonus={soulOrbs.length > 0 ? calcSoulBonusRate(soulOrbs.length * SOUL_POINT_STEP) : 0}
              >
                <PlayerCard
                  player={player}
                  enhanceLevel={player.enhance}
                  phase="trying"
                  large
                />
              </EnhanceRitual>
            ) : (
              <PlayerCard
                player={player}
                enhanceLevel={player.enhance}
                phase={phase}
                large
              />
            )}

            {!maxed && cfg && !isTrying && (
              <div className="w-full rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid #1e2d45' }}>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">목표 강화</span>
                  <span className="font-black" style={getEnhanceLabelStyle(player.enhance + 1)}>
                    +{player.enhance} → +{player.enhance + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">기본 성공률</span>
                  <span className="font-black text-muted">{cfg.rate}%</span>
                </div>
                {soulBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#c084fc' }}>영혼보내기 보너스</span>
                    <span className="font-black" style={{ color: '#c084fc' }}>+{soulBonus}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">최종 성공률</span>
                  <span className="font-black text-accent">{effectiveRate}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#141f35' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${effectiveRate}%`,
                      background: soulBonus > 0 ? 'linear-gradient(90deg,#a855f7,#00d97e)' : '#00d97e',
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">내 강화 비용</span>
                  <span className="font-black text-accent">{cfg.cost.toLocaleString()}P</span>
                </div>
                {totalSoul > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted">영혼보내기 (타 감독 차감)</span>
                    <span className="font-bold" style={{ color: '#c084fc' }}>{totalSoul.toLocaleString()}P</span>
                  </div>
                )}
              </div>
            )}

            {!maxed && cfg && !isTrying && (
              <SoulSupportPanel
                currentUser={currentUser}
                managerPoints={managerPoints}
                soulSupport={soulSupport}
                setSoulSupport={setSoulSupport}
                disabled={phase !== 'idle'}
              />
            )}
            {maxed && (
              <div
                className="w-full text-center py-3 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,215,0,.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,.3)' }}
              >
                MAX 강화 완료
              </div>
            )}

            <button
              type="button"
              onClick={tryEnhance}
              disabled={!cfg || maxed || phase !== 'idle' || !canAfford || !soulValid}
              className="w-full py-4 rounded-xl font-black text-lg transition-all"
              style={{
                background: maxed ? '#1e2d45' : phase === 'success' ? '#00d97e' : phase === 'fail' ? 'rgba(239,68,68,.3)' : cfg && canAfford && phase === 'idle' ? '#00d97e' : '#1e2d45',
                color: phase === 'success' ? '#080c16' : phase === 'fail' ? '#ef4444' : cfg && canAfford && phase === 'idle' && !maxed ? '#080c16' : '#5a7490',
                cursor: !cfg || maxed || phase !== 'idle' || !canAfford ? 'not-allowed' : 'pointer',
              }}
            >
              {isTrying
                ? `강화 진행 중... ${Math.round(tryProgress * 100)}%`
                : phase === 'success'
                  ? `+${player.enhance} 강화 성공!`
                  : phase === 'fail'
                    ? '강화 실패...'
                    : maxed
                      ? 'MAX 강화'
                      : !cfg
                        ? '강화 불가'
                        : !canAfford
                          ? '포인트 부족'
                          : ENHANCE_PROTOTYPE_FREE
                            ? `강화 시도 (무료 · ${cfg.cost.toLocaleString()}P)`
                            : `강화 시도 (${cfg.cost.toLocaleString()}P)`}
            </button>
          </div>
        </div>
      )}
      {!player && (
        <div className="rounded-2xl border border-border p-12 text-center text-muted" style={{ background: '#0d1526' }}>
          강화할 선수를 선택하세요
        </div>
      )}
    </div>
  );
}

// ── 탭3: 선수 셔플 ────────────────────────────────────────────────────────────
function ShuffleSection({ points, setPoints, fullWidth }) {
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

      <div className={`relative rounded-2xl border border-border p-8 flex flex-col items-center gap-5 gacha-stage ${phase==='shuffling' ? 'gacha-stage--spinning' : phase==='done' ? 'gacha-stage--result' : ''}`}
        style={{ background:'linear-gradient(135deg,#0d1526,#111e38)', minHeight: fullWidth ? 200 : 160 }}>
        {phase==='shuffling' && (
          <>
            <div className="absolute inset-0 pointer-events-none gacha-screen-flash opacity-20" style={{ background: 'rgba(0,217,126,0.3)' }} />
            <div className="gacha-shuffle-burst w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black"
              style={{ background:'rgba(0,217,126,.15)', border:'3px solid #00d97e', color:'#00d97e', boxShadow:'0 0 48px rgba(0,217,126,.6)' }}>
              ⚡
            </div>
          </>
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
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 flex-wrap"
                        style={{ background:slot.background, color:slot.nameColor, border:`1px solid ${slot.border}` }}>
                        <PlayerName name={p.name} nameClassName="text-xs" />
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
