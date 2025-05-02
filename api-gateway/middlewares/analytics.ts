import { Request, Response, NextFunction } from 'express';
import { writeFileSync, existsSync, appendFileSync } from 'fs';

const analyticsFile = 'logs/api-analytics.log';

if (!existsSync(analyticsFile)) {
  writeFileSync(analyticsFile, '');
}

export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms\n`;
    appendFileSync(analyticsFile, logEntry);
  });

  next();
};