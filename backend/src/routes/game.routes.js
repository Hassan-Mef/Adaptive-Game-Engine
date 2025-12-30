const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

router.post('/start', gameController.startSession);
router.post('/log-round', gameController.logRound);
router.post('/end', gameController.endSession);

module.exports = router;
