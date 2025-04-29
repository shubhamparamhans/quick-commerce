import { Request, Response, NextFunction } from 'express';
import { validationResult, checkSchema } from 'express-validator';

// Middleware to validate request body, query, or params
export const validateRequest = (schema: any) => {
  return [
    checkSchema(schema),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array().map((err) => ({
              field: err.param,
              message: err.msg,
            })),
          },
        });
      }
      next();
    },
  ];
};