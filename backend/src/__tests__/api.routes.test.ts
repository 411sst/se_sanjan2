import request from 'supertest';
import app from '../server';

describe('API Routes', () => {
  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/v1/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });

  describe('Auth Routes', () => {
    it('POST /api/v1/auth/login should respond', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'test123' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /api/v1/auth/register/merchant should respond', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register/merchant')
        .send({ email: 'merchant@test.com', password: 'test123' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /api/v1/auth/register/customer should respond', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register/customer')
        .send({ email: 'customer@test.com', password: 'test123' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Coupon Routes (Public)', () => {
    it('GET /api/v1/coupons should respond', async () => {
      const response = await request(app).get('/api/v1/coupons');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('GET /api/v1/coupons/categories should respond', async () => {
      const response = await request(app).get('/api/v1/coupons/categories');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('GET /api/v1/coupons/:id should respond', async () => {
      const response = await request(app).get('/api/v1/coupons/test-id');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Merchant Routes', () => {
    it('GET /api/v1/merchants/profile should respond', async () => {
      const response = await request(app).get('/api/v1/merchants/profile');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('GET /api/v1/merchants/coupons should respond', async () => {
      const response = await request(app).get('/api/v1/merchants/coupons');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /api/v1/merchants/coupons should respond', async () => {
      const response = await request(app)
        .post('/api/v1/merchants/coupons')
        .send({ title: 'Test Coupon' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Customer Routes', () => {
    it('GET /api/v1/customers/profile should respond', async () => {
      const response = await request(app).get('/api/v1/customers/profile');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('GET /api/v1/customers/wallet should respond', async () => {
      const response = await request(app).get('/api/v1/customers/wallet');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('GET /api/v1/customers/redemptions should respond', async () => {
      const response = await request(app).get('/api/v1/customers/redemptions');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
