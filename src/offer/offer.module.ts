import { AgoraModule } from '../agora/agora.module';
import { ChattingRepository } from '../chatting/chatting.repository';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { SocketModule } from '../socket/socket.module';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { OfferController } from './offer.controller';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, SocketModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    OfferRepository,
    UserRepository,
    QuestionRepository,
    TutoringRepository,
    UploadRepository,
    ChattingRepository,
  ],
})
export class OfferModule {}
