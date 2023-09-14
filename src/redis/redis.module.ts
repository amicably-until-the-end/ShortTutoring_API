import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

dotenv.config();

export const redisProvider = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      });
      await client.connect();
      return client;
    },
  },
];

@Module({
  imports: [],
  providers: [RedisService, ...redisProvider],
  exports: [RedisService, ...redisProvider],
})
export class RedisModule {}
