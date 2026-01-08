CREATE VIEW vw_LeaderboardHistory AS
SELECT
    l.log_id,
    p.username,
    l.score,
    l.rank_position,
    l.log_timestamp
FROM Leaderboard_Log l
JOIN Players p ON l.player_id = p.player_id;
GO


