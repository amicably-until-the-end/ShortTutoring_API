import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { UserRepository } from '../user/user.repository';
import { HttpModule } from '@nestjs/axios';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';
import { AuthSchema } from '../auth/entities/auth.schema';
import { AuthRepository } from '../auth/auth.repository';
import { EventRepository } from './event.repository';
import { JwtService } from '@nestjs/jwt';
import { cacheModule, RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    cacheModule,
    RedisModule,
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
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
  providers: [
    EventGateway,
    EventRepository,
    AuthRepository,
    UserRepository,
    JwtService,
    RedisService,
  ],
})
export class EventModule {}
