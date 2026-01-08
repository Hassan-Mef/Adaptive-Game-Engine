ALTER TRIGGER trg_LogDifficulty
ON Difficulty_Profiles
AFTER INSERT, UPDATE
AS  
BEGIN
    SET NOCOUNT ON;

    INSERT INTO System_Log(event_type, table_name, record_id, performed_by)
    SELECT 'DIFFICULTY_UPDATE', 'Difficulty_Profiles', i.profile_id, 'SYSTEM'
    FROM inserted i;
END;
GO
