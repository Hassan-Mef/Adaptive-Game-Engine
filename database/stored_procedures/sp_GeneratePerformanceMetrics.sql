CREATE OR ALTER PROCEDURE sp_GeneratePerformanceMetrics
    @AttemptID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Prevent duplicate metrics
    IF EXISTS (
        SELECT 1 FROM Performance_Metrics
        WHERE attempt_id = @AttemptID
    )
        RETURN;

    DECLARE
        @avgReaction FLOAT,
        @shotsHit INT,
        @shotsFired INT,
        @difficultyChanged CHAR(1);

    -- Aggregate round data
    SELECT
        @avgReaction = AVG(avg_reaction_time),
        @shotsHit = SUM(shots_hit),
        @shotsFired = SUM(shots_fired)
    FROM Session_Rounds
    WHERE attempt_id = @AttemptID;

    -- Detect difficulty change during session
    SELECT
        @difficultyChanged =
        CASE
            WHEN COUNT(DISTINCT difficulty_tier) > 1 THEN 'Y'
            ELSE 'N'
        END
    FROM Session_Rounds
    WHERE attempt_id = @AttemptID;

    -- Insert metrics
    INSERT INTO Performance_Metrics (
        attempt_id,
        reaction_time_avg,
        enemies_killed,
        enemies_dodged,
        hit_miss_ratio,
        difficulty_adjustment_flag
    )
    VALUES (
        @AttemptID,
        @avgReaction,
        @shotsHit,
        @shotsFired - @shotsHit,
        CASE WHEN @shotsFired > 0
             THEN CAST(@shotsHit AS FLOAT) / @shotsFired
             ELSE 0 END,
        @difficultyChanged
    );
END;
GO
