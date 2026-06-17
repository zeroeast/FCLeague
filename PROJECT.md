# FC온라인 리그 사이트 - 프로젝트 문서

> 10명 내외 친구들이 실제로 사용하는 FC온라인 기반 리그 운영 사이트.
> Node.js 풀스택 실무 학습 목적으로 제작.

---

## 작업 지침 (코드 작성 원칙)

이 프로젝트는 **운영 중 기능 추가·고도화가 지속적으로 발생**한다. 모든 코드는 아래 원칙을 기본으로 작성한다.

### 확장성 우선 설계

- **라우터/컨트롤러/모델 분리 철저히 유지** — 기능 추가 시 파일 하나만 건드릴 수 있게
- **하드코딩 금지** — 상수는 `config/` 또는 `.env`로, 매직 넘버는 named constant로
- **DB 스키마 변경은 마이그레이션 파일로 관리** — `ALTER TABLE`을 직접 치지 말고 `/migrations/` 파일에 기록
- **API 응답 포맷 통일** — 항상 `{ success, data, error }` 구조로 반환해 프론트가 일관되게 처리

### 유지보수성

- **함수는 한 가지 일만** — 비즈니스 로직과 DB 쿼리는 분리, 라우터엔 로직 넣지 않기
- **에러 핸들링 빠뜨리지 않기** — 특히 외부 API(넥슨) 호출은 반드시 try/catch + 의미있는 에러 메시지
- **주석은 "왜"를 설명** — "뭘 하는지"는 코드가 말하게, "왜 이렇게 했는지"만 주석으로

### 넥슨 API 사용 원칙

- **대량 데이터는 스케줄러로, 실시간 데이터만 즉시 호출** — 하루 1000회 제한 준수
- **API 응답은 항상 DB에 upsert** — 재호출 최소화
- **Rate limit 대비 재시도 로직 포함** — 429 응답 시 exponential backoff 적용

---

## 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React 18 + Vite | Node.js 기반 빌드 |
| 백엔드 | Express.js | Node.js 런타임 |
| 데이터베이스 | PostgreSQL | Supabase 호스팅 |
| 인증 | JWT (jsonwebtoken) | bcryptjs 비밀번호 해싱 |
| 외부 API | 넥슨 Open API | FC온라인 선수/계정 데이터 |
| 스케줄러 | node-cron | 주 1회 선수 데이터 동기화 |
| 배포 | Vercel (프론트) + Render (백엔드) | 무료 티어 활용 |

---

## 아키텍처 개요

```
[브라우저]
    │
    ▼
[React + Vite]  ──── /api/* 프록시 (개발) ────▶  [Express.js]
  port 5173                                          port 4000
                                                        │
                                          ┌─────────────┼─────────────┐
                                          │             │             │
                                    [PostgreSQL]  [넥슨 Open API]  [node-cron]
                                     (Supabase)                  (주 1회 sync)
```

개발 환경에서는 Vite의 proxy 설정으로 `/api` 요청을 백엔드(4000)로 자동 전달.
배포 환경에서는 프론트의 `VITE_API_URL` 환경변수로 실제 백엔드 URL을 지정.

---

## 프로젝트 구조

```
FC온 리그사이트 만들기 예제/
│
├── .gitignore
├── PROJECT.md                        ← 이 문서
│
├── frontend/                         ← React + Vite
│   ├── index.html
│   ├── vite.config.js                ← /api 프록시 설정 포함
│   ├── package.json
│   └── src/
│       ├── main.jsx                  ← React 진입점, BrowserRouter 래핑
│       ├── App.jsx                   ← 라우팅 정의
│       ├── index.css                 ← 전역 스타일 (다크 테마)
│       ├── api/
│       │   └── client.js             ← axios 인스턴스 (JWT 자동 첨부, 401 처리)
│       ├── components/
│       │   └── Layout.jsx            ← 공통 레이아웃 (헤더 네비, 푸터)
│       ├── context/                  ← (예정) 전역 상태 (AuthContext 등)
│       ├── hooks/                    ← (예정) 커스텀 훅
│       └── pages/
│           ├── Home.jsx              ← 홈 (현재 시즌 현황, 우승팀 테마)
│           ├── League.jsx            ← 리그 일정 / 결과 / 순위표
│           ├── Teams.jsx             ← 팀 목록 / 팀 상세
│           ├── Players.jsx           ← 선수 검색 (넥슨 메타데이터 활용)
│           ├── Stats.jsx             ← 개인 통계 (득점, 어시스트, 승률)
│           ├── HallOfFame.jsx        ← 명예의 전당 (역대 우승/기록)
│           └── Login.jsx             ← 로그인 / 회원가입
│
└── backend/                          ← Express.js
    ├── .env.example                  ← 환경변수 템플릿
    ├── package.json
    └── src/
        ├── index.js                  ← 서버 진입점, 미들웨어 등록
        ├── config/
        │   ├── db.js                 ← PostgreSQL 연결 풀 (pg Pool)
        │   ├── nexon.js              ← 넥슨 API 클라이언트 (axios)
        │   └── schema.sql            ← DB 전체 스키마 (Supabase에서 실행)
        ├── routes/                   ← (예정) 라우터 파일들
        ├── controllers/              ← (예정) 비즈니스 로직
        ├── models/                   ← (예정) DB 쿼리 함수
        ├── middleware/               ← (예정) auth 미들웨어 등
        └── scheduler/
            └── syncNexonData.js      ← 매주 월 03:00 선수 데이터 자동 동기화
```

