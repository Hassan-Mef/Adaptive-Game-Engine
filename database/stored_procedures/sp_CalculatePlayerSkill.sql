ALTER PROCEDURE sp_CalculatePlayerSkill
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
    DECLARE @DifficultyWeight FLOAT;
    DECLARE @LatestDifficultyTier VARCHAR(10);

    /* -------------------------------
       Session-level performance
       ------------------------------- */
    SELECT
        @AvgSessionScore = AVG(
            CASE
                WHEN a.total_score < 0 THEN 0
                ELSE LEAST(a.total_score, 1000)
            END
        ),
        @AvgSessionAccuracy = AVG(a.avg_accuracy)
    FROM Attempts a
    WHERE a.player_id = @PlayerID
        AND a.session_end IS NOT NULL;

    /* -------------------------------
       Round-level behavior
       (consistency & reaction time)
       ------------------------------- */
    SELECT
        @AvgReactionTime = AVG(
    CASE
        WHEN r.avg_reaction_time IS NULL THEN 1000
        ELSE r.avg_reaction_time
    END
    ),
    @Consistency = 100 - STDEV
    (r.accuracy)
    FROM Attempts a
        JOIN Session_Rounds r
          ON a.attempt_id = r.attempt_id
    WHERE a.player_id = @PlayerID;


    -- Reaction score: 0–100
DECLARE @ReactionScore FLOAT;

SET @ReactionScore =
    CASE
        WHEN @AvgReactionTime <= 300 THEN 100
        WHEN @AvgReactionTime >= 3000 THEN 0
        ELSE 100 - ((@AvgReactionTime - 300) / 27)
    END;


    /* -------------------------------
       No data → beginner
       ------------------------------- */
    IF @AvgSessionScore IS NULL
    BEGIN
        SET @DifficultyScore = 0;
        RETURN;
    END

    /* -------------------------------
       Get latest session's difficulty tier
       ------------------------------- */
    SELECT TOP 1
        @LatestDifficultyTier = final_difficulty_tier
    FROM Attempts
    WHERE player_id = @PlayerID
        AND session_end IS NOT NULL
    ORDER BY session_end DESC;
    -- latest session

    /* -------------------------------
       Map latest tier to difficulty weight
       ------------------------------- */
    SET @DifficultyWeight = CASE UPPER(@LatestDifficultyTier)
        WHEN 'EASY' THEN 0.8
        WHEN 'MEDIUM' THEN 1.0
        WHEN 'HARD' THEN 1.2
        ELSE 1.0
    END;

    /* -------------------------------
       Final weighted skill score
       ------------------------------- */
    SET @DifficultyScore = CAST(
(
  (@AvgSessionScore * 0.04) +          -- scaled
  (@AvgSessionAccuracy * 30) +
  (@ReactionScore * 0.2) +
  (ISNULL(@Consistency, 0) * 0.1)
) * ISNULL(@DifficultyWeight, 1.0)
AS INT);


    -- Clamp score to 0–100
    SET @DifficultyScore =
        CASE
            WHEN @DifficultyScore < 0 THEN 0
            WHEN @DifficultyScore > 100 THEN 100
            ELSE @DifficultyScore
        END;
END;
GO
