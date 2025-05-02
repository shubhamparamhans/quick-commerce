"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsMiddleware = void 0;
const fs_1 = require("fs");
const analyticsFile = 'logs/api-analytics.log';
if (!(0, fs_1.existsSync)(analyticsFile)) {
    (0, fs_1.writeFileSync)(analyticsFile, '');
}
const analyticsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms\n`;
        (0, fs_1.appendFileSync)(analyticsFile, logEntry);
    });
    next();
};
exports.analyticsMiddleware = analyticsMiddleware;
