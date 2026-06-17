// ────────────────────────────────────────────
// 구조화된 로깅 유틸 (컨벤션: 단순 console.log 금지)
// 운영에서는 Winston/Pino 교체 예정
// ────────────────────────────────────────────

const formatLog = (level, context, message, meta = {}) => ({
  level,
  context,
  message,
  timestamp: new Date().toISOString(),
  ...meta,
});

export const logger = {
  info: (context, message, meta) =>
    console.log(JSON.stringify(formatLog('INFO', context, message, meta))),

  warn: (context, message, meta) =>
    console.warn(JSON.stringify(formatLog('WARN', context, message, meta))),

  // 에러 발생 시 반드시 기록 (컨벤션: 에러 로그 필수)
  error: (context, message, error, meta) =>
    console.error(
      JSON.stringify(
        formatLog('ERROR', context, message, {
          error: error?.message,
          stack: error?.stack,
          ...meta,
        }),
      ),
    ),

  debug: (context, message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify(formatLog('DEBUG', context, message, meta)));
    }
  },
};
