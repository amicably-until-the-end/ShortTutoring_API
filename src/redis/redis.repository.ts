import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as process from 'process';
import { RedisClientType } from 'redis';

const ttl = 60 * 60 * 24;

@Injectable()
export class RedisRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
  ) {}

  async subscribe(channel: string) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 Pub/Sub은 게이트웨이 단에서 구현함
    } else {
      await this.redis.subscribe(channel, (message) => {
        console.log('message : ', message);
      });
    }
  }

  async unsubscribe(channel: string) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 Pub/Sub은 게이트웨이 단에서 구현함
    } else {
      await this.redis.unsubscribe(channel);
    }
  }

  async set(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.set(key, value, ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

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

  async del(key: string) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.del(key);
    } else {
      await this.redis.del(key);
    }
  }

  async push(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      const currentValue: Array<any> = await this.cache.get(key);
      if (currentValue === undefined) {
        await this.cache.set(key, [value], ttl);
      } else {
        currentValue.push(value);
        await this.cache.set(key, currentValue);
      }
    } else {
      await this.redis.rPush(key, value);
    }
  }

  async publish(channel: string, message: string) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 Pub/Sub은 게이트웨이 단에서 구현함
    } else {
      await this.redis.publish(channel, message);
    }
  }
}
