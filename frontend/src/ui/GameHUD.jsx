export default function GameHUD({ timeLeft, shots, hits, score }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        color: "white",
        fontFamily: "monospace",
        zIndex: 1000,
        background: "rgba(0,0,0,0.4)",
        padding: "10px 14px",
        borderRadius: "6px",
      }}
    >
      <div>Time: {timeLeft}s</div>
      <div>Shots Fired: {shots}</div>
      <div>Hits: {hits}</div>
      <div>Score: {score}</div>
    </div>
  );
}
