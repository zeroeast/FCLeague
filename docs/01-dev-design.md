# 개발 설계서

> FC온 리그사이트 전체 기술 스택, 아키텍처, 개발 규칙, 생애주기를 정리한 문서.
> AI 및 신규 개발자가 코드 작업 전 반드시 읽어야 한다.

---

## 1. 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| 프론트엔드 | React | 18 | Vite 빌드 |
| 프론트엔드 빌드 | Vite | 5 | emptyOutDir:false (Windows EPERM 방지) |
| CSS | Tailwind CSS | v3 | 다크 테마, 커스텀 컬러 시스템 |
| 백엔드 런타임 | Node.js | 18+ | |
| 백엔드 프레임워크 | Express.js | 4.x | |
| 데이터베이스 | PostgreSQL | 15 | Supabase 호스팅 |
| 인증 | JWT (jsonwebtoken) | — | bcryptjs 비밀번호 해싱 |
| 외부 API | Nexon Open API | v1.0 | FC온라인 선수/계정 데이터 |
| 스케줄러 | node-cron | — | 주 1회 선수 데이터 동기화 |
| 프론트 배포 | Vercel | — | GitHub 연동 자동 배포 |
| 백엔드 배포 | Render | — | render.yaml 기반 |
| 미디어 스토리지 | Supabase Storage | — | 앰블럼, 명예의 전당 이미지 |

---

## 2. 시스템 아키텍처

```
[브라우저]
    │
    ▼
[React + Vite]  ──── /api/* 프록시 (개발) ────▶  [Express.js]
  port 5173                                          port 4000
                                                        │
                                          ┌─────────────┼──────────────┐
                                          │             │              │
                                    [PostgreSQL]  [Nexon Open API]  [node-cron]
                                     (Supabase)                  (주 1회 sync)
```

- **개발 환경**: Vite proxy 설정으로 `/api` 요청을 백엔드(4000)로 자동 전달
- **배포 환경**: 프론트 `VITE_API_URL` 환경변수로 실제 백엔드 URL 지정

---

## 3. 프로젝트 디렉터리 구조

```
FC온 리그사이트 만들기 예제/
│
├── docs/                             ← 프로젝트 문서 (이 폴더)
├── design-reference/                 ← 디자인 시안 HTML/CSS (앱 미반영)
│
├── frontend/                         ← React + Vite
│   ├── index.html
│   ├── vite.config.js                ← /api 프록시 설정 포함
│   ├── tailwind.config.js            ← 커스텀 컬러 (#080c16 bg, #00d97e accent)
│   └── src/
│       ├── main.jsx                  ← 진입점, BrowserRouter 래핑
│       ├── App.jsx                   ← 라우팅 정의
│       ├── index.css                 ← 전역 스타일
│       ├── api/
│       │   └── client.js             ← axios 인스턴스 (JWT 자동 첨부, 401 처리)
│       ├── components/               ← 공통 컴포넌트
│       │   ├── Layout.jsx            ← 헤더 네비, 푸터
│       │   ├── SubNav.jsx            ← 서브 네비 (리그/팀 탭 등)
│       │   ├── Emblem.jsx            ← SVG 방패 엠블럼
│       │   ├── PlayerCard.jsx        ← 선수 카드 (OVR, 포지션, 강화)
│       │   ├── PlayerSlot.jsx        ← 포메이션 슬롯
│       │   ├── PitchFormation.jsx    ← 피치 포메이션 렌더
│       │   ├── OvrBadge.jsx          ← OVR 티어 배지
│       │   ├── PlayerName.jsx        ← 선수 이름 표시
│       │   ├── SeasonIcon.jsx        ← 시즌 아이콘
│       │   ├── ActivityBadge.jsx     ← 활동 배지
│       │   ├── EnhanceRitual.jsx     ← 강화 의식 애니메이션
│       │   └── TeamDetailPanel.jsx   ← 팀 상세 패널
│       ├── constants/                ← 상수 및 샘플 데이터
│       │   ├── leagueData.js         ← 순위표, 경기 일정 샘플
│       │   ├── teamsData.js          ← 팀 스쿼드 샘플
│       │   ├── managerTraits.js      ← 감독 특성 풀 (7종)
│       │   ├── managerPoints.js      ← 감독 포인트 샘플
│       │   ├── shopProducts.js       ← 상점 상품 목록
│       │   ├── enhanceTension.js     ← 강화 긴장감 커브
│       │   ├── playerColors.js       ← 선수 카드 색상 규칙
│       │   ├── playerActivity.js     ← 선수 활동 상태
│       │   ├── formationLayouts.js   ← 포메이션 좌표
│       │   └── seasonTags.js         ← 시즌 태그
│       └── pages/
│           ├── Home.jsx              ← 홈 (순위표, 최근경기, 득점순위)
│           ├── LeagueLayout.jsx      ← 리그 레이아웃 (서브 탭)
│           ├── LeagueSchedule.jsx    ← 경기 일정
│           ├── LeagueStandings.jsx   ← 순위표
│           ├── TeamsLayout.jsx       ← 팀 레이아웃 (서브 탭)
│           ├── TeamsMyTeam.jsx       ← 내 팀 설정
│           ├── TeamsAll.jsx          ← 전체 감독 팀 현황
│           ├── Players.jsx           ← 선수 검색
│           ├── Stats.jsx             ← 통계 대시보드
│           ├── HallOfFame.jsx        ← 명예의 전당
│           ├── Shop.jsx              ← 상점 (포인트 사용)
│           ├── TraitsInvestment.jsx  ← 특성 투자
│           └── Login.jsx             ← 로그인/회원가입
│
└── backend/                          ← Express.js
    ├── .env.example
    ├── package.json
    └── src/
        ├── index.js                  ← 서버 진입점, 미들웨어 등록
        ├── config/
        │   ├── db.js                 ← PostgreSQL 연결 풀 (pg Pool)
        │   ├── nexon.js              ← Nexon API 클라이언트 (axios)
        │   └── schema.sql            ← DB 전체 스키마
        ├── modules/
        │   ├── auth/                 ← 인증 (controller, route, service)
        │   └── players/              ← 선수 가격 (controller, route, service)
        ├── scheduler/
        │   └── sync-nexon-data.js    ← 주 1회 선수 데이터 자동 동기화
        └── shared/
            ├── constants/index.js    ← 공통 상수
            ├── middlewares/
            │   └── auth-guard.js     ← JWT 인증 미들웨어
            └── utils/
                ├── logger.js         ← 로깅 유틸
                └── response.js       ← API 응답 포맷 헬퍼
```

