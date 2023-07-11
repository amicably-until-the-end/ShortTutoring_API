import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from '../requests/entities/request.schema';
import { UserSchema } from '../users/entities/user.schema';
import { TutoringSchema } from '../tutorings/entities/tutoring.schema';
import { TutoringsService } from '../tutorings/tutorings.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: 'Users',
        },
      },
      {
        name: 'Request',
        schema: RequestSchema,
        options: {
          tableName: 'Requests',
        },
      },
      {
        name: 'Tutoring',
        schema: TutoringSchema,
        options: {
          tableName: 'Tutorings',
        },
      },
    ]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, TutoringsService],
})
export class ResponsesModule {}
