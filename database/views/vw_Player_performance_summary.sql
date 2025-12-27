CREATE VIEW vw_PlayerPerformanceSummary
AS
SELECT
    p.player_id,
    p.username,
    COUNT(a.attempt_id) AS total_attempts,
    AVG(a.score) AS average_score,
    AVG(a.accuracy) AS average_accuracy,
    AVG(a.time_survived) AS average_time_survived
FROM Players p
JOIN Attempts a
    ON p.player_id = a.player_id
GROUP BY
    p.player_id,
    p.username;