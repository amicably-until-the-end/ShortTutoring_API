import { Module } from '@nestjs/common';
import { TutoringsService } from './tutorings.service';
import { TutoringsController } from './tutorings.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../users/entities/user.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Tutoring',
        schema: UserSchema,
        options: {
          tableName: 'Tutorings',
        },
      },
    ]),
  ],
  controllers: [TutoringsController],
  providers: [TutoringsService],
})
export class TutoringsModule {}
