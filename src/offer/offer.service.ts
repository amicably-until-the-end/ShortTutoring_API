import { ChattingRepository } from '../chatting/chatting.repository';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { UserRepository } from '../user/user.repository';
import { OfferRepository } from './offer.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly userRepository: UserRepository,
    private readonly chattingRepository: ChattingRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async append(userId: string, questionId: string) {
    try {
      //await this.offerRepository.append(userId, questionId);

      const questionInfo = await this.questionRepository.getInfo(questionId);
      const studentId = questionInfo.studentId;

      const chatRoomId = await this.chattingRepository.makeChatRoom(
        userId,
        studentId,
        questionId,
      );

      await this.userRepository.joinChattingRoom(studentId, chatRoomId);
      await this.userRepository.joinChattingRoom(userId, chatRoomId);

      const messageImage = questionInfo.problem.mainImage;

      const problemMessage = {
        image: messageImage,
        description: questionInfo.problem.description,
        questionId: questionId,
      };
      const requestMessage = {
        text: '안녕하세요 선생님! 언제 수업 가능하신가요?',
      };

      //TODO: redis pub/sub으로 변경
      await this.chattingRepository.sendMessage(
        chatRoomId,
        userId,
        'problem-image',
        problemMessage,
      );
      await this.chattingRepository.sendMessage(
        chatRoomId,
        userId,
        'text',
        requestMessage,
      );

      return new Success('질문 대기열에 추가되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async remove(userId: string, questionId: string) {
    try {
      await this.offerRepository.remove(userId, questionId);
      return new Success('질문 대기열에서 삭제되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getStatus(userId: string, questionId: string) {
    try {
      const status = await this.offerRepository.getStatus(userId, questionId);
      return new Success('질문 대기열 상태를 불러왔습니다.', status);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async accept(userId: string, questionId: string, teacherId: string) {
    try {
      const tutoring = await this.offerRepository.accept(
        userId,
        questionId,
        teacherId,
      );

      //TODO : 시작 시간 추가

      //TODO : pending -> reserved

      return new Success('튜터링을 시작합니다.', tutoring);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getTeachers(userId: string, questionId: string) {
    try {
      const teachers = await this.offerRepository.getTeachers(
        userId,
        questionId,
      );
      return new Success('선생님 목록을 불러왔습니다.', { teachers });
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
