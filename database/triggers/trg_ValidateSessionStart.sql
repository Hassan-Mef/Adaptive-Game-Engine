CREATE TRIGGER trg_ValidateSessionStart
ON Attempts
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE player_id IS NULL
           OR session_start IS NULL
    )
    BEGIN
        RAISERROR ('Invalid session start detected.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
