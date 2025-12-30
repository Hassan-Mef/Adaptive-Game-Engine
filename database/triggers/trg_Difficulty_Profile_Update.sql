CREATE TRIGGER Difficulty_Profile_Update
ON Difficulty_Profiles
AFTER UPDATE
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
        'DIFFICULTY_UPDATE',
        'Difficulty_Profiles',
        i.profile_id,
        'SYSTEM'
    FROM inserted i
    JOIN deleted d
        ON i.profile_id = d.profile_id
    WHERE i.recommended_level_id <> d.recommended_level_id;
END;
GO
