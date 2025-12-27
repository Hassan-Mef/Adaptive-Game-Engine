CREATE VIEW vw_DifficultyHistory
AS
SELECT
    p.player_id,
    p.username,

    l.level_name,
    l.difficulty_rank,

    COUNT(a.attempt_id) AS attempts_on_level,
    AVG(a.score) AS avg_score_on_level,

    MIN(a.timestamp) AS first_played,
    MAX(a.timestamp) AS last_played

FROM Players p
JOIN Attempts a
    ON p.player_id = a.player_id
JOIN Levels l
    ON a.level_id = l.level_id

GROUP BY
    p.player_id,
    p.username,
    l.level_name,
    l.difficulty_rank;
GO
