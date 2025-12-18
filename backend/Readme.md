# Backend – Adaptive Game Difficulty Engine

This folder contains the **backend integration layer** of the *Adaptive Game Difficulty Engine* project. The backend acts as a bridge between the **React frontend** and the **MS SQL Server database**, exposing clean REST APIs and delegating all core logic to the database (via queries and stored procedures).

---

## 🎯 Purpose of the Backend

The backend is responsible for:

- Exposing REST APIs for the frontend
- Managing communication with MS SQL Server
- Calling **stored procedures** (business logic lives in DB)
- Validating input and formatting responses
- Keeping frontend completely **DB-agnostic**

> ❗ The frontend **never** talks directly to the database.

---

## 🧠 High-Level Architecture

```
React Frontend
      ↓ (HTTP / JSON)
Express Backend (Node.js)
      ↓ (Queries / Stored Procedures)
MS SQL Server
```

### Design Principles
- **Separation of concerns**
- **Thin backend** (logic in DB, not JS)
- **Scalable folder structure**
- **Industry-style Express architecture**

---

## 📁 Backend Folder Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup (middleware + routes)
│   ├── server.js           # Server entry point
│   │
│   ├── config/
│   │   └── db.js           # MS SQL Server connection pool
│   │
│   ├── routes/
│   │   └── player.routes.js    # Player-related API routes
│   │
│   ├── controllers/
│   │   └── player.controller.js # Request handling & response logic
│   │
│   ├── services/           # (Planned) DB / stored procedure wrappers
│   └── middlewares/        # (Planned) auth, error handling, etc.
│
├── .env                    # Environment variables (not committed)
├── package.json
└── README.md
```

---

## 🧩 File Responsibilities

### `server.js`
- Entry point of the backend
- Loads environment variables
- Initializes database connection
- Starts Express server

### `app.js`
- Creates Express app instance
- Registers middleware (CORS, JSON parsing)
- Mounts all route modules
- Defines base routes like `/health` and `/db-test`

### `config/db.js`
- Creates and exports a **single MSSQL connection pool**
- Uses environment variables for configuration
- Ensures DB connection is established once on startup

### `routes/`
- Defines API endpoints and URL structure
- Maps routes to controllers
- Example:
  - `/api/player/:id`

### `controllers/`
- Handles incoming requests
- Validates parameters
- Calls DB layer (currently direct, later via services)
- Sends formatted JSON responses

---

## 🔌 Database Connectivity

- Database: **Local MS SQL Server**
- Authentication: SQL Authentication
- Connection handled using `mssql` Node package

### Test Endpoint

```
GET /db-test
```

Returns:
```json
{
  "success": true,
  "result": [{ "test": 1 }]
}
```

This confirms successful backend ↔ database connectivity.

---

## 🌐 API Endpoints (So Far)

### Health Check
```
GET /health
```
Response:
```json
{ "status": "Backend is running 🚀" }
```

---

### Player API (Test)
```
GET /api/player/:id
```
Example:
```
GET /api/player/7
```
Response:
```json
{
  "success": true,
  "data": [{ "PlayerID": 7 }]
}
```

> ⚠️ This currently uses a temporary query. It will be replaced by stored procedure calls.

---

## 🔐 Environment Variables

The backend uses a `.env` file with the following keys:

```
PORT=5000
DB_USER=sa
DB_PASSWORD=********
DB_NAME=AdaptiveGameDB
DB_SERVER=localhost
DB_PORT=1433
```

> ⚠️ `.env` is **not committed** to version control.

---

## 🛠️ Development Scripts

```bash
npm run dev     # Run backend with nodemon
npm start       # Run backend normally
```

---

## 🚧 Planned Next Steps

- Introduce **service layer** for DB calls
- Replace raw queries with **stored procedures**
- Add `game` and `stats` APIs
- Add request validation & error middleware
- Implement authentication (if required)

---

## 📌 Key Architectural Rule

> **All business logic belongs in the database.**  
> Backend only orchestrates and integrates.

This ensures strong DBMS alignment and clean system design.

---

✅ Backend foundation is complete and ready for feature development.

