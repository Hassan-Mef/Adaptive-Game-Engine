export default function SessionSummary({ data, onRestart, onExit }) {
  if (!data) {
    console.warn("[UI] SessionSummary: No data provided");
    return null;
  }

  const { calibration = {}, rounds = [], finalDifficulty = {} } = data;

  const totalRounds = rounds.length;

  let totalShots = 0;
  let totalHits = 0;
  let allReactionTimes = [];

  rounds.forEach((r) => {
    totalShots += r.stats.shotsFired;
    totalHits += r.stats.shotsHit;

    if (Array.isArray(r.stats.reactionTimes)) {
      allReactionTimes.push(...r.stats.reactionTimes);
    }
  });

  const avgAccuracy =
    totalShots > 0 ? ((totalHits / totalShots) * 100).toFixed(2) : "0.00";

  const avgReaction =
    allReactionTimes.length > 0
      ? Math.round(
          allReactionTimes.reduce((a, b) => a + b, 0) /
            allReactionTimes.length
        )
      : "N/A";

  console.log("[UI] SessionSummary render", data);


  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: 420,
          padding: 24,
          borderRadius: 12,
          background: "#121212",
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Session Summary</h2>

        <div style={{ marginBottom: 12 }}>
          <div>Rounds Played: {totalRounds}</div>
          <div>Average Accuracy: {avgAccuracy}%</div>
          <div>Average Reaction Time: {avgReaction} ms</div>
          <div>Total Shots: {totalShots}</div>
          <div>Total Hits: {totalHits}</div>
          <div>
            Final Difficulty:{" "}
            {finalDifficulty
              ? `${finalDifficulty.tier ?? "N/A"} +${finalDifficulty.subLevel ?? 0}`
              : "N/A"}
          </div>
        </div>

        <hr style={{ opacity: 0.3 }} />

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
            onClick={onRestart}
          >
            Restart
          </button>

          <button
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
            onClick={onExit}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
