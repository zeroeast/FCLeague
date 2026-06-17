import { useState } from 'react';
import { getCardSeason, resolveCardSeason } from '../constants/seasonTags.js';

const SIZES = {
  xs: { h: 12, className: 'h-3' },
  sm: { h: 14, className: 'h-3.5' },
  md: { h: 18, className: 'h-[18px]' },
  lg: { h: 22, className: 'h-[22px]' },
};

export function SeasonIcon({
  playerName,
  cardSeason,
  size = 'sm',
  showCodeFallback = true,
  className = '',
}) {
  const [broken, setBroken] = useState(false);
  const season = resolveCardSeason(playerName, cardSeason ?? getCardSeason(playerName));
  const dim = SIZES[size] ?? SIZES.sm;

  if (!season?.iconUrl || broken) {
    if (!showCodeFallback) return null;
    return (
      <span
        className={`inline-flex items-center justify-center font-black text-slate-400 ${className}`}
        style={{ fontSize: dim.h - 4 }}
        title={season?.code}
      >
        {season?.code}
      </span>
    );
  }

  return (
    <img
      src={season.iconUrl}
      alt={season.code}
      title={season.code}
      onError={() => setBroken(true)}
      className={`inline-block w-auto object-contain shrink-0 ${dim.className} ${className}`}
      style={{ imageRendering: 'auto' }}
    />
  );
}
