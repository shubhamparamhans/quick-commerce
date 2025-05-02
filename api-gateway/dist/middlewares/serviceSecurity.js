"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSecurityMiddleware = void 0;
const crypto_1 = __importDefault(require("crypto"));
const serviceSecurityMiddleware = (req, res, next) => {
    const sharedSecret = process.env.SHARED_SECRET || 'default_secret';
    const signature = req.headers['x-service-signature'];
    if (!signature) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto_1.default.createHmac('sha256', sharedSecret).update(payload).digest('hex');
    if (signature !== expectedSignature) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};
exports.serviceSecurityMiddleware = serviceSecurityMiddleware;
