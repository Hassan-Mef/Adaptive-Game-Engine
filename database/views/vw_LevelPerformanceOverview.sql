CREATE VIEW vw_LevelPerformanceOverview AS
SELECT
    l.level_id,
    l.level_name,
    l.difficulty_rank,

    COUNT(r.round_id) AS rounds_played,
    AVG(r.score) AS avg_score,
    AVG(r.avg_reaction_time) AS avg_reaction_time,

    CASE
        WHEN SUM(r.shots_fired) = 0 THEN 0
        ELSE CAST(SUM(r.shots_hit) * 100.0 / SUM(r.shots_fired) AS DECIMAL(5,2))
    END AS avg_accuracy

FROM Levels l
LEFT JOIN Session_Rounds r ON l.level_id = r.level_id

GROUP BY
    l.level_id,
    l.level_name,
    l.difficulty_rank;
GO
