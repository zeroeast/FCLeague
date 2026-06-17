// ────────────────────────────────────────────
// 넥슨 데이터 동기화 스케줄러
//   - 매주 월 03:00 : 선수 메타데이터 (전체 bulk)
//   - 매주 월 03:30 : 시세 (5강·8강 only — 정기 sync 대상)
//   - 그 외 강화등급은 온디맨드 캐시로 운용
// ────────────────────────────────────────────

import cron from 'node-cron';
import pool from '../config/db.js';
import { getSpidList, getSeasonList, getPlayerImageUrl, nexonClient } from '../config/nexon.js';
import { logger } from '../shared/utils/logger.js';
import {
  PRICE_SYNC_ENHANCE_LEVELS,
  NEXON_API_RATE_LIMIT_DELAY_MS,
  NEXON_API_RATE_LIMIT_WAIT_MS,
} from '../shared/constants/index.js';

const CONTEXT = 'Scheduler';

// ─────────────────────────────────────────────
// 스케줄 등록
// ─────────────────────────────────────────────

export const startNexonSyncScheduler = () => {
  cron.schedule('0 3 * * 1', () => {
    logger.info(CONTEXT, '선수 메타데이터 동기화 시작');
    syncPlayerMetadata().catch((err) =>
      logger.error(CONTEXT, '메타데이터 동기화 실패', err),
    );
  });

  cron.schedule('30 3 * * 1', () => {
    logger.info(CONTEXT, '시세 동기화 시작', { enhanceLevels: PRICE_SYNC_ENHANCE_LEVELS });
    syncPlayerPrices().catch((err) =>
      logger.error(CONTEXT, '시세 동기화 실패', err),
    );
  });

  logger.info(CONTEXT, '스케줄러 등록 완료', {
    metadata: '월 03:00',
    prices: '월 03:30',
    syncLevels: PRICE_SYNC_ENHANCE_LEVELS,
  });
};

// ─────────────────────────────────────────────
// 선수 메타데이터 동기화
// ─────────────────────────────────────────────

export const syncPlayerMetadata = async () => {
  const client = await pool.connect();
  try {
    const [spidList, seasonList] = await Promise.all([getSpidList(), getSeasonList()]);

    await upsertSeasons(client, seasonList);
    await upsertPlayers(client, spidList);

    logger.info(CONTEXT, '메타데이터 동기화 완료', {
      players: spidList.length,
      seasons: seasonList.length,
    });
  } finally {
    client.release();
  }
};

const upsertSeasons = async (client, seasonList) => {
  for (const season of seasonList) {
    await client.query(
      `INSERT INTO nexon_seasons (season_id, class_name, season_img)
       VALUES ($1, $2, $3)
       ON CONFLICT (season_id) DO UPDATE
         SET class_name = EXCLUDED.class_name,
             season_img = EXCLUDED.season_img`,
      [season.seasonId, season.className, season.seasonImg],
    );
  }
};

const upsertPlayers = async (client, spidList) => {
  for (const sp of spidList) {
    await client.query(
      `INSERT INTO nexon_players (spid, player_name, image_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (spid) DO UPDATE
         SET player_name = EXCLUDED.player_name,
             image_url   = EXCLUDED.image_url,
             updated_at  = NOW()`,
      [sp.id, sp.name, getPlayerImageUrl(sp.id)],
    );
  }
};

// ─────────────────────────────────────────────
// 시세 동기화 (5강·8강 — PRICE_SYNC_ENHANCE_LEVELS)
// 대상: team_squads에 등록된 선수 (친구들 실제 보유 선수)
// ─────────────────────────────────────────────

export const syncPlayerPrices = async () => {
  const client = await pool.connect();
  try {
    const spids = await fetchSquadSpids(client);

    if (spids.length === 0) {
      logger.info(CONTEXT, '스쿼드에 등록된 선수 없음 — 시세 sync 건너뜀');
      return;
    }

    const result = { saved: 0, noTrade: 0, apiCalls: 0 };

    for (const spid of spids) {
      for (const enhance of PRICE_SYNC_ENHANCE_LEVELS) {
        await syncOnePrice(client, spid, enhance, result);
      }
    }

    logger.info(CONTEXT, '시세 동기화 완료', result);
  } finally {
    client.release();
  }
};

const fetchSquadSpids = async (client) => {
  const { rows } = await client.query(
    `SELECT DISTINCT spid FROM team_squads WHERE spid IS NOT NULL`,
  );
  return rows.map((r) => r.spid);
};

const syncOnePrice = async (client, spid, enhance, result) => {
  try {
    const lowestPrice = await fetchLowestPrice(spid, enhance);
    result.apiCalls++;

    if (lowestPrice === null) {
      await client.query(
        `DELETE FROM nexon_player_prices WHERE spid = $1 AND enhance = $2`,
        [spid, enhance],
      );
      result.noTrade++;
      return;
    }

    await upsertPrice(client, spid, enhance, lowestPrice);
    result.saved++;
    await sleep(NEXON_API_RATE_LIMIT_DELAY_MS);
  } catch (err) {
    await handlePriceError(err, spid, enhance);
  }
};

const fetchLowestPrice = async (spid, enhance) => {
  const res = await nexonClient.get('/fconline/v1.0/auction', {
    params: { spid, enhance },
  });
  const items = res.data?.auctionInfo;
  if (!items || items.length === 0) return null;

  const lowest = Math.min(...items.map((i) => i.buyNow ?? Infinity));
  return lowest === Infinity ? null : lowest;
};

const upsertPrice = async (client, spid, enhance, price) => {
  await client.query(
    `INSERT INTO nexon_player_prices (spid, enhance, price_bp, synced_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (spid, enhance) DO UPDATE
       SET price_bp  = EXCLUDED.price_bp,
           synced_at = NOW()`,
    [spid, enhance, price],
  );
};

const handlePriceError = async (err, spid, enhance) => {
  if (err.response?.status === 429) {
    logger.warn(CONTEXT, 'Rate limit 도달 — 대기 후 다음 주기에 재시도', {
      spid,
      enhance,
      waitMs: NEXON_API_RATE_LIMIT_WAIT_MS,
    });
    await sleep(NEXON_API_RATE_LIMIT_WAIT_MS);
  } else {
    logger.error(CONTEXT, '시세 fetch 실패', err, { spid, enhance });
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
