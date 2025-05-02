import express from 'express';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { validateRequest } from './middlewares/validateRequest';
import { errorHandler } from './middlewares/errorHandler';
import { healthCheckRouter } from './routes/healthCheck';
import { authMiddleware } from './middlewares/authMiddleware';
import { circuitBreakerMiddleware } from './middlewares/circuitBreaker';
import { responseCacheMiddleware } from './middlewares/responseCache';
import { requestResponseTransformMiddleware } from './middlewares/requestResponseTransform';
import { apiVersioningMiddleware } from './middlewares/apiVersioning';
import { serviceDiscoveryMiddleware } from './middlewares/serviceDiscovery';
import { serviceSecurityMiddleware } from './middlewares/serviceSecurity';
import { loggingMonitoringMiddleware } from './middlewares/loggingMonitoring';
import { analyticsMiddleware } from './middlewares/analytics';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Apply middlewares
app.use(loggingMonitoringMiddleware);
app.use(analyticsMiddleware);
app.use((req, res, next) => {
    try {
        authMiddleware(req, res, next);
    } catch (error) {
      next(error);
    }
  });
app.use(circuitBreakerMiddleware);
app.use((req, res, next) => {
    try {
        responseCacheMiddleware(req, res, next);
    } catch (error) {
      next(error);
    }
  });
app.use(requestResponseTransformMiddleware);
app.use(apiVersioningMiddleware);
// Wrap the middleware to handle async errors
app.use((req, res, next) => {
  serviceDiscoveryMiddleware(req, res, next).catch(next);
});
app.use((req, res, next) => {
  serviceDiscoveryMiddleware(req, res, next).catch(next);
});
app.use((req, res, next) => {
  try {
    serviceSecurityMiddleware(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Documentation
// const swaggerDocument = YAML.load('./swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check
app.use('/health', healthCheckRouter);

// Proxy Middleware for Microservices
app.use('/service1', createProxyMiddleware({ target: 'http://service1-url', changeOrigin: true }));
app.use('/service2', createProxyMiddleware({ target: 'http://service2-url', changeOrigin: true }));

// Unified Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});