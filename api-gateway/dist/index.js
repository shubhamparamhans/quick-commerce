"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const errorHandler_1 = require("./middlewares/errorHandler");
const healthCheck_1 = require("./routes/healthCheck");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const circuitBreaker_1 = require("./middlewares/circuitBreaker");
const responseCache_1 = require("./middlewares/responseCache");
const requestResponseTransform_1 = require("./middlewares/requestResponseTransform");
const apiVersioning_1 = require("./middlewares/apiVersioning");
const serviceDiscovery_1 = require("./middlewares/serviceDiscovery");
const serviceSecurity_1 = require("./middlewares/serviceSecurity");
const loggingMonitoring_1 = require("./middlewares/loggingMonitoring");
const analytics_1 = require("./middlewares/analytics");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
// Apply middlewares
app.use(loggingMonitoring_1.loggingMonitoringMiddleware);
app.use(analytics_1.analyticsMiddleware);
app.use((req, res, next) => {
    try {
        (0, authMiddleware_1.authMiddleware)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
app.use(circuitBreaker_1.circuitBreakerMiddleware);
app.use((req, res, next) => {
    try {
        (0, responseCache_1.responseCacheMiddleware)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
app.use(requestResponseTransform_1.requestResponseTransformMiddleware);
app.use(apiVersioning_1.apiVersioningMiddleware);
// Wrap the middleware to handle async errors
app.use((req, res, next) => {
    (0, serviceDiscovery_1.serviceDiscoveryMiddleware)(req, res, next).catch(next);
});
app.use((req, res, next) => {
    (0, serviceDiscovery_1.serviceDiscoveryMiddleware)(req, res, next).catch(next);
});
app.use((req, res, next) => {
    try {
        (0, serviceSecurity_1.serviceSecurityMiddleware)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
// API Documentation
// const swaggerDocument = YAML.load('./swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Health Check
app.use('/health', healthCheck_1.healthCheckRouter);
// Proxy Middleware for Microservices
app.use('/service1', (0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://service1-url', changeOrigin: true }));
app.use('/service2', (0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://service2-url', changeOrigin: true }));
// Unified Error Handling
app.use(errorHandler_1.errorHandler);
// Start Server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
