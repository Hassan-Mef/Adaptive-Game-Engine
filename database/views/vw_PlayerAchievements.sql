CREATE VIEW vw_PlayerAchievements AS
SELECT
    p.username,
    a.title,
    a.description,
    pa.earned_date
FROM Player_Achievements pa
JOIN Achievements a ON pa.achievement_id = a.achievement_id
JOIN Players p ON pa.player_id = p.player_id;
