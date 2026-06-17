import { useMemo, useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';
import { PlayerSlot } from '../components/PlayerSlot.jsx';

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

const POS = ['ST','RW','LW','CAM','CM','CM','RB','CB','CB','LB','GK'];

/** Sample OVR per slot until API provides real values */
const SLOT_OVR = [97, 93, 92, 91, 91, 91, 88, 90, 89, 87, 90];

const ABILITY_POOL = [
  {
    id: 'ban-player',
    name: '선수 밴 능력',
    cost: 10,
    description: '상대방 선수진 중 1명을 벤(출전 불가) 처리합니다. 사용 시 특성은 즉시 소모됩니다.',
    oneShot: true,
  },
  {
    id: 'reduce-squad',
    name: '선수단 감소 능력',
    cost: 20,
    description: '상대방 선수단 등록 가능 인원을 10명으로 제한합니다. 사용 시 특성은 소모됩니다.',
    oneShot: true,
  },
  {
    id: 'training-coach',
    name: '능숙한 훈련감독',
    cost: null,
    description: '총 n명의 선수에게 훈련 코치를 부착할 수 있습니다. n은 시즌 규칙에 따라 결정됩니다.',
    oneShot: false,
  },
  {
    id: 'set-piece-master',
    name: '세트피스 설계자',
    cost: 8,
    description: '세트피스 상황에서 OVR 보정 +2를 적용합니다. 경기당 1회 발동 가능한 소모형 효과입니다.',
    oneShot: true,
  },
  {
    id: 'rapid-recovery',
    name: '초고속 회복 루틴',
    cost: 6,
    description: '연전 구간에서 주전 2명의 컨디션 하락 페널티를 무효화합니다. 사용 후 소모됩니다.',
    oneShot: true,
  },
  {
    id: 'analysis-room',
    name: '전술 분석실',
    cost: null,
    description: '상대 포메이션 정보를 바탕으로 추천 전술 프리셋 1개를 제공하는 지속형 특성입니다.',
    oneShot: false,
  },
  {
    id: 'rookie-eye',
    name: '루키 발굴의 눈',
    cost: null,
    description: 'OVR 85 이하 선수에게 잠재 보너스를 부여해 특정 경기에서 체감 성능이 상승합니다.',
    oneShot: false,
  },
  {
    id: 'captain-aura',
    name: '캡틴 오라',
    cost: 12,
    description: '주장 1명의 멘탈 보정을 통해 후반 집중력 보너스를 부여합니다. 사용 시 소모됩니다.',
    oneShot: true,
  },
];

function pickAbilitiesByName(name, count = 3) {
  const chars = Array.from(name);
  const seed = chars.reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
  const picked = [];
  for (let i = 0; i < ABILITY_POOL.length && picked.length < count; i += 1) {
    const index = (seed + i * 3) % ABILITY_POOL.length;
    const candidate = ABILITY_POOL[index];
    if (!picked.some((ability) => ability.id === candidate.id)) {
      picked.push(candidate);
    }
  }
  return picked;
}

function AbilityChip({ ability }) {
  return (
    <div className="relative group">
      <div
        className="px-3 py-2 rounded-lg border cursor-default"
        style={{ background: 'rgba(255,255,255,.03)', borderColor: '#1e2d45' }}
      >
        <p className="text-xs font-black text-text">{ability.name}</p>
        <p className="text-[11px] text-muted mt-0.5">
          {ability.cost ? `${ability.cost}P` : '패시브'} · {ability.oneShot ? '소모형' : '지속형'}
        </p>
      </div>
      <div
        className="absolute right-0 top-full mt-2 w-72 p-3 rounded-lg border opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
        style={{ background: '#0a1426', borderColor: '#2a3c5c', zIndex: 20, boxShadow: '0 8px 20px rgba(0,0,0,.45)' }}
      >
        <p className="text-xs font-black text-accent mb-1">{ability.name}</p>
        <p className="text-[12px] text-text leading-relaxed">{ability.description}</p>
        <p className="text-[11px] text-muted mt-2">
          타입: {ability.oneShot ? '소모형 (사용 시 사라짐)' : '지속형'}
          {ability.cost ? ` · 비용: ${ability.cost}P` : ''}
        </p>
      </div>
    </div>
  );
}

export default function Teams() {
  const [selected, setSelected] = useState(null);
  const managerAbilities = useMemo(() => {
    const map = {};
    MANAGERS.forEach((manager) => {
      map[manager.name] = pickAbilitiesByName(manager.name, 3);
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
        <div className="rounded-2xl border border-accent/30 p-6 space-y-5"
          style={{ background:'linear-gradient(135deg, #0d1526, #0d1f20)', boxShadow:'0 0 32px rgba(0,217,126,0.1)' }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
            <div className="flex items-center gap-4">
              <Emblem name={selected.name} size={60} />
              <div>
                <p className="text-xl font-black">{selected.name} 감독</p>
                <p className="text-sm text-muted">{selected.formation} · OVR {selected.ovr}</p>
              </div>
            </div>
            <div className="space-y-2 min-w-[300px]">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted uppercase tracking-widest font-bold">감독 특성</p>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-text text-2xl w-8 h-8 flex items-center justify-center">x</button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(managerAbilities[selected.name] ?? []).map((ability) => (
                  <AbilityChip key={`${selected.name}-${ability.id}`} ability={ability} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-3 font-bold">Best 11</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selected.best11.map((player, i) => (
                <PlayerSlot
                  key={i}
                  name={player}
                  pos={POS[i]}
                  ovr={SLOT_OVR[i]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
