# Adaptive Game Engine – Database Design & Architecture

## Overview

This database is designed for an **Adaptive Aim Training Game Engine**.  
The core objective is to **track player performance**, **adapt game difficulty dynamically**, and **provide analytical insights** for both players and developers.

The database follows a **session-based architecture** with round-level granularity and separates:
- Raw gameplay data
- Derived analytics
- Difficulty adaptation logic

This separation ensures:
- Scalability
- Clean responsibility boundaries
- Minimal redundancy
- Easy backend & frontend integration

---

## High-Level Architecture

```
Players
├── Player_Settings
├── Difficulty_Profiles
├── Player_Achievements
└── Attempts (Game Sessions)
└── Session_Rounds
```


### Architectural Philosophy

- **Players** represent registered users.
- **Attempts** represent a full game session.
- **Session_Rounds** store per-round gameplay statistics.
- **Difficulty_Profiles** store adaptive difficulty decisions.
- **Derived logic** is handled via stored procedures, not application code.

Calibration rounds are **frontend-only** and are intentionally excluded from the database.

---

## Schema Design (Tables)

### 1. Players
Stores core identity information.

**Why?**
- Central entity
- All gameplay data references a player

---

### 2. Attempts (Game Sessions)
Represents one full play session.

**Key Concepts**
- One row = one session
- Session has start & end timestamps
- Summary stats can be stored here

**Why session-based?**
- Difficulty adapts per session
- Cleaner analytics
- Avoids bloated per-attempt rows

---

### 3. Session_Rounds
Stores detailed per-round gameplay data.

**Stored Metrics**
- Shots fired / hit
- Score
- Reaction times (aggregated)
- Difficulty level played

**Why separate rounds?**
- High-resolution analytics
- Flexible difficulty tracking
- Accurate performance measurement

---

### 4. Difficulty_Profiles
Stores **latest adaptive difficulty decision** for a player.

**Includes**
- Difficulty score
- Recommended level
- Last updated timestamp

**Why store difficulty?**
- Avoid recalculating on every request
- Deterministic behavior
- Fast frontend queries

---

### 5. Levels
Defines difficulty tiers.

**Used for**
- Mapping difficulty scores
- Analytics
- Leaderboards

---

## Stored Procedures

All game logic that **derives or mutates state** is handled inside stored procedures.

This ensures:
- Consistency
- Reduced backend complexity
- Centralized business logic

---

### sp_StartGameSession
**Purpose**
- Creates a new session (Attempt)
- Locks the difficulty at session start

**Why?**
- Difficulty should not change mid-session
- Clean lifecycle control

---

### sp_LogSessionRound
**Purpose**
- Logs one round of gameplay
- Stores performance metrics

**Why?**
- Keeps session data normalized
- Enables round-level analytics

---

### sp_EndGameSession
**Purpose**
- Marks session completion
- Finalizes session metadata

**Why?**
- Prevents partial session corruption
- Trigger-based difficulty updates depend on this

---

### sp_CalculatePlayerSkill (MODIFIED)
**Purpose**
- Calculates a player skill score using historical performance

**Why?**
- Abstracts difficulty logic
- Reusable and tunable

---

### sp_GenerateLeaderboard (MODIFIED)
**Purpose**
- Generates leaderboard rankings based on stored difficulty & performance

**Why?**
- Avoids heavy runtime aggregation
- Consistent ranking criteria

---

### sp_GetPlayerStats (MODIFIED)
**Purpose**
- Fetches consolidated player statistics

**Why?**
- Backend-ready API procedure
- Prevents repeated frontend queries

---

### sp_RecommendDifficultyLevel (UNCHANGED)
**Purpose**
- Maps difficulty score → recommended level

**Why unchanged?**
- Already clean and decoupled
- Uses stored skill score correctly

---

### sp_RegisterPlayer (UNCHANGED)
**Purpose**
- Registers new players safely
- Prevents duplicate usernames/emails

---

## Triggers

Triggers are used for **automatic side-effects**, never for core logic.

---

### trg_ValidateSessionStart
**Purpose**
- Ensures valid session creation

**Why?**
- Defensive data integrity
- Prevents invalid game states

---

### trg_LogSessionStart
**Purpose**
- Logs session start events

**Why?**
- Auditability
- Debugging and analysis

---

### trg_LogSessionRound
**Purpose**
- Logs round insertions

**Why?**
- System observability
- Debugging round-level issues

---

### trg_UpdateDifficultyAfterSession
**Purpose**
- Automatically updates difficulty after a session ends

**Why trigger-based?**
- Ensures difficulty is always updated
- No reliance on backend correctness

---

### trg_LogDifficultyAdjustment
**Purpose**
- Logs difficulty changes only when they actually change

**Why?**
- Prevents log spam
- Tracks meaningful difficulty evolution

---

## Views

Views provide **read-only analytical projections** of data.

They are:
- Frontend-safe
- Optimized for reporting
- Free from business logic

---

### vw_PlayerLeaderboard
**Purpose**
- Displays player rankings

**Uses**
- Difficulty profiles
- Session & round aggregation

---

### vw_PlayerPerformanceSummary
**Purpose**
- Player profile dashboard data

**Includes**
- Accuracy
- Reaction time
- Total sessions & rounds

---

### vw_LevelPerformanceOverview
**Purpose**
- Analyze level difficulty effectiveness

**Used by**
- Developers
- Game balancing

---

### vw_DifficultyHistory
**Purpose**
- Track how player difficulty evolved over time

---

## Design Decisions Summary

| Decision | Reason |
|--------|-------|
Session-based design | Accurate adaptation & analytics |
Triggers over backend logic | Guaranteed consistency |
Stored difficulty | Performance & determinism |
Views for analytics | Clean separation |
Calibration excluded | Frontend-only concern |

---

## Testing Strategy

At this stage:
- **Manual SQL testing is sufficient**
- Sample `INSERT` + `SELECT` queries validate correctness

Full testing is expected during:
- Backend API integration
- Frontend gameplay loop integration

---

## Conclusion

This database is:
- Scalable
- Modular
- Backend-friendly
- Analytics-ready
- Academically sound

It cleanly supports future extensions like:
- Multiplayer
- Seasonal leaderboards
- Advanced ML-based difficulty tuning
