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
exports.circuitBreakerMiddleware = void 0;
const opossum_1 = __importDefault(require("opossum"));
const options = {
    timeout: 3000, // If the function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
    resetTimeout: 30000, // After 30 seconds, try again.
};
const breaker = new opossum_1.default((req) => __awaiter(void 0, void 0, void 0, function* () {
    // Simulate a service call
    return true;
}), options);
const circuitBreakerMiddleware = (req, res, next) => {
    breaker.fire(req)
        .then(() => next())
        .catch(() => res.status(503).json({ message: 'Service Unavailable' }));
};
exports.circuitBreakerMiddleware = circuitBreakerMiddleware;
