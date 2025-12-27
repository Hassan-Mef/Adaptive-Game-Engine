CREATE TRIGGER trg_LogGameAttempt
ON Attempts
AFTER INSERT
AS
BEGIN
    INSERT INTO System_Log (
        event_type,
        table_name,
        record_id,
        performed_by
    )
    SELECT
        'INSERT',
        'Attempts',
        attempt_id,
        'SYSTEM'
    FROM inserted
END;