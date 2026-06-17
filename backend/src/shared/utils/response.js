// ────────────────────────────────────────────
// API 응답 포맷 통일 (컨벤션: { success, data, error })
// ────────────────────────────────────────────

/**
 * 성공 응답
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 */
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

/**
 * 에러 응답
 * @param {import('express').Response} res
 * @param {string} message - 사용자 친화적 메시지 (기술적 세부사항 노출 금지)
 * @param {number} [statusCode=500]
 */
export const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, error: message });
};
