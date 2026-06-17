import { useMemo, useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';
import { PitchFormation } from '../components/PitchFormation.jsx';
import { pickAbilitiesByName } from '../constants/managerTraits.js';
import { getFormationPositions } from '../constants/formationLayouts.js';

const MANAGERS = [
  { name:'영동', formation:'4-3-3',   ovr:91, pts:28,
    best11:['홀란드','손흥민','비니시우스','살라','데브라이너','로드리','트렌트','반다이크','뤼디거','데이비드','알리송'] },
  { name:'준현', formation:'4-2-3-1', ovr:90, pts:23,
    best11:['음바페','사카','벨링엄','브루노','카제미루','로드리고','아놀드','밀리탕','마르키뇨스','루카스','마이냥'] },
  { name:'종성', formation:'4-4-2',   ovr:89, pts:20,
    best11:['살라','홀란드','디아스','맥알리스터','그라베','소보슬라이','반다이크','마티프','알렉산더','코나테','알리송'] },
  { name:'민혁', formation:'3-5-2',   ovr:88, pts:17,
    best11:['비니시우스','발베르데','차메니','크로스','카르바할','밀리탕','나초','쿠르투아','홀란드','핀토','호드리구'] },
  { name:'삼주', formation:'4-3-3',   ovr:87, pts:13,
    best11:['홀란드','마르티네스','가나초','에릭센','카세미로','메이누','달로트','마과이어','리산드로','린달로프','드헤아'] },
  { name:'영모', formation:'4-2-3-1', ovr:86, pts:11,
    best11:['이강인','음바페','파비안','하쿠미','김민재','파블로','우가르테','페레이라','누뇨','쿠아레스마','동나루마'] },
  { name:'진수', formation:'5-3-2',   ovr:85, pts:7,
    best11:['황희찬','루카쿠','코디','할란드','무이','손흥민','트리피어','막과이어','포포비치','살라흐','미뇨레'] },
  { name:'기성', formation:'4-3-3',   ovr:84, pts:4,
    best11:['김민재','이강인','황희찬','가비','페드리','파블로','아라우호','크리스텐센','발데','에릭가르시아','테어슈테겐'] },
];

/** Sample OVR / enhance per slot until API provides real values */
const SLOT_OVR = [97, 93, 92, 91, 91, 91, 88, 90, 89, 87, 90];
const SLOT_ENH = [8, 7, 7, 6, 5, 5, 5, 6, 5, 4, 5];

function AbilityCard({ ability }) {
  const costLabel = ability.cost ? `${ability.cost}P` : '지속형';
  const typeLabel = ability.oneShot ? '소모형' : '패시브';

  return (
    <div className="relative group">
      <div
        className="flex gap-3 p-3 border cursor-default transition-all group-hover:-translate-y-0.5"
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
          <p className="text-[11px] text-muted mt-1 line-clamp-2">{ability.description}</p>
          <p className="text-[10px] font-bold mt-1.5 uppercase tracking-wider" style={{ color: ability.accent }}>
            {typeLabel}
            {ability.coachSlots ? ` · 코치 ${ability.coachSlots}명` : ''}
          </p>
        </div>
      </div>

      <div
        className="absolute right-0 top-full mt-2 w-80 p-4 border opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition z-30"
        style={{
          background: 'linear-gradient(180deg, #0f1a2e 0%, #0a1220 100%)',
          borderColor: `${ability.accent}88`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.55), 0 0 24px ${ability.glow}`,
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
          <span className="text-muted">타입: {ability.oneShot ? '소모형 (사용 시 사라짐)' : '지속형'}</span>
          {ability.cost && <span className="font-black" style={{ color: ability.accent }}>{ability.cost}P</span>}
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const [selected, setSelected] = useState(null);
  const managerAbilities = useMemo(() => {
    const map = {};
    MANAGERS.forEach((manager) => {
      map[manager.name] = pickAbilitiesByName(manager.name);
    });
    return map;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">팀</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MANAGERS.map((m) => (
          <button key={m.name} onClick={() => setSelected(selected?.name === m.name ? null : m)}
            className="text-left rounded-2xl p-5 border transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            style={{
              background: 'linear-gradient(135deg, #0d1526, #111e38)',
              border: selected?.name === m.name ? '1px solid #00d97e' : '1px solid #1e2d45',
              boxShadow: selected?.name === m.name ? '0 0 20px rgba(0,217,126,0.2)' : 'none',
            }}>
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
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-2xl border border-accent/30 overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d1526, #0d1f20)', boxShadow:'0 0 32px rgba(0,217,126,0.1)' }}>

          {/* header */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Emblem name={selected.name} size={56} />
              <div>
                <p className="text-xl font-black">{selected.name} 감독</p>
                <p className="text-sm text-muted">
                  {selected.formation} · 팀 OVR <span className="text-accent font-bold">{selected.ovr}</span>
                  · 승점 <span className="font-bold">{selected.pts}pt</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-muted hover:text-text text-2xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-elevated/50 shrink-0"
            >
              ×
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* pitch */}
            <div className="space-y-3">
              <p className="text-xs text-muted uppercase tracking-widest font-bold text-center lg:text-left">
                Best 11 · 포메이션
              </p>
              <PitchFormation
                formation={selected.formation}
                players={selected.best11}
                positions={getFormationPositions(selected.formation)}
                ovrList={SLOT_OVR}
                enhanceList={SLOT_ENH}
              />
            </div>

            {/* traits */}
            <div
              className="p-4 border space-y-3 rounded-xl"
              style={{
                background: 'linear-gradient(160deg, rgba(0,217,126,0.06) 0%, rgba(13,21,38,0.95) 45%)',
                borderColor: 'rgba(0,217,126,0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold">Manager Trait</p>
                <p className="text-sm font-black text-text">감독 특성</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {(managerAbilities[selected.name] ?? []).map((ability) => (
                  <AbilityCard key={`${selected.name}-${ability.id}`} ability={ability} />
                ))}
              </div>
              <p className="text-[10px] text-muted text-center">카드에 마우스를 올리면 상세 설명이 표시됩니다</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
