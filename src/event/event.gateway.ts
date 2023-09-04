import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventRepository } from './event.repository';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from '../auth/auth.repository';
import { webhook } from '../config.discord-webhook';

@WebSocketGateway()
export class EventGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const authorization = client.handshake.headers.authorization;
    const user = this.authRepository.decodeJwt(authorization.split(' ')[1]);
    const users = this.server.sockets.adapter.rooms.get(user.role);

    console.log(users);
    let usersString = '';

    for (const user of users) {
      usersString += user + '\n';
    }
    webhook.success(`새로운 ${user.role}가 접속했습니다.\n현재 ${user.role} 수: ${users.size} \n${usersString}
    `);

    client.emit('dd', 'Hello world!');
    return 'world!';
  }

  @SubscribeMessage('events')
  handleConnection(client: any, ...args: any[]) {
    const authorization = client.handshake.headers.authorization;
    const user = this.authRepository.decodeJwt(authorization.split(' ')[1]);
    // client.join(user.role);
  }

  handleDisconnect(client: any) {
    console.log(client.id);
  }
}
