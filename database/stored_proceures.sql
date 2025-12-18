-- this is all dummy procedure for testing purposes
USE ATM;
GO

CREATE PROCEDURE sp_GetPlayerById
    @PlayerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        @PlayerID AS PlayerID,
        'Test Player' AS Username,
        1 AS CurrentLevel;
END;
GO


CREATE PROCEDURE sp_RecordAttempt
    @PlayerID INT,
    @Score INT,
    @Accuracy FLOAT,
    @TimeTaken FLOAT
AS
BEGIN
    SET NOCOUNT ON;

    -- Dummy logic for now
    SELECT
        @PlayerID AS PlayerID,
        CASE
            WHEN @Score > 80 THEN 'HARD'
            WHEN @Score > 40 THEN 'MEDIUM'
            ELSE 'EASY'
        END AS NewDifficulty;
END;
GO



