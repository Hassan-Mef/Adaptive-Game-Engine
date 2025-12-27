CREATE VIEW vw_LevelPerformanceOverview
AS
SELECT
    l.level_id,
    l.level_name,
    COUNT(a.attempt_id) AS total_attempts,
    AVG(a.score) AS average_score,
    AVG(a.accuracy) AS average_accuracy
FROM Levels l
JOIN Attempts a
    ON l.level_id = a.level_id
GROUP BY
    l.level_id,
    l.level_name;