---

## 데이터베이스 스키마

### 넥슨 메타데이터 캐시 (주 1회 갱신)

| 테이블 | 주요 컬럼 | 설명 |
|--------|-----------|------|
| `nexon_seasons` | season_id, class_name, season_img | 넥슨 시즌 정보 |
| `nexon_players` | spid, player_name, image_url | 전체 선수 목록 캐시 |

### 리그 데이터

| 테이블 | 주요 컬럼 | 설명 |
|--------|-----------|------|
| `users` | id, nickname, email, password_hash, nexon_ouid | 회원 (친구들 계정) |
| `teams` | id, name, owner_id, emblem_url | 팀 |
| `team_members` | team_id, user_id, role | 팀 소속 멤버 |
| `seasons` | id, name, start_date, end_date, is_active, winner_team | 리그 시즌 |
| `matches` | id, season_id, home/away_team_id, score, status | 경기 일정 & 결과 |
| `match_stats` | match_id, user_id, goals, assists, mom | 개인 경기 기록 |
| `team_squads` | team_id, season_id, spid, position, enhance | 팀 스쿼드 (넥슨 선수 활용) |
| `hall_of_fame` | season_id, category, team_id, user_id, value | 명예의 전당 |

---

## 넥슨 Open API 연동

**Base URL:** `https://open.api.nexon.com`
**인증:** 요청 헤더 `x-nxopen-api-key: {API_KEY}`
**필수 조건:** 데이터는 **30일 이내** 갱신 필요 (약관)

### 사용 예정 엔드포인트

| 엔드포인트 | 설명 | 갱신 주기 |
|-----------|------|----------|
| `GET /fconline/v1.0/metadata/spid` | 전체 선수 ID·이름 목록 | 주 1회 |
| `GET /fconline/v1.0/metadata/seasonid` | 시즌 목록 | 주 1회 |
| `GET /fconline/v1.0/metadata/spposition` | 선수 포지션 목록 | 주 1회 |
| `GET /fconline/v1.0/id?nickname=` | 닉네임으로 계정 조회 | 실시간 |
| `GET /fconline/v1.0/user/maxdivision` | 유저 최고 등급 조회 | 실시간 |

**선수 이미지 URL 패턴:**
```
https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/small/{spid}.png
```

### 주간 동기화 흐름

```
node-cron (매주 월 03:00)
    │
    ▼
넥슨 API → spid 목록, 시즌 목록 fetch
    │
    ▼
PostgreSQL upsert (nexon_players, nexon_seasons)
    │
    ▼
완료 로그 출력
```

---

## 환경변수 (.env)

```env
# 서버
PORT=4000
FRONTEND_URL=http://localhost:5173

# PostgreSQL (Supabase 연결 문자열)
DATABASE_URL=postgresql://유저:비밀번호@호스트:5432/fc_league

# JWT
JWT_SECRET=랜덤_시크릿_키

# 넥슨 Open API
NEXON_API_KEY=넥슨_발급_토큰
NEXON_API_BASE=https://open.api.nexon.com
```

---

## 로컬 개발 시작

```bash
# 백엔드
cd backend
npm install
cp .env.example .env    # .env 파일 작성
npm run dev             # nodemon으로 자동 재시작

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## 구현 예정 기능

- [ ] Supabase DB 세팅 및 schema.sql 실행
- [ ] 회원가입 / 로그인 (JWT 인증)
- [ ] 리그 시즌 생성 / 경기 일정 등록
- [ ] 경기 결과 입력 및 순위표 자동 계산
- [ ] 넥슨 선수 검색 및 팀 스쿼드 구성
- [ ] 개인 통계 페이지 (득점왕, 어시스트, 승률)
- [ ] 명예의 전당 (역대 우승팀/MVP)
- [ ] 우승팀 테마 적용 (홈 화면 배경/색상 변경)
- [ ] Vercel + Render 배포
