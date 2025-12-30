CREATE PROCEDURE sp_StartGameSession
    @player_id INT,
    @attempt_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Attempts (
        player_id,
        session_start
    )
    VALUES (
        @player_id,
        GETDATE()
    );

    SET @attempt_id = SCOPE_IDENTITY();
END;
GO
