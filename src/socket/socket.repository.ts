import { AuthRepository } from '../auth/auth.repository';
import { ChattingRepository } from '../chatting/chatting.repository';
import { Message } from '../chatting/entities/chatting.interface';
import { RedisRepository } from '../redis/redis.repository';
import { UserRepository } from '../user/user.repository';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { getMessaging } from 'firebase-admin/messaging';
import { Server } from 'socket.io';

@Injectable()
export class SocketRepository {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
    private readonly chattingRepository: ChattingRepository,
  ) {}

  async getUserFromAuthorization(headers: any) {
    const { authorization } = headers;

    try {
      const { userId } = this.authRepository.decodeJwt(
        authorization.replace('Bearer ', ''),
      );

      return await this.userRepository.get(userId);
    } catch (error) {
      return null;
    }
  }

  /**
   * 다른 사용자에게 푸시 메시지를 보내는 메소드
   * @param senderId
   * @param receiverId
   * @param chattingId
   * @param format
   * @param body
   */
  async sendPushMessageToUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const receiverFCMToken = await this.redisRepository.getFCMToken(receiverId);
    if (receiverFCMToken != null) {
      await getMessaging().send({
        data: {
          chattingId,
          sender: senderId,
          format,
          body,
          createdAt: new Date().toISOString(),
          type: 'chatting',
        },
        token: receiverFCMToken,
      });
    }
  }

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드 , 연결된 소켓이 있으면 소켓 전송, 레디스에 브로드캐스트, DynamoDB에 저장
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

    // 레디스 브로드캐스트
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

    await this.sendPushMessageToUser(
      senderId,
      receiverId,
      chattingId,
      format,
      body,
    );

    const senderSocketId = await this.redisRepository.getSocketId(senderId);

    // 레디스 브로드캐스트
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
}
