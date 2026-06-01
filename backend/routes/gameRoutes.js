const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken } = require('../middleware/auth');

router.post('/start', verifyToken, gameController.startGame);
router.post('/submit-clue', verifyToken, gameController.submitClue);
router.post('/vote', verifyToken, gameController.vote);
router.post('/end-round', verifyToken, gameController.endRound);
router.get('/results/:gameId', verifyToken, gameController.getResults);

// New data routes
router.get('/words', gameController.getWordPairs);
router.get('/cpu-clues', gameController.getCpuClues);

module.exports = router;
