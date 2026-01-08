CREATE OR ALTER PROCEDURE sp_LogLeaderboardSnapshot
    @PlayerID INT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH RankedLeaderboard AS (
        SELECT
            a.player_id,
            SUM(a.total_score) AS total_score,
            RANK() OVER (ORDER BY SUM(a.total_score) DESC) AS rank_position
        FROM Attempts a
        WHERE a.session_end IS NOT NULL
        GROUP BY a.player_id
    )
    INSERT INTO Leaderboard_Log (player_id, score, rank_position)
    SELECT
        r.player_id,
        r.total_score,
        r.rank_position
    FROM RankedLeaderboard r
    WHERE r.player_id = @PlayerID;
END;
GO
