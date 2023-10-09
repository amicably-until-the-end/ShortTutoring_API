import { dynamooseModule } from '../config.dynamoose';
import { UploadRepository } from '../upload/upload.repository';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, UploadRepository],
})
export class EventModule {}
