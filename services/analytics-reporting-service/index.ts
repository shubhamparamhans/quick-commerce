import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/v1', routes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('Service is healthy'));

// Start Server
app.listen(PORT, () => {
  console.log(`Analytics & Reporting Service running on port ${PORT}`);
});