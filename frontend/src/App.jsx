import { useState } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";
import HomeMenu from "./ui/HomeMenu";


export default function App() {
  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);
  const [screen, setScreen] = useState("HOME"); 
    // "HOME" | "GAME"

return (
  <div style={{ width: "100vw", height: "100vh" }}>

    {screen === "HOME" && (
      <HomeMenu onStart={() => {
        setStats(null);
        setRoundKey(0);
        setScreen("GAME");
      }} />
    )}

    {screen === "GAME" && (
      <>
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
      </>
    )}

  </div>
);

}
