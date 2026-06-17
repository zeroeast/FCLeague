// ────────────────────────────────────────────
// auth.controller.js — 요청/응답 처리
// ────────────────────────────────────────────

import { register, login } from './auth.service.js';
import { sendSuccess, sendError } from '../../shared/utils/response.js';
import { HTTP_STATUS } from '../../shared/constants/index.js';
import { logger } from '../../shared/utils/logger.js';

const CONTEXT = 'AuthController';

// POST /api/auth/register
export const handleRegister = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;

    if (!nickname || !email || !password) {
      return sendError(res, '닉네임, 이메일, 비밀번호를 모두 입력해주세요.', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await register({ nickname, email, password });

    if (!result.ok) {
      return sendError(res, result.message, HTTP_STATUS.BAD_REQUEST);
    }

    return sendSuccess(res, { user: result.user }, HTTP_STATUS.CREATED);
  } catch (err) {
    logger.error(CONTEXT, '회원가입 처리 오류', err);
    return sendError(res, '서버 오류가 발생했습니다.');
  }
};

// POST /api/auth/login
export const handleLogin = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return sendError(res, '닉네임과 비밀번호를 입력해주세요.', HTTP_STATUS.BAD_REQUEST);
    }

    const result = await login({ nickname, password });

    if (!result.ok) {
      return sendError(res, result.message, HTTP_STATUS.UNAUTHORIZED);
    }

    // 컨벤션: JWT를 HttpOnly 쿠키로 전달
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return sendSuccess(res, { user: result.user });
  } catch (err) {
    logger.error(CONTEXT, '로그인 처리 오류', err);
    return sendError(res, '서버 오류가 발생했습니다.');
  }
};

// POST /api/auth/logout
export const handleLogout = (_req, res) => {
  res.clearCookie('token');
  return sendSuccess(res, { message: '로그아웃 완료' });
};
