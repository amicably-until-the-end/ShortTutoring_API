import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from './entities/request.schema';
import { UserSchema } from '../user/entities/user.schema';

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
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
