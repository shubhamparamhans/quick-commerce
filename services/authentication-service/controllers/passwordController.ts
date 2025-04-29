import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/user';

// Controller to request a password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save hashed token and expiration to user
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset token to user (placeholder for email logic)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to your email',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while requesting password reset' },
    });
  }
};

// Controller to reset the password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({ resetToken: { $exists: true }, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' },
      });
    }

    // Verify token
    const isTokenValid = await bcrypt.compare(token, user.resetToken);
    if (!isTokenValid) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while resetting password' },
    });
  }
};