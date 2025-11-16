import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../config/database';

/**
 * Get all active coupons (public browsing)
 */
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const { category, merchantId, search } = req.query;

    let query = `
      SELECT
        c.*,
        m.business_name as merchantName
      FROM coupons c
      LEFT JOIN merchants m ON c.merchant_id = m.id
      WHERE c.status = 'active'
        AND c.start_date <= datetime('now')
        AND c.end_date >= datetime('now')
    `;

    const params: any[] = [];

    if (category) {
      query += ' AND c.category = ?';
      params.push(category);
    }

    if (merchantId) {
      query += ' AND c.merchant_id = ?';
      params.push(merchantId);
    }

    if (search) {
      query += ' AND (c.title LIKE ? OR c.description LIKE ? OR c.code LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY c.created_at DESC';

    const coupons = await dbAll(query, params);

    // Convert snake_case to camelCase
    const formattedCoupons = coupons.map((coupon: any) => ({
      id: coupon.id,
      merchantId: coupon.merchant_id,
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      minPurchaseAmount: coupon.min_purchase_amount,
      maxDiscountAmount: coupon.max_discount_amount,
      maxRedemptions: coupon.max_redemptions,
      maxRedemptionsPerCustomer: coupon.max_redemptions_per_customer,
      redeemedCount: coupon.redeemed_count,
      startDate: coupon.start_date,
      endDate: coupon.end_date,
      category: coupon.category,
      tags: coupon.tags,
      termsConditions: coupon.terms_conditions,
      imageUrl: coupon.image_url,
      qrCodeUrl: coupon.qr_code_url,
      status: coupon.status,
      createdAt: coupon.created_at,
      updatedAt: coupon.updated_at,
      merchantName: coupon.merchantName,
    }));

    res.json({
      success: true,
      data: formattedCoupons,
      count: formattedCoupons.length,
    });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: error.message,
    });
  }
};

/**
 * Get coupon by ID
 */
export const getCouponById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const coupon = await dbGet(
      `
      SELECT
        c.*,
        m.business_name as merchantName
      FROM coupons c
      LEFT JOIN merchants m ON c.merchant_id = m.id
      WHERE c.id = ?
      `,
      [id]
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    const formattedCoupon = {
      id: coupon.id,
      merchantId: coupon.merchant_id,
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      minPurchaseAmount: coupon.min_purchase_amount,
      maxDiscountAmount: coupon.max_discount_amount,
      maxRedemptions: coupon.max_redemptions,
      maxRedemptionsPerCustomer: coupon.max_redemptions_per_customer,
      redeemedCount: coupon.redeemed_count,
      startDate: coupon.start_date,
      endDate: coupon.end_date,
      category: coupon.category,
      tags: coupon.tags,
      termsConditions: coupon.terms_conditions,
      imageUrl: coupon.image_url,
      qrCodeUrl: coupon.qr_code_url,
      status: coupon.status,
      createdAt: coupon.created_at,
      updatedAt: coupon.updated_at,
      merchantName: coupon.merchantName,
    };

    res.json({
      success: true,
      data: formattedCoupon,
    });
  } catch (error: any) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupon',
      error: error.message,
    });
  }
};

/**
 * Get all categories
 */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await dbAll(
      `SELECT DISTINCT category FROM coupons WHERE category IS NOT NULL AND category != '' ORDER BY category`,
      []
    );

    res.json({
      success: true,
      data: categories.map((c: any) => c.category),
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

/**
 * Claim a coupon (add to customer wallet)
 */
export const claimCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = (req as any).user?.customerId; // Assumes auth middleware sets this

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Customer authentication required',
      });
    }

    // Check if coupon exists and is active
    const coupon = await dbGet(
      `SELECT * FROM coupons WHERE id = ? AND status = 'active'`,
      [id]
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found or not active',
      });
    }

    // Check if already claimed
    const existingClaim = await dbGet(
      `SELECT * FROM claimed_coupons WHERE coupon_id = ? AND customer_id = ?`,
      [id, customerId]
    );

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'Coupon already claimed',
      });
    }

    // Check if max redemptions reached
    if (coupon.max_redemptions && coupon.redeemed_count >= coupon.max_redemptions) {
      return res.status(400).json({
        success: false,
        message: 'Coupon redemption limit reached',
      });
    }

    // Claim the coupon
    await dbRun(
      `INSERT INTO claimed_coupons (coupon_id, customer_id, claimed_at, status) VALUES (?, ?, datetime('now'), 'active')`,
      [id, customerId]
    );

    res.json({
      success: true,
      message: 'Coupon claimed successfully',
    });
  } catch (error: any) {
    console.error('Error claiming coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim coupon',
      error: error.message,
    });
  }
};

/**
 * Get customer wallet (claimed coupons)
 */
export const getCustomerWallet = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.customerId;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Customer authentication required',
      });
    }

    const claimedCoupons = await dbAll(
      `
      SELECT
        cc.*,
        c.*,
        m.business_name as merchantName
      FROM claimed_coupons cc
      JOIN coupons c ON cc.coupon_id = c.id
      LEFT JOIN merchants m ON c.merchant_id = m.id
      WHERE cc.customer_id = ?
      ORDER BY cc.claimed_at DESC
      `,
      [customerId]
    );

    const formattedCoupons = claimedCoupons.map((item: any) => ({
      id: item.id,
      couponId: item.coupon_id,
      customerId: item.customer_id,
      claimedAt: item.claimed_at,
      status: item.status,
      coupon: {
        id: item.coupon_id,
        merchantId: item.merchant_id,
        code: item.code,
        title: item.title,
        description: item.description,
        discountType: item.discount_type,
        discountValue: item.discount_value,
        minPurchaseAmount: item.min_purchase_amount,
        maxDiscountAmount: item.max_discount_amount,
        maxRedemptions: item.max_redemptions,
        maxRedemptionsPerCustomer: item.max_redemptions_per_customer,
        redeemedCount: item.redeemed_count,
        startDate: item.start_date,
        endDate: item.end_date,
        category: item.category,
        termsConditions: item.terms_conditions,
        imageUrl: item.image_url,
        status: item.status,
        merchantName: item.merchantName,
      },
    }));

    res.json({
      success: true,
      data: formattedCoupons,
    });
  } catch (error: any) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
      error: error.message,
    });
  }
};
