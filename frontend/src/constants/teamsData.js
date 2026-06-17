export const MANAGERS = [
  { name: '영동', formation: '4-3-3', ovr: 91, pts: 28, squadValue: 5_240_000_000,
    best11: ['홀란드', '손흥민', '비니시우스', '살라', '데브라이너', '로드리', '트렌트', '반다이크', '뤼디거', '데이비드', '알리송'] },
  { name: '준현', formation: '4-2-3-1', ovr: 90, pts: 23, squadValue: 4_680_000_000,
    best11: ['음바페', '사카', '벨링엄', '브루노', '카제미루', '로드리고', '아놀드', '밀리탕', '마르키뇨스', '루카스', '마이냥'] },
  { name: '종성', formation: '4-4-2', ovr: 89, pts: 20, squadValue: 4_120_000_000,
    best11: ['살라', '홀란드', '디아스', '맥알리스터', '그라베', '소보슬라이', '반다이크', '마티프', '알렉산더', '코나테', '알리송'] },
  { name: '민혁', formation: '3-5-2', ovr: 88, pts: 17, squadValue: 3_850_000_000,
    best11: ['비니시우스', '발베르데', '차메니', '크로스', '카르바할', '밀리탕', '나초', '쿠르투아', '홀란드', '핀토', '호드리구'] },
  { name: '삼주', formation: '4-3-3', ovr: 87, pts: 13, squadValue: 3_210_000_000,
    best11: ['홀란드', '마르티네스', '가나초', '에릭센', '카세미로', '메이누', '달로트', '마과이어', '리산드로', '린달로프', '드헤아'] },
  { name: '영모', formation: '4-2-3-1', ovr: 86, pts: 11, squadValue: 2_940_000_000,
    best11: ['이강인', '음바페', '파비안', '하쿠미', '김민재', '파블로', '우가르테', '페레이라', '누뇨', '쿠아레스마', '동나루마'] },
  { name: '진수', formation: '5-3-2', ovr: 85, pts: 7, squadValue: 2_580_000_000,
    best11: ['황희찬', '루카쿠', '코디', '할란드', '무이', '손흥민', '트리피어', '막과이어', '포포비치', '살라흐', '미뇨레'] },
  { name: '기성', formation: '4-3-3', ovr: 84, pts: 4, squadValue: 2_150_000_000,
    best11: ['김민재', '이강인', '황희찬', '가비', '페드리', '파블로', '아라우호', '크리스텐센', '발데', '에릭가르시아', '테어슈테겐'] },
];

/** Sample OVR / enhance per slot until API provides real values */
export const SLOT_OVR = [97, 93, 92, 91, 91, 91, 88, 90, 89, 87, 90];
export const SLOT_ENH = [8, 7, 7, 6, 5, 5, 5, 6, 5, 4, 5];

/** TODO: replace with auth context after login API is wired */
export const CURRENT_MANAGER_NAME = '영동';

export function formatSquadValue(bp) {
  if (bp >= 1_000_000_000) return `${(bp / 1_000_000_000).toFixed(2)}B`;
  if (bp >= 1_000_000) return `${Math.round(bp / 1_000_000)}M`;
  return bp.toLocaleString();
}

export function findManager(name) {
  return MANAGERS.find((m) => m.name === name) ?? null;
}
