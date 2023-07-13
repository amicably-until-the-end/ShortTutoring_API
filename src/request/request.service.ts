import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from './entities/request.interface';
import { User, UserKey } from '../user/entities/user.interface';
import {
  Created_CreateRequestDto,
  CreateRequestDto,
  Unauthorized_CreateRequestDto,
} from './dto/create-request.dto';
import { v4 as uuid } from 'uuid';
import {
  NotFound_DeleteRequestDto,
  Success_DeleteRequestDto,
} from './dto/delete-request.dto';
import { Success_GetRequestsDto } from './dto/get-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
  ) {}

  async create(studentId: string, createRequestDto: CreateRequestDto) {
    const student = await this.userModel.get({ id: studentId });
    if (student === undefined) {
      return new Unauthorized_CreateRequestDto();
    }

    // TODO: S3에 이미지 업로드
    const imageUrl = 'Decoded image url';

    const request = {
      id: uuid(),
      status: 'pending',
      studentId,
      teacherIds: [],
      problem: {
        description: createRequestDto.problem_description,
        schoolLevel: createRequestDto.problem_school_level,
        imageUrl,
        schoolSubject: createRequestDto.problem_school_subject,
        schoolChapter: createRequestDto.problem_school_chapter,
        difficulty: createRequestDto.problem_difficulty,
      },
      selectedTeacherId: '',
      createdAt: new Date().toISOString(),
    };
    await this.requestModel.create(request);

    return new Created_CreateRequestDto();
  }

  async findAll() {
    const found = [];
    const requests = await this.requestModel.scan().exec();
    for (const request of requests) {
      const student = await this.userModel.get({ id: request.studentId });
      if (request.status !== 'pending') continue;

      found.push({
        id: request.id,
        student,
        problem: request.problem,
        teacherIds: request.teacherIds,
        createdAt: request.createdAt,
      });
    }
    return new Success_GetRequestsDto(found);
  }

  async remove(requestId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFound_DeleteRequestDto();
    }

    await this.requestModel.delete({ id: requestId });
    return new Success_DeleteRequestDto();
  }
}
