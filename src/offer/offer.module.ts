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
  ],
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
