import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from './entities/request.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Request',
        schema: RequestSchema,
        options: {
          tableName: 'requests',
        },
      },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
