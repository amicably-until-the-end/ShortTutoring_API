import { ChattingRepository } from '../chatting/chatting.repository';
import { Fail, Success } from '../response';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.interface';
import { QuestionRepository } from './question.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly chattingRepository: ChattingRepository,
  ) {}

  /**
   * 학생의 질문을 생성합니다.
   * @param userId
   * @param createQuestionDto 질문 생성 정보
   * @returns 생성된 질문의 ID
   */
  async createNormal(userId: string, createQuestionDto: CreateQuestionDto) {
    try {
      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question = await this.questionRepository.create(
        questionId,
        userId,
        createQuestionDto,
        problemImages,
        false,
      );
      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async createSelected(
    userId: string,
    teacherId: string,
    createQuestionDto: CreateQuestionDto,
  ) {
    try {
      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question = await this.questionRepository.create(
        questionId,
        userId,
        createQuestionDto,
        problemImages,
        true,
      );

      //TODO: 질문 생성 시, 선생님들에게 알림을 보내야 합니다. 레디스로 올려야함

      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async delete(userId: string, questionId: string) {
    try {
      await this.questionRepository.delete(userId, questionId);
      return new Success('질문이 삭제되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async list(status: string) {
    try {
      const questions: Question[] = await this.questionRepository.getByStatus(
        status,
      );
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
