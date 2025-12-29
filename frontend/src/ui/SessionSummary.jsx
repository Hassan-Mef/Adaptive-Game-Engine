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
        background: "rgba(0,0,0,0.9)",
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
          width: "400px",
        }}
      >
        <h1 style={{ margin: "0 0 20px 0", color: "#4ebfff" }}>
          Session Complete
        </h1>
        <div
          style={{
            display: "grid",
            gap: "15px",
            marginBottom: "30px",
            fontSize: "1.1rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Accuracy:</span> <strong>{accuracy}%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Reaction:</span> <strong>{avgReaction}ms</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Difficulty:</span>{" "}
            <strong>
              {finalDifficulty?.tier} {finalDifficulty?.subLevel}
            </strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onRestart}
            style={{
              flex: 1,
              padding: "12px",
              background: "#4ebfff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            RESTART
          </button>
          <button
            onClick={onExit}
            style={{
              flex: 1,
              padding: "12px",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
}
