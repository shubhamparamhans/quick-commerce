"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    //   const token = req.headers['authorization'];
    //   if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    //   }
    // Validate token logic here (e.g., JWT verification)
    try {
        // Example: jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
};
exports.authMiddleware = authMiddleware;
