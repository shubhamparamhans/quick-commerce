"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestResponseTransformMiddleware = void 0;
const requestResponseTransformMiddleware = (req, res, next) => {
    // Transform request
    if (req.body && typeof req.body === 'object') {
        req.body = Object.assign(Object.assign({}, req.body), { transformed: true });
    }
    // Transform response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        const transformedBody = Object.assign(Object.assign({}, body), { transformed: true });
        return originalJson(transformedBody);
    };
    next();
};
exports.requestResponseTransformMiddleware = requestResponseTransformMiddleware;
