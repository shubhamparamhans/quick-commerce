import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Catalog Service API',
      version: '1.0.0',
      description: 'API documentation for the Product Catalog Service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
app.get('/health', (req, res) => res.status(200).send('Product Catalog Service is healthy'));

// Start Server
app.listen(PORT, () => {
  console.log(`Product Catalog Service running on port ${PORT}`);
});