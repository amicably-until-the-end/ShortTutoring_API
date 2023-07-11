import { Injectable } from '@nestjs/common';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { UpdateTutoringDto } from './dto/update-tutoring.dto';
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
      matched_at: new Date().toISOString(),
      started_at: '',
      ended_at: '',
      status: 'matched',
    };
    return this.tutoringModel.create(tutoring);
  }

  findAll() {
    return `This action returns all tutorings`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} tutoring`;
  }

  update(id: number, updateTutoringDto: UpdateTutoringDto) {
    return `This action updates a #${id} tutoring`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutoring`;
  }
}
