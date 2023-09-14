import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    return payload;
  }
}
