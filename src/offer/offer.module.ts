import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';
import { QuestionSchema } from '../question/entities/question.schema';
import { UserRepository } from '../user/user.repository';
import { QuestionRepository } from '../question/question.repository';
import { OfferRepository } from './offer.repository';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { TutoringSchema } from '../tutoring/entities/tutoring.schema';
import { AgoraModule } from '../agora/agora.module';
import { UploadRepository } from '../upload/upload.repository';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Question',
        schema: QuestionSchema,
      },
      {
        name: 'Tutoring',
        schema: TutoringSchema,
      },
    ]),
    AgoraModule,
  ],
  controllers: [OfferController],
  providers: [
    OfferService,
    OfferRepository,
    UserRepository,
    UploadRepository,
    QuestionRepository,
    TutoringRepository,
  ],
})
export class OfferModule {}
