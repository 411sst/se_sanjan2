import { Router } from 'express';
import {
  getAllCoupons,
  getCouponById,
  getCategories,
  claimCoupon,
  getCustomerWallet,
} from '../controllers/coupon.controller';

const router = Router();

/**
 * @route   GET /api/v1/coupons
 * @desc    Browse/search coupons (public)
 * @access  Public
 */
router.get('/', getAllCoupons);

/**
 * @route   GET /api/v1/coupons/categories
 * @desc    Get all coupon categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/v1/coupons/:id
 * @desc    Get coupon details
 * @access  Public
 */
router.get('/:id', getCouponById);

/**
 * @route   POST /api/v1/coupons/:id/claim
 * @desc    Claim a coupon (add to wallet)
 * @access  Private (Customer)
 */
router.post('/:id/claim', claimCoupon);

export default router;
