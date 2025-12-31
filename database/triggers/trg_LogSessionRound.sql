CREATE TRIGGER trg_LogSessionRound
ON Session_Rounds
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
        'ROUND_INSERT',
        'Session_Rounds',
        round_id,
        'SYSTEM'
    FROM inserted;
END;
GO
