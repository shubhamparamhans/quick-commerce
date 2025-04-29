import { Router } from 'express';
import { createCategory, getCategoryById } from '../controllers/categoryController';

const router = Router();

// Endpoint to create a new category
router.post('/', createCategory);

// Endpoint to get a category by ID
router.get('/:id', getCategoryById);

export default router;