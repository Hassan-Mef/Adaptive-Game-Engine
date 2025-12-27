CREATE TRIGGER trg_ValidateGameAttempt
ON Attempts
AFTER INSERT
AS
BEGIN
    -- Check for invalid values
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE score < 0
           OR accuracy < 0 OR accuracy > 100
           OR shots_fired < 0
           OR shots_hit < 0
           OR shots_hit > shots_fired
    )
    BEGIN
        -- Rollback the insert if invalid data found
        RAISERROR ('Invalid game attempt data detected.', 16, 1)
        ROLLBACK TRANSACTION
    END
END;