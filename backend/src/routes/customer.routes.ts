import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/customers/profile
 * @desc    Get customer profile
 * @access  Private (Customer)
 */
router.get('/profile', (_req, res) => {
  res.json({ message: 'Get customer profile endpoint' });
});

/**
 * @route   PUT /api/v1/customers/profile
 * @desc    Update customer profile
 * @access  Private (Customer)
 */
router.put('/profile', (_req, res) => {
  res.json({ message: 'Update customer profile endpoint' });
});

/**
 * @route   GET /api/v1/customers/wallet
 * @desc    Get customer's coupon wallet
 * @access  Private (Customer)
 */
router.get('/wallet', (_req, res) => {
  res.json({ message: 'Get customer wallet endpoint' });
});

/**
 * @route   POST /api/v1/customers/claim/:couponId
 * @desc    Claim a coupon
 * @access  Private (Customer)
 */
router.post('/claim/:couponId', (_req, res) => {
  res.json({ message: 'Claim coupon endpoint' });
});

/**
 * @route   GET /api/v1/customers/redemptions
 * @desc    Get customer's redemption history
 * @access  Private (Customer)
 */
router.get('/redemptions', (_req, res) => {
  res.json({ message: 'Get customer redemptions endpoint' });
});

/**
 * @route   GET /api/v1/customers/notifications
 * @desc    Get customer notifications
 * @access  Private (Customer)
 */
router.get('/notifications', (_req, res) => {
  res.json({ message: 'Get customer notifications endpoint' });
});

/**
 * @route   PUT /api/v1/customers/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Customer)
 */
router.put('/notifications/:id/read', (_req, res) => {
  res.json({ message: 'Mark notification as read endpoint' });
});

export default router;
