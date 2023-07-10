import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RequestSchema } from '../requests/entities/request.schema';

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
  controllers: [ResponsesController],
  providers: [ResponsesService],
})
export class ResponsesModule {}
