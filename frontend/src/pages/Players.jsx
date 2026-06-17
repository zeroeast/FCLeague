import { useState } from 'react';

const POSITIONS = ['전체', 'ST', 'CF', 'CAM', 'CM', 'CDM', 'LW', 'RW', 'LB', 'RB', 'CB', 'GK'];
const ENHANCE_LEVELS = [5, 6, 7, 8, 9, 10, 11];

export default function Players() {
  const [filters, setFilters] = useState({
    name: '', position: '전체', enhance: '',
    minSpeed: '', minShoot: '', minPass: '',
    minDribble: '', minDefense: '', minPhysical: '',
  });

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🔍 선수 검색</h1>

      {/* 필터 패널 */}
      <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="선수 이름 검색..."
            value={filters.name}
            onChange={(e) => setFilter('name', e.target.value)}
            className="flex-1 bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <select
            value={filters.position}
            onChange={(e) => setFilter('position', e.target.value)}
            className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            {POSITIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select
            value={filters.enhance}
            onChange={(e) => setFilter('enhance', e.target.value)}
            className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            <option value="">강화 전체</option>
            {ENHANCE_LEVELS.map((lv) => (
              <option key={lv} value={lv}>{lv}강</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            ['minSpeed','속력'], ['minShoot','슈팅'], ['minPass','패스'],
            ['minDribble','드리블'], ['minDefense','수비'], ['minPhysical','피지컬'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs text-muted block mb-1">{label} 최소</label>
              <input
                type="number" min={0} max={200} placeholder="0"
                value={filters[key]}
                onChange={(e) => setFilter(key, e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>

        <button className="w-full py-2 bg-accent text-bg-base font-semibold text-sm rounded-md hover:opacity-90 transition">
          검색
        </button>
      </div>

      {/* 결과 */}
      <div className="bg-bg-surface border border-border rounded-xl p-10 text-center text-muted">
        <p className="text-4xl mb-4">🔍</p>
        <p className="font-semibold">선수 데이터를 불러오는 중...</p>
        <p className="text-sm mt-1">넥슨 API 연동 후 선수 목록이 표시됩니다.</p>
      </div>
    </div>
  );
}
