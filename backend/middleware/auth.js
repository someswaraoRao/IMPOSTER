const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyToken };
