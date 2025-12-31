const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/start', authenticateToken, gameController.startSession);
router.post('/log-round', authenticateToken, gameController.logRound);
router.post('/end', authenticateToken, gameController.endSession);

router.get('/session-entry', authenticateToken, gameController.getSessionEntryState);

router.get('/session-summary/:attemptId', authenticateToken, gameController.getSessionSummary);

module.exports = router;
