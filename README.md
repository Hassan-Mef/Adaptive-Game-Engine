# 🎮 Adaptive Game Analytics Engine  
### A Data-Driven Adaptive Gameplay & Analytics System

> **Course Project — Database Management Systems (DBMS)**  
> **Institution:** Information Technology University (ITU)  
> **Semester:** Fall 2025  

---

## 📌 Project Overview

The **Adaptive Game Analytics Engine** is a full-stack, database-centric system that demonstrates how **player performance**, **session analytics**, and **adaptive difficulty mechanisms** can be designed, stored, and visualized using modern database systems.

⚠️ **Important Clarification**

This project is **not a complete commercial game**.  
It is an **academic prototype** designed to showcase:

- Adaptive difficulty logic
- Session-based data collection
- Analytics-driven decision making
- Secure backend and database integration

The primary focus is **how adaptability and analytics work with databases**, not gameplay realism.

---

## 🧠 Core Objectives

- Implement **session-driven adaptive difficulty**
- Store and analyze **player performance metrics**
- Design a **normalized relational database**
- Utilize **SQL views for analytics**
- Build a **secure analytics dashboard**
- Apply real-world backend architecture patterns

---

## 🏗️ System Architecture

### High-Level Architecture

```
Frontend (React + Recharts)
↓
REST API (Node.js + Express)
↓
JWT Authentication Middleware
↓
MS SQL Server (Views + Procedures)
```

---

## 📁 Repository Structure

| Directory | Description |
|---------|-------------|
| `backend/` | Node.js API, authentication, analytics |
| `frontend/` | React UI, analytics dashboard, charts |
| `database/` | SQL schema, views, ERD |
| `docs/` | Diagrams & documentation (optional) |

---

## 🗄️ Database Design

### 📌 Design Principles

- Third Normal Form (3NF)
- Session-based data modeling
- Analytics isolated using SQL Views
- Stored procedures for controlled writes
- Referential integrity with foreign keys

---

### 📊 Entity Relationship Diagram (ERD)
[ERD Image](docs/ERD.png)

```
Players ──┐
├── Attempts ──┬── Session_Rounds
│ └── Performance_Metrics
│
├── Difficulty_Profiles
├── Player_Achievements ── Achievements
└── Leaderboard_Log
```


*(ERD image can be attached here)*

---

## 👁️ Analytics Views (Read-Only Layer)

All analytics APIs read exclusively from SQL views:

| View | Purpose |
|----|--------|
| `vw_DifficultyHistory` | Difficulty progression per session |
| `vw_LevelPerformanceOverview` | Performance by difficulty tier |
| `vw_PlayerPerformanceSummary` | Aggregated player metrics |
| `vw_PlayerLeaderboard` | Global leaderboard |
| `vw_PlayerAchievements` | Achievement history |
| `vw_LeaderboardHistory` | Rank snapshots |

This ensures:
- Cleaner queries
- Better performance
- Safe read-only analytics access

---

## 🔐 Security Architecture

### Authentication
- JWT-based authentication
- Protected analytics routes
- Player-level data isolation

### Security Measures
- Parameterized SQL queries
- Middleware-based authorization
- No direct table access from frontend
- Token-based session validation

---

## 🔌 Backend (Node.js + Express)

### Architecture Pattern

```
Routes → Controllers → Services → Database
```

### Backend Responsibilities

- Session creation and termination
- Round-by-round logging
- Difficulty evaluation
- Analytics data exposure
- Secure JWT handling

---

## 🖥️ Frontend Architecture

### Frontend Purpose

The frontend acts as:
- A **visual layer** for analytics
- A **session-driven gameplay interface**
- A **dashboard for performance insights**

It is intentionally lightweight and focused on **data visualization**, not complex game mechanics.

---

### 🎨 Frontend Technology Stack

| Layer | Technology |
|----|-----------|
| Framework | React (Vite) |
| Charts | Recharts |
| API | Axios |
| Auth | JWT (Bearer Token) |
| Styling | CSS / Inline Styling |
| Game Rendering | Basic 3D context (Three.js concepts) |

---

### 🎮 Gameplay & Session Flow

The game follows a **session-driven model**:

1. Player logs in
2. A **session (Attempt)** is created
3. Each round logs:
   - Accuracy
   - Reaction time
   - Hits & misses
4. Difficulty is evaluated
5. Session ends → analytics generated
6. Dashboard visualizes performance

The **adaptive difficulty** is calculated **per session**, not per frame.

---

### 📊 Analytics Dashboard

The dashboard is divided into **tabs**, each backed by a database view:

| Tab | Visualization |
|----|--------------|
| Difficulty History | Line Chart |
| Level Performance | Bar Chart |
| Player Profile | Radar Chart |
| Achievements | List View |
| Leaderboard | Table |

---

### 🧠 Adaptive Design Philosophy

- Difficulty is **data-driven**
- Adjustments are based on:
  - Accuracy
  - Reaction time
  - Hit/Miss ratio
- Analytics explain *why* difficulty changes
- Dashboard provides transparency into adaptation

---

## 🎮 Controls (Gameplay Simulation)

| Action | Key |
|-----|----|
| Move | `W A S D` |
| Shoot | Left Click |
| Aim | Mouse |
| Pause | `ESC` |

---

## 🧪 Intended Scope

This project demonstrates:

- Database-backed adaptability
- Analytics-driven insights
- Secure full-stack integration

It does **not** aim to:
- Compete with commercial games
- Showcase advanced AI or physics
- Focus on graphics fidelity

---

## 🎓 Academic Context

Developed as part of the:

> **Database Management Systems (DBMS) Course**  
> **Information Technology University (ITU)**

Focus areas:
- Schema design
- Views & stored procedures
- Analytics modeling
- Secure API design

---

## 👥 Team Members

| Name | Role |
|----|----|
| Hassan Mehmood | Front-End(Game Dev) & Backend |
| Adan Maqbool |  UI & Database |
| Abdul Tawwab | Analytics & Database |

---

## 📜 License

This project is **open-source** and free for educational use.

If reused, please provide appropriate attribution.

---

## 🌐 Credits

Built with ❤️ by the Adaptive Game Engine Team  

LinkedIn :  
- [Adan Maqbool](https://www.linkedin.com/in/adan-maqbool/)  
- [Abdul Tawwab](https://www.linkedin.com/in/abdul-tawwab-629a83343/)  

---

## ⭐ Final Note

This project shows how **databases enable adaptive systems**, not just store data.

> *Adaptation begins with analytics. Analytics begin with data.*

