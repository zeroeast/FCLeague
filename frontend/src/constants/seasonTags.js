import { seedFromName } from './managerTraits.js';

/**
 * 임시 시즌 아이콘 풀 (인벤 CDN).
 * 정식 연동 시 nexon_seasons.season_img / API로 교체 예정.
 */
export const SEASON_ICONS = [
  { code: 'DCB',  seasonId: 846, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_846.png?v=260602a' },
  { code: 'NO7',  seasonId: 839, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_839.png?v=260602a' },
  { code: 'WB',   seasonId: 836, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_836.png?v=260602a' },
  { code: 'GRU',  seasonId: 829, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_829.png?v=260602a' },
  { code: 'BLD',  seasonId: 828, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_828.png?v=260602a' },
  { code: 'BDO',  seasonId: 827, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_827.png?v=260602a' },
  { code: '24EP', seasonId: 826, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_826.png?v=260602a' },
  { code: 'CU',   seasonId: 825, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_825.png?v=260602a' },
  { code: 'UT',   seasonId: 814, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_814.png?v=260602a' },
  { code: 'FC',   seasonId: 290, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_290.png?v=260602a' },
  { code: '23HW', seasonId: 291, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_291.png?v=260602a' },
  { code: '25',   seasonId: 856, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_856.png?v=260602a' },
  { code: '24',   seasonId: 834, iconUrl: 'https://static.inven.co.kr/image_2011/site_image/fifaonline4/seasonicon2/season_icon_834.png?v=260602a' },
];

const seasonCache = new Map();

export function getCardSeason(playerName) {
  if (!playerName) return SEASON_ICONS[0];
  if (seasonCache.has(playerName)) return seasonCache.get(playerName);
  const seed = seedFromName(playerName);
  const season = SEASON_ICONS[seed % SEASON_ICONS.length];
  seasonCache.set(playerName, season);
  return season;
}

/** @deprecated text only — prefer getCardSeason() */
export function getCardSeasonTag(playerName) {
  return getCardSeason(playerName).code;
}

export function findSeasonByCode(code) {
  return SEASON_ICONS.find((s) => s.code === code) ?? null;
}

export function resolveCardSeason(playerName, cardSeason) {
  if (cardSeason && typeof cardSeason === 'object' && cardSeason.iconUrl) return cardSeason;
  if (typeof cardSeason === 'string') return findSeasonByCode(cardSeason) ?? getCardSeason(playerName);
  return getCardSeason(playerName);
}

export function withCardSeason(player) {
  if (!player?.name) return player;
  const season = player.cardSeason
    ? resolveCardSeason(player.name, player.cardSeason)
    : getCardSeason(player.name);
  return { ...player, cardSeason: season.code, seasonIcon: season };
}
