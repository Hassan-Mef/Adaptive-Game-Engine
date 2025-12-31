# Backend – Adaptive Game Difficulty Engine (Final Architecture)

This document describes the **final backend architecture** of the *Adaptive Game Difficulty Engine*.  
It is intended as a **handover / onboarding document** for anyone working on or extending the backend.

The backend is **feature-complete for the current frontend** and follows a clean, scalable, industry-style design.

---

## 1. Purpose of the Backend

The backend acts as a **secure integration layer** between:

- A **React-based game frontend**
- A **Microsoft SQL Server database**

Its responsibilities are intentionally limited:

- Expose REST APIs
- Authenticate users (JWT)
- Orchestrate game sessions
- Call database **stored procedures**
- Return clean JSON responses

> **All business logic lives in the database.**  
> The backend never re-implements game logic.

---

## 2. High-Level Architecture

```
React Frontend
      ↓  (HTTP / JSON + JWT)
Node.js / Express Backend
      ↓  (Stored Procedures)
Microsoft SQL Server
```

### Design Principles

- Thin backend
- DB-driven logic
- Stateless authentication (JWT)
- Session-based game model
- Clear separation of concerns

---

## 3. Folder Structure

```
backend/
├── src/
│   ├── server.js               # Server entry point
│   ├── app.js                  # Express app configuration
│   │
│   ├── config/
│   │   └── db.js               # MSSQL connection pool
│   │
│   ├── routes/
│   │   ├── player.routes.js    # Auth & player APIs
│   │   └── game.routes.js      # Game session APIs
│   │
│   ├── controllers/
│   │   ├── player.controller.js
│   │   └── game.controller.js
│   │
│   ├── services/
│   │   ├── db.service.js       # Stored procedure executor
│   │   ├── player.service.js
│   │   └── game.service.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js  # JWT authentication
│   │
├── .env                        # Environment variables (ignored)
├── package.json
└── README.md
```

---

## 4. Authentication Model (JWT)

### Why JWT?

- Stateless
- Secure
- Scales easily
- Removes need to pass `playerId` manually

### Flow

1. Player logs in using username + password
2. Backend validates password using **bcrypt**
3. Backend issues a **JWT**
4. Frontend stores token
5. Token is sent in:
   ```
   Authorization: Bearer <token>
   ```
6. Backend extracts `playerId` from token

### Auth Middleware

```js
req.user = { playerId }
```

This becomes the **single source of identity**.

---

## 5. Game Session Model

The backend models gameplay using **sessions (Attempts)**.

### Lifecycle

1. Session Entry (difficulty recommendation)
2. Session Start
3. Multiple Round Logs
4. Session End
5. Session Summary

This mirrors how real games operate.

---

## 6. API Overview

### Authentication / Player

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | `/api/player` | Register new player |
| POST | `/api/player/login` | Login & receive JWT |
| GET | `/api/player/:id` | Get player info |
| GET | `/api/player/:id/stats` | Player dashboard stats |

> Login & register **do not require JWT**.

---

### Game APIs (JWT Protected)

| Method | Endpoint | Description |
|------|--------|-------------|
| GET | `/api/game/session-entry` | Recommended difficulty |
| POST | `/api/game/start` | Start session |
| POST | `/api/game/log-round` | Log round data |
| POST | `/api/game/end` | End session |
| GET | `/api/game/session-summary/:attemptId` | Session summary |

---

## 7. Session Entry vs Player Stats

### Session Entry
- Used **before starting a game**
- Returns:
  - Has history?
  - Difficulty score
  - Recommended level

### Player Stats
- Used for dashboards
- Aggregates **all sessions**
- Long-term performance view

They solve **different problems** and are intentionally separate.

---

## 8. Database-Driven Logic

All core logic is implemented via **stored procedures**:

- Authentication lookup
- Session creation
- Round logging
- Difficulty recommendation
- Skill calculation
- Session aggregation

This ensures:
- Consistency
- Performance
- Academic DBMS alignment

---

## 9. Environment Variables

```
PORT=5000

DB_USER=sa
DB_PASSWORD=********
DB_NAME=GameDB
DB_SERVER=localhost
DB_PORT=1433

JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1d
```

`.env` is **never committed**.

---

## 10. What Is Intentionally Not Implemented (Yet)

These are **future enhancements**, not missing features:

- Leaderboards
- Achievements
- Performance logs
- System logs
- Analytics views
- Triggers for rewards

The schema already supports them.

---

## 11. Backend Completeness Status

### ✅ Implemented & Stable

- JWT Authentication
- Player management
- Session lifecycle
- Adaptive difficulty
- Session summaries
- Player dashboards

### 🚀 Ready For

- Frontend integration
- UI-driven testing
- Feature expansion

---

## 12. Final Architectural Rule

> **Frontend controls gameplay flow.  
> Backend guarantees correctness, security, and persistence.  
> Database owns intelligence.**

This backend is now **production-ready for the current frontend** and **academically sound** for evaluation.

---
