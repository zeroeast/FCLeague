# 기능별 세부 규정 및 계산식

> 사이트 내 각 기능의 구체적인 원리, 계산식, 구현 명세.
> 백엔드 개발 시 이 문서의 계산식을 기준으로 구현한다.

---

## 1. 리그 순위 계산

### 1-1. 승점 계산

```
승리: +3점
무승부: +1점
패배: 0점
```

### 1-2. 순위 결정 우선순위

```
1차: 승점 (높은 순)
2차: 골득실 = 득점 - 실점 (높은 순)
3차: 총 득점 (높은 순)
4차: 직접 대결 결과 (상대 전적 승점)
5차: 운영자 재경기 결정
```

### 1-3. 순위표 쿼리 (PostgreSQL)

```sql
SELECT
  t.name AS team_name,
  COUNT(*) FILTER (WHERE
    (m.home_team_id = t.id AND m.home_score > m.away_score) OR
    (m.away_team_id = t.id AND m.away_score > m.home_score)
  ) AS wins,
  COUNT(*) FILTER (WHERE m.home_score = m.away_score) AS draws,
  COUNT(*) FILTER (WHERE
    (m.home_team_id = t.id AND m.home_score < m.away_score) OR
    (m.away_team_id = t.id AND m.away_score < m.home_score)
  ) AS losses,
  SUM(CASE WHEN m.home_team_id = t.id THEN m.home_score ELSE m.away_score END) AS goals_for,
  SUM(CASE WHEN m.home_team_id = t.id THEN m.away_score ELSE m.home_score END) AS goals_against
FROM teams t
JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id)
WHERE m.season_id = $1 AND m.status = 'played'
GROUP BY t.id, t.name
ORDER BY
  (wins * 3 + draws) DESC,
  (goals_for - goals_against) DESC,
  goals_for DESC;
```

---

## 2. 선수 OVR 계산

### 2-1. 기본 OVR

넥슨 API의 `position_ovr` JSONB 필드에서 해당 포지션 OVR 값 사용.

```js
const ovr = player.position_ovr[position] ?? player.position_ovr['ST'] ?? 0;
```

### 2-2. 강화 적용 OVR

```
강화 OVR = base_stat + enhance_bonus[stat항목] × 강화등급
```

예시:
```js
const enhanced = {};
for (const [stat, bonus] of Object.entries(player.enhance_bonus)) {
  enhanced[stat] = (player.sub_stats[stat] ?? 0) + bonus * enhanceLevel;
}
```

### 2-3. Best 11 팀 OVR

```
팀 OVR = 포지션별 강화 OVR 11명 평균 (소수점 버림)
```

```js
const teamOvr = Math.floor(
  squad.reduce((sum, player) => sum + getEnhancedOvr(player), 0) / 11
);
```

---

## 3. 선수 카드 색상 규칙

구현 파일: `frontend/src/constants/playerColors.js`

### 3-1. 강화 단계 색상

| 강화 등급 | 테두리·글로우 색상 |
|----------|-----------------|
| +0 ~ +4 | `#94a3b8` (회색) |
| +5 ~ +7 | `#8b5cf6` (보라) |
| +8 ~ +10 | `#FFD700` (금색) + 강한 글로우 |
| +11 | `#FFD700` + 최강 글로우 |

### 3-2. 포지션 색상

| 그룹 | 포지션 | 색상 |
|------|--------|------|
| GK | GK | `#f97316` (주황) |
| 수비 | CB, LB, RB, LWB, RWB | `#3b82f6` (파랑) |
| 미드 | CM, CAM, CDM, LM, RM | `#22c55e` (녹색) |
| 공격 | ST, LW, RW, CF | `#ef4444` (빨강) |

### 3-3. OVR 티어 색상

| OVR | 컬러 테마 |
|-----|----------|
| 97+ | 특수 (레인보우 글로우) |
| 94~96 | 금색 |
| 91~93 | 주황 |
| 88~90 | 보라 |
| 85~87 | 파랑 |
| 82~84 | 녹색 |
| ~81 | 기본 (회색) |

---

## 4. 포인트 원장 처리

### 4-1. 포인트 지급 함수 명세

