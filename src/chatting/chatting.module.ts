import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { ChattingController } from './chatting.controller';
import { ChattingRepository } from './chatting.repository';
import { ChattingService } from './chatting.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule],
  controllers: [ChattingController],
  providers: [
    ChattingService,
    ChattingRepository,
    UserRepository,
    QuestionRepository,
    UploadRepository,
  ],
  exports: [ChattingRepository],
})
export class ChattingModule {}
