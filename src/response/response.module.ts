import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from '../request/entities/request.schema';
import { UserSchema } from '../user/entities/user.schema';
import { TutoringSchema } from '../tutoring/entities/tutoring.schema';
import { TutoringModule } from '../tutoring/tutoring.module';

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
    TutoringModule,
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
