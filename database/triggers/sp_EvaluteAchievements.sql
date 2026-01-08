CREATE PROCEDURE sp_EvaluateAchievements
    @AttemptID INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE
        @PlayerID INT,
        @ShotsHit INT,
        @ShotsFired INT,
        @Accuracy FLOAT,
        @RoundsCompleted INT,
        @FinalDifficulty VARCHAR(10);

    -- Get session data
    SELECT
        @PlayerID = player_id,
        @ShotsHit = total_shots_hit,
        @ShotsFired = total_shots_fired,
        @FinalDifficulty = final_difficulty_tier
    FROM Attempts
    WHERE attempt_id = @AttemptID;

    SET @Accuracy =
        CASE WHEN @ShotsFired > 0
             THEN (@ShotsHit * 100.0 / @ShotsFired)
             ELSE 0 END;

    SELECT
        @RoundsCompleted = COUNT(*)
    FROM Session_Rounds
    WHERE attempt_id = @AttemptID;

    /* =====================
       ACHIEVEMENT CHECKS
       ===================== */

    -- Warmup Complete
    IF @ShotsHit >= 20
        INSERT INTO Player_Achievements (player_id, achievement_id)
        SELECT @PlayerID, achievement_id
        FROM Achievements
        WHERE title = 'Warmup Complete'
          AND NOT EXISTS (
              SELECT 1 FROM Player_Achievements pa
              WHERE pa.player_id = @PlayerID
                AND pa.achievement_id = Achievements.achievement_id
          );

    -- Sharpshooter
    IF @Accuracy >= 80
        INSERT INTO Player_Achievements (player_id, achievement_id)
        SELECT @PlayerID, achievement_id
        FROM Achievements
        WHERE title = 'Sharpshooter'
          AND NOT EXISTS (
              SELECT 1 FROM Player_Achievements pa
              WHERE pa.player_id = @PlayerID
                AND pa.achievement_id = Achievements.achievement_id
          );

    -- Survivor
    IF @RoundsCompleted >= 3
        INSERT INTO Player_Achievements (player_id, achievement_id)
        SELECT @PlayerID, achievement_id
        FROM Achievements
        WHERE title = 'Survivor'
          AND NOT EXISTS (
              SELECT 1 FROM Player_Achievements pa
              WHERE pa.player_id = @PlayerID
                AND pa.achievement_id = Achievements.achievement_id
          );

    -- Difficulty Promotions
    IF @FinalDifficulty = 'MEDIUM'
        INSERT INTO Player_Achievements (player_id, achievement_id)
        SELECT @PlayerID, achievement_id
        FROM Achievements
        WHERE title = 'Medium Promoted'
          AND NOT EXISTS (
              SELECT 1 FROM Player_Achievements pa
              WHERE pa.player_id = @PlayerID
                AND pa.achievement_id = Achievements.achievement_id
          );

    IF @FinalDifficulty = 'HARD'
        INSERT INTO Player_Achievements (player_id, achievement_id)
        SELECT @PlayerID, achievement_id
        FROM Achievements
        WHERE title = 'Hard Promoted'
          AND NOT EXISTS (
              SELECT 1 FROM Player_Achievements pa
              WHERE pa.player_id = @PlayerID
                AND pa.achievement_id = Achievements.achievement_id
          );
END;
GO
