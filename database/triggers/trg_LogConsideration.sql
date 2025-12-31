CREATE TRIGGER trg_LogConsideration
ON Attempts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(session_end)
    BEGIN
        INSERT INTO System_Log (
            event_type,
            table_name,
            record_id,
            performed_by
        )
        SELECT
            'SESSION_END',
            'Attempts',
            i.attempt_id,
            'SYSTEM'
        FROM inserted i
        JOIN deleted d
            ON i.attempt_id = d.attempt_id
        WHERE d.session_end IS NULL
          AND i.session_end IS NOT NULL;
    END
END;
GO
