import { Router } from 'express';

export const healthCheckRouter = Router();

healthCheckRouter.get('/', (req, res) => {
  res.status(200).json({ status: 'UP' });
});