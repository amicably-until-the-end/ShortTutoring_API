import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
import * as process from 'process';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
  ) {}

  async get(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      return await this.cache.get(key);
    } else {
      return await this.redis.get(key);
    }
  }

  async getAllKeys(): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      return await this.cache.store.keys();
    } else {
      return await this.redis.keys('*');
    }
  }

  async set(key: string, value: any, option?: any) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.set(key, value, option);
    } else {
      await this.redis.set(key, value, option);
    }
  }

  async del(key: string) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.del(key);
    } else {
      await this.redis.del(key);
    }
  }
}
