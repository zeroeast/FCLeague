// ────────────────────────────────────────────
// player-price.service.js — 온디맨드 시세 캐시
//
// 전략:
//   1. DB에 해당 spid + enhance 가격 있으면 반환 (캐시 히트)
//   2. 없으면 넥슨 API fetch → DB 영구 저장 → 반환
//   3. 정기 sync 대상(5강·8강)도 동일 흐름으로 조회 가능
// ────────────────────────────────────────────

import pool from '../../config/db.js';
import { nexonClient } from '../../config/nexon.js';
import { logger } from '../../shared/utils/logger.js';
import {
  PRICE_ENHANCE_MIN,
  PRICE_ENHANCE_MAX,
  NEXON_API_RATE_LIMIT_DELAY_MS,
} from '../../shared/constants/index.js';

const CONTEXT = 'PlayerPriceService';

export const getPlayerPrice = async (spid, enhance) => {
  validateEnhance(enhance);

  const cached = await findCachedPrice(spid, enhance);
  if (cached) {
    logger.debug(CONTEXT, '시세 캐시 히트', { spid, enhance });
    return { price: cached.price_bp, cachedAt: cached.synced_at, fromCache: true };
  }

  logger.info(CONTEXT, '시세 캐시 미스 — Nexon API 호출', { spid, enhance });
  return fetchAndCachePrice(spid, enhance);
};

// ─────────────────────────────────────────────
// 내부 헬퍼
// ─────────────────────────────────────────────

const validateEnhance = (enhance) => {
  if (enhance < PRICE_ENHANCE_MIN || enhance > PRICE_ENHANCE_MAX) {
    const error = new Error(`강화등급은 ${PRICE_ENHANCE_MIN}~${PRICE_ENHANCE_MAX}강 범위여야 합니다.`);
    error.statusCode = 400;
    throw error;
  }
};

const findCachedPrice = async (spid, enhance) => {
  const { rows } = await pool.query(
    `SELECT price_bp, synced_at FROM nexon_player_prices
     WHERE spid = $1 AND enhance = $2`,
    [spid, enhance],
  );
  return rows[0] ?? null;
};

const fetchAndCachePrice = async (spid, enhance) => {
  const price = await callNexonAuction(spid, enhance);

  if (price === null) {
    // 거래 없음 — 기존 캐시 삭제 후 null 반환
    await pool.query(
      `DELETE FROM nexon_player_prices WHERE spid = $1 AND enhance = $2`,
      [spid, enhance],
    );
    return { price: null, fromCache: false };
  }

  await upsertCachedPrice(spid, enhance, price);
  await sleep(NEXON_API_RATE_LIMIT_DELAY_MS);
  return { price, cachedAt: new Date().toISOString(), fromCache: false };
};

const callNexonAuction = async (spid, enhance) => {
  const res = await nexonClient.get('/fconline/v1.0/auction', {
    params: { spid, enhance },
  });
  const items = res.data?.auctionInfo;
  if (!items || items.length === 0) return null;

  const lowest = Math.min(...items.map((i) => i.buyNow ?? Infinity));
  return lowest === Infinity ? null : lowest;
};

const upsertCachedPrice = async (spid, enhance, price) => {
  await pool.query(
    `INSERT INTO nexon_player_prices (spid, enhance, price_bp, synced_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (spid, enhance) DO UPDATE
       SET price_bp  = EXCLUDED.price_bp,
           synced_at = NOW()`,
    [spid, enhance, price],
  );
  logger.info(CONTEXT, '시세 캐시 저장', { spid, enhance, price });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
