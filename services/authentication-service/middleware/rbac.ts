import { Request, Response, NextFunction } from 'express';

// Middleware for role-based access control
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role; // Assuming `req.user` is populated by authentication middleware

      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: 'error',
          error: {
            code: 'PERMISSION_DENIED',
            message: 'You do not have permission to perform this action',
          },
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while checking permissions',
        },
      });
    }
  };
};