import { Router } from 'express';
import { createProduct, getProductById } from '../controllers/productController';

const router = Router();

// Endpoint to create a new product
router.post('/', createProduct);

// Endpoint to get a product by ID
router.get('/:id', getProductById);

export default router;