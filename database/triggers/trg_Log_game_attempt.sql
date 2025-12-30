CREATE TRIGGER trg_LogSessionStart
ON Attempts
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO System_Log (
        event_type,
        table_name,
        record_id,
        performed_by
    )
    SELECT
        'SESSION_START',
        'Attempts',
        attempt_id,
        'SYSTEM'
    FROM inserted;
END;
GO
