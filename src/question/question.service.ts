import { ChattingRepository } from '../chatting/chatting.repository';
import { Fail, Success } from '../response';
import { SocketGateway } from '../socket/socket.gateway';
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
    private readonly socketGateway: SocketGateway,
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

      try {
        await this.userRepository.get(teacherId);
      } catch (e) {
        return new Fail('해당 선생님을 찾을 수 없습니다.');
      }

      const question: Question =
        await this.questionRepository.createSelectedQuestion(
          questionId,
          userId,
          teacherId,
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

      const messageImage = problemImages[createQuestionDto.mainImageIndex];

      const problemMessage = {
        image: messageImage,
        description: createQuestionDto.description,
        questionId: questionId,
      };
      const requestMessage = {
        startDateTime: createQuestionDto.requestTutoringStartTime.toISOString(),
      };

      await this.socketGateway.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'problem-image',
        JSON.stringify(problemMessage),
      );
      await this.socketGateway.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'appoint-request',
        JSON.stringify(requestMessage),
      );

      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getQuestionInfo(questionId: string) {
    try {
      const info = await this.questionRepository.getInfo(questionId);
      return new Success('질문 정보를 가져왔습니다.', info);
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

  async getPendingNormalQuestions() {
    try {
      const questions: Question[] =
        await this.questionRepository.getByStatusAndType('pending', false);
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
