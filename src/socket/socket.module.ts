import { AuthModule } from '../auth/auth.module';
import { ChattingRepository } from '../chatting/chatting.repository';
import { dynamooseModule } from '../config.dynamoose';
import { redisSubProvider } from '../config.redis';
import { RedisModule } from '../redis/redis.module';
import { UserRepository } from '../user/user.repository';
import { SocketGateway } from './socket.gateway';
import { SocketRepository } from './socket.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AuthModule, RedisModule],
  providers: [
    SocketRepository,
    SocketGateway,
    ChattingRepository,
    redisSubProvider,
    UserRepository,
  ],
  exports: [SocketRepository, SocketGateway],
})
export class SocketModule {}
