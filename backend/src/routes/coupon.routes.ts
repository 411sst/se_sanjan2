import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/coupons
 * @desc    Browse/search coupons (public)
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'Browse coupons endpoint' });
});

/**
 * @route   GET /api/v1/coupons/:id
 * @desc    Get coupon details
 * @access  Public
 */
router.get('/:id', (req, res) => {
  res.json({ message: 'Get coupon details endpoint' });
});

/**
 * @route   POST /api/v1/coupons/validate
 * @desc    Validate coupon code
 * @access  Public
 */
router.post('/validate', (req, res) => {
  res.json({ message: 'Validate coupon endpoint' });
});

/**
 * @route   POST /api/v1/coupons/redeem/initiate
 * @desc    Initiate redemption (QR scan, send OTP)
 * @access  Private (Customer)
 */
router.post('/redeem/initiate', (req, res) => {
  res.json({ message: 'Initiate redemption endpoint' });
});

/**
 * @route   POST /api/v1/coupons/redeem/verify
 * @desc    Verify OTP and complete redemption
 * @access  Private (Merchant)
 */
router.post('/redeem/verify', (req, res) => {
  res.json({ message: 'Verify redemption endpoint' });
});

/**
 * @route   GET /api/v1/coupons/categories
 * @desc    Get all coupon categories
 * @access  Public
 */
router.get('/categories', (req, res) => {
  res.json({ message: 'Get categories endpoint' });
});

export default router;
