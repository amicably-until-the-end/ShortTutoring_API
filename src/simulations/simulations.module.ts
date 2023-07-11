import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../users/entities/user.schema';
import { RequestSchema } from '../requests/entities/request.schema';
import { SimulationsService } from './simulations.service';
import { TutoringSchema } from '../tutorings/entities/tutoring.schema';

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
  controllers: [SimulationsController],
  providers: [SimulationsService],
})
export class SimulationsModule {}
