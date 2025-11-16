import { Router } from 'express';
import { browseCoupons, getCouponById, validateCoupon, getCategories } from '../controllers/couponController';

const router = Router();

/**
 * @route   GET /api/v1/coupons/categories
 * @desc    Get all coupon categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/v1/coupons
 * @desc    Browse/search coupons (public)
 * @access  Public
 */
router.get('/', browseCoupons);

/**
 * @route   GET /api/v1/coupons/:id
 * @desc    Get coupon details
 * @access  Public
 */
router.get('/:id', getCouponById);

/**
 * @route   POST /api/v1/coupons/validate
 * @desc    Validate coupon code
 * @access  Public
 */
router.post('/validate', validateCoupon);

/**
 * @route   POST /api/v1/coupons/redeem/initiate
 * @desc    Initiate redemption (QR scan, send OTP)
 * @access  Private (Customer)
 */
router.post('/redeem/initiate', (_req, res) => {
  res.json({ message: 'Initiate redemption endpoint - To be implemented' });
});

/**
 * @route   POST /api/v1/coupons/redeem/verify
 * @desc    Verify OTP and complete redemption
 * @access  Private (Merchant)
 */
router.post('/redeem/verify', (_req, res) => {
  res.json({ message: 'Verify redemption endpoint - To be implemented' });
});

export default router;
