import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Controller for user registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        error: { code: 'RESOURCE_EXISTS', message: 'User already exists' },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      data: { email, role },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during registration' },
    });
  }
};

// Controller for user login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'AUTH_INVALID', message: 'Invalid credentials' },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      status: 'success',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during login' },
    });
  }
};

// Controller to enable 2FA
export const enableTwoFactorAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({ length: 20 });

    // Save secret to user profile (placeholder logic)
    const user = await User.findByIdAndUpdate(userId, { twoFactorSecret: secret.base32, twoFactorEnabled: true }, { new: true });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
      });
    }

    res.status(200).json({
      status: 'success',
      data: { secret: secret.otpauth_url },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while enabling 2FA' },
    });
  }
};

// Controller to verify 2FA
export const verifyTwoFactorAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware
    const { token } = req.body;

    // Retrieve user and verify token
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'INVALID_REQUEST', message: '2FA is not enabled for this user' },
      });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isVerified) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'AUTH_INVALID', message: 'Invalid 2FA token' },
      });
    }

    res.status(200).json({
      status: 'success',
      message: '2FA verification successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while verifying 2FA' },
    });
  }
};

// Controller for email verification
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Generate a verification token (placeholder logic)
    const verificationToken = generateAccessToken({ email });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred while sending the verification email' },
    });
  }
};

// Controller for user logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Placeholder logic to invalidate the refresh token (e.g., store it in a blacklist)
    // In a real-world scenario, you might use a database or in-memory store to track invalidated tokens

    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during logout' },
    });
  }
};

// Controller for Google login
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'AUTH_INVALID', message: 'Invalid Google token' },
      });
    }

    const { email, name } = payload;

    // Check if user exists or create a new one
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, role: 'Customer' });
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      status: 'success',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during Google login' },
    });
  }
};

// Controller for Facebook login
export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    // Verify Facebook token
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );

    const { email, name } = response.data;

    // Check if user exists or create a new one
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, role: 'Customer' });
      await user.save();
    }

    // Generate tokens
    const accessTokenJWT = generateAccessToken({ id: user._id, role: user.role });
    const refreshTokenJWT = generateRefreshToken({ id: user._id });

    res.status(200).json({
      status: 'success',
      data: { accessToken: accessTokenJWT, refreshToken: refreshTokenJWT },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during Facebook login' },
    });
  }
};