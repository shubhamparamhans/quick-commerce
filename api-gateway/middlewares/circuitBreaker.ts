import { Request, Response, NextFunction } from 'express';
import CircuitBreaker from 'opossum';

const options = {
  timeout: 3000, // If the function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(async (req: Request) => {
  // Simulate a service call
  return true;
}, options);

export const circuitBreakerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  breaker.fire(req)
    .then(() => next())
    .catch(() => res.status(503).json({ message: 'Service Unavailable' }));
};