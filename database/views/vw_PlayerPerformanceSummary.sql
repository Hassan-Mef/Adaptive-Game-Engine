CREATE VIEW vw_PlayerPerformanceSummary AS
SELECT
    p.player_id,
    p.username,

    COUNT(DISTINCT a.attempt_id) AS total_sessions,
    COUNT(r.round_id) AS total_rounds,

    SUM(r.shots_fired) AS total_shots_fired,
    SUM(r.shots_hit) AS total_shots_hit,

    CASE
        WHEN SUM(r.shots_fired) = 0 THEN 0
        ELSE CAST(SUM(r.shots_hit) * 100.0 / SUM(r.shots_fired) AS DECIMAL(5,2))
    END AS accuracy_percentage,

    AVG(r.score) AS avg_score,
    AVG(r.avg_reaction_time) AS avg_reaction_time

FROM Players p
LEFT JOIN Attempts a ON p.player_id = a.player_id
LEFT JOIN Session_Rounds r ON a.attempt_id = r.attempt_id

GROUP BY
    p.player_id,
    p.username;
GO
