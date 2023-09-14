import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { UserRepository } from '../user/user.repository';
import { QuestionRepository } from '../question/question.repository';
import { OfferRepository } from './offer.repository';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [dynamooseModule, AgoraModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    OfferRepository,
    UserRepository,
    QuestionRepository,
    TutoringRepository,
  ],
})
export class OfferModule {}
