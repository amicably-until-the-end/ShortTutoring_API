import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { Request, RequestKey } from '../request/entities/request.interface';
import { Tutoring, TutoringKey } from '../tutoring/entities/tutoring.interface';
import {
  Conflict_CreateResponseDto,
  Created_CreateResponseDto,
  NotFound_CreateResponseDto,
  NotFound_SelectResponseDto,
} from './dto/create-response.dto';
import {
  Conflict_SelectResponseDto,
  SelectResponseDto,
  Success_SelectResponseDto,
} from './dto/select-response.dto';
import {
  NotFound_GetTeachersDTO,
  Success_GetTeachersDTO,
} from './dto/get-response.dto';
import {
  NotFound_DeleteResponseDto,
  Success_DeleteResponseDto,
} from './dto/delete-response.dto';
import { TutoringService } from '../tutoring/tutoring.service';
import {
  NotFound_CheckResponseDto,
  Success_CheckResponseDto,
} from './dto/check-response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async create(requestId: string, teacherId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFound_CreateResponseDto('과외 요청을 찾을 수 없습니다.');
    }

    const teacher = await this.userModel.get({ id: teacherId });
    if (teacher === undefined) {
      return new NotFound_CreateResponseDto('선생님을 찾을 수 없습니다.');
    }

    if (request.teacherIds.includes(teacherId)) {
      return new Conflict_CreateResponseDto('이미 응답한 선생님입니다.');
    }

    request.teacherIds.push(teacherId);
    await this.requestModel.update(request);

    return new Created_CreateResponseDto({ requestId: requestId });
  }

  async getTeachers(requestId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFound_GetTeachersDTO();
    }

    const teachers = [];
    for (const teacherId of request.teacherIds) {
      teachers.push(await this.userModel.get({ id: teacherId }));
    }

    return new Success_GetTeachersDTO(teachers);
  }

  async delete(requestId: string, teacherId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFound_DeleteResponseDto('과외 요청을 찾을 수 없습니다.');
    }

    if (!request.teacherIds.includes(teacherId)) {
      return new NotFound_DeleteResponseDto(
        '해당 요청에서 선생님을 찾을 수 없습니다.',
      );
    }

    request.teacherIds = request.teacherIds.filter((id) => id !== teacherId);
    await this.requestModel.update(request);

    return new Success_DeleteResponseDto();
  }

  async select(selectResponseDto: SelectResponseDto) {
    const request = await this.requestModel.get({
      id: selectResponseDto.requestId,
    });
    if (request === undefined) {
      return new NotFound_SelectResponseDto('과외 요청을 찾을 수 없습니다.');
    }

    if (request.status === 'selected') {
      return new Conflict_SelectResponseDto();
    }

    const tutoringService = new TutoringService(
      this.requestModel,
      this.tutoringModel,
    );

    const tempTutoring = await tutoringService.create(selectResponseDto);
    let tutoringId;
    if ('id' in tempTutoring.data) {
      tutoringId = tempTutoring.data.id;
    }

    const tutoring = await this.tutoringModel.get({ id: tutoringId });

    request.status = 'selected';
    request.selectedTeacherId = selectResponseDto.teacherId;
    request.tutoringId = tutoringId;
    await this.requestModel.update(request);

    return new Success_SelectResponseDto({ tutoringId: tutoring.id });
  }

  async check(requestId: string, teacherId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFound_CheckResponseDto('과외 요청을 찾을 수 없습니다.');
    }

    if (request.status === 'pending') {
      return new Success_CheckResponseDto('학생의 선택을 기다리는 중입니다.', {
        status: 'yet selected',
      });
    }

    if (teacherId !== request.selectedTeacherId) {
      return new Success_CheckResponseDto(
        '학생이 다른 선생님과 과외를 시작하였습니다.',
        { status: 'not selected' },
      );
    }

    const tutoring = await this.tutoringModel.get({ id: request.tutoringId });
    if (tutoring === undefined) {
      return new NotFound_CheckResponseDto('과외를 찾을 수 없습니다.');
    }

    return new Success_CheckResponseDto(
      '학생이 선생님을 선택했습니다. 과외를 시작하세요.',
      {
        status: request.status,
        tutoringId: tutoring.id,
      },
    );
  }
}
