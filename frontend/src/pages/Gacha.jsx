import { useState, useRef } from 'react';

const PLAYERS = [
  { id: 1,  name: '손흥민',    pos: 'LW',  ovr: 93, rarity: 'S', nation: '한국',   club: '토트넘' },
  { id: 2,  name: '음바페',    pos: 'ST',  ovr: 95, rarity: 'S', nation: '프랑스', club: 'PSG' },
  { id: 3,  name: '홀란드',    pos: 'ST',  ovr: 97, rarity: 'S', nation: '노르웨이', club: '맨시티' },
  { id: 4,  name: '살라',      pos: 'RW',  ovr: 91, rarity: 'S', nation: '이집트', club: '리버풀' },
  { id: 5,  name: '비니시우스', pos: 'LW',  ovr: 92, rarity: 'S', nation: '브라질', club: '레알마드리드' },
  { id: 6,  name: '로드리',    pos: 'CM',  ovr: 91, rarity: 'A', nation: '스페인', club: '맨시티' },
  { id: 7,  name: '반다이크',  pos: 'CB',  ovr: 90, rarity: 'A', nation: '네덜란드', club: '리버풀' },
  { id: 8,  name: '알리송',    pos: 'GK',  ovr: 90, rarity: 'A', nation: '브라질', club: '리버풀' },
  { id: 9,  name: '사카',      pos: 'RW',  ovr: 87, rarity: 'A', nation: '잉글랜드', club: '아스날' },
  { id: 10, name: '트렌트',    pos: 'RB',  ovr: 88, rarity: 'A', nation: '잉글랜드', club: '리버풀' },
  { id: 11, name: '김민재',    pos: 'CB',  ovr: 87, rarity: 'B', nation: '한국',   club: '뮌헨' },
  { id: 12, name: '황희찬',    pos: 'LW',  ovr: 82, rarity: 'B', nation: '한국',   club: '울버햄튼' },
  { id: 13, name: '이강인',    pos: 'CAM', ovr: 83, rarity: 'B', nation: '한국',   club: 'PSG' },
  { id: 14, name: '가비',      pos: 'CM',  ovr: 86, rarity: 'B', nation: '스페인', club: '바르셀로나' },
  { id: 15, name: '루카쿠',    pos: 'ST',  ovr: 85, rarity: 'B', nation: '벨기에', club: '로마' },
];

const POS_GROUPS = {
  '공격수': ['ST', 'LW', 'RW', 'CF'],
  '미드필더': ['CM', 'CAM', 'CDM', 'LM', 'RM'],
  '수비수': ['CB', 'LB', 'RB', 'LWB', 'RWB'],
  '골키퍼': ['GK'],
};

const RARITY = {
  S: { color: '#FFD700', glow: 'rgba(255,215,0,0.5)',   bg: 'rgba(255,215,0,0.07)',   label: 'S급' },
  A: { color: '#a855f7', glow: 'rgba(168,85,247,0.5)',  bg: 'rgba(168,85,247,0.07)',  label: 'A급' },
  B: { color: '#00d97e', glow: 'rgba(0,217,126,0.5)',   bg: 'rgba(0,217,126,0.07)',   label: 'B급' },
};

