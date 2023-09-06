import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ChattingSchema } from './entities/chatting.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Chatting',
        schema: ChattingSchema,
      },
    ]),
  ],
  controllers: [ChattingController],
  providers: [ChattingService],
})
export class ChattingModule {}
