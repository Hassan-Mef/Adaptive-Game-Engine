CREATE TRIGGER trg_ValidateSessionRound
ON Session_Rounds
AFTER INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE accuracy < 0 OR accuracy > 100
           OR shots_fired < 0
           OR shots_hit < 0
           OR shots_hit > shots_fired
           OR avg_reaction_time < 0
    )
    BEGIN
        RAISERROR ('Invalid session round data.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO


CREATE TRIGGER trg_ValidateSessionEnd
ON Attempts
AFTER UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE session_end IS NOT NULL
          AND session_end < session_start
    )
    BEGIN
        RAISERROR ('Invalid session timing detected.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
