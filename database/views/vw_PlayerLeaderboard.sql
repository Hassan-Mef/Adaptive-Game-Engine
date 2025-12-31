CREATE VIEW vw_PlayerLeaderboard AS
SELECT
    p.player_id,
    p.username,

    dp.difficulty_score,
    l.level_name AS recommended_level,

    COUNT(DISTINCT a.attempt_id) AS sessions_played,
    AVG(r.score) AS avg_score,

    RANK() OVER (
        ORDER BY dp.difficulty_score DESC
    ) AS leaderboard_rank

FROM Players p
LEFT JOIN Difficulty_Profiles dp ON p.player_id = dp.player_id
LEFT JOIN Levels l ON dp.recommended_level_id = l.level_id
LEFT JOIN Attempts a ON p.player_id = a.player_id
LEFT JOIN Session_Rounds r ON a.attempt_id = r.attempt_id

GROUP BY
    p.player_id,
    p.username,
    dp.difficulty_score,
    l.level_name;
GO
