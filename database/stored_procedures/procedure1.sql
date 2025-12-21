CREATE PROCEDURE sp_CalculatePlayerSkill
    @PlayerID INT,
    @DifficultyScore INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AvgScore FLOAT;
    DECLARE @AvgAccuracy FLOAT;
    DECLARE @HitRatio FLOAT;

    SELECT
        @AvgScore = AVG(CAST(score AS FLOAT)),
        @AvgAccuracy = AVG(accuracy),
        @HitRatio = AVG(
            CASE 
                WHEN shots_fired = 0 THEN 0 
                ELSE CAST(shots_hit AS FLOAT) / shots_fired 
            END
        )
    FROM Attempts
    WHERE player_id = @PlayerID;

    -- If no attempts exist
    IF @AvgScore IS NULL
    BEGIN
        SET @DifficultyScore = 0;
        RETURN;
    END

    -- Final difficulty score calculation
    SET @DifficultyScore = CAST(
        (@AvgScore * 0.5) +
        (@AvgAccuracy * 30) +
        (@HitRatio * 20)
        AS INT
    );
END;
GO
