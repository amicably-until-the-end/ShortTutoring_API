import * as dotenv from 'dotenv';
import * as process from 'process';
import { createClient } from 'redis';

dotenv.config();

export const redisPubProvider = {
  provide: 'REDIS_PUB',
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

export const redisSubProvider = {
  provide: 'REDIS_SUB',
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
