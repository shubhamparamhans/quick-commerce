import { Router } from 'express';
import dashboardRoutes from './dashboard';

const router = Router();

// Dashboard Routes
router.use('/dashboard', dashboardRoutes);

export default router;