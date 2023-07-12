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

  async create(studentId: string, createRequestDto: CreateRequestDto) {
    const imageUrl = 'Decoded image url';
    const request = {
      id: uuid(),
      status: 'pending',
      studentId,
      teacherIds: [],
      createdAt: new Date().toISOString(),
      problem: {
        description: createRequestDto.problem_description,
        schoolLevel: createRequestDto.problem_school_level,
        imageUrl,
        schoolSubject: createRequestDto.problem_school_subject,
        schoolChapter: createRequestDto.problem_school_chapter,
        difficulty: createRequestDto.problem_difficulty,
      },
    };
    return await this.requestModel.create(request);
  }

  async findAll() {
    const found = [];
    const requests = await this.requestModel.scan().exec();
    for (const request of requests) {
      const student = await this.userModel.get({ id: request.studentId });
      found.push({
        id: request.id,
        student,
        problem: request.problem,
        teacherIds: request.teacherIds,
        createdAt: request.createdAt,
      });
    }
    return found;
  }

  remove(id: string) {
    return this.requestModel.delete({ id });
  }
}
