import api from './api';

export interface RegisterCustomerData {
  email?: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterMerchantData {
  email: string;
  password: string;
  businessName: string;
  businessType?: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email?: string;
    phone?: string;
    role: string;
  };
}

const authService = {
  registerCustomer: async (data: RegisterCustomerData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/customer', data);
    return response.data;
  },

  registerMerchant: async (data: RegisterMerchantData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/merchant', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  sendOTP: async (phone: string) => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  verifyOTP: async (phone: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
};

export default authService;
