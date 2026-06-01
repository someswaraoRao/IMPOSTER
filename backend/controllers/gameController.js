const db = require('../config/db');

exports.startGame = async (req, res) => {
    try {
        const { roomId, imposterId } = req.body; 

        // Update room status
        await db.execute('UPDATE rooms SET status = ? WHERE id = ?', ['playing', roomId]);

        // Create game
        const [result] = await db.execute(
            'INSERT INTO games (room_id, imposter_id) VALUES (?, ?)',
            [roomId, imposterId]
        );
        const gameId = result.insertId;

        // Create first round
        const [roundResult] = await db.execute(
            'INSERT INTO rounds (game_id, round_number) VALUES (?, ?)',
            [gameId, 1]
        );

        res.status(201).json({
            message: 'Game started successfully',
            gameId,
            roundId: roundResult.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitClue = async (req, res) => {
    try {
        const { roundId, clueText } = req.body;
        const userId = req.user.id;

        await db.execute(
            'INSERT INTO clues (round_id, user_id, clue_text) VALUES (?, ?, ?)',
            [roundId, userId, clueText]
        );

        res.status(201).json({ message: 'Clue submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.vote = async (req, res) => {
    try {
        const { roundId, votedForId } = req.body;
        const voterId = req.user.id;

        await db.execute(
            'INSERT INTO votes (round_id, voter_id, voted_for_id) VALUES (?, ?, ?)',
            [roundId, voterId, votedForId]
        );

        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.endRound = async (req, res) => {
    try {
        const { roundId, gameId, isGameOver, winner } = req.body;

        // End current round
        await db.execute('UPDATE rounds SET end_time = CURRENT_TIMESTAMP WHERE id = ?', [roundId]);

        if (isGameOver) {
            // End game
            await db.execute('UPDATE games SET end_time = CURRENT_TIMESTAMP, winner = ? WHERE id = ?', [winner, gameId]);
            
            // Get game details
            const [games] = await db.execute('SELECT room_id, imposter_id FROM games WHERE id = ?', [gameId]);
            const roomId = games[0].room_id;
            
            // Revert room status
            await db.execute('UPDATE rooms SET status = ? WHERE id = ?', ['waiting', roomId]);
            
            res.json({ message: 'Game ended successfully' });
        } else {
            // Start next round
            const [rounds] = await db.execute('SELECT MAX(round_number) as max_round FROM rounds WHERE game_id = ?', [gameId]);
            const nextRoundNumber = (rounds[0].max_round || 0) + 1;
            
            const [newRound] = await db.execute(
                'INSERT INTO rounds (game_id, round_number) VALUES (?, ?)',
                [gameId, nextRoundNumber]
            );
            
            res.json({ 
                message: 'Round ended, new round started',
                newRoundId: newRound.insertId
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getResults = async (req, res) => {
    try {
        const { gameId } = req.params;

        const [games] = await db.execute('SELECT * FROM games WHERE id = ?', [gameId]);
        if (games.length === 0) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(games[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getWordPairs = async (req, res) => {
    try {
        const [words] = await db.execute('SELECT innocent_word as i, imposter_word as m, difficulty as d FROM word_pairs');
        res.json(words);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCpuClues = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT word, clue FROM cpu_clues');
        
        // Group by word to match frontend format
        const cpuClues = {};
        rows.forEach(row => {
            if (!cpuClues[row.word]) {
                cpuClues[row.word] = [];
            }
            cpuClues[row.word].push(row.clue);
        });

        res.json(cpuClues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
