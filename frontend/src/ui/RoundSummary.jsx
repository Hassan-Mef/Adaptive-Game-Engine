export default function RoundSummary({ data, onContinue }) {
  if (!data) return null;

  const { round, liveStats, difficulty, promoted, events } = data;

  const accuracy = liveStats.shotsHit / Math.max(liveStats.shotsFired, 1);

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        <h2>Round {round} Complete</h2>

        <p>
          Difficulty:{" "}
          <b>
            {difficulty.tier} +{difficulty.subLevel}
          </b>
        </p>

        <p>Accuracy: {(accuracy * 100).toFixed(1)}%</p>
        <p>Score: {liveStats.score}</p>

        {promoted && <p className="highlight">🎉 PROMOTED!</p>}

        <div className="events">
          {events.map((e) => (
            <div key={e.id} className={`event ${e.type.toLowerCase()}`}>
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

        <button onClick={onContinue}>Continue</button>
      </div>
      </div>
    </div>
  );
}
