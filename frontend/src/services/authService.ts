import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterMerchantRequest {
  email: string;
  password: string;
  businessName: string;
  businessType?: string;
  taxId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
}

export interface OTPLoginRequest {
  identifier: string; // email or phone
  type: 'email' | 'phone';
}

export interface OTPVerifyRequest {
  identifier: string;
  otpCode: string;
  purpose: 'login' | 'registration' | 'redemption' | 'password_reset';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email?: string;
      phone?: string;
      role: 'admin' | 'merchant' | 'customer';
    };
    token: string;
  };
  message?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    expiresIn: number;
  };
}

const authService = {
  // Merchant login with email/password
  loginMerchant: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/merchant/login', data);
    return response.data;
  },

  // Merchant registration
  registerMerchant: async (data: RegisterMerchantRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/merchant/register', data);
    return response.data;
  },

  // Customer - Request OTP
  requestOTP: async (data: OTPLoginRequest): Promise<OTPResponse> => {
    const response = await api.post('/auth/otp/request', data);
    return response.data;
  },

  // Customer - Verify OTP and login
  verifyOTP: async (data: OTPVerifyRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/otp/verify', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;
