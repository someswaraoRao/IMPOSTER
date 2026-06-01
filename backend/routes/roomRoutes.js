const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { verifyToken } = require('../middleware/auth');

router.post('/create', verifyToken, roomController.createRoom);
router.post('/join', verifyToken, roomController.joinRoom);
router.post('/leave', verifyToken, roomController.leaveRoom);
router.get('/:roomCode', verifyToken, roomController.getRoom);

module.exports = router;
