import { getOvrTier, getPositionColor } from '../constants/playerColors.js';

/** OVR number with a thin position-color bar on the right */
export function OvrBadge({ ovr, pos, size = 'md' }) {
  const tier = getOvrTier(ovr);
  const posColor = getPositionColor(pos);
  const sizes = {
    sm: { ovr: 'text-xl', bar: 'h-6 w-0.5' },
    md: { ovr: 'text-4xl', bar: 'h-9 w-1' },
    lg: { ovr: 'text-5xl', bar: 'h-11 w-1' },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${s.ovr} font-black leading-none`} style={{ color: tier.accent }}>
        {ovr}
      </span>
      <div
        className={`${s.bar} rounded-full shrink-0`}
        style={{ background: posColor, boxShadow: `0 0 6px ${posColor}88` }}
        title={pos}
      />
    </div>
  );
}
