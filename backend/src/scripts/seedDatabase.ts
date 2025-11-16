import { dbRun, initializeDatabase } from '../config/database';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Initialize database first
    await initializeDatabase();

    // Create a sample merchant
    const password = await bcrypt.hash('password123', 10);
    const userResult: any = await dbRun(
      'INSERT INTO users (email, password_hash, role, is_verified, is_active) VALUES (?, ?, ?, ?, ?)',
      ['merchant@example.com', password, 'merchant', 1, 1]
    );

    const merchantUserId = userResult.lastID;

    const merchantResult: any = await dbRun(
      'INSERT INTO merchants (user_id, business_name, business_type, address, status) VALUES (?, ?, ?, ?, ?)',
      [merchantUserId, 'Demo Restaurant & Cafe', 'Restaurant', '123 Main St, City', 'approved']
    );

    const merchantId = merchantResult.lastID;

    // Create sample coupons
    const coupons = [
      {
        code: 'WELCOME20',
        title: '20% Off Your First Order',
        description: 'Get 20% off on your first purchase. Valid for new customers only.',
        discount_type: 'percentage',
        discount_value: 20,
        min_purchase_amount: 50,
        max_discount_amount: 100,
        category: 'Food',
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 100,
      },
      {
        code: 'SAVE50',
        title: '$50 Off on Orders Above $200',
        description: 'Save $50 when you spend $200 or more on dining.',
        discount_type: 'fixed',
        discount_value: 50,
        min_purchase_amount: 200,
        category: 'Food',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 50,
      },
      {
        code: 'LUNCH15',
        title: '15% Off Lunch Special',
        description: 'Enjoy 15% off on all lunch items between 11 AM and 3 PM.',
        discount_type: 'percentage',
        discount_value: 15,
        min_purchase_amount: 30,
        max_discount_amount: 50,
        category: 'Food',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 200,
      },
      {
        code: 'COFFEE10',
        title: '$10 Off Coffee & Beverages',
        description: 'Get $10 off on any coffee or beverage purchase.',
        discount_type: 'fixed',
        discount_value: 10,
        min_purchase_amount: 20,
        category: 'Beverages',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 150,
      },
      {
        code: 'FAMILY25',
        title: '25% Off Family Meals',
        description: 'Perfect for family dining! Get 25% off on family meal combos.',
        discount_type: 'percentage',
        discount_value: 25,
        min_purchase_amount: 100,
        max_discount_amount: 150,
        category: 'Food',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 75,
      },
      {
        code: 'DESSERT20',
        title: '20% Off All Desserts',
        description: 'Satisfy your sweet tooth! Get 20% off on all dessert items.',
        discount_type: 'percentage',
        discount_value: 20,
        min_purchase_amount: 15,
        max_discount_amount: 30,
        category: 'Desserts',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        max_redemptions: 100,
      },
    ];

    for (const coupon of coupons) {
      await dbRun(
        `INSERT INTO coupons (
          merchant_id, code, title, description, discount_type, discount_value,
          min_purchase_amount, max_discount_amount, max_redemptions,
          start_date, end_date, category, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          merchantId,
          coupon.code,
          coupon.title,
          coupon.description,
          coupon.discount_type,
          coupon.discount_value,
          coupon.min_purchase_amount,
          coupon.max_discount_amount || null,
          coupon.max_redemptions,
          coupon.start_date,
          coupon.end_date,
          coupon.category,
          'active',
        ]
      );
      console.log(`✅ Created coupon: ${coupon.title}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample Merchant Login:');
    console.log('  Email: merchant@example.com');
    console.log('  Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
