CREATE VIEW vw_DifficultyHistory AS
SELECT
    a.player_id,
    p.username,

    a.attempt_id,
    a.start_time,
    a.end_time,

    dp.difficulty_score,
    l.level_name,
    l.difficulty_rank

FROM Attempts a
JOIN Players p ON a.player_id = p.player_id
JOIN Difficulty_Profiles dp ON a.player_id = dp.player_id
JOIN Levels l ON dp.recommended_level_id = l.level_id;
GO
