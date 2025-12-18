const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/player.routes');
const gameRoutes = require('./routes/game.routes');
const { getPool } = require('./config/db');

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- ROUTES ---------- */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running 🚀' });
});



app.get('/db-test', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query('SELECT 1 AS test');
    res.json({ success: true, result: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/player', playerRoutes);

app.use('/api/game', gameRoutes);

/* ---------- FALLBACK ---------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
