export const ENHANCE_TRY_MS = 6800;
export const ENHANCE_RESULT_MS = 3600;

/** Progress easing curves (0→1 over normalized time t) */
export const TENSION_CURVES = {
  linear: (t) => t,
  sine: (t) => (1 - Math.cos(t * Math.PI)) / 2,
  steps: (t) => {
    const n = 9;
    return Math.floor(t * n) / n;
  },
  wavy: (t) => {
    const wave = Math.sin(t * Math.PI * 5) * 0.1 * (1 - t * 0.5);
    return Math.min(1, Math.max(0, t + wave));
  },
  burst: (t) => {
    if (t < 0.7) return t * 0.28;
    const burstT = (t - 0.7) / 0.3;
    return 0.196 + burstT ** 0.45 * 0.804;
  },
};

const CURVE_KEYS = Object.keys(TENSION_CURVES);

export function pickTensionCurve(seed = Date.now()) {
  return CURVE_KEYS[Math.abs(seed) % CURVE_KEYS.length];
}

export function getTensionProgress(elapsedMs, totalMs, curveKey) {
  const t = Math.min(1, elapsedMs / totalMs);
  const fn = TENSION_CURVES[curveKey] ?? TENSION_CURVES.linear;
  return fn(t);
}

export function getCurveLabel(key) {
  const labels = {
    linear: '직진 상승',
    sine: '부드러운 고조',
    steps: '계단식 상승',
    wavy: '꼬불꼬불 상승',
    burst: '잠잠 → 폭발',
  };
  return labels[key] ?? key;
}
