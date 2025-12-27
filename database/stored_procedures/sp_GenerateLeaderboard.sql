CREATE PROCEDURE sp_GenerateLeaderboard
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Leaderboard_Log (player_id, score, rank_position)
    SELECT
        player_id,
        SUM(score) AS total_score,
        RANK() OVER (ORDER BY SUM(score) DESC) AS rank_position
    FROM Attempts
    GROUP BY player_id;
END;
GO
