import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later.',
    },
  },
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware
app.use(bodyParser.json());

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication Service API',
      version: '1.0.0',
      description: 'API documentation for the Authentication Service',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.ts'], // Adjust the path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log('Swagger documentation available at /api-docs');

// Routes
app.use('/v1', routes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('Authentication Service is healthy'));

// Start Server
app.listen(PORT, () => {
  console.log(`Authentication Service running on port ${PORT}`);
});