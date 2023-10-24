import { Inject, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { RedisClientType } from 'redis';
import { Server } from 'socket.io';

const ttl = 60 * 60 * 24;

@Injectable()
export class RedisRepository {
  @WebSocketServer()
  server: Server;

  constructor(@Inject('REDIS_PUB') private redisPub: RedisClientType) {}

  /*
   REDIS_PUB
   */
  async set(key: string, value: any) {
    await this.redisPub.set(key, value);
  }

  async hSet(key: string, value: any) {
    await this.redisPub.hSet(key, value);
  }

  async setSocketId(key: string, value: any) {
    await this.redisPub.hSet(key, {
      socketId: value,
    });
  }

  async setFCMToken(key: string, value: any) {
    await this.redisPub.hSet(key, {
      fcmToken: value,
    });
  }

  async setRole(key: string, value: any) {
    await this.redisPub.hSet(key, {
      role: value,
    });
  }

  async get(key: string): Promise<any> {
    return await this.redisPub.get(key);
  }

  async hGetAll(key: string): Promise<any> {
    return await this.redisPub.hGetAll(key);
  }

  async getSocketId(key: string): Promise<any> {
    return await this.redisPub.hGet(key, 'socketId');
  }

  async getFCMToken(key: string): Promise<any> {
    return await this.redisPub.hGet(key, 'fcmToken');
  }

  async getRole(key: string): Promise<any> {
    return await this.redisPub.hGet(key, 'role');
  }

  async getAllKeys() {
    return await this.redisPub.keys('*');
  }

  async del(key: string) {
    await this.redisPub.del(key);
  }

  async delAll() {
    await this.redisPub.flushAll();
  }

  async delSocketId(key: string) {
    await this.redisPub.hDel(key, 'socketId');
  }

  async push(key: string, value: any) {
    await this.redisPub.rPush(key, value);
  }

  async publish(channel: string, message: string) {
    await this.redisPub.publish(channel, message);
  }
}
