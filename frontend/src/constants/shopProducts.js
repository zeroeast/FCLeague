import { ABILITY_POOL } from './managerTraits.js';

/** Trait purchase prices (P) — oneShot vs passive */
export const TRAIT_SHOP_PRICE = {
  oneShot: 60,
  passive: 120,
};

export const DRAW_TICKET_PRODUCTS = [
  {
    id: 'draw-1',
    name: '뽑기권',
    subtitle: '1회 이용권',
    qty: 1,
    price: 100,
    icon: '🎰',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.35)',
  },
  {
    id: 'draw-5',
    name: '뽑기권 번들',
    subtitle: '5회 패키지',
    qty: 5,
    price: 450,
    badge: '10% OFF',
    icon: '🎁',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
  },
  {
    id: 'draw-10',
    name: '뽑기권 메가팩',
    subtitle: '10회 패키지',
    qty: 10,
    price: 850,
    badge: '15% OFF',
    icon: '💎',
    accent: '#FFD700',
    glow: 'rgba(255,215,0,0.35)',
  },
];

/** Base + per-level surcharge for enhance tickets */
export const ENHANCE_TICKET_BASE = 80;
export const ENHANCE_LEVEL_SURCHARGE = {
  5: 40,
  6: 70,
  7: 110,
  8: 160,
  9: 220,
  10: 300,
};

export function getEnhanceTicketPrice(level) {
  return ENHANCE_TICKET_BASE + (ENHANCE_LEVEL_SURCHARGE[level] ?? 0);
}

export function getTraitShopPrice(ability) {
  return ability.oneShot ? TRAIT_SHOP_PRICE.oneShot : TRAIT_SHOP_PRICE.passive;
}

export const SHOP_TRAITS = ABILITY_POOL.map((ability) => ({
  ...ability,
  shopPrice: getTraitShopPrice(ability),
}));
