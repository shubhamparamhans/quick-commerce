import express from 'express';
import mongoose from 'mongoose';
import warehouseRoutes from './routes/warehouseRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import staffRoutes from './routes/staffRoutes';
import qualityControlRoutes from './routes/qualityControlRoutes';
import orderPickingRoutes from './routes/orderPickingRoutes';
import packingRoutes from './routes/packingRoutes';
import deliveryHandoffRoutes from './routes/deliveryHandoffRoutes';
import returnsRoutes from './routes/returnsRoutes';
import inventoryForecastingRoutes from './routes/inventoryForecastingRoutes';
import barcodeRoutes from './routes/barcodeRoutes';
import batchProcessingRoutes from './routes/batchProcessingRoutes';
import webhookRoutes from './routes/webhookRoutes';
import reportingRoutes from './routes/reportingRoutes';
import { initializeSocket } from './realtime/inventorySync';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/warehouse-management';
mongoose.connect(MONGO_URI,) // { useNewUrlParser: true, useUnifiedTopology: true }
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes Placeholder
app.use('/api', warehouseRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', staffRoutes);
app.use('/api', qualityControlRoutes);
app.use('/api', orderPickingRoutes);
app.use('/api', packingRoutes);
app.use('/api', deliveryHandoffRoutes);
app.use('/api', returnsRoutes);
app.use('/api', inventoryForecastingRoutes);
app.use('/api', barcodeRoutes);
app.use('/api', batchProcessingRoutes);
app.use('/api', webhookRoutes);
app.use('/api', reportingRoutes);
// Read the JSON file
const filePath = path.join(__dirname, 'swagger.json');
const swaggerDefinition = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: [], // Adjust the path to match your routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log('Swagger documentation available at /api-docs');

app.get('/', (req, res) => {
  res.send('Warehouse Management Service is running');
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize WebSocket for real-time inventory synchronization
initializeSocket(server);