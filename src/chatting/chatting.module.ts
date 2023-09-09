import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ChattingSchema } from './entities/chatting.schema';
import { UserRepository } from '../user/user.repository';
import { UserSchema } from '../user/entities/user.schema';
import { ChattingRepository } from './chatting.repository';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Chatting',
        schema: ChattingSchema,
      },
    ]),
  ],
  controllers: [ChattingController],
  providers: [ChattingService, ChattingRepository, UserRepository],
})
export class ChattingModule {}