---

## 4. 라우팅 구조

```
/                        → Home
/login                   → Login
/league
  /league/schedule       → LeagueSchedule (경기 일정)
  /league/standings      → LeagueStandings (순위표)
/teams
  /teams/my              → TeamsMyTeam (내 팀 설정)
  /teams/all             → TeamsAll (전체 감독 현황)
/players                 → Players (선수 검색)
/stats                   → Stats (통계 대시보드)
/hall-of-fame            → HallOfFame (명예의 전당)
/shop                    → Shop (상점 + 뽑기 + 강화)
/traits                  → redirect → /shop (deprecated)
/gacha                   → redirect → /shop (deprecated)
```

---

## 5. 데이터베이스 스키마

### Nexon 메타데이터 캐시 (주 1회 갱신)

| 테이블 | 주요 컬럼 | 설명 |
|--------|-----------|------|
| `nexon_seasons` | season_id, class_name, season_img | 넥슨 시즌 정보 |
| `nexon_players` | spid, player_name, image_url, 6대 스탯, position_ovr(JSONB), sub_stats(JSONB), traits(JSONB), enhance_bonus(JSONB) | 전체 선수 목록 |
| `nexon_player_prices` | spid, enhance(5~11), price_bp | 강화등급별 시세 캐시 |

> `nexon_players.is_detail_loaded` — false: 이름/이미지만 있음(bulk), true: 전체 스탯 로드 완료(온디맨드)

### 리그 데이터

| 테이블 | 주요 컬럼 | 설명 |
|--------|-----------|------|
| `users` | id(UUID), nickname, email, password_hash, nexon_ouid, role | 감독 계정 |
| `teams` | id(UUID), name, owner_id, emblem_url | 팀 |
| `team_members` | team_id, user_id, role | 팀 소속 |
| `seasons` | id(UUID), name, start_date, end_date, is_active, winner_team | 리그 시즌 |
| `matches` | id(UUID), season_id, home/away_team_id, scheduled_at, score, status | 경기 일정·결과 |
| `match_stats` | match_id, user_id, goals, assists, mom | 개인 경기 기록 |
| `team_squads` | team_id, season_id, spid, position, enhance(0~11), note | 팀 스쿼드 |
| `hall_of_fame` | season_id, category, team_id, user_id, value | 명예의 전당 기록 |

### 포인트 시스템 (구현 예정)

> 상세 설계: `docs/02-planning/02b-currency-system.md` 참조

| 테이블 | 설명 |
|--------|------|
| `user_wallet` | 유저 포인트 현재 잔액 캐시 |
| `point_transactions` | 포인트 원장 (모든 증감 기록) |
| `predictions` | 승부 예측 참여 기록 |
| `prediction_events` | 예측 대상 경기 이벤트 |
| `gacha_records` | 뽑기 결과 기록 |
| `enhancement_records` | 강화 시도 기록 |

---

## 6. Nexon Open API

