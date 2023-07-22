import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from './entities/request.interface';
import { User, UserKey } from '../user/entities/user.interface';
import { CreateRequestDto } from './dto/create-request.dto';
import { v4 as uuid } from 'uuid';
import { ForbiddenDto, NotFoundDto } from '../HttpResponseDto';
import {
  Created_CreateRequestDto,
  Success_DeleteRequestDto,
  Success_GetRequestsDto,
} from './dto/response-request.dto';
import { UploadController } from '../upload/upload.controller';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
  ) {}

  /*
  createdRequestDto의 문제 이미지를 S3에 업로드하고, URL을 반환합니다.
  @param requestId 과외 요청 ID
  @param createdRequestDto 과외 요청 정보
  @exception 문제 이미지 데이터가 존재하지 않을 경우 기본 이미지 URL을 반환합니다.
  @return problemImage URL
   */
  async problemImage(requestId: string, createRequestDto: CreateRequestDto) {
    if (createRequestDto.problemImage.data === undefined) {
      return 'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/problem.png';
    }

    const uploadController = new UploadController();
    return await uploadController
      .uploadBase64(
        requestId,
        `problem.${createRequestDto.problemImage.format}`,
        createRequestDto.problemImage.data,
      )
      .then((res) => res.toString());
  }

  /*
  과외 요청을 생성합니다.
  @param studentId 학생 ID
  @param createRequestDto 과외 요청 정보
  @return 과외 요청 정보
   */
  async create(studentId: string, createRequestDto: CreateRequestDto) {
    const student = await this.userModel.get({ id: studentId });
    if (student === undefined) {
      return new NotFoundDto('학생을 찾을 수 없습니다.');
    }

    if (student.role === 'teacher') {
      return new ForbiddenDto('선생님은 과외 요청을 할 수 없습니다.');
    }

    const requestId = uuid();
    const problemImage = await this.problemImage(requestId, createRequestDto);

    const request = {
      id: requestId,
      status: 'pending',
      studentId,
      teacherIds: [],
      problem: {
        image: problemImage,
        description: createRequestDto.problemDescription,
        schoolLevel: createRequestDto.problemSchoolLevel,
        schoolSubject: createRequestDto.problemSchoolSubject,
        schoolChapter: createRequestDto.problemSchoolChapter,
        difficulty: createRequestDto.problemDifficulty,
      },
      selectedTeacherId: '',
      createdAt: new Date().toISOString(),
    };
    await this.requestModel.create(request);

    return new Created_CreateRequestDto({ requestId: request.id });
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
      return new NotFoundDto('해당 과외 요청이 존재하지 않습니다.');
    }

    await this.requestModel.delete({ id: requestId });
    return new Success_DeleteRequestDto();
  }
}
