import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const registerCustomer = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    // Validate input
    if (!password || (!email && !phone)) {
      return res.status(400).json({ error: 'Password and either email or phone are required' });
    }

    // Check if user already exists
    let existingUser;
    if (email) {
      existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    } else if (phone) {
      existingUser = await dbGet('SELECT * FROM users WHERE phone = ?', [phone]);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userResult: any = await dbRun(
      'INSERT INTO users (email, phone, password_hash, role, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [email || null, phone || null, passwordHash, 'customer', 1, 1]
    );

    const userId = userResult.lastID;

    // Create customer profile
    await dbRun(
      'INSERT INTO customers (user_id, first_name, last_name) VALUES (?, ?, ?)',
      [userId, firstName || null, lastName || null]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, role: 'customer', email, phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await dbRun(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt.toISOString()]
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        phone,
        role: 'customer',
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerMerchant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, businessName, businessType, phone, address } = req.body;

    // Validate input
    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'Email, password, and business name are required' });
    }

    // Check if user already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userResult: any = await dbRun(
      'INSERT INTO users (email, phone, password_hash, role, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [email, phone || null, passwordHash, 'merchant', 1, 1]
    );

    const userId = userResult.lastID;

    // Create merchant profile
    await dbRun(
      'INSERT INTO merchants (user_id, business_name, business_type, address, status) VALUES (?, ?, ?, ?, ?)',
      [userId, businessName, businessType || null, address || null, 'approved']
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, role: 'merchant', email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await dbRun(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt.toISOString()]
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        role: 'merchant',
        businessName,
      },
    });
  } catch (error) {
    console.error('Error registering merchant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if (!password || (!email && !phone)) {
      return res.status(400).json({ error: 'Password and either email or phone are required' });
    }

    // Find user
    let user: any;
    if (email) {
      user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    } else if (phone) {
      user = await dbGet('SELECT * FROM users WHERE phone = ?', [phone]);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, phone: user.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await dbRun(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt.toISOString()]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await dbRun('DELETE FROM sessions WHERE token = ?', [token]);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
