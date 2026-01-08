const express = require('express');
const cors = require('cors');

const playerRoutes = require('./routes/player.routes');
const gameRoutes = require('./routes/game.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const { getPool } = require('./config/db');

const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */

// Enable Cross-Origin requests (frontend ↔ backend)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads (form submissions, etc.)
app.use(express.urlencoded({ extended: true }));

/* ---------- BASE ROUTES ---------- */

// Health check – confirms server is alive
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running 🚀' });
});

// Database connectivity test
// Verifies MSSQL connection pool is active
app.get('/db-test', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT 1 AS test');
    res.json({ success: true, result: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ---------- API ROUTES ---------- */

// Player-related endpoints
app.use('/api/player', playerRoutes);

// Game session & round endpoints
app.use('/api/game', gameRoutes);

// Leaderboard endpoints
app.use('/api/leaderboard', leaderboardRoutes);
// Analytics endpoints
app.use('/api/analytics', analyticsRoutes);

/* ---------- FALLBACK HANDLER ---------- */

// Handles unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
