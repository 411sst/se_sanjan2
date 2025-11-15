import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface CouponState {
  coupons: Coupon[];
  wallet: Coupon[];
  selectedCoupon: Coupon | null;
  loading: boolean;
}

const initialState: CouponState = {
  coupons: [],
  wallet: [],
  selectedCoupon: null,
  loading: false,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.coupons = action.payload;
    },
    setWallet: (state, action: PayloadAction<Coupon[]>) => {
      state.wallet = action.payload;
    },
    setSelectedCoupon: (state, action: PayloadAction<Coupon | null>) => {
      state.selectedCoupon = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCoupons, setWallet, setSelectedCoupon, setLoading } = couponSlice.actions;
export default couponSlice.reducer;
