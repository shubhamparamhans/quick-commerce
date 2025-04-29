import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/user';

// Controller to validate a JWT token
export const validateToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'AUTH_INVALID', message: 'Invalid token' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: decoded,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while validating the token' },
    });
  }
};

// Controller to validate user role
export const validateUserRole = async (req: Request, res: Response) => {
  try {
    const { token, requiredRole } = req.body;

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'AUTH_INVALID', message: 'Invalid token' },
      });
    }

    // Check user role
    const user = await User.findById(decoded.id);
    if (!user || user.role !== requiredRole) {
      return res.status(403).json({
        status: 'error',
        error: { code: 'PERMISSION_DENIED', message: 'User does not have the required role' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: { userId: user.id, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while validating the user role' },
    });
  }
};