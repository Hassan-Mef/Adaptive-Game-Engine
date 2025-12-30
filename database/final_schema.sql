/* ============================================================
   Adaptive Game Difficulty Engine
   Final Database Schema (Design View)
   ------------------------------------------------------------
   Key Design Decisions:
   - One ATTEMPT = One full GAME SESSION
   - Each SESSION consists of multiple ROUNDS
   - Aggregated data stored at session level
   - Time-series / graph data stored at round level
   ============================================================ */


/* =======================
   PLAYERS & SETTINGS
   ======================= */

CREATE TABLE Players (
    player_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    join_date DATETIME DEFAULT GETDATE(),
    last_login DATETIME NULL,
    account_status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- Stores user-specific preferences (not gameplay data)
CREATE TABLE Player_Settings (
    setting_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT NOT NULL,
    sensitivity FLOAT,
    theme VARCHAR(20),
    sound_level INT,
    is_inverted_controls BIT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);


/* =======================
   DIFFICULTY & LEVEL MODEL
   ======================= */

-- Represents difficulty presets used by the adaptive engine
-- (Levels are NOT gameplay stages; they act as difficulty buckets)
CREATE TABLE Levels (
    level_id INT IDENTITY(1,1) PRIMARY KEY,
    level_name VARCHAR(50),
    base_enemy_speed FLOAT,
    enemy_count INT,
    spawn_rate FLOAT,
    difficulty_rank INT
);

-- Stores long-term player skill and recommended starting difficulty
CREATE TABLE Difficulty_Profiles (
    profile_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT NOT NULL,
    difficulty_score INT,
    recommended_level_id INT,
    last_updated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (recommended_level_id) REFERENCES Levels(level_id)
);


/* =======================
   ATTEMPTS = GAME SESSIONS
   ======================= */

-- One ATTEMPT represents ONE complete game session by a player
-- Used for leaderboards, dashboards, and session summaries
CREATE TABLE Attempts (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT NOT NULL,

    -- Session lifecycle
    session_start DATETIME DEFAULT GETDATE(),
    session_end DATETIME NULL,

    -- Aggregated session performance
    total_score INT,
    avg_accuracy FLOAT,
    total_shots_fired INT,
    total_shots_hit INT,
    avg_reaction_time FLOAT,

    -- Final difficulty state after adaptive evaluation
    final_difficulty_tier VARCHAR(10),   -- EASY / MEDIUM / HARD
    final_difficulty_value FLOAT,        -- Numeric representation

    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);


/* =======================
   SESSION ROUNDS (CORE)
   ======================= */

-- Stores per-round time-series data for a session
-- Enables graphs, histograms, and difficulty progression analysis
CREATE TABLE Session_Rounds (
    round_id INT IDENTITY PRIMARY KEY,
    attempt_id INT NOT NULL,

    round_index INT NOT NULL,             -- Order within session (1..N)

    -- Difficulty state during this round
    difficulty_tier VARCHAR(10),          -- EASY / MEDIUM / HARD
    difficulty_sublevel FLOAT,             -- +1, +2, continuous for HARD

    -- Round performance metrics
    accuracy FLOAT,
    shots_fired INT,
    shots_hit INT,
    avg_reaction_time FLOAT,
    round_duration FLOAT,

    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (attempt_id) REFERENCES Attempts(attempt_id),
    CONSTRAINT uq_attempt_round UNIQUE (attempt_id, round_index)
);


/* =======================
   ADVANCED ANALYTICS
   ======================= */

-- Stores deeper analytics (optional, DBMS-focused)
CREATE TABLE Performance_Metrics (
    metric_id INT IDENTITY(1,1) PRIMARY KEY,
    attempt_id INT NOT NULL,
    reaction_time_avg FLOAT,
    enemies_killed INT,
    enemies_dodged INT,
    hit_miss_ratio FLOAT,
    difficulty_adjustment_flag CHAR(1),
    FOREIGN KEY (attempt_id) REFERENCES Attempts(attempt_id)
);


/* =======================
   ACHIEVEMENTS SYSTEM
   ======================= */

-- Master list of achievements
CREATE TABLE Achievements (
    achievement_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(255),
    requirement_type VARCHAR(50),
    requirement_value INT
);

-- Tracks achievements earned by players
CREATE TABLE Player_Achievements (
    pa_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (achievement_id) REFERENCES Achievements(achievement_id)
);


/* =======================
   LEADERBOARD & LOGGING
   ======================= */

-- Stores leaderboard snapshots for ranking and history
CREATE TABLE Leaderboard_Log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT NOT NULL,
    score INT,
    rank_position INT,
    log_timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

-- System-level logging for auditing and triggers
CREATE TABLE System_Log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    event_type VARCHAR(20),
    table_name VARCHAR(50),
    record_id INT,
    performed_by VARCHAR(50),
    timestamp DATETIME DEFAULT GETDATE()
);
