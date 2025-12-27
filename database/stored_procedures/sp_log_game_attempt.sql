CREATE PROCEDURE sp_LogGameAttempt
    @player_id INT,
    @level_id INT,
    @score INT,
    @accuracy FLOAT,
    @time_survived FLOAT,
    @shots_fired INT,
    @shots_hit INT,
    @attempt_id INT OUTPUT
AS
BEGIN
    INSERT INTO Attempts (
        player_id,
        level_id,
        score,
        accuracy,
        time_survived,
        shots_fired,
        shots_hit
    )
    VALUES (
        @player_id,
        @level_id,
        @score,
        @accuracy,
        @time_survived,
        @shots_fired,
        @shots_hit
    )

    SET @attempt_id = SCOPE_IDENTITY()
END;