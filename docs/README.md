# FC온 리그사이트 — 문서 인덱스

> AI 및 신규 개발자가 작업 시작 전 가장 먼저 읽어야 할 파일입니다.
> 모든 문서는 `docs/` 폴더 안에 있으며, 아래 순서대로 읽으면 전체 맥락을 파악할 수 있습니다.

---

## 문서 구조

```
docs/
├── README.md                          ← 이 파일 (진입점)
│
├── 01-dev-design.md                   ← 개발 설계서
│
├── 02-planning/                       ← 기획서
│   ├── 02a-main-planning.md           ← 메인 기획서
│   ├── 02b-currency-system.md         ← 재화·포인트 시스템 기획서
│   └── panels/                        ← 페이지(패널)별 기획서
│       ├── panel-home.md
│       ├── panel-league.md
│       ├── panel-teams.md
│       ├── panel-players.md
│       ├── panel-stats.md
│       ├── panel-hall-of-fame.md
│       ├── panel-shop-gacha.md        ← 상점 (뽑기/강화/특성구매/승부예측 탭)
│       ├── panel-prediction.md        ← 승부 예측 탭 상세
│       ├── panel-point-history.md     ← 포인트 히스토리 페이지
│       └── panel-traits.md
│
├── 03-operations/                     ← 운용문서
│   ├── 03a-rulebook.md                ← 규정집
│   └── 03b-feature-specs.md           ← 기능별 세부 규정 및 계산식
│
└── 작업로그.md
```

---

## 한눈에 보는 프로젝트

| 항목 | 내용 |
|------|------|
| 서비스명 | FC온 리그사이트 |
| 목적 | 친구 8명의 FC온라인 자체 리그 운영 웹사이트 |
| 사용자 | 준현, 종성, 영동, 민혁, 삼주, 영모, 진수, 기성 |
| 프론트 | React 18 + Vite + Tailwind CSS v3 |
| 백엔드 | Node.js + Express.js |
| DB | PostgreSQL (Supabase) |
| 배포 | Vercel(프론트) + Render(백엔드) |
| 외부 API | Nexon Open API (FC온라인 선수 데이터) |

---

## 읽기 순서 권장

1. **이 파일** — 전체 구조 파악
2. `01-dev-design.md` — 기술 스택, 아키텍처, DB, 코딩 규칙
3. `02-planning/02a-main-planning.md` — 서비스 전체 기획
4. `02-planning/02b-currency-system.md` — 포인트 시스템 (구현 예정)
5. `02-planning/panels/` — 담당 페이지 기획서
6. `03-operations/03a-rulebook.md` — 운영 규정
7. `03-operations/03b-feature-specs.md` — 계산식 및 세부 스펙

---

## 작업 원칙 요약

- 포인트 잔액은 **직접 수정 금지** — 원장 트랜잭션으로만 처리
- API 응답 포맷은 항상 `{ success, data, error }` 구조
- 한글 파일 작성 시 **python3 utf-8** 방식 사용 (heredoc/Write tool 한글 깨짐 주의)
- 코드 컨벤션: Fluxion LMS v1.21 (kebab-case 파일, camelCase 변수)
- DB 스키마 변경은 `migrations/` 파일로 관리, `ALTER TABLE` 직접 금지

---

_최종 업데이트: 2026-06-18_
