import {
  getEnhanceColor,
  getEnhanceGlow,
  getOvrSlotStyle,
  getPositionColor,
} from '../constants/playerColors.js';
import { OvrBadge } from './OvrBadge.jsx';

export function PlayerCard({
  player,
  large = false,
  rarity = null,
  enhanceLevel = null,
  phase = 'idle',
  className = '',
}) {
  const slot = getOvrSlotStyle(player.ovr);
  const posColor = getPositionColor(player.pos);
  const enh = enhanceLevel ?? player.enhance;
  const enhColor = enh != null ? getEnhanceColor(enh) : null;
  const isSuccess = phase === 'success';
  const isFail = phase === 'fail';
  const isTrying = phase === 'trying';

  const borderColor = isFail ? '#ef4444' : enhColor ?? slot.border;
  const boxShadow = isSuccess
    ? undefined
    : isFail
      ? '0 0 30px rgba(239,68,68,.5)'
      : enhColor
        ? getEnhanceGlow(enh)
        : slot.glow;

  return (
    <div
      className={`${large ? 'w-44 h-60' : 'w-40 h-56'} rounded-2xl flex flex-col items-center justify-center gap-2 select-none relative overflow-hidden ${className}
        ${isTrying ? 'anim-shake' : ''} ${isSuccess ? 'anim-enhance-success' : ''}`}
      style={{
        background: slot.background,
        border: `2px solid ${borderColor}`,
        boxShadow,
        '--enh-color': enhColor ?? slot.accent,
      }}
    >
      {isSuccess && enhColor && (
        <div
          className="absolute inset-0 pointer-events-none anim-enhance-glow rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 45%, ${enhColor}88 0%, rgba(139,92,246,.35) 35%, ${enhColor}22 55%, transparent 75%)`,
          }}
        />
      )}

      {player.nation && (
        <span className="text-xs font-bold uppercase tracking-widest text-muted">{player.nation}</span>
      )}

      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: posColor }}
      >
        {player.pos}
      </span>

      <span
        className={`${large ? 'text-xl' : 'text-lg'} font-black text-center px-2 leading-tight`}
        style={{ color: slot.nameColor }}
      >
        {player.name}
      </span>

      <OvrBadge ovr={player.ovr} pos={player.pos} size={large ? 'lg' : 'md'} />

      {enh != null && (
        <span
          className="text-sm font-black"
          style={{ color: enhColor }}
        >
          +{enh}
        </span>
      )}

      {rarity && (
        <span
          className="text-xs font-black px-3 py-0.5 rounded-full"
          style={{
            background: rarity.bg,
            color: rarity.color,
            border: `1px solid ${rarity.color}`,
          }}
        >
          {rarity.label}
        </span>
      )}

      {player.club && (
        <span className="text-xs text-muted">{player.club}</span>
      )}

      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl anim-success-overlay">
          <span
            className="text-2xl font-black anim-success-text"
            style={{ color: enhColor ?? '#FFD700' }}
          >
            SUCCESS
          </span>
        </div>
      )}

      {isFail && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{ background: 'rgba(239,68,68,.18)' }}
        >
          <span className="text-2xl font-black text-red-400" style={{ textShadow: '0 0 20px rgba(239,68,68,.8)' }}>
            FAIL
          </span>
        </div>
      )}
    </div>
  );
}
