import request from 'supertest';
import app from '../server';

describe('Health Check Endpoint', () => {
  it('should return 200 OK status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  it('should return health status object', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  it('should return valid timestamp', async () => {
    const response = await request(app).get('/health');
    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.getTime()).toBeGreaterThan(0);
  });

  it('should return non-negative uptime', async () => {
    const response = await request(app).get('/health');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
