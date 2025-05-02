import { Request, Response, NextFunction } from 'express';

export const requestResponseTransformMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Transform request
  if (req.body && typeof req.body === 'object') {
    req.body = { ...req.body, transformed: true };
  }

  // Transform response
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const transformedBody = { ...body, transformed: true };
    return originalJson(transformedBody);
  };

  next();
};