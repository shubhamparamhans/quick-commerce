"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseCacheMiddleware = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 100, checkperiod: 120 });
const responseCacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        return res.json(cachedResponse);
    }
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        cache.set(key, body);
        return originalJson(body);
    };
    next();
};
exports.responseCacheMiddleware = responseCacheMiddleware;
