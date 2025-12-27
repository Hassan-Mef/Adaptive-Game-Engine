CREATE PROCEDURE sp_RecommendDifficultyLevel
    @PlayerID INT,
    @RecommendedLevelID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @DifficultyScore INT;

    -- Get player difficulty score
    EXEC sp_CalculatePlayerSkill
        @PlayerID = @PlayerID,
        @DifficultyScore = @DifficultyScore OUTPUT;

    -- Select appropriate level based on score
    IF @DifficultyScore < 40
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        ORDER BY difficulty_rank ASC;          -- Easy
    ELSE IF @DifficultyScore < 70
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        WHERE difficulty_rank BETWEEN 3 AND 6
        ORDER BY difficulty_rank;              -- Medium
    ELSE
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        ORDER BY difficulty_rank DESC;         -- Hard

    -- Update or insert difficulty profile
    IF EXISTS (SELECT 1 FROM Difficulty_Profiles WHERE player_id = @PlayerID)
    BEGIN
        UPDATE Difficulty_Profiles
        SET
            difficulty_score = @DifficultyScore,
            recommended_level_id = @RecommendedLevelID,
            last_updated = GETDATE()
        WHERE player_id = @PlayerID;
    END
    ELSE
    BEGIN
        INSERT INTO Difficulty_Profiles (player_id, difficulty_score, recommended_level_id)
        VALUES (@PlayerID, @DifficultyScore, @RecommendedLevelID);
    END
END;
GO
