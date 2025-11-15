import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database/couponify.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create database connection
export const db = new Database(DB_PATH, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Configure WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize database schema
export const initializeDatabase = (): void => {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL CHECK(role IN ('admin', 'merchant', 'customer')),
      is_verified INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Merchants table
    CREATE TABLE IF NOT EXISTS merchants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      business_name TEXT NOT NULL,
      business_type TEXT,
      tax_id TEXT UNIQUE,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      country TEXT DEFAULT 'India',
      description TEXT,
      logo_url TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'suspended')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      first_name TEXT,
      last_name TEXT,
      date_of_birth DATE,
      gender TEXT CHECK(gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
      profile_image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Coupons table
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      merchant_id INTEGER NOT NULL,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed')),
      discount_value REAL NOT NULL,
      min_purchase_amount REAL DEFAULT 0,
      max_discount_amount REAL,
      max_redemptions INTEGER,
      max_redemptions_per_customer INTEGER DEFAULT 1,
      redeemed_count INTEGER DEFAULT 0,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      category TEXT,
      tags TEXT,
      terms_conditions TEXT,
      image_url TEXT,
      qr_code_url TEXT,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'paused', 'expired', 'deleted')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
    );

    -- Claimed coupons (customer wallet)
    CREATE TABLE IF NOT EXISTS claimed_coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'redeemed', 'expired')),
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE(coupon_id, customer_id)
    );

    -- Redemptions table
    CREATE TABLE IF NOT EXISTS redemptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      merchant_id INTEGER NOT NULL,
      transaction_amount REAL,
      discount_amount REAL NOT NULL,
      verification_method TEXT DEFAULT 'qr_otp' CHECK(verification_method IN ('qr_otp', 'code', 'manual')),
      otp_code TEXT,
      otp_verified INTEGER DEFAULT 0,
      device_info TEXT,
      ip_address TEXT,
      location TEXT,
      redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
    );

    -- OTP table for authentication and verification
    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK(purpose IN ('login', 'registration', 'redemption', 'password_reset')),
      expires_at DATETIME NOT NULL,
      is_used INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('coupon_new', 'coupon_expiring', 'redemption_success', 'campaign_start', 'campaign_end', 'system')),
      channel TEXT NOT NULL CHECK(channel IN ('email', 'sms', 'push', 'in_app')),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed', 'read')),
      sent_at DATETIME,
      read_at DATETIME,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Audit logs table
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      changes TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Sessions table
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      refresh_token TEXT UNIQUE,
      device_info TEXT,
      ip_address TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);
    CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
    CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
    CREATE INDEX IF NOT EXISTS idx_coupons_merchant_id ON coupons(merchant_id);
    CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
    CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
    CREATE INDEX IF NOT EXISTS idx_coupons_dates ON coupons(start_date, end_date);
    CREATE INDEX IF NOT EXISTS idx_claimed_coupons_customer ON claimed_coupons(customer_id);
    CREATE INDEX IF NOT EXISTS idx_claimed_coupons_coupon ON claimed_coupons(coupon_id);
    CREATE INDEX IF NOT EXISTS idx_redemptions_customer ON redemptions(customer_id);
    CREATE INDEX IF NOT EXISTS idx_redemptions_merchant ON redemptions(merchant_id);
    CREATE INDEX IF NOT EXISTS idx_redemptions_coupon ON redemptions(coupon_id);
    CREATE INDEX IF NOT EXISTS idx_otps_identifier ON otps(identifier);
    CREATE INDEX IF NOT EXISTS idx_otps_purpose ON otps(purpose);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `);

  console.log('✅ Database schema initialized successfully');
};

// Close database connection
export const closeDatabase = (): void => {
  db.close();
  console.log('✅ Database connection closed');
};

// Handle cleanup on exit
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});