```js
/**
 * 포인트 지급/차감 — 반드시 이 함수를 통해서만 처리
 * @param {object} db - DB 연결 (트랜잭션 클라이언트)
 * @param {object} params
 * @param {string} params.userId
 * @param {number} params.amount - 양수: 지급, 음수: 차감
 * @param {string} params.transactionType - LEAGUE_MATCH_REWARD 등
 * @param {string} params.sourceType - 'match' | 'prediction' | 'gacha' | 'admin' 등
 * @param {string} [params.sourceId] - 관련 레코드 ID
 * @param {string} params.description - 사용자 표시 문구
 * @param {string} [params.createdBy] - 'system' | 관리자 userId
 */
async function applyPointTransaction(db, params) {
  // 1. 잔액 조회 (SELECT FOR UPDATE — 동시성 보호)
  const wallet = await db.query(
    'SELECT balance FROM user_wallet WHERE user_id = $1 FOR UPDATE',
    [params.userId]
  );
  const currentBalance = wallet.rows[0]?.balance ?? 0;

  // 2. 잔액 부족 검증 (차감 시)
  if (params.amount < 0 && currentBalance + params.amount < 0) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  const newBalance = currentBalance + params.amount;

  // 3. 원장 기록
  await db.query(`
    INSERT INTO point_transactions
      (user_id, amount, transaction_type, source_type, source_id, description, balance_after, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    params.userId, params.amount, params.transactionType,
    params.sourceType, params.sourceId, params.description,
    newBalance, params.createdBy ?? 'system'
  ]);

  // 4. 지갑 잔액 갱신
  await db.query(
    'UPDATE user_wallet SET balance = $1, updated_at = NOW() WHERE user_id = $2',
    [newBalance, params.userId]
  );

  return newBalance;
}
```

### 4-2. 포인트 소모 트랜잭션 패턴 (뽑기 예시)

```js
const client = await db.pool.connect();
try {
  await client.query('BEGIN');

  // 1. 포인트 차감
  await applyPointTransaction(client, {
    userId, amount: -GACHA_COST, transactionType: 'GACHA_PURCHASE',
    sourceType: 'gacha', description: '선수 뽑기 1회'
  });

  // 2. 선수 지급 기록
  const player = await pickRandomPlayer();
  await client.query(
    'INSERT INTO gacha_records (user_id, spid, created_at) VALUES ($1, $2, NOW())',
    [userId, player.spid]
  );

  await client.query('COMMIT');
  return player;
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

---

## 5. 승부 예측 정산 계산식

### 5-1. 적중 지급액

```
지급 포인트 = floor(참여 포인트 × 확정 배당)
```

예시:
```
참여: 100P, 배당: 2.10 → 지급: floor(100 × 2.10) = 210P
참여: 150P, 배당: 3.30 → 지급: floor(150 × 3.30) = 495P
```

### 5-2. 중복 정산 방지 구현

```sql
-- predictions 테이블 settled_at 컬럼 확인
UPDATE predictions
SET settled_at = NOW(), result = $2
WHERE prediction_id = $1 AND settled_at IS NULL
RETURNING *;
-- 반환 rows가 0이면 이미 정산된 예측 → 중복 처리 차단
```

### 5-3. 정산 흐름

```
경기 결과 확정
    ↓
predictions WHERE event_id = ? AND settled_at IS NULL 조회
    ↓
각 예측에 대해:
  if (예측 결과 == 실제 결과):
    applyPointTransaction(userId, 참여P × 배당, 'PREDICTION_REWARD')
    predictions.settled_at = NOW()
  else:
    predictions.settled_at = NOW()  (참여P는 이미 PREDICTION_STAKE로 차감됨)
```

---

## 6. 강화 성공률 계산

### 6-1. 기본 성공률

```js
const BASE_ENHANCE_RATE = {
  1: 90, 2: 85, 3: 80, 4: 75, 5: 65,
  6: 55, 7: 45, 8: 35, 9: 25, 10: 15, 11: 8
};
```

### 6-2. 특성·Soul Point 보너스 적용

```js
function getFinalEnhanceRate(targetLevel, managerName, soulPointsSpent) {
  const base = BASE_ENHANCE_RATE[targetLevel] ?? 0;

  // enhance-master 감독 특성 보너스
  const traits = getManagerAbilitiesWithLevels(managerName);
  const master = traits.find(t => t.id === 'enhance-master');
  const traitBonus = master ? master.enhanceRate : 0;

  // Soul Point 보너스: 10P당 5%
  const soulBonus = Math.floor(soulPointsSpent / 10) * 5;

  return Math.min(95, base + traitBonus + soulBonus); // 최대 95% 상한
}
```

### 6-3. 강화 비용 (단계별)

```js
const ENHANCE_COST = {
  1: 100, 2: 150, 3: 200, 4: 280, 5: 400,
  6: 550, 7: 700, 8: 900, 9: 1200, 10: 1600, 11: 2200
};
```

---

## 7. 감독 특성 배정 알고리즘

감독 이름을 seed로 하여 결정론적으로 특성을 배정한다 (같은 이름 = 항상 같은 특성).

```js
// 1. seed 계산
function seedFromName(name) {
  return Array.from(name).reduce(
    (acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0
  );
}

// 2. 배정 개수: 2~4개
const count = 2 + (seed % 3);

// 3. 특성 풀 7개를 seed로 셔플 후 count개 선택
const picked = [...ABILITY_POOL]
  .map((ability, i) => ({ ability, rank: (seed + i * 7) % 97 }))
  .sort((a, b) => a.rank - b.rank)
  .slice(0, count);

// 4. 감독 특성 동적 수치 적용 (seed 기반)
```

---

## 8. 선수 파워점수 계산 (통계 탭)

```
파워점수 = (골 × 3) + (도움 × 2) + (출전 경기 수 × 0.5)
```

> 현재는 미확정 공식. 백엔드 구현 시 재검토.

---

## 9. API 응답 포맷 표준

모든 API 응답은 다음 구조를 따른다.

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

오류 시:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "포인트가 부족합니다."
  }
}
```

---

## 10. 환경변수별 사용처

| 변수 | 사용처 |
|------|--------|
| `DATABASE_URL` | `backend/src/config/db.js` — pg Pool 연결 |
| `JWT_SECRET` | `auth.service.js` — 토큰 서명·검증 |
| `NEXON_API_KEY` | `backend/src/config/nexon.js` — Nexon API 헤더 |
| `NEXON_API_BASE` | `backend/src/config/nexon.js` — API Base URL |
| `PORT` | `backend/src/index.js` — 서버 포트 (기본 4000) |
| `FRONTEND_URL` | `backend/src/index.js` — CORS 허용 Origin |
| `VITE_API_URL` | `frontend/src/api/client.js` — axios baseURL (배포 환경) |

---

_최종 업데이트: 2026-06-18_
