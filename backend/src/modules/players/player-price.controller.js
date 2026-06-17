// ────────────────────────────────────────────
// player-price.controller.js
// ────────────────────────────────────────────

import { getPlayerPrice } from './player-price.service.js';
import { sendSuccess, sendError } from '../../shared/utils/response.js';
import { HTTP_STATUS } from '../../shared/constants/index.js';
import { logger } from '../../shared/utils/logger.js';

const CONTEXT = 'PlayerPriceController';

// GET /api/players/:spid/price/:enhance
export const handleGetPlayerPrice = async (req, res) => {
  try {
    const spid = parseInt(req.params.spid, 10);
    const enhance = parseInt(req.params.enhance, 10);

    if (Number.isNaN(spid) || Number.isNaN(enhance)) {
      return sendError(res, 'spid와 강화등급은 숫자여야 합니다.', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await getPlayerPrice(spid, enhance);
    return sendSuccess(res, { spid, enhance, ...result });
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, HTTP_STATUS.BAD_REQUEST);
    }
    logger.error(CONTEXT, '시세 조회 오류', err, {
      spid: req.params.spid,
      enhance: req.params.enhance,
    });
    return sendError(res, '시세 조회 중 오류가 발생했습니다.');
  }
};
