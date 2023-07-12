import { Module } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { TutoringController } from './tutoring.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';

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
  controllers: [TutoringController],
  providers: [TutoringService],
})
export class TutoringModule {}
