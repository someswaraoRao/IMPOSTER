const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/', leaderboardController.getLeaderboard);
router.get('/profile/:userId', verifyToken, leaderboardController.getUserProfile);

module.exports = router;
