import { Injectable } from '@nestjs/common';
import {
  CreateTutoringDto,
  NotFound_CreateTutoringDto,
  Success_CreateTutoringDto,
} from './dto/create-tutoring.dto';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Tutoring, TutoringKey } from './entities/tutoring.interface';
import { v4 as uuid } from 'uuid';
import { Request, RequestKey } from '../request/entities/request.interface';

@Injectable()
export class TutoringService {
  constructor(
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async create(createTutoringDto: CreateTutoringDto) {
    const request = await this.requestModel.get({
      id: createTutoringDto.requestId,
    });
    if (request === undefined) {
      return new NotFound_CreateTutoringDto('과외 요청을 찾을 수 없습니다');
    }

    const tutoring = {
      id: uuid(),
      ...createTutoringDto,
      matchedAt: new Date().toISOString(),
      startedAt: '',
      endedAt: '',
      status: 'matched',
    };
    await this.tutoringModel.create(tutoring);

    return new Success_CreateTutoringDto(tutoring);
  }
}
