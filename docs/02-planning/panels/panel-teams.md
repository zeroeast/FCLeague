# 패널 기획서 — 팀

경로: `/teams`  
서브 탭: `/teams/my` (내 팀) / `/teams/all` (전체 감독)  
컴포넌트: `pages/TeamsLayout.jsx`, `TeamsMyTeam.jsx`, `TeamsAll.jsx`, `components/TeamDetailPanel.jsx`  
구현 상태: 샘플 UI 완료 (API 연동 필요)

---

## 목적

감독별 팀 스쿼드 구성 및 조회.

---

## 서브 탭 구성

### 내 팀 탭 (`/teams/my`)

**포메이션 설정**
- 포메이션 선택 (4-3-3, 4-4-2 등)
- 피치 위에 선수 11명 배치 (`PitchFormation` 컴포넌트)
- 선수 슬롯 클릭 → 선수 검색·교체

**팀 정보 자동 계산**
- 시장가치 합산 (배치 선수들의 Nexon 시세 합계)
- OVR 자동 계산 (Best 11 강화등급 적용 스탯 평균)
- 케미 설정 (강화케미·팀케미 효과 수동 선택)

**우측 패널**
- 적용된 OVR, 케미 설정값
- 팀 시장가치 합계

### 전체 감독 탭 (`/teams/all`)

- 8감독 카드 그리드 (엠블럼·포메이션·OVR·승점)
- 감독 카드 클릭 → `TeamDetailPanel` 슬라이드 오픈
  - Best 11 포지션 배치
  - 감독 특성 패널 (2~4개, 호버 시 툴팁)
  - 감독 포인트 잔액

---

## 감독 특성 패널

- 감독마다 7종 특성 풀에서 이름 seed 기반 2~4개 배정
- 소모형 특성: 사용 시 포인트 소모 + 해당 경기 1회 적용
- 패시브 특성: 지속 효과
- 상세 내용: `docs/02-planning/02a-main-planning.md` §6 참조

---

## 데이터 요구사항

| 데이터 | API |
|--------|-----|
| 내 팀 스쿼드 | `GET /api/squads/my` |
| 팀 저장 | `POST /api/squads/my` |
| 전체 감독 스쿼드 | `GET /api/squads/all` |
| 선수 시세 | `GET /api/players/:spid/price` |

---

## 미구현

- 내 팀 설정·편집 UI (내 팀 탭 대부분)
- 시장가치 자동 합산
- 케미 설정 로직
- 선수단 편집 저장 API 연동

---

_최종 업데이트: 2026-06-18_
