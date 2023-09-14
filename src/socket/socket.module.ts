import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';
import { AuthSchema } from '../auth/entities/auth.schema';
import { RedisRepository } from '../redis/redis.repository';
import { redisProvider } from '../config.redis';
import { SocketService } from './socket.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Auth',
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [SocketService, SocketGateway, RedisRepository, redisProvider],
  exports: [SocketService, SocketGateway],
})
export class SocketModule {}
