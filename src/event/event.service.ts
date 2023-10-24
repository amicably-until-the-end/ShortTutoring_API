import { Fail, Success } from '../response';
import { UploadRepository } from '../upload/upload.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRepository } from './event.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const eventId = uuid();
      const imageFormat = createEventDto.image.split(';')[0].split('/')[1];
      const base64Data = createEventDto.image.replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      const image = await this.uploadRepository.uploadBase64(
        `event`,
        `${eventId}.${imageFormat}`,
        base64Data,
      );

      return new Success(
        '이벤트 등록 성공',
        await this.eventRepository.create(
          eventId,
          image,
          createEventDto.url,
          createEventDto.authority,
        ),
      );
    } catch (error) {
      return new Fail('이벤트 등록 실패');
    }
  }

  async findAll(role: string) {
    try {
      const events = await this.eventRepository.findByRole(role);

      return new Success('이벤트 조회 성공', {
        count: events.length,
        events,
      });
    } catch (error) {
      return new Fail('이벤트 조회 실패');
    }
  }
}
