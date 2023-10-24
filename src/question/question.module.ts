import { AgoraModule } from '../agora/agora.module';
import { ChattingRepository } from '../chatting/chatting.repository';
import { dynamooseModule } from '../config.dynamoose';
import { SocketModule } from '../socket/socket.module';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, SocketModule, AgoraModule],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionRepository,
    UserRepository,
    UploadRepository,
    ChattingRepository,
    TutoringRepository,
  ],
  exports: [QuestionRepository],
})
export class QuestionModule {}
