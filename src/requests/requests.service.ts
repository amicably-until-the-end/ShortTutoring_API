import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from './entities/request.interface';
import { User, UserKey } from '../users/entities/user.interface';
import { CreateRequestDto } from './dto/create-request.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
  ) {}

  async create(student_id: string, createRequestDto: CreateRequestDto) {
    const image_url = 'Decoded image url';
    const request = {
      id: uuid(),
      status: 'pending',
      student_id,
      teacher_ids: [],
      created_at: new Date().toISOString(),
      problem: {
        description: createRequestDto.problem_description,
        school_level: createRequestDto.problem_school_level,
        image_url,
        school_subject: createRequestDto.problem_school_subject,
        school_chapter: createRequestDto.problem_school_chapter,
        difficulty: createRequestDto.problem_difficulty,
      },
    };
    return await this.requestModel.create(request);
  }

  async findAll() {
    const found = [];
    const requests = await this.requestModel.scan().exec();
    for (const request of requests) {
      const student = await this.userModel.get({ id: request.student_id });
      found.push({
        id: request.id,
        student,
        problem: request.problem,
        teacher_ids: request.teacher_ids,
        created_at: request.created_at,
      });
    }
    return found;
  }

  remove(id: string) {
    return this.requestModel.delete({ id });
  }
}
