import { Injectable } from '@nestjs/common';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Tutoring, TutoringKey } from './entities/tutoring.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TutoringsService {
  constructor(
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async create(createTutoringDto: CreateTutoringDto) {
    const tutoring = {
      id: uuid(),
      ...createTutoringDto,
      matchedAt: new Date().toISOString(),
      startedAt: '',
      endedAt: '',
      status: 'matched',
    };
    return this.tutoringModel.create(tutoring);
  }
}
