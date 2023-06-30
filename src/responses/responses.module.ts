import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';

@Module({
  controllers: [ResponsesController],
  providers: [ResponsesService],
})
export class ResponsesModule {}
