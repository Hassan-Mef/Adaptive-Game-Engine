const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

// POST /api/game/attempt
router.post('/attempt', gameController.recordAttempt);

module.exports = router;



