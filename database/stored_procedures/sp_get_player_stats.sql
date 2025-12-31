

CREATE PROCEDURE sp_GetPlayerStats
    @PlayerID INT,
    @username VARCHAR(50) OUTPUT,
    @TotalSessions INT OUTPUT,
    @AvgSessionScore FLOAT OUTPUT,
    @AvgAccuracy FLOAT OUTPUT,
    @AvgReactionTime FLOAT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Attempts
        WHERE player_id = @PlayerID
          AND session_end IS NOT NULL
    )
    BEGIN
        SELECT
            @username = Players.username,
            @TotalSessions = COUNT(*),
            @AvgSessionScore = AVG(total_score),
            @AvgAccuracy = AVG(avg_accuracy),
            @AvgReactionTime = AVG(avg_reaction_time)
        FROM Attempts
        JOIN Players ON Attempts.player_id = Players.player_id
        WHERE Attempts.player_id = @PlayerID
          AND Attempts.session_end IS NOT NULL
        GROUP BY Players.username, Players.player_id;
    END
    ELSE
    BEGIN
        SET @TotalSessions = 0;
        SET @AvgSessionScore = 0;
        SET @AvgAccuracy = 0;
        SET @AvgReactionTime = NULL;
    END
END;
GO
