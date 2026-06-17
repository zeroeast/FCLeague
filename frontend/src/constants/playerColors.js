/** Position group colors */
const POSITION_COLORS = {
  gk:  '#f97316',
  def: '#3b82f6',
  mid: '#22c55e',
  atk: '#ef4444',
};

const DEF_POS = ['CB', 'LB', 'RB', 'LWB', 'RWB'];
const MID_POS = ['CM', 'CAM', 'CDM', 'LM', 'RM'];
const ATK_POS = ['ST', 'LW', 'RW', 'CF'];

/** +5~+7 silver, +8~+10 gold, +11+ platinum (aurora crystal) */
const ENHANCE_SILVER   = '#C8D0DC';
const ENHANCE_GOLD     = '#FFD700';
const ENHANCE_PLATINUM = '#E8F6FF';

const OVR_TIERS = [
  { min: 97, name: '#fde68a', accent: '#fbbf24', bg: ['#1a1408', '#2d2208'], border: 'rgba(251,191,36,.45)' },
  { min: 94, name: '#fcd34d', accent: '#f59e0b', bg: ['#141008', '#261c08'], border: 'rgba(245,158,11,.4)' },
  { min: 91, name: '#e9d5ff', accent: '#a855f7', bg: ['#100d18', '#1e1530'], border: 'rgba(168,85,247,.4)' },
  { min: 88, name: '#bfdbfe', accent: '#60a5fa', bg: ['#0a1018', '#121e30'], border: 'rgba(96,165,250,.35)' },
  { min: 85, name: '#bbf7d0', accent: '#4ade80', bg: ['#081410', '#0f2018'], border: 'rgba(74,222,128,.3)' },
  { min: 82, name: '#cbd5e1', accent: '#94a3b8', bg: ['#0c1016', '#141c28'], border: 'rgba(148,163,184,.25)' },
  { min: 0,  name: '#94a3b8', accent: '#64748b', bg: ['#080c14', '#101820'], border: 'rgba(100,116,139,.2)' },
];

export function getEnhanceTier(lv) {
  if (lv == null || lv < 5) return 'default';
  if (lv >= 11) return 'platinum';
  if (lv >= 8) return 'gold';
  return 'silver';
}

export function getPositionGroup(pos) {
  if (pos === 'GK') return 'gk';
  if (DEF_POS.includes(pos)) return 'def';
  if (MID_POS.includes(pos)) return 'mid';
  if (ATK_POS.includes(pos)) return 'atk';
  return 'mid';
}

export function getPositionColor(pos) {
  return POSITION_COLORS[getPositionGroup(pos)];
}

export function getEnhanceColor(lv) {
  const tier = getEnhanceTier(lv);
  if (tier === 'platinum') return ENHANCE_PLATINUM;
  if (tier === 'gold') return ENHANCE_GOLD;
  if (tier === 'silver') return ENHANCE_SILVER;
  return '#94a3b8';
}

export function getEnhanceGlow(lv) {
  const tier = getEnhanceTier(lv);
  const c = getEnhanceColor(lv);

  if (tier === 'platinum') {
    return [
      `0 0 24px rgba(232,246,255,.9)`,
      `0 0 48px rgba(184,224,255,.55)`,
      `0 0 72px rgba(232,212,255,.35)`,
      `0 0 96px rgba(200,255,255,.2)`,
    ].join(', ');
  }
  if (tier === 'gold') {
    return `0 0 40px ${c}88, 0 0 80px rgba(251,191,36,.35), 0 0 120px rgba(255,215,0,.2)`;
  }
  if (tier === 'silver') {
    return `0 0 20px rgba(200,208,220,.6), 0 0 40px rgba(192,192,192,.35)`;
  }
  return `0 0 16px ${c}33`;
}

/** Inline style for +N label — platinum uses aurora gradient */
export function getEnhanceLabelStyle(lv) {
  if (getEnhanceTier(lv) === 'platinum') {
    return {
      background: 'linear-gradient(135deg, #f0fbff 0%, #ffffff 22%, #cce8ff 45%, #f5e8ff 68%, #e0ffff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 0 5px rgba(220,240,255,.95)) drop-shadow(0 0 10px rgba(200,180,255,.5))',
    };
  }
  return { color: getEnhanceColor(lv) };
}

export function getOvrTier(ovr) {
  return OVR_TIERS.find((t) => ovr >= t.min) ?? OVR_TIERS[OVR_TIERS.length - 1];
}

export function getOvrSlotStyle(ovr) {
  const tier = getOvrTier(ovr);
  return {
    nameColor: tier.name,
    accent: tier.accent,
    bgFrom: tier.bg[0],
    bgTo: tier.bg[1],
    background: `linear-gradient(145deg, ${tier.bg[0]} 0%, ${tier.bg[1]} 55%, rgba(8,12,22,.95) 100%)`,
    border: tier.border,
    glow: `0 0 20px ${tier.accent}22`,
  };
}
