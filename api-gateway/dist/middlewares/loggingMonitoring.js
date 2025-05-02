"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMonitoringMiddleware = void 0;
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/api-gateway.log' })
    ]
});
const loggingMonitoringMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
        });
    });
    next();
};
exports.loggingMonitoringMiddleware = loggingMonitoringMiddleware;
