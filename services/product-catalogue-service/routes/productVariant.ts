import { Router } from 'express';
import { createProductVariant, getProductVariantById } from '../controllers/productVariantController';

const router = Router();

// Endpoint to create a new product variant
router.post('/', createProductVariant);

// Endpoint to get a product variant by ID
router.get('/:id', getProductVariantById);

export default router;