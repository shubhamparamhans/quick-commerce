import { Router } from 'express';
import { createOrder, getOrderById } from '../controllers/orderController';

const router = Router();

// Endpoint to create a new order
router.post('/', createOrder);

// Endpoint to get an order by ID
router.get('/:id', getOrderById);

export default router;