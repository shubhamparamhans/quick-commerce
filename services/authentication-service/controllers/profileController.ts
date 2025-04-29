import { Request, Response } from 'express';
import User from '../models/user';

// Controller to get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware

    // Find user by ID
    const user = await User.findById(userId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching user profile' },
    });
  }
};

// Controller to update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware
    const { firstName, lastName, phoneNumber } = req.body;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while updating user profile' },
    });
  }
};