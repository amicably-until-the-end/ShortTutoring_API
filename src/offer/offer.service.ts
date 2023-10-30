import { ChattingRepository } from '../chatting/chatting.repository';
import { ChattingStatus } from '../chatting/entities/chatting.interface';
import { webhook } from '../config.discord-webhook';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { SocketRepository } from '../socket/socket.repository';
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
    private readonly socketRepository: SocketRepository,
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
        subTitle: `${questionInfo.problem.schoolLevel} ${questionInfo.problem.schoolSubject}`,
      };
      const requestMessage = {
        text: '안녕하세요 선생님! 언제 수업 가능하신가요?',
      };

      await this.socketRepository.sendMessageToBothUser(
        studentId,
        userId,
        chatRoomId,
        'problem-image',
        JSON.stringify(problemMessage),
      );
      await this.socketRepository.sendMessageToBothUser(
        studentId,
        userId,
        chatRoomId,
        'text',
        JSON.stringify(requestMessage),
      );

      return new Success('질문 대기열에 추가되었습니다.', { chatRoomId });
    } catch (error) {
      const errorMessage = `offer.service > append > ${error.message}`;
      await webhook.send(errorMessage);
      return new Fail(errorMessage);
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

  async schedule(
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

      const scheduleMessage = {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      await this.socketRepository.sendMessageToBothUser(
        chatting.teacherId,
        chatting.studentId,
        chattingId,
        'schedule-time',
        JSON.stringify(scheduleMessage),
      );

      return new Success('시간을 제안했습니다.', chatting);
    } catch (error) {
      const errorMessage = `offer.service > schedule > ${error.message}`;
      await webhook.send(errorMessage);
      return new Fail(errorMessage);
    }
  }

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

      if (chatting.status == ChattingStatus.reserved) {
        return new Fail('이미 수업이 예약되었습니다.');
      }

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

      await this.chattingRepository.changeStatus(
        chattingId,
        ChattingStatus.reserved,
      );

      const offerTeacherIds = question.offerTeachers;

      await this.questionRepository.changeStatus(questionId, 'reserved');

      await this.questionRepository.setTutoringId(questionId, tutoring.id);

      await this.questionRepository.setSelectedTeacherId(
        questionId,
        chatting.teacherId,
      );

      const confirmMessage = {
        startTime: startTime.toISOString(),
      };

      await this.socketRepository.sendMessageToBothUser(
        userId,
        chatting.teacherId,
        chattingId,
        'reserve-confirm',
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
          await this.chattingRepository.changeStatus(
            teacherChatId,
            ChattingStatus.declined,
          );
          await this.socketRepository.sendMessageToBothUser(
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
      const errorMessage = `offer.service > accept > ${error.message}`;
      await webhook.send(errorMessage);
      return new Fail(errorMessage);
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
