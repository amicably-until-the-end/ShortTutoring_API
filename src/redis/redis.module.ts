import { redisProvider } from '../config.redis';
import { RedisRepository } from './redis.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      store: 'redis',
      isGlobal: true,
    }),
  ],
  providers: [RedisRepository, redisProvider],
  exports: [RedisRepository, redisProvider],
})
export class RedisModule {}
