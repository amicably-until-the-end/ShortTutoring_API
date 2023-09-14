import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';
import { UserRepository } from '../user/user.repository';
import { ChattingRepository } from './chatting.repository';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [dynamooseModule],
  controllers: [ChattingController],
  providers: [ChattingService, ChattingRepository, UserRepository],
})
export class ChattingModule {}
