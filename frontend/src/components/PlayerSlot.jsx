import {
  getEnhanceLabelStyle,
  getPlayerSlotVisual,
  getPositionColor,
} from '../constants/playerColors.js';
import { getActivityMeta } from '../constants/playerActivity.js';
import { ActivityBadge } from './ActivityBadge.jsx';
import { OvrBadge } from './OvrBadge.jsx';
import { PlayerName } from './PlayerName.jsx';

/** Compact player row / grid slot */
export function PlayerSlot({
  name,
  pos,
  ovr = 85,
  enhance = null,
  cardSeason = null,
  selected = false,
  onClick,
  as = 'div',
}) {
  const visual = getPlayerSlotVisual(ovr, enhance);
  const posColor = getPositionColor(pos);
  const activity = getActivityMeta(name);
  const Tag = onClick ? 'button' : as;

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="relative rounded-xl p-3 text-left transition-all w-full overflow-hidden"
      style={{
        background: visual.background,
        border: selected ? `2px solid ${posColor}` : visual.border,
        boxShadow: selected
          ? `0 0 20px ${posColor}55, ${visual.boxShadow}`
          : visual.boxShadow,
      }}
    >
      {enhance != null && enhance >= 5 && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-40"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${visual.enhColor}33 0%, transparent 65%)`,
          }}
        />
      )}

      <ActivityBadge playerName={name} />

      <div className="relative flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-bold uppercase" style={{ color: posColor }}>
          {pos}
        </span>
        {enhance != null && (
          <span
            className="text-xs font-black px-1.5 py-0.5 rounded"
            style={{
              ...getEnhanceLabelStyle(enhance),
              background: 'rgba(0,0,0,0.35)',
            }}
          >
            +{enhance}
          </span>
        )}
      </div>

      <p className="relative text-sm truncate mb-2 font-bold" style={{ color: visual.nameColor }}>
        <PlayerName name={name} cardSeason={cardSeason} stacked nameStyle={{ color: visual.nameColor }} />
      </p>

      <div className="relative flex items-end justify-between gap-2">
        <OvrBadge ovr={ovr} pos={pos} size="sm" />
        {activity.grade && (
          <span
            className="text-[9px] font-bold tabular-nums"
            style={{ color: activity.color }}
            title={`활약도 ${activity.score}`}
          >
            {activity.sellLabel}
          </span>
        )}
      </div>
    </Tag>
  );
}
