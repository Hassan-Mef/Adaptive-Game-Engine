# Adaptive Game Difficulty Engine – Frontend Documentation !(Outdated)

## 📌 Project Overview

The **Adaptive Game Difficulty Engine** is a browser-based aim training game built with **React** and **Three.js**.  
It dynamically adjusts game difficulty based on player performance, both **within a session** and **across sessions**.

This Folder contains the **complete frontend implementation**, including:
- Game loop and session management
- Adaptive difficulty system
- UI flow and overlays
- Configurable gameplay parameters
- Backend-ready data structures

The frontend is now **feature-complete** and ready for backend integration.

---

## 🧠 High-Level Design Philosophy

### Core Principles
- **Session-based gameplay** (each playthrough is isolated)
- **Stateless game loop between sessions**
- **Difficulty persistence handled by the parent App**
- **UI overlays never unmount the WebGL canvas**
- **All gameplay metrics are backend-ready**

The game logic is deterministic, predictable, and restart-safe.

---

## 🎮 Gameplay Flow (Final)

```
BOOT
 ↓
HOME
 ↓
CALIBRATION
 ↓
LIVE ROUND 1
 ↓
ROUND SUMMARY
 ↓
LIVE ROUND 2
 ↓
...
 ↓
SESSION SUMMARY
```

### Restart Behavior
- Restart does **not reset the engine**
- It creates a **new session instance**
- Previous difficulty can optionally persist

---
## 📁 Frontend File Structure

The frontend is organized around clear separation of concerns: game logic, rendering, UI, configuration, and future backend integration.

```
src/
│
├── App.jsx
│   └── Root application component
│       • Controls screen state (HOME / GAME)
│       • Controls UI overlays (ROUND_SUMMARY / SESSION_SUMMARY)
│       • Holds persistent difficulty across sessions
│       • Acts as the boundary between game logic and UI
│
├── api/
│   ├── db.js
│   │   └── Placeholder for backend communication
│   └── player.js
│       └── Future player/session API calls
│
├── game/
│   ├── GameCanvas.jsx
│   │ └── React-Three-Fiber canvas wrapper
│   │  │ • Mounts once per session
│   │  │ • Prevents WebGL context loss
│   │
│   ├── scenes/
│   │ └── AimTrainingScene.jsx
│   │ └── Main gameplay scene
│   │ • Initializes game loop
│   │ • Handles shooting input
│   │ • Connects gameplay systems together
│   │
│   ├── hooks/
│   │ ├── useGameLoop.js
│   │ │ └── Core game engine
│   │ │ • Timer & phase control
│   │ │ • Session lifecycle
│   │ │ • Stats aggregation
│   │ │ • Difficulty progression
│   │ │
│   │ └── usePlayer.js
│   │ └── Player movement & camera control
│   │
│   ├── systems/
│   │ ├── difficultySystem.js
│   │ │ └── Initial difficulty evaluation (calibration)
│   │ │
│   │ ├── LiveDifficultyEvalutor.js
│   │ │ └── Adaptive difficulty between rounds
│   │ │
│   │ ├── gameConfig.js
│   │ │ └── Tunable gameplay parameters
│   │ │ • Calibration duration
│   │ │ • Live round duration
│   │ │ • Max rounds per session
│   │ │
│   │ ├── gamePhases.js
│   │ │ └── Enumerated internal game phases
│   │ │
│   │ ├── scoringSystem.js
│   │ │
│   │ ├── achievementSystem.js
│   │ │ └── Future achievement tracking
│   │ │
│   │ └── targetSpawnerConfig.js
│   │ └── Target behavior & spawn tuning
│   │
│   └── components/
│   │ ├── Crosshair.jsx
│   │ │ └── Screen-space crosshair
│   │ │
│   │ ├── TargetSpawner.jsx
│   │ │ └── Spawns and manages targets
│   │ │ • Computes reaction times
│   │ │ • Reports hit/miss events
│   │ │
│   │ ├── Target.jsx
│   │ │ └── Individual target behavior
│   │ │
│   │ ├── Gun/
│   │ │ └── Gun.jsx
│   │ │ └── Weapon model & shooting animation
│   │ │
│   │ ├── Environment/
│   │ │ ├── index.js
│   │ │ ├── LevelLayout.jsx
│   │ │ ├── Walls.jsx
│   │ │ ├── Props.jsx
│   │ │ └── Props/
│   │ │ ├── Barrel.jsx
│   │ │ ├── Crate.jsx
│   │ │ └── TargetStand.jsx
│   │ │
│   │ ├── Ground.jsx
│   │ ├── Player.jsx
│   │ ├── HitEffect.jsx
│   │ └── ImpactParticles.jsx
│
├── ui/
│   ├── HomeMenu.jsx
│   ├── GameHUD.jsx
│   ├── GameOverlay.jsx
│   ├── RoundSummary.jsx
│   ├── SessionSummary.jsx
│   ├── Dashboard.jsx
│   └── LoadingScreen.jsx
│
├── assets/
├── styles/global.css
├── main.jsx
├── routes.jsx
└── index.css
```
---