**Base URL:** `https://open.api.nexon.com`
**인증:** 요청 헤더 `x-nxopen-api-key: {NEXON_API_KEY}`
**제약:** 하루 1000회 제한, 데이터 30일 이내 갱신 필요 (약관)

### 사용 엔드포인트

| 엔드포인트 | 설명 | 호출 방식 |
|-----------|------|----------|
| `GET /fconline/v1.0/metadata/spid` | 전체 선수 ID·이름 | 주 1회 스케줄러 |
| `GET /fconline/v1.0/metadata/seasonid` | 시즌 목록 | 주 1회 스케줄러 |
| `GET /fconline/v1.0/metadata/spposition` | 선수 포지션 목록 | 주 1회 스케줄러 |
| `GET /fconline/v1.0/id?nickname=` | 닉네임으로 계정 조회 | 실시간 |
| `GET /fconline/v1.0/user/maxdivision` | 유저 최고 등급 조회 | 실시간 |

**선수 이미지 URL 패턴:**
```
https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/small/{spid}.png
```

### 주간 동기화 흐름

```
node-cron (매주 월 03:00)
    → Nexon API: spid 목록, 시즌 목록 fetch
    → PostgreSQL upsert (nexon_players, nexon_seasons)
    → 완료 로그 출력
```

**Rate limit 정책:** 429 응답 시 exponential backoff 적용. 대량 데이터는 스케줄러로, 실시간 데이터만 즉시 호출.

---

## 7. 환경변수

```env
# 서버
PORT=4000
FRONTEND_URL=http://localhost:5173

# PostgreSQL (Supabase 연결 문자열)
DATABASE_URL=postgresql://유저:비밀번호@호스트:5432/fc_league

# JWT
JWT_SECRET=랜덤_시크릿_키

# Nexon Open API
NEXON_API_KEY=넥슨_발급_토큰
NEXON_API_BASE=https://open.api.nexon.com
```

---

## 8. 코드 컨벤션

컨벤션 기준: **Fluxion LMS v1.21** (`CODE_CONVENTION_v1.21.pdf`)

| 규칙 | 내용 |
|------|------|
| 파일명 | kebab-case (`auth-guard.js`, `player-card.jsx`) |
| 변수명 | camelCase |
| 상수명 | UPPER_SNAKE_CASE |
| 함수 최대 길이 | 20줄 |
| 코드 주석 언어 | 영어만 |
| 주석 원칙 | "왜" 설명. "무엇"은 코드가 말하게 |
| API 응답 포맷 | 항상 `{ success, data, error }` |
| 비즈니스 로직 위치 | service 레이어. 라우터에 로직 금지 |
| DB 스키마 변경 | `migrations/` 파일로 관리. `ALTER TABLE` 직접 금지 |
| 하드코딩 금지 | 상수는 `config/` 또는 `.env`로 관리 |
| 에러 핸들링 | 외부 API 호출은 반드시 try/catch + 의미있는 에러 메시지 |

---

## 9. 배포 구조

```
GitHub (master 브랜치)
    ├── Vercel (프론트) — push 시 자동 빌드·배포
    │     환경변수: VITE_API_URL=https://백엔드.render.com
    └── Render (백엔드) — render.yaml 기반 수동/자동 배포
          환경변수: DATABASE_URL, JWT_SECRET, NEXON_API_KEY 등
                    Supabase (DB + Storage) — 항시 동작
```

---

## 10. 로컬 개발 시작

```bash
# 백엔드
cd backend
npm install
cp .env.example .env    # .env 파일 작성
npm run dev             # nodemon으로 자동 재시작 (port 4000)

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## 11. 구현 현황 (2026-06-18)

### 완료
- Vite + React + Tailwind 초기 세팅
- 전체 페이지 라우팅 (9개 페이지)
- 공통 레이아웃/네비 (SubNav 포함)
- 샘플 데이터 기반 UI (전 페이지)
- 감독 특성 시스템 7종 (managerTraits.js)
- 선수 카드 색상/OVR 티어 시스템
- SVG 방패 엠블럼 (8감독)
- 강화 긴장감 커브 애니메이션
- Supabase DB 세팅 + schema.sql 실행 완료
- bcryptjs 닉네임+비번 인증 코드 완료 (DB 연동 테스트 필요)
- GitHub + Vercel 자동 배포 연동

### 진행 예정
- `backend/.env` — DATABASE_URL·JWT_SECRET 연결
- 로그인/회원가입 DB 연동 테스트
- Render 백엔드 배포
- 선수 검색 Nexon Open API 연동
- 경기 결과 입력 API
- 리그 순위 자동 계산
- 모든 페이지 샘플 데이터 → 실제 API 교체
- **포인트 시스템 전체** (원장, 승부예측, 뽑기, 강화 — 별도 기획서 참조)

---

_최종 업데이트: 2026-06-18_
