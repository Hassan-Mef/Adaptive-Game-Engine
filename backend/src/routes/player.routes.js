const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.get('/:id', authenticateToken, playerController.getPlayer);
router.post('/',  playerController.createPlayer);
router.post('/login',  playerController.login);
router.get('/:id/stats', authenticateToken, playerController.getPlayerStats);


module.exports = router;
