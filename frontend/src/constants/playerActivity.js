/** Season power-ranking style activity (0~100). Drives SS/S/A badge + future sell price. */
const SAMPLE_SCORES = {
  홀란드: 96,
  손흥민: 89,
  음바페: 93,
  살라: 84,
  데브라이너: 81,
  비니시우스: 87,
  반다이크: 76,
  알리송: 71,
  로드리: 82,
  사카: 78,
  트렌트: 74,
  김민재: 73,
  황희찬: 68,
  이강인: 80,
  레반도프스키: 79,
  벨링엄: 85,
};

export const ACTIVITY_GRADES = {
  SS: {
    label: 'SS',
    color: '#ff4d6d',
    glow: 'rgba(255,77,109,0.65)',
    sellBonus: 0.18,
  },
  S: {
    label: 'S',
    color: '#FFD700',
    glow: 'rgba(255,215,0,0.55)',
    sellBonus: 0.1,
  },
  A: {
    label: 'A',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.5)',
    sellBonus: 0.05,
  },
};

export function getActivityScore(playerName) {
  if (SAMPLE_SCORES[playerName] != null) return SAMPLE_SCORES[playerName];
  const hash = [...playerName].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return 58 + (hash % 35);
}

export function getActivityGrade(score) {
  if (score >= 90) return 'SS';
  if (score >= 80) return 'S';
  if (score >= 70) return 'A';
  return null;
}

export function getActivityMeta(playerName) {
  const score = getActivityScore(playerName);
  const grade = getActivityGrade(score);

  if (!grade) {
    return { score, grade: null, sellModifier: 0, sellLabel: null, color: null, glow: null, label: null };
  }

  const g = ACTIVITY_GRADES[grade];
  const pct = Math.round(g.sellBonus * 100);
  return {
    score,
    grade,
    sellModifier: g.sellBonus,
    sellLabel: `매각 +${pct}%`,
    color: g.color,
    glow: g.glow,
    label: g.label,
  };
}

export function formatSellPrice(baseBp, playerName) {
  const { sellModifier } = getActivityMeta(playerName);
  const adjusted = Math.round(baseBp * (1 + sellModifier));
  return { baseBp, adjusted, sellModifier };
}
