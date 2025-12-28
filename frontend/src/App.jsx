import { useState } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";
import HomeMenu from "./ui/HomeMenu";
import GameOverlay from "./ui/GameOverlay";
import RoundSummary from "./ui/RoundSummary"; 

export default function App() {
  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);
  const [screen, setScreen] = useState("HOME");
  // "HOME" | "GAME"
  const [overlayApi, setOverlayApi] = useState(null);
  const [uiMode, setUiMode] = useState("HOME");
  // HOME | GAME | ROUND_SUMMARY

  const [roundSummary, setRoundSummary] = useState(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {screen === "HOME" && (
        <HomeMenu
          onStart={() => {
            setStats(null);
            setRoundKey(0);
            setScreen("GAME");
          }}
        />
      )}

      {uiMode === "ROUND_SUMMARY" && (
        <RoundSummary
          data={roundSummary}
          onContinue={() => {
            overlayApi?.resumeNextRound();
            setRoundSummary(null);
            setUiMode("GAME");
          }}
        />
      )}

      {screen === "GAME" && (
        <>
          <GameCanvas
            key={roundKey}
            onStatsUpdate={setStats}
            onGameReady={setOverlayApi}
            onRoundEnd={(data) => {
              setRoundSummary(data);
              setUiMode("ROUND_SUMMARY");
            }}
          />

          <Crosshair />

          {stats && (
            <GameHUD
              timeLeft={stats.timeLeft}
              shots={stats.shotsFired}
              hits={stats.shotsHit}
              score={stats.score}
              onRestart={() => setRoundKey((k) => k + 1)}
            />
          )}

          {overlayApi && (
            <GameOverlay
              getEvents={overlayApi.getEvents}
              clearEvents={overlayApi.clearEvents}
            />
          )}
        </>
      )}
    </div>
  );
}
