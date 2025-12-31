-- changed t
CREATE PROCEDURE sp_EndGameSession
    @attempt_id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE A
    SET
        session_end = GETDATE(),
        total_score = SR.total_score,
        avg_accuracy = SR.avg_accuracy,
        total_shots_fired = SR.total_shots_fired,
        total_shots_hit = SR.total_shots_hit,
        avg_reaction_time = SR.avg_reaction_time,
        final_difficulty_tier = SR.final_difficulty_tier,
        final_difficulty_value = SR.final_difficulty_value
    FROM Attempts A
    JOIN (
        SELECT
            attempt_id,
            SUM(shots_hit * 10) AS total_score,
            AVG(accuracy) AS avg_accuracy,
            SUM(shots_fired) AS total_shots_fired,
            SUM(shots_hit) AS total_shots_hit,
            AVG(avg_reaction_time) AS avg_reaction_time,
            MAX(difficulty_tier) AS final_difficulty_tier,
            MAX(difficulty_sublevel) AS final_difficulty_value
        FROM Session_Rounds
        WHERE attempt_id = @attempt_id
        GROUP BY attempt_id
    ) SR ON A.attempt_id = SR.attempt_id;
END;
GO