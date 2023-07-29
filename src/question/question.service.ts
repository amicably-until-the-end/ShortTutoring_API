import { Injectable } from '@nestjs/common';
import { Question } from './entities/question.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionRepository } from './question.repository';
import {
  BadRequest,
  Created,
  Forbidden,
  NotFound,
  Success,
} from '../http.response';
import { UploadRepository } from '../upload/upload.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   createdRequestDto의 문제 이미지를 S3에 업로드하고, URL을 반환합니다.
   문제 이미지 데이터가 존재하지 않을 경우 기본 이미지 URL을 반환합니다.
   @param questionId 과외 요청 ID
   @param createQuestionDto
   @return problemImage URL
   */
  async problemImage(questionId: string, createQuestionDto: CreateQuestionDto) {
    if (createQuestionDto.imageBase64 === undefined) {
      return 'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/problem.png';
    }

    return await this.uploadRepository
      .uploadBase64(
        `question/${questionId}`,
        `problem.${createQuestionDto.imageFormat}`,
        createQuestionDto.imageBase64,
      )
      .then((res) => res.toString());
  }

  /**
   * 학생의 질문을 생성합니다.
   * @param userKey 사용자 키
   * @param createQuestionDto 질문 생성 정보
   * @returns 생성된 질문의 ID
   */
  async create(
    userKey: { vendor: string; userId: string },
    createQuestionDto: CreateQuestionDto,
  ) {
    try {
      const questionId = uuid();
      const problemImage = await this.problemImage(
        questionId,
        createQuestionDto,
      );
      const question: Question = await this.questionRepository.create(
        questionId,
        userKey,
        createQuestionDto,
        problemImage,
      );
      return new Created('질문이 생성되었습니다.', question);
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          return new BadRequest('잘못된 요청입니다.');
        case 403:
          return new Forbidden('질문을 생성할 권한이 없습니다.');
        case 404:
          return new NotFound('사용자가 존재하지 않습니다.');
      }
    }
  }

  async delete(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    try {
      await this.questionRepository.delete(userKey, questionId);
      return new Success('질문이 삭제되었습니다.', { questionId });
    } catch (error) {
      switch (error.statusCode) {
        case 400:
          return new BadRequest('잘못된 요청입니다.');
        case 403:
          return new Forbidden('질문을 삭제할 권한이 없습니다.');
        case 404:
          return new NotFound('질문이 존재하지 않습니다.');
      }
    }
  }

  async list(status: string) {
    try {
      const questions: Question[] = await this.questionRepository.getByStatus(
        status,
      );
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      return new BadRequest('잘못된 요청입니다.');
    }
  }
}
