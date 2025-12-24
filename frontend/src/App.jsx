import { useState } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";

export default function App() {
  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GameCanvas
        key={roundKey}
        onStatsUpdate={setStats}
      />

      <Crosshair />

      {stats && (
        <GameHUD
          timeLeft={stats.timeLeft}
          shots={stats.shotsFired}
          hits={stats.shotsHit}
          score={stats.score}
          onRestart={() => setRoundKey(k => k + 1)}
        />
      )}
    </div>
  );
}
