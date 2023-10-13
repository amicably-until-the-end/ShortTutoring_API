import { socketErrorWebhook, webhook } from '../config.discord-webhook';
import { RedisRepository } from '../redis/redis.repository';
import { SocketRepository } from './socket.repository';
import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as process from 'process';
import { RedisClientType } from 'redis';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly socketRepository: SocketRepository,
    @Inject('REDIS_SUB') private redisSub: RedisClientType,
  ) {}

  /**
   * 클라이언트가 소켓에 연결되었을 때 실행되는 메소드
   * @param client
   */
  async handleConnection(client: any) {
    try {
      const user = await this.socketRepository.getUserFromAuthorization(
        client.handshake.headers,
      );

      await this.redisRepository.setSocketId(user.id, client.id);
      if (process.env.NODE_ENV === 'local') {
        return null;
      }

      await this.redisSub.subscribe(client.id, (message) => {
        client.emit('message', message);
      });
      await webhook.send(
        `${user.id}(${user.role})이 ` +
          process.env.NODE_ENV +
          ' 서버에 연결되었습니다.',
      );
    } catch (error) {
      const message = `소켓 연결에 실패했습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('소켓 연결에 실패했습니다.');
    }
  }

  /**
   * 클라이언트가 소켓 연결을 끊었을 때 실행되는 메소드
   * @param client
   */
  async handleDisconnect(client: any) {
    try {
      const user = await this.socketRepository.getUserFromAuthorization(
        client.handshake.headers,
      );

      await this.redisRepository.delSocketId(user.id);
      await this.redisSub.unsubscribe(client.id);
    } catch (error) {
      const message = `소켓 연결을 끊을 수 없습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('소켓 연결을 끊을 수 없습니다.');
    }
  }

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드
   * 푸시 알림 전송 및 소켓 메시지 전송
   * @param client
   * @param payload
   */
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const { receiverId, chattingId, format, body } = payload;

    const sender = await this.socketRepository.getUserFromAuthorization(
      client.handshake.headers,
    );
    if (sender === null) {
      const message = `사용자를 찾을 수 없습니다.`;

      await socketErrorWebhook.send(message);

      return new Error('사용자를 찾을 수 없습니다.');
    }

    // 푸시 알림 전송
    await this.socketRepository.sendPushMessageToUser(
      sender.id,
      receiverId,
      chattingId,
      format,
      body,
    );

    // 소켓 메시지 전송
    await this.socketRepository.sendMessageToUser(
      sender.id,
      receiverId,
      chattingId,
      format,
      body,
    );
  }

  /**
   * 디버깅용 메소드
   * 현재 서버에 접속한 클라이언트의 소켓 정보 및 레디스에 저장된 키 목록을 가져옴
   */
  @SubscribeMessage('debug')
  async handleDebug() {
    try {
      console.log(this.server.sockets.adapter.rooms);
      return this.redisRepository.getAllKeys();
    } catch (error) {
      const message = `디버깅에 실패했습니다. ${error.message}`;

      console.log(message);
      await socketErrorWebhook.send(message);

      return new Error('디버깅에 실패했습니다.');
    }
  }
}
