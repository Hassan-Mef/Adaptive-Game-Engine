CREATE PROCEDURE sp_CalculatePlayerSkill
    @PlayerID INT,
    @DifficultyScore INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE
        @AvgSessionScore FLOAT,
        @AvgSessionAccuracy FLOAT,
        @AvgReactionTime FLOAT,
        @Consistency FLOAT;

    /* -------------------------------
       Session-level performance
       ------------------------------- */
    SELECT
        @AvgSessionScore = AVG(a.total_score),
        @AvgSessionAccuracy = AVG(a.avg_accuracy)
    FROM Attempts a
    WHERE a.player_id = @PlayerID
      AND a.session_end IS NOT NULL;

    /* -------------------------------
       Round-level behavior
       (consistency & reaction time)
       ------------------------------- */
    SELECT
        @AvgReactionTime = AVG(r.avg_reaction_time),
        @Consistency = 100 - STDEV(r.accuracy)
    FROM Attempts a
    JOIN Session_Rounds r
        ON a.attempt_id = r.attempt_id
    WHERE a.player_id = @PlayerID;

    /* -------------------------------
       No data → beginner
       ------------------------------- */
    IF @AvgSessionScore IS NULL
    BEGIN
        SET @DifficultyScore = 0;
        RETURN;
    END

    /* -------------------------------
       Final weighted skill score
       ------------------------------- */
    SET @DifficultyScore = CAST(
        (@AvgSessionScore * 0.4) +
        (@AvgSessionAccuracy * 30) +
        ((100 - ISNULL(@AvgReactionTime, 100)) * 0.2) +
        (ISNULL(@Consistency, 0) * 0.1)
        AS INT
    );
END;
GO
