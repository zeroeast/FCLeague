import { useMemo, useState } from 'react';
import { ABILITY_POOL, pickAbilitiesByName } from '../constants/managerTraits.js';

const MANAGERS = ['영동', '준현', '종성', '민혁', '삼주', '영모', '진수', '기성'];

function TraitNode({ trait, level, onPlus, onMinus }) {
  return (
    <div
      className="border p-3 space-y-2"
      style={{
        borderColor: `${trait.accent}66`,
        background: `linear-gradient(145deg, rgba(255,255,255,.03), ${trait.glow})`,
        boxShadow: `inset 2px 0 0 ${trait.accent}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black px-2 py-0.5" style={{ color: trait.accent, border: `1px solid ${trait.accent}` }}>
          {trait.icon}
        </span>
        <span className="text-[11px] text-muted">Lv.{level}</span>
      </div>
      <p className="text-sm font-black text-text leading-tight">{trait.name}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          className="w-8 h-8 border text-sm font-black"
          style={{ borderColor: '#1e2d45' }}
        >
          -
        </button>
        <div className="flex-1 h-2 bg-bg-elevated overflow-hidden">
          <div className="h-full" style={{ width: `${Math.min(level, 5) * 20}%`, background: trait.accent }} />
        </div>
        <button
          type="button"
          onClick={onPlus}
          className="w-8 h-8 border text-sm font-black"
          style={{ borderColor: trait.accent, color: trait.accent }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TraitsInvestment() {
  const [selectedManager, setSelectedManager] = useState(MANAGERS[0]);
  const [investPoints, setInvestPoints] = useState(20);
  const [levels, setLevels] = useState({});

  const activeTraits = useMemo(() => pickAbilitiesByName(selectedManager), [selectedManager]);

  const getLevel = (id) => levels[id] ?? 0;
  const addPoint = (id) => {
    if (investPoints <= 0) return;
    setLevels((prev) => ({ ...prev, [id]: Math.min((prev[id] ?? 0) + 1, 5) }));
    setInvestPoints((p) => p - 1);
  };
  const removePoint = (id) => {
    if ((levels[id] ?? 0) <= 0) return;
    setLevels((prev) => ({ ...prev, [id]: (prev[id] ?? 0) - 1 }));
    setInvestPoints((p) => p + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">감독 특성 투자</h1>
        <div className="text-sm font-bold">
          남은 포인트 <span className="text-accent text-lg">{investPoints}P</span>
        </div>
      </div>

      <section className="border p-4 space-y-4" style={{ borderColor: '#1e2d45', background: 'linear-gradient(135deg,#0d1526,#111e38)' }}>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">감독 선택</label>
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="bg-bg-elevated border border-border px-3 py-2 text-sm"
          >
            {MANAGERS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted">정복자 포인트처럼 특성 노드에 투자하여 레벨을 올리는 UI 샘플입니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeTraits.map((trait) => (
            <TraitNode
              key={trait.id}
              trait={trait}
              level={getLevel(trait.id)}
              onPlus={() => addPoint(trait.id)}
              onMinus={() => removePoint(trait.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black">감독 특성 리스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ABILITY_POOL.map((trait) => (
            <article
              key={trait.id}
              className="border p-4"
              style={{ borderColor: '#1e2d45', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-black" style={{ color: trait.accent }}>{trait.name}</p>
                <span className="text-[11px] text-muted">
                  {trait.cost ? `${trait.cost}P · 소모형` : '패시브'}
                </span>
              </div>
              <p className="text-sm text-text mt-1">{trait.description}</p>
              <p className="text-xs text-muted mt-1">{trait.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
