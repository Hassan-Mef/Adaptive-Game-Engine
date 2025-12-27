CREATE PROCEDURE sp_RegisterPlayer
    @username VARCHAR(50),
    @email VARCHAR(100),
    @password_hash VARCHAR(255),
    @new_player_id INT OUTPUT,
    @status_message VARCHAR(100) OUTPUT
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM Players 
        WHERE username = @username OR email = @email
    )
    BEGIN
        SET @new_player_id = NULL
        SET @status_message = 'Username or Email already exists'
    END
    ELSE
    BEGIN
        INSERT INTO Players (username, email, password_hash)
        VALUES (@username, @email, @password_hash)

        SET @new_player_id = SCOPE_IDENTITY()
        SET @status_message = 'Player registered successfully'
    END
END;