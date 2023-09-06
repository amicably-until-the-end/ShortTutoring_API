import { Module } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { ChattingController } from './chatting.controller';

@Module({
  imports: [],
  controllers: [ChattingController],
  providers: [ChattingService],
})
export class ChattingModule {}
