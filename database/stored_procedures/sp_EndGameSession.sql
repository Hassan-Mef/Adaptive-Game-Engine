CREATE PROCEDURE sp_EndGameSession
    @attempt_id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Attempts
    SET
        session_end = GETDATE(),
        total_score = SUM(shots_hit * 10),
        avg_accuracy = AVG(accuracy),
        total_shots_fired = SUM(shots_fired),
        total_shots_hit = SUM(shots_hit),
        avg_reaction_time = AVG(avg_reaction_time),
        final_difficulty_tier = MAX(difficulty_tier),
        final_difficulty_value = MAX(difficulty_sublevel)
    FROM Session_Rounds
    WHERE Attempts.attempt_id = @attempt_id
      AND Session_Rounds.attempt_id = Attempts.attempt_id;
END;
GO
