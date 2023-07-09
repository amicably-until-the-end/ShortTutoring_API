import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ResponseSchema } from './entities/response.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Response',
        schema: ResponseSchema,
        options: {
          tableName: 'responses',
        },
      },
    ]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService],
})
export class ResponsesModule {}
