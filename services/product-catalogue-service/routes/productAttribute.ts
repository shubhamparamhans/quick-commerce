import { Router } from 'express';
import { createProductAttribute, getProductAttributeById } from '../controllers/productAttributeController';

const router = Router();

// Endpoint to create a new product attribute
router.post('/', createProductAttribute);

// Endpoint to get a product attribute by ID
router.get('/:id', getProductAttributeById);

export default router;