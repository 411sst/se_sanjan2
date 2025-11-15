import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis'));
redisClient.on('ready', () => console.log('✅ Redis client ready'));

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    console.log('⚠️  Continuing without Redis cache...');
  }
};

export const disconnectRedis = async (): Promise<void> => {
  await redisClient.quit();
  console.log('✅ Redis connection closed');
};

export { redisClient };
