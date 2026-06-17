import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Emblem } from '../components/Emblem.jsx';
import TeamDetailPanel from '../components/TeamDetailPanel.jsx';
import { getManagerAbilitiesWithLevels } from '../constants/managerTraits.js';
import { formatPoints, getManagerPointsMap } from '../constants/managerPoints.js';
import { MANAGERS, formatSquadValue } from '../constants/teamsData.js';

const MANAGER_POINTS = getManagerPointsMap();

const SORT_COLUMNS = [
  { key: 'name', label: '감독', type: 'string' },
  { key: 'ovr', label: '평균 OVR', type: 'number' },
  { key: 'pts', label: '승점', type: 'number' },
  { key: 'points', label: '보유 포인트', type: 'number' },
  { key: 'squadValue', label: '구단가치', type: 'number' },
  { key: 'traitCount', label: '보유 특성', type: 'number' },
];

function buildRows() {
  return MANAGERS.map((m) => {
    const traits = getManagerAbilitiesWithLevels(m.name);
    return {
      ...m,
      points: MANAGER_POINTS[m.name],
      traits,
      traitCount: traits.length,
    };
  });
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="text-muted/40 ml-1">↕</span>;
  return <span className="text-accent ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
}

function TraitTooltip({ trait, rect }) {
  if (!trait || !rect) return null;

  const width = 280;
  let left = rect.left + rect.width / 2 - width / 2;
  let top = rect.bottom + 8;

  if (left < 8) left = 8;
  if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
  if (top + 160 > window.innerHeight) top = rect.top - 8 - 140;

  return createPortal(
    <div
      className="fixed z-[9999] p-3 border pointer-events-none rounded-xl"
      style={{
        left,
        top,
        width,
        background: 'linear-gradient(180deg, #0f1a2e 0%, #0a1220 100%)',
        borderColor: `${trait.accent}88`,
        boxShadow: `0 12px 32px rgba(0,0,0,0.55), 0 0 20px ${trait.glow}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="px-1.5 py-0.5 text-[9px] font-black"
          style={{ background: `${trait.accent}33`, color: trait.accent, border: `1px solid ${trait.accent}` }}
        >
          {trait.icon}
        </span>
        <p className="text-sm font-black text-text">{trait.shortName}</p>
        <span className="ml-auto text-[10px] font-black text-muted">Lv.{trait.level}</span>
      </div>
      <p className="text-[11px] text-muted leading-relaxed">{trait.description}</p>
      <p className="text-[10px] mt-1.5" style={{ color: trait.accent }}>
        {trait.oneShot ? '액티브 · 발동 후 소모' : '패시브 · 지속'}
      </p>
    </div>,
    document.body,
  );
}

function TraitIcons({ traits, onHover, onLeave }) {
  return (
    <div className="flex flex-wrap gap-1 justify-center" onMouseLeave={onLeave}>
      {traits.map((trait) => (
        <button
          key={trait.id}
          type="button"
          className="relative w-7 h-7 rounded-md flex items-center justify-center text-[8px] font-black transition-transform hover:scale-110"
          style={{
            background: `${trait.accent}22`,
            border: `1px solid ${trait.accent}88`,
            color: trait.accent,
            boxShadow: `0 0 8px ${trait.glow}`,
          }}
          onMouseEnter={(e) => onHover(trait, e.currentTarget.getBoundingClientRect())}
          onClick={(e) => e.stopPropagation()}
        >
          {trait.icon}
          <span
            className="absolute -bottom-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded text-[8px] font-black leading-none flex items-center justify-center"
            style={{ background: '#0d1526', border: `1px solid ${trait.accent}`, color: trait.accent }}
          >
            {trait.level}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function TeamsAll() {
  const [selected, setSelected] = useState(null);
  const [sortKey, setSortKey] = useState('pts');
  const [sortDir, setSortDir] = useState('desc');
  const [showGuide, setShowGuide] = useState(false);
  const [traitTooltip, setTraitTooltip] = useState(null);

  const rows = useMemo(() => buildRows(), []);

  const sortedRows = useMemo(() => {
    const col = SORT_COLUMNS.find((c) => c.key === sortKey);
    const getVal = (row) => {
      if (sortKey === 'points') return row.points;
      if (sortKey === 'traitCount') return row.traitCount;
      return row[sortKey];
    };

    return [...rows].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      let cmp = 0;
      if (col?.type === 'string') cmp = String(av).localeCompare(String(bv), 'ko');
      else cmp = av - bv;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted">8명 감독 팀을 간략 보기로 비교합니다.</p>
        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
        >
          {showGuide ? '보는 법 닫기' : '보는 법'}
        </button>
      </div>

      {showGuide && (
        <div
          className="rounded-xl border p-4 text-sm space-y-2"
          style={{ background: 'rgba(0,217,126,0.05)', borderColor: 'rgba(0,217,126,0.2)' }}
        >
          <p className="font-black text-accent">보는 법</p>
          <ul className="text-muted space-y-1.5 text-xs leading-relaxed list-disc list-inside">
            <li>각 행을 클릭하면 Best 11·감독 스킬·서브 명단 <strong className="text-text">상세 보기</strong>가 열립니다.</li>
            <li>열 제목(감독, 평균 OVR, 승점 등)을 클릭하면 해당 항목 기준 <strong className="text-text">오름차순/내림차순</strong>으로 정렬됩니다. 같은 열을 다시 누르면 방향이 바뀝니다.</li>
            <li><strong className="text-text">보유 특성</strong> 아이콘에 마우스를 올리면 특성 이름·레벨·설명이 표시됩니다. 숫자 뱃지는 특성 레벨(Lv)입니다.</li>
            <li>평균 OVR은 Best 11 기준 팀 전체 오버롤, 구단가치는 선수 시세 합산 샘플 값입니다.</li>
          </ul>
        </div>
      )}

      <div
        className="rounded-2xl border border-border overflow-hidden overflow-x-auto"
        style={{ background: 'linear-gradient(135deg, #0d1526, #111e38)' }}
      >
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wide border-b border-border">
              {SORT_COLUMNS.map(({ key, label }) => (
                <th key={key} className="px-3 py-3 text-left">
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className="inline-flex items-center font-bold hover:text-accent transition-colors whitespace-nowrap"
                  >
                    {label}
                    <SortIcon active={sortKey === key} dir={sortDir} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const isSelected = selected?.name === row.name;
              return (
                <tr
                  key={row.name}
                  onClick={() => setSelected(isSelected ? null : row)}
                  className="border-b border-border/40 cursor-pointer transition-colors hover:bg-bg-elevated/50"
                  style={{
                    background: isSelected ? 'rgba(0,217,126,0.06)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #00d97e' : '3px solid transparent',
                  }}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Emblem name={row.name} size={36} />
                      <div>
                        <p className="font-black text-text">{row.name}</p>
                        <p className="text-[10px] text-muted">{row.formation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-black text-accent tabular-nums">{row.ovr}</td>
                  <td className="px-3 py-3 text-center font-black tabular-nums">{row.pts}</td>
                  <td className="px-3 py-3 text-center font-bold text-accent tabular-nums text-xs">
                    {formatPoints(row.points)}
                  </td>
                  <td className="px-3 py-3 text-center font-black tabular-nums" style={{ color: '#FFD700' }}>
                    {formatSquadValue(row.squadValue)}
                  </td>
                  <td className="px-3 py-3">
                    <TraitIcons
                      traits={row.traits}
                      onHover={(trait, rect) => setTraitTooltip({ trait, rect })}
                      onLeave={() => setTraitTooltip(null)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <TeamDetailPanel manager={selected} onClose={() => setSelected(null)} />
      )}

      <TraitTooltip trait={traitTooltip?.trait} rect={traitTooltip?.rect} />
    </div>
  );
}
