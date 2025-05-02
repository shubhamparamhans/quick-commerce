"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiVersioningMiddleware = void 0;
const apiVersioningMiddleware = (req, res, next) => {
    const version = req.headers['api-version'] || 'v1';
    req.headers['api-version'] = version; // Default to v1 if not provided
    next();
};
exports.apiVersioningMiddleware = apiVersioningMiddleware;
