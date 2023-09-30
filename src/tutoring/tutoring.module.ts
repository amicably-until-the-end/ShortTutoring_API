import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { SocketModule } from '../socket/socket.module';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { TutoringController } from './tutoring.controller';
import { TutoringRepository } from './tutoring.repository';
import { TutoringService } from './tutoring.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, SocketModule],
  controllers: [TutoringController],
  providers: [
    TutoringService,
    TutoringRepository,
    QuestionRepository,
    UserRepository,
    UploadRepository,
  ],
})
export class TutoringModule {}
