import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    reconnectStrategy: false, // Disable automatic reconnection
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

let redisConnected = false;

redisClient.on('error', (err) => {
  // Only log errors if we successfully connected before
  if (redisConnected) {
    console.error('Redis Client Error', err);
  }
});

redisClient.on('connect', () => {
  redisConnected = true;
  console.log('✅ Connected to Redis');
});

redisClient.on('ready', () => console.log('✅ Redis client ready'));

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    redisConnected = true;
  } catch (error) {
    console.log('⚠️  Redis not available - continuing without cache');
    // Don't log the full error stack to avoid cluttering the logs
  }
};

export const disconnectRedis = async (): Promise<void> => {
  await redisClient.quit();
  console.log('✅ Redis connection closed');
};

export { redisClient };
