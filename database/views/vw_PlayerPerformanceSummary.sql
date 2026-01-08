CREATE OR ALTER VIEW vw_PlayerPerformanceSummary AS
SELECT
    p.username,
    a.attempt_id,
    pm.reaction_time_avg,
    pm.enemies_killed,
    pm.enemies_dodged,
    pm.hit_miss_ratio,
    pm.difficulty_adjustment_flag,
    a.session_end
FROM Performance_Metrics pm
JOIN Attempts a ON pm.attempt_id = a.attempt_id
JOIN Players p ON a.player_id = p.player_id;
GO
SELECT * FROM vw_PlayerPerformanceSummary;