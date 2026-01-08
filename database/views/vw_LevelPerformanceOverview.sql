CREATE OR ALTER VIEW vw_LevelPerformanceOverview AS
SELECT
    r.difficulty_tier AS difficulty_level,

    COUNT(r.round_id) AS rounds_played,

    -- Approximate score proxy (DB-safe)
    AVG(
        CASE
            WHEN r.shots_fired = 0 THEN 0
            ELSE r.shots_hit * 10
        END
    ) AS avg_score,

    AVG(r.avg_reaction_time) AS avg_reaction_time,

    CAST(
        CASE
            WHEN SUM(r.shots_fired) = 0 THEN 0
            ELSE SUM(r.shots_hit) * 100.0 / SUM(r.shots_fired)
        END
    AS DECIMAL(5,2)) AS avg_accuracy

FROM Session_Rounds r
GROUP BY r.difficulty_tier;
GO



SELECT * FROM vw_LevelPerformanceOverview;