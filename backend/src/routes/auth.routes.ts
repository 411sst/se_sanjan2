import { Router } from 'express';
import {
  registerMerchant,
  loginMerchant,
  requestOTP,
  verifyOTP,
  getProfile,
  logout,
} from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/v1/auth/merchant/register
 * @desc    Register a new merchant
 * @access  Public
 */
router.post('/merchant/register', registerMerchant);

/**
 * @route   POST /api/v1/auth/merchant/login
 * @desc    Login merchant
 * @access  Public
 */
router.post('/merchant/login', loginMerchant);

/**
 * @route   POST /api/v1/auth/otp/request
 * @desc    Request OTP for customer login
 * @access  Public
 */
router.post('/otp/request', requestOTP);

/**
 * @route   POST /api/v1/auth/otp/verify
 * @desc    Verify OTP and login customer
 * @access  Public
 */
router.post('/otp/verify', verifyOTP);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', logout);

export default router;
