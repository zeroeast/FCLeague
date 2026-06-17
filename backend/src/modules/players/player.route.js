// ────────────────────────────────────────────
// player.route.js
// ────────────────────────────────────────────

import { Router } from 'express';
import { handleGetPlayerPrice } from './player-price.controller.js';

const router = Router();

// 온디맨드 시세 조회 (캐시 미스 시 Nexon API 자동 fetch)
// GET /api/players/:spid/price/:enhance
router.get('/:spid/price/:enhance', handleGetPlayerPrice);

export default router;
