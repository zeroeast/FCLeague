import {
  getEnhanceColor,
  getEnhanceGlow,
  getEnhanceLabelStyle,
  getEnhanceTier,
  getPlayerSlotVisual,
  getPositionColor,
} from '../constants/playerColors.js';
import { getActivityMeta } from '../constants/playerActivity.js';
import { ActivityBadge } from './ActivityBadge.jsx';
import { OvrBadge } from './OvrBadge.jsx';
import { PlayerName } from './PlayerName.jsx';

export function PlayerCard({
  player,
  large = false,
  rarity = null,
  enhanceLevel = null,
  phase = 'idle',
  className = '',
}) {
  const enh = enhanceLevel ?? player.enhance;
  const visual = getPlayerSlotVisual(player.ovr, enh);
  const posColor = getPositionColor(player.pos);
  const activity = getActivityMeta(player.name);
  const enhColor = enh != null ? getEnhanceColor(enh) : null;
  const isSuccess = phase === 'success';
  const isFail = phase === 'fail';
  const isTrying = phase === 'trying';

  const borderColor = isFail ? '#ef4444' : visual.border;
  const boxShadow = isSuccess
    ? undefined
    : isFail
      ? '0 0 40px rgba(239,68,68,.65), 0 0 80px rgba(239,68,68,.35)'
      : visual.boxShadow;

  return (
    <div
      className={`${large ? 'w-44 h-60' : 'w-40 h-56'} rounded-2xl flex flex-col items-center justify-center gap-2 select-none relative overflow-hidden ${className}
        ${isTrying ? 'anim-shake gacha-card-charge' : ''} ${isSuccess ? 'anim-enhance-success gacha-jackpot-pop' : ''} ${isFail ? 'gacha-fail-shake' : ''}`}
      style={{
        background: visual.background,
        border: borderColor,
        boxShadow,
        '--enh-color': enhColor ?? visual.accent,
      }}
    >
      <ActivityBadge playerName={player.name} size="lg" />

      {enh != null && enh >= 5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 20%, ${enhColor}44 0%, transparent 55%)`,
          }}
        />
      )}

      {isSuccess && enhColor && (
        <div
          className="absolute inset-0 pointer-events-none anim-enhance-glow rounded-2xl gacha-flash-burst"
          style={{
            background: getEnhanceTier(enh) === 'platinum'
              ? 'radial-gradient(ellipse at 50% 45%, rgba(232,246,255,.85) 0%, rgba(200,220,255,.5) 35%, rgba(245,232,255,.3) 55%, transparent 75%)'
              : `radial-gradient(ellipse at 50% 45%, ${enhColor}aa 0%, ${enhColor}55 35%, ${enhColor}22 55%, transparent 75%)`,
          }}
        />
      )}

      {player.nation && (
        <span className="relative text-xs font-bold uppercase tracking-widest text-muted">{player.nation}</span>
      )}

      <span className="relative text-xs font-bold uppercase tracking-widest" style={{ color: posColor }}>
        {player.pos}
      </span>

      <span className={`relative ${large ? 'text-xl' : 'text-lg'} text-center px-2 leading-tight font-bold`}>
        <PlayerName
          name={player.name}
          cardSeason={player.cardSeason}
          stacked
          nameClassName={large ? 'text-xl' : 'text-lg'}
          nameStyle={{ color: visual.nameColor }}
        />
      </span>

      <OvrBadge ovr={player.ovr} pos={player.pos} size={large ? 'lg' : 'md'} />

      {enh != null && (
        <span
          className="relative text-sm font-black px-2 py-0.5 rounded"
          style={{ ...getEnhanceLabelStyle(enh), background: 'rgba(0,0,0,0.4)' }}
        >
          +{enh}
        </span>
      )}

      {activity.grade && (
        <span className="relative text-[10px] font-bold" style={{ color: activity.color }}>
          활약 {activity.score} · {activity.sellLabel}
        </span>
      )}

      {rarity && (
        <span
          className="relative text-xs font-black px-3 py-0.5 rounded-full"
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
        <span className="relative text-xs text-muted">{player.club}</span>
      )}

      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl anim-success-overlay gacha-win-overlay">
          <span
            className="text-2xl font-black anim-success-text gacha-win-text"
            style={{ color: enhColor ?? '#FFD700' }}
          >
            SUCCESS!
          </span>
        </div>
      )}

      {isFail && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl gacha-fail-overlay"
        >
          <span className="text-2xl font-black text-red-400 gacha-fail-text">
            FAIL
          </span>
        </div>
      )}
    </div>
  );
}
