const db = require('../config/db');

// Helper function to generate room code
const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

exports.createRoom = async (req, res) => {
    try {
        const hostId = req.user.id;
        let roomCode = generateRoomCode();
        let isUnique = false;

        // Ensure room code is unique
        while (!isUnique) {
            const [existing] = await db.execute('SELECT id FROM rooms WHERE room_code = ?', [roomCode]);
            if (existing.length === 0) {
                isUnique = true;
            } else {
                roomCode = generateRoomCode();
            }
        }

        // Create room
        const [result] = await db.execute(
            'INSERT INTO rooms (room_code, host_id) VALUES (?, ?)',
            [roomCode, hostId]
        );
        const roomId = result.insertId;

        // Add host to room_players
        await db.execute(
            'INSERT INTO room_players (room_id, user_id, is_ready) VALUES (?, ?, ?)',
            [roomId, hostId, true] // Host is ready by default
        );

        res.status(201).json({
            message: 'Room created successfully',
            roomCode,
            roomId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const userId = req.user.id;

        // Find room
        const [rooms] = await db.execute(
            'SELECT * FROM rooms WHERE room_code = ? AND status = ?',
            [roomCode, 'waiting']
        );

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Room not found or already playing' });
        }

        const room = rooms[0];

        // Check if user already in room
        const [existingPlayer] = await db.execute(
            'SELECT * FROM room_players WHERE room_id = ? AND user_id = ?',
            [room.id, userId]
        );

        if (existingPlayer.length === 0) {
            // Join room
            await db.execute(
                'INSERT INTO room_players (room_id, user_id) VALUES (?, ?)',
                [room.id, userId]
            );
        }

        res.json({
            message: 'Joined room successfully',
            roomCode: room.room_code,
            roomId: room.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const userId = req.user.id;

        const [rooms] = await db.execute('SELECT id, host_id FROM rooms WHERE room_code = ?', [roomCode]);
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const room = rooms[0];

        // Remove from room_players
        await db.execute('DELETE FROM room_players WHERE room_id = ? AND user_id = ?', [room.id, userId]);

        // If host leaves, handle logic (e.g., assign new host or close room)
        if (room.host_id === userId) {
            const [remainingPlayers] = await db.execute('SELECT user_id FROM room_players WHERE room_id = ? LIMIT 1', [room.id]);
            
            if (remainingPlayers.length > 0) {
                // Assign new host
                const newHostId = remainingPlayers[0].user_id;
                await db.execute('UPDATE rooms SET host_id = ? WHERE id = ?', [newHostId, room.id]);
            } else {
                // Close room if empty
                await db.execute('UPDATE rooms SET status = ? WHERE id = ?', ['finished', room.id]);
            }
        }

        res.json({ message: 'Left room successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const [rooms] = await db.execute(
            'SELECT r.id, r.room_code, r.host_id, r.status, u.username as host_name ' +
            'FROM rooms r JOIN users u ON r.host_id = u.id ' +
            'WHERE r.room_code = ?',
            [roomCode]
        );

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const room = rooms[0];

        // Get players
        const [players] = await db.execute(
            'SELECT rp.user_id, u.username, rp.is_ready ' +
            'FROM room_players rp JOIN users u ON rp.user_id = u.id ' +
            'WHERE rp.room_id = ?',
            [room.id]
        );

        res.json({
            room,
            players
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
