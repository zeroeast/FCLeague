// ────────────────────────────────────────────
// index.js — Express 앱 진입점
// ────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRouter from './modules/auth/auth.route.js';
import playerRouter from './modules/players/player.route.js';
import { startNexonSyncScheduler } from './scheduler/sync-nexon-data.js';
import { logger } from './shared/utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CONTEXT = 'App';

// ─────────────────────────────────────────────
// 미들웨어
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // HttpOnly 쿠키 전달 허용
  }),
);
app.use(express.json());
app.use(cookieParser()); // JWT HttpOnly 쿠키 파싱

// ─────────────────────────────────────────────
// 라우터
// ─────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/players', playerRouter);

// 헬스체크
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'FC리그 서버 실행 중' });
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  logger.info(CONTEXT, `서버 시작`, { port: PORT });
  startNexonSyncScheduler();
});
