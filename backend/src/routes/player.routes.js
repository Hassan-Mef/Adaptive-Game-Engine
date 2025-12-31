const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');

router.get('/:id', playerController.getPlayer);
router.post('/', playerController.createPlayer);
router.post('/login', playerController.login);
router.get('/:id/stats', playerController.getPlayerStats);


module.exports = router;
