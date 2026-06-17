// ────────────────────────────────────────────
// 공유 상수 (컨벤션: 대문자 + 언더스코어)
// 새 상수는 여기에 추가
// ────────────────────────────────────────────

// 강화 등급
export const MIN_ENHANCE = 0;
export const MAX_ENHANCE = 11;

// 시세 동기화 대상 강화등급 (주 1회 정기 sync)
// 그 외 등급은 온디맨드 캐시로 운용
export const PRICE_SYNC_ENHANCE_LEVELS = [5, 8];

// 시세 온디맨드 fetch 가능 범위
export const PRICE_ENHANCE_MIN = 5;
export const PRICE_ENHANCE_MAX = 11;

// API 응답 포맷 헬퍼
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// JWT
export const JWT_EXPIRES_IN = '7d';

// bcrypt
export const BCRYPT_ROUNDS = 12;

// 넥슨 API
export const NEXON_API_RATE_LIMIT_DELAY_MS = 50;    // 호출 간 딜레이
export const NEXON_API_RATE_LIMIT_WAIT_MS = 60_000; // 429 시 대기
