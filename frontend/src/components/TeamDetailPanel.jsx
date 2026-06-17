import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Emblem } from './Emblem.jsx';
import { PitchFormation } from './PitchFormation.jsx';
import { pickAbilitiesByName } from '../constants/managerTraits.js';
import { getFormationPositions } from '../constants/formationLayouts.js';
import { formatPoints, getManagerPointsMap } from '../constants/managerPoints.js';
import { SLOT_OVR, SLOT_ENH, formatSquadValue } from '../constants/teamsData.js';

const MANAGER_POINTS = getManagerPointsMap();

function getTooltipStyle(rect) {
  const width = 320;
  const margin = 12;
  let left = rect.left - width - margin;
  let top = rect.top;

  if (left < margin) left = rect.right + margin;
  if (left + width > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - width - margin);
  }
  if (top + 200 > window.innerHeight - margin) {
    top = Math.max(margin, window.innerHeight - 220);
  }

  return { left, top, width };
}

function AbilityTooltip({ ability, rect }) {
  if (!ability || !rect) return null;

  const pos = getTooltipStyle(rect);

  return createPortal(
    <div
      className="fixed z-[9999] p-4 border pointer-events-none"
      style={{
        left: pos.left,
        top: pos.top,
        width: pos.width,
        background: 'linear-gradient(180deg, #0f1a2e 0%, #0a1220 100%)',
        borderColor: `${ability.accent}88`,
        boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 28px ${ability.glow}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-0.5 text-[10px] font-black"
          style={{ background: `${ability.accent}33`, color: ability.accent, border: `1px solid ${ability.accent}` }}
        >
          {ability.icon}
        </span>
        <p className="text-sm font-black" style={{ color: ability.accent }}>{ability.name}</p>
      </div>
      <p className="text-[13px] text-text leading-relaxed">{ability.description}</p>
      {ability.detail && (
        <p className="text-[12px] mt-2 leading-relaxed" style={{ color: '#c7d4e8' }}>
          {ability.detail}
        </p>
      )}
      <div className="mt-3 pt-2 border-t border-border/60 flex justify-between text-[11px]">
        <span className="text-muted">
          타입: {ability.oneShot ? '액티브 (발동 후 소모)' : '패시브 (지속)'}
        </span>
        {ability.cost && <span className="font-black" style={{ color: ability.accent }}>{ability.cost}P</span>}
      </div>
    </div>,
    document.body,
  );
}

function AbilityCard({ ability, onHover, onLeave }) {
  const costLabel = ability.cost ? `${ability.cost}P` : '패시브';
  const typeLabel = ability.oneShot ? '액티브' : '패시브';

  return (
    <div
      onMouseEnter={(e) => onHover(ability, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={onLeave}
    >
      <div
        className="flex gap-3 p-3 border cursor-default transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${ability.glow} 120%)`,
          borderColor: `${ability.accent}66`,
          boxShadow: `inset 3px 0 0 ${ability.accent}, 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
      >
        <div
          className="w-11 h-11 shrink-0 flex items-center justify-center text-[10px] font-black tracking-wider"
          style={{
            background: `${ability.accent}22`,
            border: `1px solid ${ability.accent}`,
            color: ability.accent,
            boxShadow: `0 0 12px ${ability.glow}`,
          }}
        >
          {ability.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-black text-text leading-tight">{ability.name}</p>
            <span
              className="shrink-0 px-2 py-0.5 text-[10px] font-black"
              style={{
                background: ability.cost ? `${ability.accent}22` : 'rgba(0,217,126,0.12)',
                color: ability.cost ? ability.accent : '#00d97e',
                border: `1px solid ${ability.cost ? ability.accent : '#00d97e'}55`,
              }}
            >
              {costLabel}
            </span>
          </div>
          <p className="text-[11px] text-muted mt-1 line-clamp-1">{ability.description}</p>
          <p className="text-[10px] font-bold mt-1.5 uppercase tracking-wider" style={{ color: ability.accent }}>
            {typeLabel}
            {ability.coachSlots ? ` · 코치 ${ability.coachSlots}명` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TeamDetailPanel({ manager, onClose, showClose = true }) {
  const [abilityTooltip, setAbilityTooltip] = useState(null);
  const abilities = useMemo(() => pickAbilitiesByName(manager.name), [manager.name]);

  return (
    <>
      <div
        className="rounded-2xl border border-accent/30 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1526, #0d1f20)', boxShadow: '0 0 32px rgba(0,217,126,0.1)' }}
      >
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Emblem name={manager.name} size={56} />
            <div>
              <p className="text-xl font-black">{manager.name} 감독</p>
              <p className="text-sm text-muted">
                {manager.formation} · 팀 OVR <span className="text-accent font-bold">{manager.ovr}</span>
                · 승점 <span className="font-bold">{manager.pts}pt</span>
                · 보유 포인트 <span className="font-bold text-accent">{formatPoints(MANAGER_POINTS[manager.name])}</span>
                · 구단가치 <span className="font-bold" style={{ color: '#FFD700' }}>{formatSquadValue(manager.squadValue)} BP</span>
              </p>
            </div>
          </div>
          {showClose && (
            <button
              type="button"
              onClick={() => { setAbilityTooltip(null); onClose?.(); }}
              className="text-muted hover:text-text text-2xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-elevated/50 shrink-0"
            >
              ×
            </button>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-3">
            <p className="text-xs text-muted uppercase tracking-widest font-bold text-center lg:text-left">
              Best 11 · 포메이션
            </p>
            <PitchFormation
              formation={manager.formation}
              players={manager.best11}
              positions={getFormationPositions(manager.formation)}
              ovrList={SLOT_OVR}
              enhanceList={SLOT_ENH}
            />
          </div>

          <div
            className="p-4 border space-y-3 rounded-xl"
            style={{
              background: 'linear-gradient(160deg, rgba(0,217,126,0.06) 0%, rgba(13,21,38,0.95) 45%)',
              borderColor: 'rgba(0,217,126,0.25)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold">Manager Skill</p>
              <p className="text-sm font-black text-text">감독 스킬</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
              {abilities.map((ability) => (
                <AbilityCard
                  key={`${manager.name}-${ability.id}`}
                  ability={ability}
                  onHover={(ab, rect) => setAbilityTooltip({ ability: ab, rect })}
                  onLeave={() => setAbilityTooltip(null)}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted text-center">카드에 마우스를 올리면 상세 설명이 표시됩니다</p>
          </div>
        </div>
      </div>

      <AbilityTooltip ability={abilityTooltip?.ability} rect={abilityTooltip?.rect} />
    </>
  );
}
