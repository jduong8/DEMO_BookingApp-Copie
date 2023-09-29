const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ auth: false, message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ auth: false, message: 'Incorrect token.' });
    }
};

module.exports = verifyJWT;