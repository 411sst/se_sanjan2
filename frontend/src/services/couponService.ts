import api from './api';

export interface Coupon {
  id: number;
  merchant_id: number;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  category?: string;
  tags?: string;
  image_url?: string;
  status: string;
  redeemed_count?: number;
  max_redemptions?: number;
}

export interface BrowseCouponsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const couponService = {
  browseCoupons: async (params?: BrowseCouponsParams) => {
    const response = await api.get('/coupons', { params });
    return response.data;
  },

  getCouponById: async (id: number) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  validateCoupon: async (code: string) => {
    const response = await api.post('/coupons/validate', { code });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/coupons/categories');
    return response.data;
  },
};

export default couponService;
