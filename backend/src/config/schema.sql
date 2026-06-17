-- ============================================================
-- FC온라인 리그 사이트 DB 스키마
-- Supabase (PostgreSQL) 에서 실행
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 넥슨 메타데이터 캐시 (주 1회 갱신)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nexon_seasons (
  season_id   INT         PRIMARY KEY,
  class_name  VARCHAR(50) NOT NULL,
  season_img  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nexon_players (
  spid             INT          PRIMARY KEY,
  player_name      VARCHAR(100) NOT NULL,
  season_id        INT          REFERENCES nexon_seasons(season_id),
  image_url        TEXT,

  -- 신체 정보 (필터용 컬럼)
  nationality      VARCHAR(50),
  position         VARCHAR(10),
  height           INT,
  weight           INT,
  body_type        VARCHAR(20),   -- '마름' | '보통' | '건장' | '고유'
  birthdate        DATE,
  foot_main        VARCHAR(10),   -- '왼발' | '오른발'
  foot_weak        INT,           -- 약발 등급 (1~5)
  foot_main_val    INT,           -- 주발 등급 (1~5)
  individual_skill INT,           -- 개인기 (1~5)

  -- 6대 스탯 (0강 기본값 — 필터 빈도 높아서 컬럼으로)
  stat_speed       INT,
  stat_shoot       INT,
  stat_pass        INT,
  stat_dribble     INT,
  stat_defense     INT,
  stat_physical    INT,

  -- 포지션별 오버롤 {"ST": 129, "CF": 127, ...}
  position_ovr     JSONB  DEFAULT '{}',

  -- 세부 능력치 30개+ {"속력": 116, "가속력": 116, ...}
  sub_stats        JSONB  DEFAULT '{}',

  -- 특성 배열 ["타이탄", "파워헤더"]
  traits           JSONB  DEFAULT '[]',

  -- 강화 보정 공식 (프론트 계산용)
  -- 실제스탯 = base_stat + enhance_bonus[항목] × 강화등급
  -- 예: {"속력": 2, "가속력": 2, "골결정력": 2, ...}
  enhance_bonus    JSONB  DEFAULT '{}',

  -- false: 이름/이미지만 있음 (bulk sync)
  -- true:  전체 스탯 로드 완료 (온디맨드 fetch 후)
  is_detail_loaded BOOLEAN DEFAULT FALSE,

  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 시세 캐시 (강화등급별, 주 1회 갱신)
-- 스쿼드에 등록된 선수 + 조회 이력 선수 대상으로만 sync
-- 거래 없는 경우 row 없음 (NULL 저장 안 함)
CREATE TABLE IF NOT EXISTS nexon_player_prices (
  spid          INT   NOT NULL REFERENCES nexon_players(spid) ON DELETE CASCADE,
  enhance       INT   NOT NULL CHECK (enhance BETWEEN 5 AND 11),  -- 5~11강만 sync
  price_bp      BIGINT NOT NULL,   -- 최저가 (BP)
  synced_at     TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (spid, enhance)
);

-- ─────────────────────────────────────────────
-- 우리 리그 데이터
-- ─────────────────────────────────────────────

-- 유저 (닉네임 + bcrypt 비밀번호 — 우리끼리 쓰는 사이트)
CREATE TABLE IF NOT EXISTS users (
  id            UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname      VARCHAR(30)  UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,          -- bcryptjs 해시
  avatar_url    TEXT,
  nexon_ouid    TEXT,        -- 넥슨 계정 연동 (선택)
  role          VARCHAR(20)  DEFAULT 'member',  -- 'admin' | 'member'
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- 팀
CREATE TABLE IF NOT EXISTS teams (
  id          UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  owner_id    UUID  REFERENCES users(id),
  emblem_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 팀 멤버
CREATE TABLE IF NOT EXISTS team_members (
  team_id  UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  role     VARCHAR(20) DEFAULT 'member',  -- 'owner' | 'member'
  PRIMARY KEY (team_id, user_id)
);

-- 리그 시즌
CREATE TABLE IF NOT EXISTS seasons (
  id          UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(50) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  is_active   BOOLEAN DEFAULT FALSE,
  winner_team UUID  REFERENCES teams(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 경기 일정 & 결과
CREATE TABLE IF NOT EXISTS matches (
  id            UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id     UUID  REFERENCES seasons(id) ON DELETE CASCADE,
  home_team_id  UUID  REFERENCES teams(id),
  away_team_id  UUID  REFERENCES teams(id),
  scheduled_at  TIMESTAMPTZ,
  home_score    INT,
  away_score    INT,
  status        VARCHAR(20) DEFAULT 'scheduled',  -- 'scheduled' | 'played' | 'cancelled'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 개인 경기 기록
CREATE TABLE IF NOT EXISTS match_stats (
  id        UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id  UUID  REFERENCES matches(id) ON DELETE CASCADE,
  user_id   UUID  REFERENCES users(id),
  goals     INT   DEFAULT 0,
  assists   INT   DEFAULT 0,
  mom       BOOLEAN DEFAULT FALSE
);

-- 팀 스쿼드
CREATE TABLE IF NOT EXISTS team_squads (
  id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id    UUID  REFERENCES teams(id) ON DELETE CASCADE,
  season_id  UUID  REFERENCES seasons(id) ON DELETE CASCADE,
  spid       INT   REFERENCES nexon_players(spid),

  -- 실제 운용 포지션 (기본과 다를 수 있음, ex: ST → CAM)
  position   VARCHAR(10),

  -- 실제 강화 등급 (0~11)
  enhance    INT   DEFAULT 0 CHECK (enhance BETWEEN 0 AND 11),

  -- 메모 (선택, ex: "집중훈련 +3", "팀컬러 보정 포함")
  note       TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 명예의 전당
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id         UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id  UUID  REFERENCES seasons(id),
  category   VARCHAR(50) NOT NULL,  -- '우승팀' | '득점왕' | 'MVP' ...
  team_id    UUID  REFERENCES teams(id),
  user_id    UUID  REFERENCES users(id),
  value      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 인덱스
-- ─────────────────────────────────────────────

-- 경기 / 기록
CREATE INDEX IF NOT EXISTS idx_matches_season       ON matches(season_id);
CREATE INDEX IF NOT EXISTS idx_match_stats_match    ON match_stats(match_id);
CREATE INDEX IF NOT EXISTS idx_match_stats_user     ON match_stats(user_id);

-- 선수 검색 필터
CREATE INDEX IF NOT EXISTS idx_players_name         ON nexon_players(player_name);
CREATE INDEX IF NOT EXISTS idx_players_season       ON nexon_players(season_id);
CREATE INDEX IF NOT EXISTS idx_players_position     ON nexon_players(position);
CREATE INDEX IF NOT EXISTS idx_players_nationality  ON nexon_players(nationality);
CREATE INDEX IF NOT EXISTS idx_players_height       ON nexon_players(height);
CREATE INDEX IF NOT EXISTS idx_players_weight       ON nexon_players(weight);
CREATE INDEX IF NOT EXISTS idx_players_body_type    ON nexon_players(body_type);
CREATE INDEX IF NOT EXISTS idx_players_foot_main    ON nexon_players(foot_main);
CREATE INDEX IF NOT EXISTS idx_players_speed        ON nexon_players(stat_speed);
CREATE INDEX IF NOT EXISTS idx_players_shoot        ON nexon_players(stat_shoot);
CREATE INDEX IF NOT EXISTS idx_players_pass         ON nexon_players(stat_pass);
CREATE INDEX IF NOT EXISTS idx_players_dribble      ON nexon_players(stat_dribble);
CREATE INDEX IF NOT EXISTS idx_players_defense      ON nexon_players(stat_defense);
CREATE INDEX IF NOT EXISTS idx_players_physical     ON nexon_players(stat_physical);

-- JSONB 필터 (GIN 인덱스)
CREATE INDEX IF NOT EXISTS idx_players_sub_stats    ON nexon_players USING GIN (sub_stats);
CREATE INDEX IF NOT EXISTS idx_players_traits       ON nexon_players USING GIN (traits);
CREATE INDEX IF NOT EXISTS idx_players_position_ovr ON nexon_players USING GIN (position_ovr);

-- 시세
CREATE INDEX IF NOT EXISTS idx_prices_spid          ON nexon_player_prices(spid);
CREATE INDEX IF NOT EXISTS idx_prices_enhance       ON nexon_player_prices(enhance);
CREATE INDEX IF NOT EXISTS idx_prices_synced_at     ON nexon_player_prices(synced_at);
