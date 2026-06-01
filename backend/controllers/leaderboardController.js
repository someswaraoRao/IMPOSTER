const db = require('../config/db');

exports.getLeaderboard = async (req, res) => {
    try {
        const [leaders] = await db.execute(
            'SELECT l.user_id, u.username, l.games_played, l.games_won, l.imposter_wins, l.crewmate_wins, l.score ' +
            'FROM leaderboard l JOIN users u ON l.user_id = u.id ' +
            'ORDER BY l.score DESC LIMIT 50'
        );

        res.json(leaders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get basic profile stats
        const [profile] = await db.execute(
            'SELECT l.*, u.username, u.created_at ' +
            'FROM leaderboard l JOIN users u ON l.user_id = u.id ' +
            'WHERE l.user_id = ?',
            [userId]
        );

        if (profile.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Get achievements
        const [achievements] = await db.execute(
            'SELECT a.name, a.description, ua.unlocked_at ' +
            'FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id ' +
            'WHERE ua.user_id = ?',
            [userId]
        );

        res.json({
            profile: profile[0],
            achievements
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
