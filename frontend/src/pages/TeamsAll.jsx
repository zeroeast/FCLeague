import { useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';
import TeamDetailPanel from '../components/TeamDetailPanel.jsx';
import { formatPoints, getManagerPointsMap } from '../constants/managerPoints.js';
import { MANAGERS, formatSquadValue } from '../constants/teamsData.js';

const MANAGER_POINTS = getManagerPointsMap();

export default function TeamsAll() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">8명 감독의 팀 스쿼드와 보유 스킬을 확인합니다.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MANAGERS.map((m) => (
          <button
            key={m.name}
            type="button"
            onClick={() => setSelected(selected?.name === m.name ? null : m)}
            className="text-left rounded-2xl p-5 border transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(135deg, #0d1526, #111e38)',
              border: selected?.name === m.name ? '1px solid #00d97e' : '1px solid #1e2d45',
              boxShadow: selected?.name === m.name ? '0 0 20px rgba(0,217,126,0.2)' : 'none',
            }}
          >
            <Emblem name={m.name} size={72} />
            <p className="font-black text-base text-text mt-3">{m.name}</p>
            <p className="text-xs text-muted mt-0.5">{m.formation}</p>
            <div className="mt-3 w-full flex justify-between text-xs">
              <span className="text-muted">OVR</span>
              <span className="font-black text-accent">{m.ovr}</span>
            </div>
            <div className="w-full flex justify-between text-xs">
              <span className="text-muted">승점</span>
              <span className="font-black text-text">{m.pts}pt</span>
            </div>
            <div className="w-full flex justify-between text-xs mt-0.5">
              <span className="text-muted">보유 포인트</span>
              <span className="font-black text-accent">{formatPoints(MANAGER_POINTS[m.name])}</span>
            </div>
            <div className="w-full flex justify-between text-xs mt-0.5">
              <span className="text-muted">구단가치</span>
              <span className="font-black" style={{ color: '#FFD700' }}>{formatSquadValue(m.squadValue)}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <TeamDetailPanel
          manager={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
