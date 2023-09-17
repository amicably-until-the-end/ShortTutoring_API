import { RedisRepository } from '../redis/redis.repository';
import { SocketRepository } from './socket.repository';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly socketRepository: SocketRepository,
  ) {}

  /**
   * 클라이언트가 소켓에 연결되었을 때 실행되는 메소드
   * @param client
   */
  async handleConnection(client: any) {
    const user = await this.socketRepository.getUserFromAuthorization(
      client.handshake.headers,
    );

    console.log(user.name, client.id);
    client.join(user.role);
    await this.redisRepository.set(user.id, client.id);
    await this.redisRepository.push(user.role, user.id);
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
    await this.redisRepository.del(user.role);
  }

  /**
   * 원하는 역할의 온라인 사용자 목록을 가져오는 메소드
   * @param payload
   */
  @SubscribeMessage('get-role-participants')
  async getRoleParticipants(payload: any) {
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
    const { receiverId, questionId, type, body } = payload;
    const senderId = await this.socketRepository
      .getUserFromAuthorization(client.handshake.headers)
      .then((user) => user.id);

    const receiverSocketId = await this.redisRepository.get(receiverId);
    client.broadcast
      .to(receiverSocketId)
      .emit('message', { senderId, questionId, type, body });
    // TODO: EC2서버에서 레디스가 잘 뿌려주는지 확인 필요
    await this.redisRepository.publish(
      receiverSocketId,
      JSON.stringify({ senderId, questionId, type, body }),
    );
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
