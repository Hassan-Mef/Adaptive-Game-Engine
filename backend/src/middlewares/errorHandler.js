const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');

router.get('/:id', playerController.getPlayer);
router.post('/', playerController.createPlayer);

module.exports = router;
