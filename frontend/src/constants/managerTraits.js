export const ABILITY_POOL = [
  {
    id: 'ban-player',
    name: '선수 밴 능력',
    cost: 10,
    icon: 'BAN',
    accent: '#ef4444',
    glow: 'rgba(239,68,68,0.35)',
    description: '상대방 선수진 중 1명을 벤(출전 불가) 처리합니다. 사용 시 특성은 즉시 소모됩니다.',
    detail: '매치 시작 전 1회 선택 가능 · 선택된 선수는 해당 경기 출전 불가',
    oneShot: true,
  },
  {
    id: 'reduce-squad',
    name: '선수단 감소 능력',
    cost: 20,
    icon: 'CUT',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
    description: '상대방 선수단 등록 가능 인원을 10명으로 제한합니다. 사용 시 특성은 소모됩니다.',
    detail: '적용 시 후보 풀이 즉시 축소됨 · 한 경기 기준 1회 적용',
    oneShot: true,
  },
  {
    id: 'training-coach',
    name: '능숙한 훈련감독',
    cost: null,
    icon: 'COACH',
    accent: '#00d97e',
    glow: 'rgba(0,217,126,0.35)',
    description: '총 n명의 선수에게 훈련 코치를 부착할 수 있습니다.',
    detail: '패시브 · 소모형 스킬 아님',
    oneShot: false,
  },
  {
    id: 'sub-master',
    name: '교체의 명장',
    cost: null,
    icon: 'SUB',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    description: '교체 선수를 (n BP) 규모로 운용할 수 있게 됩니다.',
    detail: '벤치 운용 한도 증가 · 패시브 · 소모형 스킬 아님',
    oneShot: false,
  },
  {
    id: 'doctor-strange',
    name: '닥터스트레인지',
    cost: 10,
    icon: 'TIME',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    description: '선수단 중 1명을 다시 선발할 수 있습니다. 사용 시 10P가 소모됩니다.',
    detail: '교체/제외 처리된 선수 1명 즉시 복귀 · 경기당 1회 사용',
    oneShot: true,
  },
  {
    id: 'enhance-master',
    name: '강화의 달인',
    cost: null,
    icon: 'ENH',
    accent: '#eab308',
    glow: 'rgba(234,179,8,0.35)',
    description: '강화 콘텐츠 진행 시 성공률을 n% 올려줍니다.',
    detail: '패시브 · 소모형 스킬 아님',
    oneShot: false,
  },
  {
    id: 'draw-master',
    name: '뽑기의 달인',
    cost: null,
    icon: 'DRAW',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.35)',
    description: '뽑기 콘텐츠 진행 시 일정 확률(n%)로 다시뽑기 기능이 활성화됩니다.',
    detail: '재뽑기 여부를 선택할 수 있음 · 패시브 · 소모형 스킬 아님',
    oneShot: false,
  },
];

export function seedFromName(name) {
  return Array.from(name).reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0);
}

function withDynamicValues(ability, seed) {
  if (ability.id === 'training-coach') {
    const n = 2 + (seed % 4);
    return { ...ability, description: `총 ${n}명의 선수에게 훈련 코치를 부착할 수 있습니다.`, coachSlots: n };
  }
  if (ability.id === 'sub-master') {
    const bp = (200 + (seed % 7) * 50).toLocaleString();
    return { ...ability, description: `교체 선수를 (${bp} BP) 규모로 운용할 수 있게 됩니다.`, subBp: bp };
  }
  if (ability.id === 'enhance-master') {
    const rate = 3 + (seed % 6);
    return { ...ability, description: `강화 콘텐츠 진행 시 성공률을 ${rate}% 올려줍니다.`, enhanceRate: rate };
  }
  if (ability.id === 'draw-master') {
    const chance = 8 + (seed % 13);
    return { ...ability, description: `뽑기 콘텐츠 진행 시 일정 확률(${chance}%)로 다시뽑기 기능이 활성화됩니다.`, redrawChance: chance };
  }
  return ability;
}

export function pickAbilitiesByName(name) {
  const seed = seedFromName(name);
  const count = 2 + (seed % 3); // 2~4개
  return [...ABILITY_POOL]
    .map((ability, i) => ({ ability, rank: (seed + i * 7) % 97 }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, count)
    .map(({ ability }) => withDynamicValues(ability, seed));
}

/** Sample trait level (1~5) until API provides real data */
export function getTraitLevelForManager(managerName, abilityId) {
  const seed = seedFromName(managerName);
  const idHash = abilityId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 1 + ((seed + idHash) % 5);
}

export function getManagerAbilitiesWithLevels(name) {
  return pickAbilitiesByName(name).map((ability) => ({
    ...ability,
    level: getTraitLevelForManager(name, ability.id),
    shortName: ability.name.replace(/ 능력$/, '').replace(/의 달인$/, ' 달인'),
  }));
}
