import { Router } from 'express';
import { registerCustomer, registerMerchant, login, logout } from '../controllers/authController';

const router = Router();

/**
 * @route   POST /api/v1/auth/register/merchant
 * @desc    Register a new merchant
 * @access  Public
 */
router.post('/register/merchant', registerMerchant);

/**
 * @route   POST /api/v1/auth/register/customer
 * @desc    Register a new customer
 * @access  Public
 */
router.post('/register/customer', registerCustomer);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user (merchant/customer)
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP for customer login
 * @access  Public
 */
router.post('/send-otp', (_req, res) => {
  res.json({ message: 'Send OTP endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP for customer login
 * @access  Public
 */
router.post('/verify-otp', (_req, res) => {
  res.json({ message: 'Verify OTP endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', (_req, res) => {
  res.json({ message: 'Forgot password endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', (_req, res) => {
  res.json({ message: 'Reset password endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', (_req, res) => {
  res.json({ message: 'Refresh token endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', logout);

export default router;
