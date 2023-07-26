import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';
import { RequestSchema } from '../request/entities/request.schema';
import { SimulationService } from './simulation.service';
import { TutoringSchema } from '../tutoring/entities/tutoring.schema';
import {ResponseModule} from "../response/response.module";

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
    ]),ResponseModule
  ],
  controllers: [SimulationController],
  providers: [SimulationService],

})
export class SimulationModule {}
