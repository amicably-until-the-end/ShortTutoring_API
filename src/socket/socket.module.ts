import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { RedisRepository } from '../redis/redis.repository';
import { redisProvider } from '../config.redis';
import { SocketService } from './socket.service';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [dynamooseModule],
  providers: [SocketService, SocketGateway, RedisRepository, redisProvider],
  exports: [SocketService, SocketGateway],
})
export class SocketModule {}
