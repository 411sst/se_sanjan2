import { Router } from 'express';

const router = Router();

/**
 * @route   POST /api/v1/auth/register/merchant
 * @desc    Register a new merchant
 * @access  Public
 */
router.post('/register/merchant', (_req, res) => {
  res.status(201).json({ message: 'Merchant registration endpoint' });
});

/**
 * @route   POST /api/v1/auth/register/customer
 * @desc    Register a new customer
 * @access  Public
 */
router.post('/register/customer', (_req, res) => {
  res.status(201).json({ message: 'Customer registration endpoint' });
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user (merchant/customer)
 * @access  Public
 */
router.post('/login', (_req, res) => {
  res.json({ message: 'Login endpoint' });
});

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP for customer login
 * @access  Public
 */
router.post('/send-otp', (_req, res) => {
  res.json({ message: 'Send OTP endpoint' });
});

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP for customer login
 * @access  Public
 */
router.post('/verify-otp', (_req, res) => {
  res.json({ message: 'Verify OTP endpoint' });
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', (_req, res) => {
  res.json({ message: 'Forgot password endpoint' });
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', (_req, res) => {
  res.json({ message: 'Reset password endpoint' });
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', (_req, res) => {
  res.json({ message: 'Refresh token endpoint' });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logout endpoint' });
});

export default router;
