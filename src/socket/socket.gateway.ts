import { ChattingRepository } from '../chatting/chatting.repository';
import { Message } from '../chatting/entities/chatting.interface';
import { socketErrorWebhook } from '../config.discord-webhook';
import { RedisRepository } from '../redis/redis.repository';
import { SocketRepository } from './socket.repository';
import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { getMessaging } from 'firebase-admin/messaging';
import * as process from 'process';
import { RedisClientType } from 'redis';
import { Server } from 'socket.io';
import { User } from 'src/user/entities/user.interface';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chattingRepository: ChattingRepository,
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
      if (process.env.NODE_ENV === 'dev') {
        await this.redisSub.subscribe(client.id, (message) => {
          client.emit('message', message);
        });
      }

      // 접속 확인용 로그
      console.log(user.name, client.id);
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
   * 원하는 사용자의 정보를 가져오는 메소드
   * @param client
   */
  @SubscribeMessage('get-user-info')
  async getUserInfo(client: any) {
    try {
      return await this.socketRepository.getUserFromAuthorization(
        client.handshake.headers,
      );
    } catch (error) {
      const message = `사용자 정보를 가져올 수 없습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('사용자 정보를 가져올 수 없습니다.');
    }
  }

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드
   * @param client
   * @param payload
   */
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const { receiverId, chattingId, format, body } = payload;

    let sender: User;
    try {
      sender = await this.socketRepository.getUserFromAuthorization(
        client.handshake.headers,
      );
    } catch (error) {
      const message = `사용자를 찾을 수 없습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('사용자를 찾을 수 없습니다.');
    }

    // 소켓 메시지 전송
    try {
      // 메시지를 보낸 사용자의 정보를 가져옴
      const senderId = sender.id;

      // user에게 메시지 전송
      await this.sendMessageToUser(
        senderId,
        receiverId,
        chattingId,
        format,
        body,
      );
    } catch (error) {
      const message = `메시지를 전송할 수 없습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('메시지를 전송할 수 없습니다.');
    }

    // 푸시 알림 보내기
    try {
      const senderName = sender.name;
      const senderProfileImage = sender.profileImage;

      const receiverFCMToken = await this.redisRepository.getFCMToken(
        receiverId,
      );

      // 푸시 알림 전송
      await getMessaging().send({
        notification: {
          imageUrl: senderProfileImage,
          title: senderName,
          body: format === 'text' ? body : '새로운 메시지가 도착했습니다.',
        },
        token: receiverFCMToken,
      });
    } catch (error) {
      const message = `푸시 알림을 보낼 수 없습니다. ${error.message}`;

      await socketErrorWebhook.send(message);

      return new Error('푸시 알림을 보낼 수 없습니다.');
    }
  }

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드
   * @param senderId 메시지를 보내는 사용자의 ID
   * @param receiverId 메시지를 받는 사용자의 ID
   * @param chattingId 메시지를 보내는 채팅방의 ID
   * @param format 메시지의 형식 (text, appoint-request , ...)
   * @param body 메시지의 내용 (JSON 형식 ex: { "text" : "안녕하세요" } )
   */
  async sendMessageToUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const message: Message = {
      sender: senderId,
      format,
      body,
      createdAt: new Date().toISOString(),
    };
    const receiverSocketId = await this.redisRepository.getSocketId(receiverId);
    if (receiverSocketId != null) {
      this.sendMessageToSocketClient(receiverSocketId, chattingId, message);
    } else {
      //FCM 메시지 보내기
    }
    // TODO: 레디스 브로드캐스트
    // EC2서버에서 레디스가 잘 뿌려주는지 확인 필요
    await this.redisRepository.publish(
      receiverSocketId,
      JSON.stringify({ chattingId, message }),
    );

    // DynamoDB에 메시지 저장
    await this.chattingRepository.sendMessage(
      chattingId,
      senderId,
      format,
      body,
    );
  }

  async sendMessageToBothUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const message: Message = {
      sender: senderId,
      format,
      body,
      createdAt: new Date().toISOString(),
    };
    const receiverSocketId = await this.redisRepository.getSocketId(receiverId);

    if (receiverSocketId != null) {
      this.sendMessageToSocketClient(receiverSocketId, chattingId, message);
    } else {
      console.log('receiver is not online', receiverId);
      //TODO: FCM 메시지 보내기
    }
    const senderSocketId = await this.redisRepository.getSocketId(senderId);
    if (senderSocketId != null) {
      this.sendMessageToSocketClient(senderSocketId, chattingId, message);
    } else {
      console.log('sender is not online', senderId);
    }

    // TODO: 레디스 브로드캐스트
    // EC2서버에서 레디스가 잘 뿌려주는지 확인 필요
    await this.redisRepository.publish(
      receiverSocketId,
      JSON.stringify({ chattingId, message }),
    );

    await this.redisRepository.publish(
      senderSocketId,
      JSON.stringify({ chattingId, message }),
    );

    // DynamoDB에 메시지 저장
    await this.chattingRepository.sendMessage(
      chattingId,
      senderId,
      format,
      body,
    );
  }

  sendMessageToSocketClient(
    receiverSocketId: string,
    chattingId: string,
    message: Message,
  ) {
    this.server.to(receiverSocketId).emit('message', { chattingId, message });
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
