import { ChattingRepository } from '../chatting/chatting.repository';
import { Message } from '../chatting/entities/chatting.interface';
import { RedisRepository } from '../redis/redis.repository';
import { SocketRepository } from './socket.repository';
import { Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisClientType } from 'redis';
import { Server } from 'socket.io';

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
    const user = await this.socketRepository.getUserFromAuthorization(
      client.handshake.headers,
    );

    await this.redisRepository.set(user.id, client.id);
    await this.redisSub.subscribe(client.id, (message) => {
      client.emit('message', message);
      console.log(message);
    });

    // 접속 확인용 로그
    console.log(user.name, client.id);
  }

  /**
   * 클라이언트가 소켓 연결을 끊었을 때 실행되는 메소드
   * @param client
   */
  async handleDisconnect(client: any) {
    const user = await this.socketRepository.getUserFromAuthorization(
      client.handshake.headers,
    );

    await this.redisRepository.del(user.id);
    await this.redisRepository.unsubscribe(client.id);
  }

  /**
   * 원하는 역할의 온라인 사용자 목록을 가져오는 메소드
   * @param client
   * @param payload
   */
  @SubscribeMessage('get-role-participants')
  async getRoleParticipants(client: any, payload: any) {
    const { role } = payload;
    return await this.redisRepository.get(role);
  }

  /**
   * 원하는 사용자의 정보를 가져오는 메소드
   * @param client
   */
  @SubscribeMessage('get-user-info')
  async getUserInfo(client: any) {
    return await this.socketRepository.getUserFromAuthorization(
      client.handshake.headers,
    );
  }

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드
   * @param client
   * @param payload
   */
  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const { receiverId, chattingId, format, body } = payload;
    const sender = await this.socketRepository
      .getUserFromAuthorization(client.handshake.headers)
      .then((user) => user.id);

    await this.sendMessageToUser(sender, receiverId, chattingId, format, body);
  }

  /*
   * 다른 사용자에게 메시지를 전송하는 메소드
   * @param senderId : 메시지를 보내는 사용자의 ID
   * @param receiverId : 메시지를 받는 사용자의 ID
   * @param chattingId : 메시지를 보내는 채팅방의 ID
   * @param format : 메시지의 형식 (text, appoint-request , ...)
   * @param body : 메시지의 내용 (JSON 형식 ex: { "text" : "안녕하세요" } )
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
    const receiverSocketId = await this.redisRepository.get(receiverId);
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
  handleDebug() {
    console.log(this.server.sockets.adapter.rooms);
    return this.redisRepository.getAllKeys();
  }
}
