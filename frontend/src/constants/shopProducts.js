import { ABILITY_POOL } from './managerTraits.js';

/** Skill purchase prices (P) */
export const SKILL_SHOP_PRICE = {
  active: 60,
  passive: 120,
};

export function getSkillShopPrice(ability) {
  return ability.oneShot ? SKILL_SHOP_PRICE.active : SKILL_SHOP_PRICE.passive;
}

export const SHOP_PASSIVE_SKILLS = ABILITY_POOL
  .filter((a) => !a.oneShot)
  .map((ability) => ({ ...ability, shopPrice: getSkillShopPrice(ability) }));

export const SHOP_ACTIVE_SKILLS = ABILITY_POOL
  .filter((a) => a.oneShot)
  .map((ability) => ({ ...ability, shopPrice: getSkillShopPrice(ability) }));

/** @deprecated use SHOP_PASSIVE_SKILLS / SHOP_ACTIVE_SKILLS */
export const SHOP_TRAITS = ABILITY_POOL.map((ability) => ({
  ...ability,
  shopPrice: getSkillShopPrice(ability),
}));
