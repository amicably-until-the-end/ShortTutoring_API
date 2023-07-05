import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
