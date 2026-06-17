import {
  getEnhanceLabelStyle,
  getOvrSlotStyle,
  getPositionColor,
} from '../constants/playerColors.js';
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
  const slot = getOvrSlotStyle(ovr);
  const posColor = getPositionColor(pos);
  const Tag = onClick ? 'button' : as;

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="rounded-xl p-3 text-left transition-all w-full"
      style={{
        background: selected
          ? `linear-gradient(145deg, ${slot.bgFrom}, ${slot.bgTo})`
          : slot.background,
        border: `1px solid ${selected ? posColor : slot.border}`,
        boxShadow: selected ? `0 0 16px ${posColor}33` : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-bold uppercase" style={{ color: posColor }}>
          {pos}
        </span>
        {enhance != null && (
          <span className="text-xs font-black" style={getEnhanceLabelStyle(enhance)}>
            +{enhance}
          </span>
        )}
      </div>
      <p className="text-sm truncate mb-2" style={{ color: slot.nameColor }}>
        <PlayerName name={name} cardSeason={cardSeason} stacked nameStyle={{ color: slot.nameColor }} />
      </p>
      <OvrBadge ovr={ovr} pos={pos} size="sm" />
    </Tag>
  );
}
