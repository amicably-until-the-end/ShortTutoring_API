import { dynamooseModule } from '../config.dynamoose';
import { UserRepository } from '../user/user.repository';
import { ChattingController } from './chatting.controller';
import { ChattingRepository } from './chatting.repository';
import { ChattingService } from './chatting.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule],
  controllers: [ChattingController],
  providers: [ChattingService, ChattingRepository, UserRepository],
})
export class ChattingModule {}
