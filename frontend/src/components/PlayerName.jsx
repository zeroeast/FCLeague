import { resolveCardSeason } from '../constants/seasonTags.js';
import { SeasonIcon } from './SeasonIcon.jsx';

/**
 * FC card season icon + player name.
 * @param {boolean} stacked - vertical layout for tight slots (pitch)
 */
export function PlayerName({
  name,
  cardSeason,
  className = '',
  nameClassName = '',
  stacked = false,
  nameStyle,
  iconSize = 'sm',
}) {
  const season = resolveCardSeason(name, cardSeason);

  if (stacked) {
    return (
      <span className={`block text-center ${className}`}>
        <span className="flex justify-center mb-0.5">
          <SeasonIcon playerName={name} cardSeason={season} size={iconSize} />
        </span>
        <span className={`block font-black truncate leading-tight ${nameClassName}`} style={nameStyle}>
          {name}
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 min-w-0 ${className}`}>
      <SeasonIcon playerName={name} cardSeason={season} size={iconSize} />
      <span className={`font-bold truncate ${nameClassName}`} style={nameStyle}>{name}</span>
    </span>
  );
}
