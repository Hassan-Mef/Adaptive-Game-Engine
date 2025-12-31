
CREATE PROCEDURE sp_RecommendDifficultyLevel
    @PlayerID INT,
    @HasHistory BIT OUTPUT,
    @DifficultyScore INT OUTPUT,
    @RecommendedLevelID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    /* -------------------------------
       1. Validate player exists
       ------------------------------- */
    IF NOT EXISTS (SELECT 1 FROM Players WHERE player_id = @PlayerID)
    BEGIN
        THROW 50001, 'Player does not exist', 1;
    END

    /* -------------------------------
       2. Check if player has history
       ------------------------------- */
    IF NOT EXISTS (
        SELECT 1
        FROM Attempts
        WHERE player_id = @PlayerID
          AND session_end IS NOT NULL
    )
    BEGIN
        -- Beginner path
        SET @HasHistory = 0;
        SET @DifficultyScore = 0;

        SELECT TOP 1
            @RecommendedLevelID = level_id
        FROM Levels
        ORDER BY difficulty_rank ASC; -- easiest

        RETURN;
    END

    /* -------------------------------
       3. Calculate skill
       ------------------------------- */
    SET @HasHistory = 1;

    EXEC sp_CalculatePlayerSkill
        @PlayerID = @PlayerID,
        @DifficultyScore = @DifficultyScore OUTPUT;

    /* -------------------------------
       4. Select difficulty tier
       ------------------------------- */
    IF @DifficultyScore < 40
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        ORDER BY difficulty_rank ASC;
    ELSE IF @DifficultyScore < 70
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        WHERE difficulty_rank BETWEEN 3 AND 6
        ORDER BY difficulty_rank;
    ELSE
        SELECT TOP 1 @RecommendedLevelID = level_id
        FROM Levels
        ORDER BY difficulty_rank DESC;

    /* -------------------------------
       5. Upsert Difficulty Profile
       ------------------------------- */
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
        INSERT INTO Difficulty_Profiles (
            player_id,
            difficulty_score,
            recommended_level_id
        )
        VALUES (
            @PlayerID,
            @DifficultyScore,
            @RecommendedLevelID
        );
    END
END;
GO
