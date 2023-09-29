import { ChattingRepository } from '../chatting/chatting.repository';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { SocketGateway } from '../socket/socket.gateway';
import { TutoringRepository } from '../tutoring/tutoring.repository';
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
    private readonly tutoringRepository: TutoringRepository,
    private readonly socketGateway: SocketGateway,
  ) {}

  async append(userId: string, questionId: string) {
    try {
      //await this.offerRepository.append(userId, questionId);

      const questionInfo = await this.questionRepository.getInfo(questionId);

      const studentId = questionInfo.studentId;

      const offerSuccess = await this.questionRepository.appendOffer(
        questionId,
        userId,
      );
      if (offerSuccess == null) {
        return new Fail('이미 신청한 질문 입니다.');
      }

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
        studentId,
        'problem-image',
        problemMessage,
      );

      //TODO: redis pub/sub으로 변경
      await this.socketGateway.sendMessageToBothUser(
        studentId,
        userId,
        chatRoomId,
        'problem-image',
        JSON.stringify(problemMessage),
      );
      await this.socketGateway.sendMessageToBothUser(
        studentId,
        userId,
        chatRoomId,
        'text',
        JSON.stringify(requestMessage),
      );

      return new Success('질문 대기열에 추가되었습니다.', { chatRoomId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /*
  async remove(userId: string, questionId: string) {
    try {
      await this.offerRepository.remove(userId, questionId);
      return new Success('질문 대기열에서 삭제되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }*/

  /*

  async getStatus(userId: string, questionId: string) {
    try {
      const status = await this.offerRepository.getStatus(userId, questionId);
      return new Success('질문 대기열 상태를 불러왔습니다.', status);
    } catch (error) {
      return new Fail(error.message);
    }
  }*/

  async accept(
    userId: string,
    chattingId: string,
    questionId: string,
    startTime: Date,
    endTime: Date,
  ) {
    try {
      const chatting = await this.chattingRepository.getChatRoomInfo(
        chattingId,
      );
      const tutoring = await this.tutoringRepository.create(
        questionId,
        userId,
        chatting.teacherId,
      );

      await this.tutoringRepository.reserveTutoring(
        tutoring.id,
        startTime,
        endTime,
      );

      const question = await this.questionRepository.getInfo(questionId);

      const offerTeacherIds = question.offerTeachers;

      await this.questionRepository.changeStatus(questionId, 'reserved');

      await this.questionRepository.setTutoringId(questionId, tutoring.id);

      await this.questionRepository.setSeletedTeacherId(
        questionId,
        chatting.teacherId,
      );

      const confirmMessage = {
        text: `선생님과 수업이 확정되었습니다.\n수업 시간은 ${startTime} ~ ${endTime} 입니다.`,
      };

      await this.socketGateway.sendMessageToBothUser(
        userId,
        chatting.teacherId,
        chattingId,
        'text',
        JSON.stringify(confirmMessage),
      );

      const rejectMessage = {
        text: '죄송합니다.\n다른 선생님과 수업을 진행하기로 했습니다.',
      };

      for (const offerTeacherId of offerTeacherIds) {
        if (offerTeacherId != chatting.teacherId) {
          const teacherChatId =
            await this.chattingRepository.getIdByQuestionAndTeacher(
              questionId,
              offerTeacherId,
            );
          //TODO: redis pub/sub으로 변경
          await this.socketGateway.sendMessageToBothUser(
            userId,
            offerTeacherId,
            teacherChatId,
            'text',
            JSON.stringify(rejectMessage),
          );
        }
      }

      return new Success('선생님 선택이 완료되었습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /*
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

   */
}
