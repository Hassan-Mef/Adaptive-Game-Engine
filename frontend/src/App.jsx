import { useState, useEffect } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";
import HomeMenu from "./ui/HomeMenu";
import GameOverlay from "./ui/GameOverlay";
import RoundSummary from "./ui/RoundSummary";
import SessionSummary from "./ui/SessionSummary";

export default function App() {
  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);

  // Screen controls the base scene
  // "HOME" | "GAME"
  const [screen, setScreen] = useState("HOME");

  // uiMode controls overlays
  // "HOME" | "GAME" | "ROUND_SUMMARY" | "SESSION_SUMMARY"
  const [uiMode, setUiMode] = useState("HOME");

  const [overlayApi, setOverlayApi] = useState(null);
  const [roundSummary, setRoundSummary] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);

  /* ---------------- SESSION FINISH ---------------- */

  const handleSessionFinish = (session) => {
    if (!session || !session.rounds || session.rounds.length === 0) {
      console.warn("[APP] Ignoring empty session finish");
      return;
    }

    console.log("[APP] Session finish received", session);

    setSessionSummary(session);
    setUiMode("SESSION_SUMMARY");
    setScreen("GAME"); // lock HomeMenu out
  };

  /* ---------------- DEBUG LOGGING ---------------- */

  useEffect(() => {
    console.log("[APP STATE]", { screen, uiMode });
  }, [screen, uiMode]);

  /* ---------------- RENDER ---------------- */

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {/* ===== SESSION SUMMARY (OVERRIDES EVERYTHING) ===== */}
      {uiMode === "SESSION_SUMMARY" && (
        <SessionSummary
          data={sessionSummary}
          onRestart={() => {
            setSessionSummary(null);
            setUiMode("GAME");
            setScreen("GAME");
            setRoundKey((k) => k + 1);
          }}
          onExit={() => {
            setSessionSummary(null);
            setUiMode("HOME");
            setScreen("HOME");
          }}
        />
      )}

      {/* ===== HOME MENU ===== */}
      {screen === "HOME" && uiMode === "HOME" && (
        <HomeMenu
          onStart={() => {
            setStats(null);
            setRoundKey(0);
            setScreen("GAME");
            setUiMode("GAME");
          }}
        />
      )}

      {/* ===== ROUND SUMMARY ===== */}
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

      {/* ===== GAME ===== */}
      {screen === "GAME" && uiMode !== "SESSION_SUMMARY" && (
        <>
          <GameCanvas
            key={roundKey}
            onStatsUpdate={setStats}
            onGameReady={setOverlayApi}
            onRoundEnd={(data) => {
              setRoundSummary(data);
              setUiMode("ROUND_SUMMARY");
            }}
            onSessionFinish={handleSessionFinish}
          />

          <Crosshair />

          {stats && (
            <GameHUD
              timeLeft={stats.timeLeft}
              shots={stats.shotsFired}
              hits={stats.shotsHit}
              score={stats.score}
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



//import { useState } from "react"; import Crosshair from "./game/components/Crosshair"; import GameCanvas from "./game/GameCanvas"; import GameHUD from "./ui/GameHUD"; import HomeMenu from "./ui/HomeMenu"; import GameOverlay from "./ui/GameOverlay"; import RoundSummary from "./ui/RoundSummary"; import SessionSummary from "./ui/SessionSummary"; export default function App() { const [stats, setStats] = useState(null); const [roundKey, setRoundKey] = useState(0); const [screen, setScreen] = useState("HOME"); // "HOME" | "GAME" const [overlayApi, setOverlayApi] = useState(null); const [uiMode, setUiMode] = useState("HOME"); // HOME | GAME | ROUND_SUMMARY | SESSION_SUMMARY const [roundSummary, setRoundSummary] = useState(null); const [sessionSummary, setSessionSummary] = useState(null); const handleSessionFinish = (session) => { setSessionSummary(session); // <-- triggers SessionSummary render setUiMode("SESSION_SUMMARY"); setScreen("HOME"); // optionally stop rendering Canvas }; return ( <div style={{ width: "100vw", height: "100vh" }}> {screen === "HOME" && ( <HomeMenu onStart={() => { setStats(null); setRoundKey(0); setScreen("GAME"); }} /> )} {uiMode === "ROUND_SUMMARY" && ( <RoundSummary data={roundSummary} onContinue={() => { overlayApi?.resumeNextRound(); setRoundSummary(null); setUiMode("GAME"); }} /> )} {uiMode === "SESSION_SUMMARY" && ( <SessionSummary data={sessionSummary} onRestart={() => { setSessionSummary(null); setScreen("GAME"); setUiMode("GAME"); setRoundKey((k) => k + 1); }} onExit={() => { setSessionSummary(null); setScreen("HOME"); setUiMode("HOME"); }} /> )} {screen === "GAME" && uiMode !== "SESSION_SUMMARY" && ( <> <GameCanvas key={roundKey} onStatsUpdate={setStats} onGameReady={setOverlayApi} onRoundEnd={(data) => { setRoundSummary(data); setUiMode("ROUND_SUMMARY"); }} onSessionFinish={handleSessionFinish} /> <Crosshair /> {stats && ( <GameHUD timeLeft={stats.timeLeft} shots={stats.shotsFired} hits={stats.shotsHit} score={stats.score} //onRestart={() => setRoundKey((k) => k + 1)} /> )} {overlayApi && ( <GameOverlay getEvents={overlayApi.getEvents} clearEvents={overlayApi.clearEvents} /> )} </> )} </div> ); }