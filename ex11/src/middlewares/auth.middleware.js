const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.config.js');

// Verifies the JWT sent in the Authorization header (Bearer <token>)
verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized! Invalid or expired token."
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const authMiddleware = {
    verifyToken
};

module.exports = authMiddleware;
