CREATE TRIGGER trg_UpdateDifficultyProfile
ON Attempts
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PlayerID INT;
    DECLARE @DifficultyScore INT;
    DECLARE @RecommendedLevelID INT;

    -- Get player_id from inserted attempt
    SELECT @PlayerID = player_id
    FROM inserted;

    -- Calculate difficulty score
    EXEC sp_CalculateDifficultyScore
        @player_id = @PlayerID,
        @difficulty_score = @DifficultyScore OUTPUT;

    -- Get recommended level based on score
    EXEC sp_RecommendLevel
        @difficulty_score = @DifficultyScore,
        @level_id = @RecommendedLevelID OUTPUT;

    -- Update difficulty profile
    UPDATE Difficulty_Profiles
    SET difficulty_score = @DifficultyScore,
        recommended_level_id = @RecommendedLevelID,
        last_updated = GETDATE()
    WHERE player_id = @PlayerID;
END;
GO
