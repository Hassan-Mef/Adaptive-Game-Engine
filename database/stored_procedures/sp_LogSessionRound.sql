USE GameDB;
GO

CREATE PROCEDURE sp_LogSessionRound
    @attempt_id INT,
    @round_index INT,
    @difficulty_tier VARCHAR(10),
    @difficulty_sublevel FLOAT,
    @accuracy FLOAT,
    @shots_fired INT,
    @shots_hit INT,
    @avg_reaction_time FLOAT,
    @round_duration FLOAT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Session_Rounds (
        attempt_id,
        round_index,
        difficulty_tier,
        difficulty_sublevel,
        accuracy,
        shots_fired,
        shots_hit,
        avg_reaction_time,
        round_duration
    )
    VALUES (
        @attempt_id,
        @round_index,
        @difficulty_tier,
        @difficulty_sublevel,
        @accuracy,
        @shots_fired,
        @shots_hit,
        @avg_reaction_time,
        @round_duration
    );
END;
GO
