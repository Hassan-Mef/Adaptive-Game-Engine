USE GameDB;
GO

CREATE PROCEDURE sp_LoginPlayer
    @username VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        player_id,
        password_hash
    FROM Players
    WHERE username = @username;
END;
GO
