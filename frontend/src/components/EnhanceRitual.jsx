import { Emblem } from './Emblem.jsx';
import { getCurveLabel } from '../constants/enhanceTension.js';
import { SOUL_POINT_STEP } from '../constants/managerPoints.js';

/** Build soul orb list from pledged support (10P = 1 soul) */
export function buildSoulOrbs(pledged) {
  const orbs = [];
  Object.entries(pledged).forEach(([managerName, amt]) => {
    const count = Math.floor(amt / SOUL_POINT_STEP);
    for (let i = 0; i < count; i += 1) {
      const angle = (orbs.length * 2.399963) % (Math.PI * 2);
      orbs.push({
        id: `${managerName}-${i}`,
        managerName,
        angle,
        radius: 118 + (orbs.length % 3) * 18,
      });
    }
  });
  return orbs;
}

function SoulOrb({ orb, index, total, progress }) {
  const absorbAt = (index + 1) / total;
  const absorbed = progress >= absorbAt;
  const vibrating = progress > 0.05 && !absorbed;
  const flyT = absorbed
    ? 1
    : Math.max(0, (progress - absorbAt * 0.6) / (absorbAt * 0.4));

  const x = absorbed ? 50 : 50 + Math.cos(orb.angle) * orb.radius * (1 - flyT * 0.92);
  const y = absorbed ? 50 : 50 + Math.sin(orb.angle) * orb.radius * (1 - flyT * 0.92);
  const scale = absorbed ? 0.1 : 1 - flyT * 0.8;
  const opacity = absorbed ? 0 : 1 - flyT * 0.25;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: 20,
        opacity,
        transition: absorbed ? 'opacity 0.3s ease-out, transform 0.3s ease-in' : 'none',
      }}
    >
      <div
        className={`flex flex-col items-center ${vibrating ? 'enhance-soul-vibrate' : ''}`}
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${10 + flyT * 20}px rgba(192,132,252,0.95))`,
        }}
      >
        <span className="text-lg leading-none mb-0.5">👻</span>
        <Emblem name={orb.managerName} size={26} />
      </div>
    </div>
  );
}

export default function EnhanceRitual({
  progress,
  curveKey,
  soulOrbs,
  effectiveRate,
  soulBonus,
  children,
}) {
  const pct = Math.round(progress * 100);
  const glow = 0.25 + progress * 0.75;
  const shakePx = Math.round(2 + progress * 12);

  const barGradient = soulBonus > 0
    ? `linear-gradient(90deg, #7c3aed 0%, #a855f7 ${30 + progress * 40}%, #00d97e 100%)`
    : `linear-gradient(90deg, #00d97e 0%, #FFD700 ${40 + progress * 50}%, #00ffaa 100%)`;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted font-bold uppercase tracking-wider">강화 진행</span>
        <span className="font-black text-accent tabular-nums text-lg">{pct}%</span>
      </div>

      <div
        className="relative h-5 rounded-full overflow-hidden enhance-tension-track"
        style={{
          background: '#141f35',
          boxShadow: `inset 0 0 14px rgba(0,0,0,0.55), 0 0 ${24 + progress * 48}px rgba(0,217,126,${glow * 0.4})`,
        }}
      >
        <div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: barGradient,
            boxShadow: `0 0 ${20 + progress * 36}px rgba(0,217,126,${glow * 0.65})`,
          }}
        >
          <div className="absolute inset-0 enhance-tension-shimmer pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-muted">
        <span>패턴: <span className="text-text font-bold">{getCurveLabel(curveKey)}</span></span>
        <span>목표 성공률 {effectiveRate}%</span>
      </div>

      {soulOrbs.length > 0 && (
        <p className="text-[10px] text-center font-bold" style={{ color: '#c084fc' }}>
          👻 영혼 {soulOrbs.length}기가 카드로 흡수 중...
        </p>
      )}

      <div
        className="relative mx-auto enhance-ritual-stage rounded-3xl py-4"
        style={{
          width: 'min(100%, 300px)',
          minHeight: 300,
          '--enhance-shake': `${shakePx}px`,
        }}
      >
        {progress > 0.05 && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none enhance-aura-pulse"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, rgba(0,217,126,${0.1 + progress * 0.3}) 0%, rgba(168,85,247,${soulBonus > 0 ? progress * 0.22 : 0}) 45%, transparent 72%)`,
            }}
          />
        )}

        {soulOrbs.map((orb, i) => (
          <SoulOrb
            key={orb.id}
            orb={orb}
            index={i}
            total={soulOrbs.length}
            progress={progress}
          />
        ))}

        <div className="relative z-10 flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
