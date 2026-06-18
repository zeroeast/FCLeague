# 패널 기획서 — 선수 검색

경로: `/players`  
컴포넌트: `pages/Players.jsx`  
구현 상태: UI 골격만 (API 연동 필요)

---

## 목적

피파인벤·피온북 유사 Nexon Open API 기반 선수 검색·필터.

---

## 검색·필터 항목

| 필터 | 내용 |
|------|------|
| 포지션 | GK, CB, LB, RB, CM, CAM, CDM, ST, LW, RW 등 |
| 시즌 | Nexon 시즌 태그 (23 TOTY, 24 TOTY 등) |
| 국적 | 국가명 |
| 강화등급 | 0~11강 |
| OVR 범위 | min ~ max 슬라이더 |
| 이름 검색 | 한글/영문 |

---

## 검색 결과 표시

- 카드 그리드 레이아웃
- `PlayerCard` 컴포넌트 (OVR·포지션·강화 색상 규칙 적용)
- 선수 이미지: `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/small/{spid}.png`

---

## 데이터 전략

- 선수 기본 목록 (`spid`, `player_name`, `image_url`): 주 1회 스케줄러로 Nexon API → DB 캐시
- 선수 상세 스탯: **온디맨드** — 검색·조회 시 Nexon API 호출 후 DB upsert
- 시세: 5강·8강만 주 1회 스케줄러, 나머지 온디맨드

---

## 선수 상세 보기 (미구현)

- 선수 카드 클릭 → 상세 모달
- 6대 스탯 레이더 차트
- 강화등급별 스탯 계산 (`base_stat + enhance_bonus × 등급`)
- 현재 시세 (BP)

---

## 데이터 요구사항

| 데이터 | API |
|--------|-----|
| 선수 검색 | `GET /api/players?name=&position=&season=&enhance=&ovr_min=&ovr_max=` |
| 선수 상세 | `GET /api/players/:spid` |
| 선수 시세 | `GET /api/players/:spid/price?enhance=` |

---

## 미구현

- 실제 검색 결과 표시
- Nexon API 연동
- 즐겨찾기·선수단 추가
- 상세 보기 모달

---

_최종 업데이트: 2026-06-18_
