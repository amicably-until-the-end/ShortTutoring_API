import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { Request, RequestKey } from '../request/entities/request.interface';
import { Tutoring, TutoringKey } from '../tutoring/entities/tutoring.interface';
import { SelectResponseDto } from './dto/select-response.dto';
import { TutoringService } from '../tutoring/tutoring.service';
import { ConflictDto, NotFoundDto } from '../HttpResponseDto';
import {
  Created_CreateResponseDto,
  Success_CheckResponseDto,
  Success_DeleteResponseDto,
  Success_GetTeachersDto,
  Success_SelectResponseDto,
} from './response.http-response';

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
      return new NotFoundDto('과외 요청을 찾을 수 없습니다.');
    }

    const teacher = await this.userModel.get({ id: teacherId });
    if (teacher === undefined) {
      return new NotFoundDto('선생님을 찾을 수 없습니다.');
    }

    if (request.teacherIds.includes(teacherId)) {
      return new ConflictDto('이미 응답한 선생님입니다.');
    }

    if (request.status !== 'pending') {
      return new ConflictDto('이미 매칭된 요청입니다.');
    }

    request.teacherIds.push(teacherId);
    await this.requestModel.update(request);

    return new Created_CreateResponseDto({ requestId: requestId });
  }

  async getTeachers(requestId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFoundDto('과외 요청을 찾을 수 없습니다.');
    }

    const teachers = [];
    for (const teacherId of request.teacherIds) {
      teachers.push(await this.userModel.get({ id: teacherId }));
    }

    return new Success_GetTeachersDto(teachers);
  }

  async delete(requestId: string, teacherId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFoundDto('과외 요청을 찾을 수 없습니다.');
    }

    if (!request.teacherIds.includes(teacherId)) {
      return new NotFoundDto('해당 요청에서 선생님을 찾을 수 없습니다.');
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
      return new NotFoundDto('과외 요청을 찾을 수 없습니다.');
    }

    if (request.status === 'selected') {
      if (request.selectedTeacherId === selectResponseDto.teacherId) {
        return new ConflictDto('이미 선택된 선생님입니다.');
      } else {
        return new ConflictDto('이미 다른 선생님을 선택했습니다.');
      }
    }

    if (!request.teacherIds.includes(selectResponseDto.teacherId)) {
      return new NotFoundDto('선생님을 찾을 수 없습니다.');
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
    console.log(tutoringId, selectResponseDto.teacherId);
    request.tutoringId = tutoringId;
    await this.requestModel.update(request);

    return new Success_SelectResponseDto({ tutoringId: tutoring.id });
  }

  async check(requestId: string, teacherId: string) {
    const request = await this.requestModel.get({ id: requestId });
    if (request === undefined) {
      return new NotFoundDto('과외 요청을 찾을 수 없습니다.');
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
      return new NotFoundDto('과외를 찾을 수 없습니다.');
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
