import { Router } from 'express';
import orderRoutes from './order';

const router = Router();

// Order Routes
router.use('/orders', orderRoutes);

export default router;