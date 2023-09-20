import { ChattingRepository } from '../chatting/chatting.repository';
import { Message } from '../chatting/entities/chatting.interface';
import { Fail, Success } from '../response';
import { UserRepository } from '../user/user.repository';
import {
  CreateNormalQuestionDto,
  CreateSelectedQuestionDto,
} from './dto/create-question.dto';
import { Question } from './entities/question.interface';
import { QuestionRepository } from './question.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 학생의 질문을 생성합니다.
   * @param userId
   * @param createQuestionDto 질문 생성 정보
   * @returns 생성된 질문의 ID
   */
  async createNormal(
    userId: string,
    createQuestionDto: CreateNormalQuestionDto,
  ) {
    try {
      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question =
        await this.questionRepository.createNormalQuestion(
          questionId,
          userId,
          createQuestionDto,
          problemImages,
        );
      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async createSelected(
    userId: string,
    teacherId: string,
    createQuestionDto: CreateSelectedQuestionDto,
  ) {
    try {
      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question =
        await this.questionRepository.createSelectedQuestion(
          questionId,
          userId,
          createQuestionDto,
          problemImages,
        );

      const chatRoomId = await this.chattingRepository.makeChatRoom(
        teacherId,
        userId,
        questionId,
      );

      await this.userRepository.joinChattingRoom(userId, chatRoomId);
      await this.userRepository.joinChattingRoom(teacherId, chatRoomId);

      const messageImage =
        createQuestionDto.images[createQuestionDto.mainImageIndex];

      const problemMessage: Message = {
        type: 'problem_image',
        body: {
          image: messageImage,
          description: createQuestionDto.description,
          questionId: questionId,
        },
      };
      const requestMessage: Message = {
        type: 'appoint-request',
        body: {
          startDateTime: createQuestionDto.requestTutoringStartTime,
        },
      };

      //TODO: redis pub/sub으로 변경
      this.chattingRepository.sendMessage(chatRoomId, userId, problemMessage);

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
