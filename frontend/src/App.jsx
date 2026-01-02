import { useState, useEffect } from "react";
import Crosshair from "./game/components/Crosshair";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./ui/GameHUD";
import GameOverlay from "./ui/GameOverlay";
import RoundSummary from "./ui/RoundSummary";
import SessionSummary from "./ui/SessionSummary";
import HomeScreen from "./ui/HomeScreen";
import LoginScreen from "./ui/LoginScreen";
import { useAuth } from "./contexts/AuthContext";
import { startSession, getSessionEntryState } from "./api/game";

export default function App() {
  const { isAuthenticated, logout, loading } = useAuth();

  const [stats, setStats] = useState(null);
  const [roundKey, setRoundKey] = useState(0);
  const [screen, setScreen] = useState("HOME");
  const [uiMode, setUiMode] = useState("HOME");

  // Keep difficulty across sessions
  const [persistentDifficulty, setPersistentDifficulty] = useState(null);

  const [overlayApi, setOverlayApi] = useState(null);
  const [roundSummary, setRoundSummary] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  if (loading) return null;

  const handleSessionFinish = async (session) => {
    if (!session || !session.rounds || session.rounds.length === 0) return;

    console.log("[APP] Session Finished:", session);

    if (sessionId) {
      await import("./api/game").then(({ endSession }) =>
        endSession(sessionId)
      );
    }

    setPersistentDifficulty(session.finalDifficulty);
    setSessionSummary(session);
    setUiMode("SESSION_SUMMARY");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GAME LAYER: Stays mounted during SESSION_SUMMARY to prevent WebGL crash */}
      {screen === "GAME" && (
        <>
          <GameCanvas
            key={roundKey}
            onStatsUpdate={setStats}
            initialDifficulty={persistentDifficulty}
            onGameReady={setOverlayApi}
            onRoundEnd={async (data) => {
              setRoundSummary(data);
              setUiMode("ROUND_SUMMARY");

              if (!sessionId) return;

              const { round, liveStats, difficulty } = data;

              const accuracy =
                liveStats.shotsFired > 0
                  ? liveStats.shotsHit / liveStats.shotsFired
                  : 0;

              const avgReactionTime =
                liveStats.reactionTimes.length > 0
                  ? liveStats.reactionTimes.reduce((a, b) => a + b, 0) /
                    liveStats.reactionTimes.length
                  : null;

              await import("./api/game").then(({ logRound }) =>
                logRound({
                  attemptId: sessionId,
                  roundIndex: round,
                  difficultyTier: difficulty.tier,
                  difficultySublevel: difficulty.subLevel,
                  accuracy,
                  shotsFired: liveStats.shotsFired,
                  shotsHit: liveStats.shotsHit,
                  avgReactionTime,
                  roundDuration: liveStats.duration ?? 0,
                })
              );
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

      {/* UI OVERLAY LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: uiMode === "GAME" ? "none" : "auto",
            userSelect: uiMode === "GAME" ? "none" : "auto",
          }}
        >
          {screen === "HOME" && uiMode === "HOME" && (
            <HomeScreen
              onPlay={async () => {
                if (!isAuthenticated) {
                  setScreen("LOGIN");
                  return;
                }

                // Get recommended difficulty
                const entry = await getSessionEntryState();
                console.log("[APP] Session Entry State:", entry);

                // Start session
                const attemptId = await startSession();
                // debugging log
                console.log("[APP] Started Session with ID:", attemptId);
                setSessionId(attemptId);

                // Apply difficulty (if exists)`
                if (entry.hasHistory) {
                  setPersistentDifficulty({
                    tier: "AUTO", // or map from RecommendedLevelID
                    subLevel: entry.difficultyScore,
                  });
                } else {
                  setPersistentDifficulty(null);
                }

                // 4️⃣ Start game
                setStats(null);
                setRoundKey((k) => k + 1);
                setScreen("GAME");
                setUiMode("GAME");
              }}
              onSettings={() => console.log("Settings clicked")}
              onLeaderboard={() => console.log("Leaderboard clicked")}
              onLogin={isAuthenticated ? logout : () => setScreen("LOGIN")}
              isAuthenticated={isAuthenticated}
            />
          )}

          {screen === "LOGIN" && (
            <LoginScreen
              onBack={() => setScreen("HOME")}
              onLoginSuccess={() => setScreen("HOME")}
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

          {uiMode === "SESSION_SUMMARY" && (
            <SessionSummary
              data={sessionSummary}
              onRestart={() => {
                setUiMode("GAME");
                setRoundKey((k) => k + 1);
              }}
              onExit={() => {
                setSessionSummary(null);
                setPersistentDifficulty(null);
                setSessionId(null);
                setUiMode("HOME");
                setScreen("HOME");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
