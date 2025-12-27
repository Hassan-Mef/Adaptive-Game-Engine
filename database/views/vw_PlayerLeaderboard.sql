CREATE VIEW vw_PlayerLeaderboard
AS
SELECT
    p.player_id,
    p.username,

    COUNT(a.attempt_id) AS total_attempts,
    AVG(a.score) AS average_score,
    MAX(a.score) AS highest_score,

    RANK() OVER (
        ORDER BY AVG(a.score) DESC
    ) AS leaderboard_rank

FROM Players p
JOIN Attempts a
    ON p.player_id = a.player_id

GROUP BY
    p.player_id,
    p.username;
GO
