// ────────────────────────────────────────────
// auth-guard.js — JWT 인증 미들웨어
// HttpOnly 쿠키에서 토큰 추출 후 검증
// ────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';
import { logger } from '../utils/logger.js';

const CONTEXT = 'AuthGuard';

export const authGuard = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return sendError(res, '로그인이 필요합니다.', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, nickname, role }
    return next();
  } catch (err) {
    logger.warn(CONTEXT, 'JWT 검증 실패', { error: err.message });
    return sendError(res, '인증이 만료되었거나 유효하지 않습니다.', HTTP_STATUS.UNAUTHORIZED);
  }
};

// 관리자 전용 라우트용
export const adminGuard = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, '관리자만 접근 가능합니다.', HTTP_STATUS.FORBIDDEN);
  }
  return next();
};
