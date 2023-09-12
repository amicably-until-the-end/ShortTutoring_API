import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway()
export class EventGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    return payload;
  }

  @SubscribeMessage('set')
  async set(client: any, payload: any) {
    const { key, value } = JSON.parse(payload);
    await this.redisService.set(key, value);
    console.log('set', payload);
    return payload;
  }

  @SubscribeMessage('get')
  async get(client: any, payload: any) {
    const { key } = JSON.parse(payload);
    console.log('get', payload);
    return await this.redisService.get(key);
  }

  @SubscribeMessage('get-all')
  async getAll(client: any, payload: any) {
    console.log('get-all', payload);
    return await this.redisService.getAllKeys();
  }
}
