import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async get(key: string): Promise<any> {
    return await this.redis.get(key);
  }

  async getAllKeys(): Promise<any> {
    return await this.redis.keys('*');
  }

  async set(key: string, value: any, option?: any) {
    await this.redis.set(key, value, option);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
