import { Request, Response, NextFunction } from 'express';

export const apiVersioningMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] || 'v1';
  req.headers['api-version'] = version; // Default to v1 if not provided
  next();
};