export default function Gacha() {
  const [phase, setPhase] = useState('idle');
  const [displayPlayer, setDisplayPlayer] = useState(PLAYERS[0]);
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(500);
  const [filterPos, setFilterPos] = useState('전체');
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef(null);

  const getPool = () => {
    if (filterPos === '전체') return PLAYERS;
    const positions = POS_GROUPS[filterPos] || [];
    return PLAYERS.filter(p => positions.includes(p.pos));
  };

  const handleDraw = () => {
    if (phase !== 'idle' || points < 100) return;
    const pool = getPool();
    if (pool.length === 0) return;

    setPoints(p => p - 100);
    setPhase('spinning');
    setResult(null);

    const finalPlayer = pool[Math.floor(Math.random() * pool.length)];
    let elapsed = 0;
    let delay = 60;

    const tick = () => {
      setDisplayPlayer(PLAYERS[Math.floor(Math.random() * PLAYERS.length)]);
      elapsed += delay;
      if (elapsed > 2000) delay = Math.min(delay + 40, 500);
      if (elapsed >= 3500) {
        setDisplayPlayer(finalPlayer);
        setResult(finalPlayer);
        setPhase('result');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, delay);
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setPhase('idle');
    setResult(null);
    setDisplayPlayer(PLAYERS[0]);
  };

  const r = result ? RARITY[result.rarity] : null;
  const pool = getPool();

  return (
    <>
      <style>{`
        @keyframes card-reveal {
          0%   { transform: rotateY(90deg) scale(0.8); opacity: 0; }
          60%  { transform: rotateY(-8deg) scale(1.05); }
          100% { transform: rotateY(0deg)  scale(1);    opacity: 1; }
        }
        @keyframes shine-sweep {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes toast-drop {
          0%   { transform: translateX(-50%) translateY(-16px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0);     opacity: 1; }
        }
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes spin-flicker {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes bg-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        .anim-reveal  { animation: card-reveal  0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .anim-float   { animation: card-float   3s ease-in-out infinite; }
        .anim-flicker { animation: spin-flicker 0.14s ease-in-out infinite; }
        .anim-bgpulse { animation: bg-pulse     1.4s ease-in-out infinite; }
      `}</style>

      <div className="max-w-2xl mx-auto space-y-5">

        {showToast && result && (
          <div
            className="fixed top-20 z-50 px-6 py-3 rounded-xl font-black text-sm"
            style={{
              left: '50%',
              background: RARITY[result.rarity].color,
              color: '#080c16',
              boxShadow: `0 0 32px ${RARITY[result.rarity].glow}`,
              animation: 'toast-drop 0.3s ease-out forwards',
            }}
          >
            {result.rarity === 'S' ? '!!! ' : ''}{result.name} 획득!{result.rarity === 'S' ? ' !!!' : ''}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">선수 뽑기</h1>
            <p className="text-sm mt-1" style={{ color: '#5a7490' }}>우승 포인트로 선수를 뽑아보세요</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest" style={{ color: '#5a7490' }}>보유 포인트</p>
            <p className="text-2xl font-black" style={{ color: '#00d97e' }}>{points.toLocaleString()}P</p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{ background: '#0d1526', border: '1px solid #1e2d45' }}
        >
          <span className="text-sm font-medium shrink-0" style={{ color: '#5a7490' }}>포지션</span>
          <div className="flex gap-2 flex-wrap">
            {['전체', '공격수', '미드필더', '수비수', '골키퍼'].map(pos => (
              <button
                key={pos}
                onClick={() => phase === 'idle' && setFilterPos(pos)}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: filterPos === pos ? '#00d97e' : 'rgba(255,255,255,0.04)',
                  color:      filterPos === pos ? '#080c16' : '#5a7490',
                  border:     `1px solid ${filterPos === pos ? '#00d97e' : '#1e2d45'}`,
                  cursor:     phase !== 'idle' ? 'not-allowed' : 'pointer',
                }}
              >
                {pos}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs" style={{ color: '#5a7490' }}>{pool.length}명</span>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0d1526, #111e38)',
            border: '1px solid #1e2d45',
            minHeight: 380,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none anim-bgpulse"
            style={{
              background: phase === 'result' && r
                ? `radial-gradient(ellipse at 50% 60%, ${r.glow} 0%, transparent 60%)`
                : 'radial-gradient(ellipse at 50% 60%, rgba(0,217,126,0.07) 0%, transparent 60%)',
              transition: 'background 0.5s',
            }}
          />

          {phase === 'idle' && (
            <div className="anim-float">
              <div
                className="w-40 h-56 rounded-2xl flex flex-col items-center justify-center gap-3 select-none"
                style={{
                  background: 'linear-gradient(135deg, #0a1628, #0d1f3c)',
                  border: '2px solid #00d97e',
                  boxShadow: '0 0 32px rgba(0,217,126,0.3), inset 0 0 24px rgba(0,217,126,0.05)',
                }}
              >
                <div className="text-5xl font-black" style={{ color: '#00d97e' }}>FC</div>
                <div className="text-xs tracking-widest uppercase" style={{ color: '#5a7490' }}>League</div>
                <div
                  className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: 'rgba(0,217,126,0.1)', color: '#00d97e', border: '1px solid rgba(0,217,126,0.3)' }}
                >
                  뽑기권
                </div>
              </div>
            </div>
          )}

          {phase === 'spinning' && (
            <div className="anim-flicker">
              <PlayerCard player={displayPlayer} rarity={RARITY[displayPlayer.rarity]} />
            </div>
          )}

          {phase === 'result' && result && (
            <div className="anim-reveal relative">
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
              >
                <div
                  style={{
                    position: 'absolute', top: 0, width: '55%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                    animation: 'shine-sweep 0.9s ease-out 0.2s both',
                  }}
                />
              </div>
              <PlayerCard player={result} rarity={r} large />
            </div>
          )}

          <p
            className="mt-8 text-sm relative z-10"
            style={{ color: '#5a7490' }}
          >
            {phase === 'idle'    && '뽑기 1회당 100P 소모'}
            {phase === 'spinning' && '뽑는 중...'}
            {phase === 'result'  && result && `${result.name} 선수가 선수단에 추가됩니다`}
          </p>
        </div>

        <div className="flex gap-3">
          {phase === 'result' ? (
            <>
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-xl font-bold text-base transition-all"
                style={{ background: '#141f35', color: '#e2eaf5', border: '1px solid #1e2d45' }}
              >
                다시 뽑기
              </button>
              <button
                className="flex-1 py-4 rounded-xl font-bold text-base"
                style={{ background: '#00d97e', color: '#080c16' }}
              >
                선수단에 추가
              </button>
            </>
          ) : (
            <button
              onClick={handleDraw}
              disabled={phase === 'spinning' || points < 100}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all"
              style={{
                background: phase === 'idle' && points >= 100 ? '#00d97e' : '#1e2d45',
                color:      phase === 'idle' && points >= 100 ? '#080c16' : '#5a7490',
                cursor:     phase !== 'idle' || points < 100  ? 'not-allowed' : 'pointer',
              }}
            >
              {phase === 'spinning' ? '뽑는 중...' : points < 100 ? '포인트 부족' : '뽑기  (100P)'}
            </button>
          )}
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: '#0d1526', border: '1px solid #1e2d45' }}
        >
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#5a7490' }}>
            뽑기 대상  ({pool.length}명)
          </p>
          <div className="flex flex-wrap gap-2">
            {pool.map(p => (
              <span
                key={p.id}
                className="text-xs px-2 py-1 rounded-lg font-medium"
                style={{
                  background: RARITY[p.rarity].bg,
                  color:      RARITY[p.rarity].color,
                  border:     `1px solid ${RARITY[p.rarity].color}44`,
                }}
              >
                {p.name} {p.ovr}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PlayerCard({ player, rarity, large }) {
  const w = large ? 'w-44' : 'w-40';
  const h = large ? 'h-60' : 'h-56';
  return (
    <div
      className={`${w} ${h} rounded-2xl flex flex-col items-center justify-center gap-2 select-none relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, #0a1628, ${rarity.bg})`,
        border:     `2px solid ${rarity.color}`,
        boxShadow:  `0 0 40px ${rarity.glow}, 0 0 12px ${rarity.glow}`,
      }}
    >
      <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#5a7490' }}>{player.nation}</div>
      <div className="text-xs font-bold tracking-widest uppercase" style={{ color: rarity.color }}>{player.pos}</div>
      <div className="text-xl font-black text-center px-2" style={{ color: '#e2eaf5' }}>{player.name}</div>
      <div className="text-4xl font-black" style={{ color: rarity.color }}>{player.ovr}</div>
      <div
        className="text-xs font-black px-3 py-0.5 rounded-full"
        style={{ background: rarity.bg, color: rarity.color, border: `1px solid ${rarity.color}` }}
      >
        {rarity.label}
      </div>
      <div className="text-xs" style={{ color: '#5a7490' }}>{player.club}</div>
    </div>
  );
}