## ⚙️ Configurable Game Parameters

Located in `config/gameConfig.js`

```js
export const GAME_CONFIG = {
  CALIBRATION_DURATION: 20,    // seconds
  LIVE_ROUND_DURATION: 20,     // seconds
  MAX_LIVE_ROUNDS: 5,
};
```

These values can later be:
- Controlled by backend
- Adjusted per difficulty profile
- Used for A/B testing

---

## 🔁 Game Session Model

Each **session** produces a structured object:

```json
{
  "calibration": { ... },
  "rounds": [
    {
      "round": 1,
      "stats": { ... },
      "difficulty": { "tier": "EASY", "subLevel": 1 }
    }
  ],
  "finalDifficulty": { "tier": "MEDIUM", "subLevel": 0 }
}
```

This object is **directly transferable to backend APIs**.

---

## 🧩 Game Phases (Internal)

```
IDLE
 ↓
CALIBRATION
 ↓
LIVE
 ↓
ROUND_END
 ↓
SESSION_END
```

Phase control is **internal to the game loop** and never manipulated by UI.

---

## 🎯 Calibration Phase

Purpose:
- Measure raw player skill
- No difficulty applied
- No adaptive behavior

Metrics collected:
- shotsFired
- shotsHit
- reactionTimes
- accuracy
- shotsPerSecond

---

## ⚔️ Live Gameplay Phase

- Difficulty is locked at round start
- Difficulty adapts **between rounds**
- Scoring enabled
- Reaction time affects difficulty progression

---

## 📊 Difficulty System

### Initial Difficulty (Calibration)

Based on:
- Accuracy
- Shots per second
- Median reaction time

Example thresholds:

```
EASY:
  accuracy < 0.30 OR sps < 1.2

MEDIUM:
  accuracy 0.30–0.60 AND sps 1.2–2.5

HARD:
  accuracy > 0.60 AND sps > 2.5
```

---

### Live Difficulty Progression

```
Easy → Easy+ → Easy++ → Medium → Medium+ → Hard
```

Handled by `evaluateLiveDifficulty()`  
No side effects, pure evaluation.

---

## 🧠 Architecture Overview

```
App.jsx
 └── GameCanvas
       └── AimTrainingScene
             ├── useGameLoop
             │     ├── Timer
             │     ├── Phase Control
             │     ├── Stats Aggregation
             │     └── Session Assembly
             │
             ├── TargetSpawner
             │     ├── Target lifecycle
             │     ├── Reaction timing
             │     └── Hit/Miss reporting
             │
             └── Difficulty Systems
                   ├── Initial evaluation
                   └── Live adaptive updates
```

---

## 🔁 Restart & Persistence Model

- WebGL canvas remains mounted
- Restart = remount `useGameLoop`
- Difficulty can persist via `initialDifficulty`
- No ref resets required

This prevents:
- WebGL context loss
- NaN stats
- Timer desync
- Pointer lock bugs

---

## 🚧 Missing / Planned Features

### UI Enhancements
- Session graphs
- Accuracy trends
- Reaction-time histograms
- Difficulty progression visualization

### User System
- Login / Signup
- Player ID persistence
- Multi-session history
- Leaderboards

### Backend Integration
- POST session results
- GET next recommended difficulty
- Player progression tracking

---

## 🔗 Backend Readiness

Frontend already provides:
- Complete session payload
- Clear session boundaries
- Stable identifiers (round index, difficulty tier)
- Configurable parameters

Backend only needs to:
- Accept session object
- Store per-player history
- Compute long-term difficulty

---

## ✅ Frontend Status

✔ Core gameplay complete  
✔ Adaptive difficulty stable  
✔ Restart logic fixed  
✔ Configurable parameters  
✔ Backend-ready  

**Frontend is production-complete.**

---

## 📄 License

Educational / Academic Project  
DBMS Semester Project
