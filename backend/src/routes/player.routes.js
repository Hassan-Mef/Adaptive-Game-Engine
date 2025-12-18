const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');

// GET /api/player/:id
router.get('/:id', playerController.getPlayerById);

module.exports = router;
