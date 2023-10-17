import { AgoraModule } from '../agora/agora.module';
import { AuthModule } from '../auth/auth.module';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { RedisModule } from '../redis/redis.module';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UploadRepository } from '../upload/upload.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AuthModule, RedisModule, AgoraModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UploadRepository,
    TutoringRepository,
    QuestionRepository,
  ],
  exports: [UserRepository],
})
export class UserModule {}
