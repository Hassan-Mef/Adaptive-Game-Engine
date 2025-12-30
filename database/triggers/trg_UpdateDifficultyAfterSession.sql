CREATE TRIGGER trg_UpdateDifficultyAfterSession
ON Attempts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Only trigger when session_end is set
    IF UPDATE(session_end)
    BEGIN
        DECLARE @PlayerID INT;

        SELECT @PlayerID = player_id
        FROM inserted
        WHERE session_end IS NOT NULL;

        EXEC sp_RecommendDifficultyLevel
            @PlayerID = @PlayerID;
    END
END;
GO
