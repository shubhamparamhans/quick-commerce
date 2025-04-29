import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController';

const router = Router();

// Endpoint to fetch dashboard metrics
router.get('/metrics', getDashboardMetrics);

export default router;