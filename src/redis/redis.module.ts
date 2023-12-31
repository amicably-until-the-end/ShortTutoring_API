import { redisPubProvider } from '../config.redis';
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
  providers: [RedisRepository, redisPubProvider],
  exports: [RedisRepository],
})
export class RedisModule {}
