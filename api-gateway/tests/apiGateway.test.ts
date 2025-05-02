import request from 'supertest';
import express from 'express';
import { healthCheckRouter } from '../routes/healthCheck';
import { authMiddleware } from '../middlewares/authMiddleware';
import { loggingMonitoringMiddleware } from '../middlewares/loggingMonitoring';
import { analyticsMiddleware } from '../middlewares/analytics';

const app = express();

// Apply middlewares and routes for testing
app.use(loggingMonitoringMiddleware);
app.use(analyticsMiddleware);
app.use('/health', healthCheckRouter);
app.use((req, res, next) => {
    try {
        authMiddleware(req, res, next);
    } catch (error) {
      next(error);
    }
  });

describe('API Gateway Integration Tests', () => {
  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'UP' });
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app).get('/protected-route');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized' });
  });

  // Add more tests for other middlewares and routes as needed
});