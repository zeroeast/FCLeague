// ────────────────────────────────────────────
// auth.service.js — 비즈니스 로직
// ────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import { BCRYPT_ROUNDS, JWT_EXPIRES_IN } from '../../shared/constants/index.js';
import { logger } from '../../shared/utils/logger.js';

const CONTEXT = 'AuthService';

// ─────────────────────────────────────────────
// 회원가입
// ─────────────────────────────────────────────

export const register = async ({ nickname, email, password }) => {
  const existing = await findUserByNicknameOrEmail(nickname, email);
  if (existing) {
    const field = existing.nickname === nickname ? '닉네임' : '이메일';
    return { ok: false, message: `이미 사용 중인 ${field}입니다.` };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await createUser({ nickname, email, passwordHash });

  logger.info(CONTEXT, '회원가입 완료', { userId: user.id, nickname });
  return { ok: true, user: sanitizeUser(user) };
};

// ─────────────────────────────────────────────
// 로그인
// ─────────────────────────────────────────────

export const login = async ({ nickname, password }) => {
  const user = await findUserByNickname(nickname);
  if (!user) {
    return { ok: false, message: '닉네임 또는 비밀번호가 올바르지 않습니다.' };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return { ok: false, message: '닉네임 또는 비밀번호가 올바르지 않습니다.' };
  }

  const token = signToken(user);
  logger.info(CONTEXT, '로그인 성공', { userId: user.id, nickname });
  return { ok: true, token, user: sanitizeUser(user) };
};

// ─────────────────────────────────────────────
// 내부 헬퍼
// ─────────────────────────────────────────────

const findUserByNicknameOrEmail = async (nickname, email) => {
  const { rows } = await pool.query(
    `SELECT id, nickname, email FROM users WHERE nickname = $1 OR email = $2 LIMIT 1`,
    [nickname, email],
  );
  return rows[0] ?? null;
};

const findUserByNickname = async (nickname) => {
  const { rows } = await pool.query(
    `SELECT id, nickname, email, role, password_hash FROM users WHERE nickname = $1`,
    [nickname],
  );
  return rows[0] ?? null;
};

const createUser = async ({ nickname, email, passwordHash }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (nickname, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, nickname, email, role, created_at`,
    [nickname, email, passwordHash],
  );
  return rows[0];
};

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, nickname: user.nickname, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

// 비밀번호 해시 제거 후 반환
const sanitizeUser = ({ password_hash: _, ...rest }) => rest;
