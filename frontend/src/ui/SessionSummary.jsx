import "../styles/global.css";

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
      className="auth-wrapper"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div className="background-overlay"></div>
      <div
        className="auth-card"
        style={{
          textAlign: "center",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1
          className="game-title"
          style={{ margin: "0 0 10px 0", fontSize: "3rem" }}
        >
          Session Complete
        </h1>
        <p
          style={{
            color: "var(--neon-purple)",
            marginBottom: "20px",
            fontSize: "1.2rem",
          }}
        >
          Final Tier: {finalDifficulty?.tier} {finalDifficulty?.subLevel}
        </p>

        {/* Global Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(208, 0, 255, 0.1)",
            padding: "20px",
            border: "1px solid rgba(208, 0, 255, 0.2)",
            marginBottom: "25px",
          }}
        >
          <div>
            <div
              style={{
                color: "var(--electric-blue)",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textShadow: "0 0 10px var(--electric-blue)",
              }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>ACCURACY</div>
          </div>
          <div>
            <div
              style={{
                color: "var(--electric-blue)",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textShadow: "0 0 10px var(--electric-blue)",
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
            color: "var(--neon-purple)",
            marginBottom: "10px",
            letterSpacing: "1px",
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
                  background: "rgba(255,255,255,0.05)",
                  padding: "10px",
                  borderLeft: "2px solid var(--electric-blue)",
                }}
              >
                <span
                  style={{
                    width: "30px",
                    fontWeight: "bold",
                    color: "var(--electric-blue)",
                  }}
                >
                  R{r.round}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: "0px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${roundAcc}%`,
                      height: "100%",
                      background: "var(--electric-blue)",
                      boxShadow: "0 0 10px var(--electric-blue)",
                      transition: "width 1s ease-out",
                    }}
                  />
                </div>
                <span style={{ width: "50px", fontSize: "0.8rem" }}>
                  {Math.round(roundAcc)}%
                </span>
                <span
                  style={{ width: "70px", fontSize: "1.0rem", color: "#888" }}
                >
                  {r.difficulty.tier}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="menu-button_summary primary-button_summary"
            onClick={onRestart}
            style={{ flex: 1, transform: "skew(0deg)" }}
          >
            RESTART SESSION
          </button>
          <button
            className="menu-button_summary secondary-button_summary"
            onClick={onExit}
            style={{ flex: 1, transform: "skew(0deg)" }}
          >
            EXIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
