import * as dotenv from 'dotenv';
import * as process from 'process';
import { createClient } from 'redis';

dotenv.config();

export const redisPubProvider = {
  provide: 'REDIS_PUB',
  useFactory: async () => {
    if (process.env.NODE_ENV != 'local') {
      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST_LOCAL,
          port: Number(process.env.REDIS_PORT_LOCAL),
        },
      });
      await client.connect();
      return client;
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
    if (process.env.NODE_ENV !== 'prod') {
      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST_LOCAL,
          port: Number(process.env.REDIS_PORT_LOCAL),
        },
      });
      await client.connect();
      return client;
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
