const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ' });
});

module.exports = app;
