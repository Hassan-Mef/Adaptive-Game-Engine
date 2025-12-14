require('dotenv').config();
const app = require('./app');

// initialize DB connection
require('./config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
