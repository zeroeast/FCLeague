import { getActivityMeta } from '../constants/playerActivity.js';

export function ActivityBadge({ playerName, size = 'sm' }) {
  const meta = getActivityMeta(playerName);
  if (!meta.grade) return null;

  const isLg = size === 'lg';

  return (
    <span
      className={`absolute z-10 font-black leading-none rounded pointer-events-none ${
        isLg ? 'top-1.5 right-1.5 text-[10px] px-1.5 py-0.5' : 'top-1 right-1 text-[8px] px-1 py-px'
      }`}
      style={{
        color: '#080c16',
        background: meta.color,
        boxShadow: `0 0 10px ${meta.glow}, 0 0 20px ${meta.glow}`,
        textShadow: '0 1px 0 rgba(255,255,255,0.35)',
      }}
      title={`활약도 ${meta.score} · ${meta.sellLabel}`}
    >
      {meta.label}
    </span>
  );
}
