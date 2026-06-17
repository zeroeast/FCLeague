import { seedFromName } from './managerTraits.js';

export const MANAGER_NAMES = ['영동', '준현', '종성', '민혁', '삼주', '영모', '진수', '기성'];

/** Sample current login user until auth is wired */
export const SAMPLE_CURRENT_MANAGER = '영동';

/** 10P spent by helper → +5% enhance rate */
export const SOUL_RATE_PER_10P = 5;
export const SOUL_POINT_STEP = 10;

let cachedPoints = null;

export function getManagerPointsMap() {
  if (cachedPoints) return cachedPoints;
  cachedPoints = Object.fromEntries(
    MANAGER_NAMES.map((name) => {
      const seed = seedFromName(name);
      return [name, 600 + (seed % 1400)];
    }),
  );
  return cachedPoints;
}

export function calcSoulBonusRate(totalSoulPoints) {
  return Math.floor(totalSoulPoints / SOUL_POINT_STEP) * SOUL_RATE_PER_10P;
}

export function formatPoints(p) {
  return `${p.toLocaleString()}P`;
}
