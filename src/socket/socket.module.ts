import { AuthRepository } from '../auth/auth.repository';
import { dynamooseModule } from '../config.dynamoose';
import { redisProvider } from '../config.redis';
import { RedisRepository } from '../redis/redis.repository';
import { UserRepository } from '../user/user.repository';
import { SocketGateway } from './socket.gateway';
import { SocketRepository } from './socket.repository';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    dynamooseModule,
  ],
  providers: [
    SocketRepository,
    SocketGateway,
    RedisRepository,
    redisProvider,
    AuthRepository,
    JwtService,
    UserRepository,
  ],
  exports: [SocketRepository, SocketGateway],
})
export class SocketModule {}
