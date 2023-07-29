import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Tutoring, TutoringKey } from './entities/tutoring.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TutoringRepository {
  constructor(
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async create(questionId: string, studentId: string, teacherId: string) {
    const tutoring = {
      id: uuid(),
      questionId,
      studentId,
      teacherId,
      matchedAt: new Date().toISOString(),
      startedAt: '',
      endedAt: '',
      status: 'matched',
    };
    await this.tutoringModel.create(tutoring);
    return tutoring.id;
  }
}
