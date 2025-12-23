CREATE PROCEDURE sp_GetPlayerStats
    @player_id INT,
    @total_attempts INT OUTPUT,
    @average_score FLOAT OUTPUT,
    @average_accuracy FLOAT OUTPUT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Attempts WHERE player_id = @player_id)
    BEGIN
        SELECT 
            @total_attempts = COUNT(*),
            @average_score = AVG(score),
            @average_accuracy = AVG(accuracy)
        FROM Attempts
        WHERE player_id = @player_id
    END
    ELSE
    BEGIN
        SET @total_attempts = 0
        SET @average_score = 0
        SET @average_accuracy = 0
    END
END;