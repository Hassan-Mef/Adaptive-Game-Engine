require('dotenv').config();
const app = require('./app');
const { initDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await initDB(); // 🔥 WAIT for DB connection
  console.log('✅ Database initialized');

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer();
