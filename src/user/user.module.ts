import { AuthModule } from '../auth/auth.module';
import { dynamooseModule } from '../config.dynamoose';
import { RedisModule } from '../redis/redis.module';
import { UploadRepository } from '../upload/upload.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AuthModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UploadRepository],
  exports: [UserRepository],
})
export class UserModule {}
