import { Request, Response } from 'express';
import { dbAll, dbGet } from '../config/database';

export const browseCoupons = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT
        c.*,
        m.business_name as merchant_name
      FROM coupons c
      JOIN merchants m ON c.merchant_id = m.id
      WHERE c.status = 'active'
        AND c.start_date <= datetime('now')
        AND c.end_date >= datetime('now')
    `;

    const params: any[] = [];

    if (category) {
      query += ' AND c.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY c.created_at DESC';

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const coupons = await dbAll(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM coupons c WHERE c.status = "active"';
    const countParams: any[] = [];

    if (category) {
      countQuery += ' AND c.category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const countResult: any = await dbGet(countQuery, countParams);
    const total = countResult.total;

    res.json({
      coupons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error browsing coupons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCouponById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const coupon: any = await dbGet(
      `
      SELECT
        c.*,
        m.business_name as merchant_name,
        m.address as merchant_address
      FROM coupons c
      JOIN merchants m ON c.merchant_id = m.id
      WHERE c.id = ?
      `,
      [id]
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Error getting coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const coupon: any = await dbGet(
      `
      SELECT
        c.*,
        m.business_name as merchant_name
      FROM coupons c
      JOIN merchants m ON c.merchant_id = m.id
      WHERE c.code = ? AND c.status = 'active'
      `,
      [code]
    );

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Check if coupon is expired
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const endDate = new Date(coupon.end_date);

    if (now < startDate) {
      return res.status(400).json({ error: 'Coupon is not yet active' });
    }

    if (now > endDate) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    // Check if max redemptions reached
    if (coupon.max_redemptions && coupon.redeemed_count >= coupon.max_redemptions) {
      return res.status(400).json({ error: 'Coupon redemption limit reached' });
    }

    res.json({ valid: true, coupon });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<any> => {
  try {
    const categories = await dbAll(
      `
      SELECT DISTINCT category
      FROM coupons
      WHERE category IS NOT NULL
        AND category != ''
        AND status = 'active'
      ORDER BY category
      `
    );

    res.json(categories.map((c: any) => c.category));
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
