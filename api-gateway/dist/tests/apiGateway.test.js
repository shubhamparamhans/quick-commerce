"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const healthCheck_1 = require("../routes/healthCheck");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const loggingMonitoring_1 = require("../middlewares/loggingMonitoring");
const analytics_1 = require("../middlewares/analytics");
const app = (0, express_1.default)();
// Apply middlewares and routes for testing
app.use(loggingMonitoring_1.loggingMonitoringMiddleware);
app.use(analytics_1.analyticsMiddleware);
app.use('/health', healthCheck_1.healthCheckRouter);
app.use((req, res, next) => {
    try {
        (0, authMiddleware_1.authMiddleware)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
describe('API Gateway Integration Tests', () => {
    it('should return 200 for health check', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'UP' });
    }));
    it('should return 401 for unauthorized access', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/protected-route');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Unauthorized' });
    }));
    // Add more tests for other middlewares and routes as needed
});
