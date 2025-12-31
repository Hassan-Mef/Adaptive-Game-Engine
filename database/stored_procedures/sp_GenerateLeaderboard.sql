CREATE PROCEDURE sp_GenerateLeaderboard
AS
BEGIN
    SET NOCOUNT ON;

    -- Clear old leaderboard data
    DELETE FROM Leaderboard_Log;

    INSERT INTO Leaderboard_Log (
        player_id,
        score,
        rank_position
    )
    SELECT
        player_id,
        MAX(total_score) AS best_session_score,
        RANK() OVER (
            ORDER BY MAX(total_score) DESC
        ) AS rank_position
    FROM Attempts
    WHERE session_end IS NOT NULL
    GROUP BY player_id;
END;
GO
