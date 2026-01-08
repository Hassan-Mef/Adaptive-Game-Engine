CREATE OR ALTER VIEW vw_DifficultyHistory AS
SELECT
    a.player_id,
    p.username,

    a.attempt_id,
    a.session_start,
    a.session_end,

    a.final_difficulty_tier,
    a.final_difficulty_value

FROM Attempts a
JOIN Players p ON a.player_id = p.player_id
WHERE a.session_end IS NOT NULL;
GO



SELECT * FROM vw_DifficultyHistory;