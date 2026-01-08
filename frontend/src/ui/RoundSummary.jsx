import "../styles/global.css";

export default function RoundSummary({ data, onContinue }) {
  if (!data) return null;

  const { round, liveStats, difficulty, promoted, events } = data;

  const accuracy = liveStats.shotsHit / Math.max(liveStats.shotsFired, 1);

  return (
    <div className="auth-wrapper" style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div className="background-overlay"></div>
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h2 className="game-title" style={{ fontSize: '3rem', marginBottom: '10px' }}>Round {round} Complete</h2>

        <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          Difficulty:{" "}
          <b style={{ color: 'var(--electric-blue)', fontSize: '1.5rem' }}>
            {difficulty.tier} +{difficulty.subLevel}
          </b>
        </p>

        <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Accuracy: <span style={{ color: 'var(--neon-purple)', fontSize: '1.5rem' }}>{(accuracy * 100).toFixed(1)}%</span></p>
        <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Score: <span style={{ color: 'var(--neon-purple)', fontSize: '1.5rem' }}>{liveStats.score}</span></p>

        {promoted && <p className="game-title" style={{ fontSize: '1.5rem', color: 'var(--electric-blue)' }}>🎉 PROMOTED!</p>}

        <div className="events">
          {events.map((e) => (
            <div key={e.id} className={`event ${e.type.toLowerCase()}`} style={{ border: '1px solid var(--electric-blue)', padding: '5px', margin: '10px', display: 'inline-block', background: 'rgba(0, 242, 255, 0.1)', fontSize: '1rem' }}>
              {e.label}
            </div>
          ))}
        </div>

        <div
          style={{
            inset: 0,
            pointerEvents: "auto",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >

        <button className="menu-button_summary primary-button_summary" style={{width: '80%'}} onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}