import { Router } from 'express';
import { registerUser, loginUser, enableTwoFactorAuth, verifyTwoFactorAuth } from '../controllers/authController';
import { requestPasswordReset, resetPassword } from '../controllers/passwordController';
import { getUserProfile, updateUserProfile } from '../controllers/profileController';
import { validateToken, validateUserRole } from '../controllers/validationController';

const router = Router();

// Endpoint for user registration
router.post('/register', registerUser);

// Endpoint for user login
router.post('/login', loginUser);

// Endpoint to request a password reset
router.post('/password-reset/request', requestPasswordReset);

// Endpoint to reset the password
router.post('/password-reset/reset', resetPassword);

// Endpoint to get user profile
router.get('/profile', getUserProfile);

// Endpoint to update user profilec
router.put('/profile', updateUserProfile);

// Endpoint to enable 2FA
router.post('/2fa/enable', enableTwoFactorAuth);

// Endpoint to verify 2FA
router.post('/2fa/verify', verifyTwoFactorAuth);

// Endpoint to validate a JWT token
router.post('/validate-token', validateToken);

// Endpoint to validate user role
router.post('/validate-role', validateUserRole);

export default router;