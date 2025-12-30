CREATE TABLE Players (
    player_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    join_date DATETIME DEFAULT GETDATE(),
    last_login DATETIME NULL,
    account_status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE Player_Settings (
    setting_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT,
    sensitivity FLOAT,
    theme VARCHAR(20),
    sound_level INT,
    is_inverted_controls BIT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE Levels (
    level_id INT IDENTITY(1,1) PRIMARY KEY,
    level_name VARCHAR(50),
    base_enemy_speed FLOAT,
    enemy_count INT,
    spawn_rate FLOAT,
    difficulty_rank INT
);

CREATE TABLE Difficulty_Profiles (
    profile_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT,
    difficulty_score INT,
    recommended_level_id INT,
    last_updated DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (recommended_level_id) REFERENCES Levels(level_id)
);

CREATE TABLE Attempts (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT,
    level_id INT,
    score INT,
    accuracy FLOAT,
    time_survived FLOAT,
    shots_fired INT,
    shots_hit INT,
    timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (level_id) REFERENCES Levels(level_id)
);

CREATE TABLE Performance_Metrics (
    metric_id INT IDENTITY(1,1) PRIMARY KEY,
    attempt_id INT,
    reaction_time_avg FLOAT,
    enemies_killed INT,
    enemies_dodged INT,
    hit_miss_ratio FLOAT,
    difficulty_adjustment_flag CHAR(1),
    FOREIGN KEY (attempt_id) REFERENCES Attempts(attempt_id)
);

CREATE TABLE Achievements (
    achievement_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(255),
    requirement_type VARCHAR(50),
    requirement_value INT
);

CREATE TABLE Player_Achievements (
    pa_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT,
    achievement_id INT,
    earned_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (achievement_id) REFERENCES Achievements(achievement_id)
);

CREATE TABLE Leaderboard_Log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    player_id INT,
    score INT,
    rank_position INT,
    log_timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE System_Log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    event_type VARCHAR(20),
    table_name VARCHAR(50),
    record_id INT,
    performed_by VARCHAR(50),
    timestamp DATETIME DEFAULT GETDATE()
);


ALTER TABLE Attempts
ADD
    session_start DATETIME DEFAULT GETDATE(),
    session_end DATETIME NULL,

    -- Aggregated session stats
    total_score INT NULL,
    avg_accuracy FLOAT NULL,
    total_shots_fired INT NULL,
    total_shots_hit INT NULL,
    avg_reaction_time FLOAT NULL,

    -- Final difficulty outcome
    final_difficulty_tier VARCHAR(10),   -- EASY / MEDIUM / HARD
    final_difficulty_value FLOAT;        -- e.g. 2.3, 5.8, 9.1


-- new core tables 
CREATE TABLE Session_Rounds (
    round_id INT IDENTITY PRIMARY KEY,
    attempt_id INT NOT NULL,

    round_index INT NOT NULL,          -- 1, 2, 3, ...
    
    -- Difficulty state DURING this round
    difficulty_tier VARCHAR(10),       -- EASY / MEDIUM / HARD
    difficulty_sublevel FLOAT,          -- +1, +2, continuous for HARD

    -- Round performance
    accuracy FLOAT,
    shots_fired INT,
    shots_hit INT,
    avg_reaction_time FLOAT,
    round_duration FLOAT,

    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (attempt_id) REFERENCES Attempts(attempt_id),
    CONSTRAINT uq_round UNIQUE (attempt_id, round_index)
);

