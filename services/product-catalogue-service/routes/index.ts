import { Router } from 'express';
import productRoutes from './product';

const router = Router();

// Product Routes
router.use('/products', productRoutes);

export default router;