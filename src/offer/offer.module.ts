import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { OfferController } from './offer.controller';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    OfferRepository,
    UserRepository,
    QuestionRepository,
    TutoringRepository,
    UploadRepository,
  ],
})
export class OfferModule {}
