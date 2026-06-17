import { getFormationCoords } from '../constants/formationLayouts.js';
import {
  getEnhanceLabelStyle,
  getPlayerSlotVisual,
  getPositionColor,
} from '../constants/playerColors.js';
import { ActivityBadge } from './ActivityBadge.jsx';
import { PlayerName } from './PlayerName.jsx';

function PitchPlayer({ name, pos, ovr, enhance }) {
  const visual = getPlayerSlotVisual(ovr, enhance);
  const posColor = getPositionColor(pos);

  return (
    <div
      className="relative flex flex-col items-center gap-0.5 w-[72px] sm:w-[80px] pointer-events-none select-none"
      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.55))' }}
    >
      <div
        className="relative w-full rounded-lg px-1.5 py-1.5 text-center overflow-hidden"
        style={{
          background: visual.background,
          border: visual.border,
          boxShadow: visual.boxShadow,
          backdropFilter: 'blur(4px)',
        }}
      >
        <ActivityBadge playerName={name} />
        <p className="text-[9px] font-black uppercase leading-none" style={{ color: posColor }}>
          {pos}
        </p>
        <div className="mt-0.5 px-0.5">
          <PlayerName name={name} stacked nameStyle={{ color: visual.nameColor }} nameClassName="text-[11px] font-bold" />
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-[10px] font-black" style={{ color: visual.accent }}>{ovr}</span>
          {enhance != null && (
            <span
              className="text-[9px] font-black px-0.5 rounded"
              style={{ ...getEnhanceLabelStyle(enhance), background: 'rgba(0,0,0,0.45)' }}
            >
              +{enhance}
            </span>
          )}
        </div>
      </div>
      <div
        className="w-2 h-2 rounded-full border border-white/40"
        style={{ background: posColor, boxShadow: `0 0 6px ${posColor}` }}
      />
    </div>
  );
}

export function PitchFormation({ formation, players, positions, ovrList, enhanceList = [] }) {
  const coords = getFormationCoords(formation);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2"
        style={{
          aspectRatio: '68 / 105',
          background: 'linear-gradient(180deg, #1a6b35 0%, #2d8a47 35%, #247a3d 65%, #1a6b35 100%)',
          borderColor: 'rgba(255,255,255,0.35)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* stripe pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 40px, transparent 40px, transparent 80px)',
          }}
        />

        {/* outer boundary */}
        <div className="absolute inset-[3%] border-2 border-white/50 rounded-sm pointer-events-none" />

        {/* halfway line */}
        <div className="absolute left-[3%] right-[3%] top-1/2 h-0.5 bg-white/45 -translate-y-1/2 pointer-events-none" />

        {/* center circle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/45 pointer-events-none"
          style={{ width: '22%', aspectRatio: '1' }}
        />
        <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 pointer-events-none" />

        {/* penalty areas */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[3%] border-2 border-t-0 border-white/40 pointer-events-none"
          style={{ width: '44%', height: '14%' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[3%] border-2 border-b-0 border-white/40 pointer-events-none"
          style={{ width: '44%', height: '14%' }}
        />

        {/* goal boxes */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[3%] border-2 border-t-0 border-white/35 pointer-events-none"
          style={{ width: '20%', height: '6%' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[3%] border-2 border-b-0 border-white/35 pointer-events-none"
          style={{ width: '20%', height: '6%' }}
        />

        {/* formation label */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black tracking-wider pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
        >
          {formation}
        </div>

        {/* players */}
        {players.map((name, i) => {
          const c = coords[i] ?? { x: 50, y: 50 };
          return (
            <div
              key={`${name}-${i}`}
              className="absolute z-10"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PitchPlayer
                name={name}
                pos={positions[i]}
                ovr={ovrList[i]}
                enhance={enhanceList[i]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
