import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from '../request/entities/request.schema';
import { UserSchema } from '../user/entities/user.schema';
import { TutoringSchema } from '../tutoring/entities/tutoring.schema';
import { TutoringService } from '../tutoring/tutoring.service';

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
  controllers: [ResponseController],
  providers: [ResponseService, TutoringService],
})
export class ResponseModule {}
