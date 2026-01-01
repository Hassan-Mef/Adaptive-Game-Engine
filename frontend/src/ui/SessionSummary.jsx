export default function SessionSummary({ data, onRestart, onExit }) {
  if (!data) return null;

  const { rounds = [], finalDifficulty = {} } = data;
  let totalShots = 0,
    totalHits = 0,
    allReactions = [];

  rounds.forEach((r) => {
    totalShots += r.stats.shotsFired;
    totalHits += r.stats.shotsHit;
    if (r.stats.reactionTimes) allReactions.push(...r.stats.reactionTimes);
  });

  const accuracy =
    totalShots > 0 ? ((totalHits / totalShots) * 100).toFixed(1) : 0;
  const avgReaction =
    allReactions.length > 0
      ? Math.round(
          allReactions.reduce((a, b) => a + b, 0) / allReactions.length
        )
      : "N/A";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid #333",
          color: "white",
          textAlign: "center",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", color: "#4ebfff" }}>
          Session Complete
        </h1>
        <p style={{ color: "#888", marginBottom: "20px" }}>
          Final Tier: {finalDifficulty?.tier} {finalDifficulty?.subLevel}
        </p>

        {/* Global Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            background: "#252525",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <div>
            <div
              style={{
                color: "#4ebfff",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>ACCURACY</div>
          </div>
          <div>
            <div
              style={{
                color: "#4ebfff",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {avgReaction}ms
            </div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>
              AVG REACTION
            </div>
          </div>
        </div>

        {/* Round Breakdown Chart */}
        <h3
          style={{
            textAlign: "left",
            fontSize: "0.9rem",
            color: "#888",
            marginBottom: "10px",
          }}
        >
          ROUND-BY-ROUND PROGRESS
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "30px",
          }}
        >
          {rounds.map((r, i) => {
            const roundAcc =
              r.stats.shotsFired > 0
                ? (r.stats.shotsHit / r.stats.shotsFired) * 100
                : 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#222",
                  padding: "10px",
                  borderRadius: "6px",
                }}
              >
                <span
                  style={{
                    width: "30px",
                    fontWeight: "bold",
                    color: "#4ebfff",
                  }}
                >
                  R{r.round}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "#333",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${roundAcc}%`,
                      height: "100%",
                      background: "#4ebfff",
                      transition: "width 1s ease-out",
                    }}
                  />
                </div>
                <span style={{ width: "50px", fontSize: "0.8rem" }}>
                  {Math.round(roundAcc)}%
                </span>
                <span
                  style={{ width: "70px", fontSize: "0.7rem", color: "#888" }}
                >
                  {r.difficulty.tier}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onRestart}
            style={{
              flex: 1,
              padding: "15px",
              background: "#4ebfff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            RESTART SESSION
          </button>
          <button
            onClick={onExit}
            style={{
              flex: 1,
              padding: "15px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            EXIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
