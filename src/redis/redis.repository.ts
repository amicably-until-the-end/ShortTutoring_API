import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import * as process from 'process';
import { RedisClientType } from 'redis';
import { Server } from 'socket.io';

const ttl = 60 * 60 * 24;

@Injectable()
export class RedisRepository {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject('REDIS_PUB') private redisPub: RedisClientType,
  ) {}

  /*
   REDIS_PUB
   */
  async set(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.set(key, value, ttl);
    } else {
      await this.redisPub.set(key, value);
    }
  }

  async hSet(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      await this.redisPub.hSet(key, value);
    }
  }

  async setSocketId(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      await this.redisPub.hSet(key, {
        socketId: value,
      });
    }
  }

  async setFCMToken(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      await this.redisPub.hSet(key, {
        fcmToken: value,
      });
    }
  }

  async setRole(key: string, value: any) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      await this.redisPub.hSet(key, {
        role: value,
      });
    }
  }

  async get(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      return await this.cache.get(key);
    } else {
      return await this.redisPub.get(key);
    }
  }

  async hGetAll(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      return await this.redisPub.hGetAll(key);
    }
  }

  async getSocketId(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      return await this.redisPub.hGet(key, 'socketId');
    }
  }

  async getFCMToken(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      return await this.redisPub.hGet(key, 'fcmToken');
    }
  }

  async getRole(key: string): Promise<any> {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      return await this.redisPub.hGet(key, 'role');
    }
  }

  async getAllKeys() {
    if (process.env.NODE_ENV === 'local') {
      return await this.cache.store.keys();
    } else {
      return await this.redisPub.keys('*');
    }
  }

  async del(key: string) {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.del(key);
    } else {
      await this.redisPub.del(key);
    }
  }

  async delAll() {
    if (process.env.NODE_ENV === 'local') {
      await this.cache.reset();
    } else {
      await this.redisPub.flushAll();
    }
  }

  async delSocketId(key: string) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 캐시엔 해시맵 없나?
    } else {
      await this.redisPub.hDel(key, 'socketId');
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
      await this.redisPub.rPush(key, value);
    }
  }

  async publish(channel: string, message: string) {
    if (process.env.NODE_ENV === 'local') {
      // 로컬 Pub/Sub은 게이트웨이 단에서 구현함
    } else {
      await this.redisPub.publish(channel, message);
    }
  }
}
