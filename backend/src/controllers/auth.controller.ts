import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

/**
 * Generate JWT token
 */
const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Merchant Registration
 */
export const registerMerchant = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      businessName,
      businessType,
      taxId,
      address,
      city,
      state,
      zipCode,
      country,
      description,
    } = req.body;

    // Validate required fields
    if (!email || !password || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and business name are required',
      });
    }

    // Check if user already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userResult = await dbRun(
      `INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES (?, ?, 'merchant', 0, 1)`,
      [email, passwordHash]
    );

    const userId = userResult.lastID;

    // Create merchant profile
    await dbRun(
      `INSERT INTO merchants (
        user_id, business_name, business_type, tax_id, address, city, state, zip_code, country, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, businessName, businessType, taxId, address, city, state, zipCode, country || 'India', description]
    );

    // Generate token
    const token = generateToken(userId, 'merchant');

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          role: 'merchant',
        },
        token,
      },
      message: 'Merchant registered successfully',
    });
  } catch (error: any) {
    console.error('Error in merchant registration:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Merchant Login
 */
export const loginMerchant = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await dbGet(
      `SELECT * FROM users WHERE email = ? AND role = 'merchant'`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Error in merchant login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Request OTP for customer login
 */
export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, type } = req.body;

    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and type are required',
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    const field = type === 'email' ? 'email' : 'phone';
    let user = await dbGet(`SELECT * FROM users WHERE ${field} = ? AND role = 'customer'`, [identifier]);

    // If user doesn't exist, create a new customer
    if (!user) {
      const userResult = await dbRun(
        `INSERT INTO users (${field}, role, is_verified, is_active) VALUES (?, 'customer', 0, 1)`,
        [identifier]
      );
      const userId = userResult.lastID;

      // Create customer profile
      await dbRun(
        `INSERT INTO customers (user_id) VALUES (?)`,
        [userId]
      );

      user = { id: userId };
    }

    // Store OTP
    await dbRun(
      `INSERT INTO otps (identifier, otp_code, purpose, expires_at, is_used, attempts) VALUES (?, ?, 'login', ?, 0, 0)`,
      [identifier, otpCode, expiresAt.toISOString()]
    );

    // TODO: Send OTP via email/SMS
    // For now, we'll just log it (in development)
    console.log(`OTP for ${identifier}: ${otpCode}`);

    res.json({
      success: true,
      message: `OTP sent to your ${type}`,
      data: {
        expiresIn: 600, // 10 minutes in seconds
      },
      // In development, include OTP in response
      ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
    });
  } catch (error: any) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};

/**
 * Verify OTP and login customer
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, otpCode, purpose } = req.body;

    if (!identifier || !otpCode || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Identifier, OTP code, and purpose are required',
      });
    }

    // Find OTP
    const otp = await dbGet(
      `SELECT * FROM otps
       WHERE identifier = ?
       AND otp_code = ?
       AND purpose = ?
       AND is_used = 0
       AND datetime(expires_at) > datetime('now')
       ORDER BY created_at DESC
       LIMIT 1`,
      [identifier, otpCode, purpose]
    );

    if (!otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark OTP as used
    await dbRun(`UPDATE otps SET is_used = 1 WHERE id = ?`, [otp.id]);

    // Find user
    const user = await dbGet(
      `SELECT * FROM users WHERE (email = ? OR phone = ?) AND role = 'customer'`,
      [identifier, identifier]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Mark user as verified
    await dbRun(`UPDATE users SET is_verified = 1 WHERE id = ?`, [user.id]);

    // Get customer details
    const customer = await dbGet(`SELECT * FROM customers WHERE user_id = ?`, [user.id]);

    // Generate token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const user = await dbGet('SELECT id, email, phone, role, is_verified FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

/**
 * Logout
 */
export const logout = async (_req: Request, res: Response) => {
  // In a real implementation, you might want to:
  // - Invalidate the token in a blacklist
  // - Delete the session from database
  // For JWT, logout is typically handled client-side
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
