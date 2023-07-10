import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../users/entities/user.schema';
import { RequestSchema } from '../requests/entities/request.schema';
import { UsersService } from '../users/users.service';
import { ResponsesService } from '../responses/responses.service';
import { RequestsService } from '../requests/requests.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: 'users',
        },
      },
      {
        name: 'Request',
        schema: RequestSchema,
        options: {
          tableName: 'requests',
        },
      },
    ]),
  ],
  controllers: [SimulationsController],
  providers: [
    SimulationsService,
    UsersService,
    RequestsService,
    ResponsesService,
  ],
})
export class SimulationsModule {}
