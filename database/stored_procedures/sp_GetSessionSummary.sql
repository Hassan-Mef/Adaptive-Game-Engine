CREATE PROCEDURE sp_GetSessionSummary
    @attempt_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        A.attempt_id,
        A.session_start,
        A.session_end,
        A.total_score,
        A.avg_accuracy,
        A.total_shots_fired,
        A.total_shots_hit,
        A.avg_reaction_time,
        A.final_difficulty_tier,
        A.final_difficulty_value,
        COUNT(R.round_index) AS rounds_played
    FROM Attempts A
    LEFT JOIN Session_Rounds R
        ON A.attempt_id = R.attempt_id
    WHERE A.attempt_id = @attempt_id
    GROUP BY
        A.attempt_id,
        A.session_start,
        A.session_end,
        A.total_score,
        A.avg_accuracy,
        A.total_shots_fired,
        A.total_shots_hit,
        A.avg_reaction_time,
        A.final_difficulty_tier,
        A.final_difficulty_value;
END;
GO
