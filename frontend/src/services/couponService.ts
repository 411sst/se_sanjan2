import api from './api';

export interface Coupon {
  id: number;
  merchantId: number;
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  maxRedemptions?: number;
  maxRedemptionsPerCustomer?: number;
  redeemedCount: number;
  startDate: string;
  endDate: string;
  category?: string;
  tags?: string;
  termsConditions?: string;
  imageUrl?: string;
  qrCodeUrl?: string;
  status: 'draft' | 'active' | 'paused' | 'expired' | 'deleted';
  createdAt?: string;
  updatedAt?: string;
  merchantName?: string;
}

export interface CreateCouponRequest {
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  maxRedemptions?: number;
  maxRedemptionsPerCustomer?: number;
  startDate: string;
  endDate: string;
  category?: string;
  tags?: string;
  termsConditions?: string;
  imageUrl?: string;
}

export interface ClaimedCoupon {
  id: number;
  couponId: number;
  customerId: number;
  claimedAt: string;
  status: 'active' | 'redeemed' | 'expired';
  coupon: Coupon;
}

export interface RedeemCouponRequest {
  couponId: number;
  transactionAmount?: number;
}

const couponService = {
  // Get all active coupons (for browsing)
  getAllCoupons: async (filters?: {
    category?: string;
    merchantId?: number;
    search?: string;
  }) => {
    const response = await api.get('/coupons', { params: filters });
    return response.data;
  },

  // Get coupon by ID
  getCouponById: async (id: number) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  // Claim a coupon (add to wallet)
  claimCoupon: async (couponId: number) => {
    const response = await api.post(`/coupons/${couponId}/claim`);
    return response.data;
  },

  // Get customer wallet (claimed coupons)
  getWallet: async () => {
    const response = await api.get('/customer/wallet');
    return response.data;
  },

  // Redeem coupon - Request OTP
  requestRedemptionOTP: async (couponId: number) => {
    const response = await api.post(`/coupons/${couponId}/redeem/request-otp`);
    return response.data;
  },

  // Redeem coupon - Verify OTP and complete
  redeemCoupon: async (couponId: number, data: { otpCode: string; transactionAmount?: number }) => {
    const response = await api.post(`/coupons/${couponId}/redeem`, data);
    return response.data;
  },

  // MERCHANT ENDPOINTS

  // Get merchant's coupons
  getMerchantCoupons: async () => {
    const response = await api.get('/merchant/coupons');
    return response.data;
  },

  // Create new coupon
  createCoupon: async (data: CreateCouponRequest) => {
    const response = await api.post('/merchant/coupons', data);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (id: number, data: Partial<CreateCouponRequest>) => {
    const response = await api.put(`/merchant/coupons/${id}`, data);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id: number) => {
    const response = await api.delete(`/merchant/coupons/${id}`);
    return response.data;
  },

  // Get coupon analytics
  getCouponAnalytics: async (id: number) => {
    const response = await api.get(`/merchant/coupons/${id}/analytics`);
    return response.data;
  },

  // Get merchant dashboard stats
  getMerchantStats: async () => {
    const response = await api.get('/merchant/stats');
    return response.data;
  },

  // Verify redemption (merchant side)
  verifyRedemption: async (redemptionId: number) => {
    const response = await api.post(`/merchant/redemptions/${redemptionId}/verify`);
    return response.data;
  },
};

export default couponService;
