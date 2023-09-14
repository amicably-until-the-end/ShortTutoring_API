import * as dotenv from 'dotenv';
import process from 'process';
import { createClient } from 'redis';

dotenv.config();

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    if (process.env.NODE_ENV === 'local') {
      return null;
    }
    const client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    await client.connect();
    return client;
  },
};
