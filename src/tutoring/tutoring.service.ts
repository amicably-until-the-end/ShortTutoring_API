import { AgoraService } from '../agora/agora.service';
import { ChattingRepository } from '../chatting/chatting.repository';
import { ChattingStatus } from '../chatting/entities/chatting.interface';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { SocketRepository } from '../socket/socket.repository';
import { UserRepository } from '../user/user.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { ClassroomInfo, TutoringInfo } from './entities/tutoring.entity';
import { TutoringRepository } from './tutoring.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TutoringService {
  constructor(
    private readonly tutoringRepository: TutoringRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly agoraService: AgoraService,
    private readonly socketRepository: SocketRepository,
    private readonly userRepository: UserRepository,
    private readonly chattingRepository: ChattingRepository,
  ) {}

  async finish(tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.finishTutoring(tutoringId);

      await this.questionRepository.changeStatus(
        tutoring.questionId,
        'finished',
      );

      const { whiteBoardUUID } = tutoring;
      await this.agoraService.disableWhiteBoardChannel(whiteBoardUUID);

      const finishMessage = {
        startAt: tutoring.startedAt,
        endAt: tutoring.endedAt,
      };

      const chatId = await this.chattingRepository.getIdByQuestionAndTeacher(
        tutoring.questionId,
        tutoring.teacherId,
      );

      await this.socketRepository.sendMessageToBothUser(
        tutoring.teacherId,
        tutoring.studentId,
        chatId,
        'tutoring-finished',
        JSON.stringify(finishMessage),
      );

      await this.userRepository.earnCoin(tutoring.teacherId);

      return new Success('과외가 종료되었습니다.', { tutoringId });
    } catch (error) {
      console.log(error);
      return new Fail(`과외를 종료할 수 없습니다.`);
    }
  }

  async reserveTutoring(questionId: string, startTime: Date, endTime: Date) {
    try {
      const question = await this.questionRepository.getInfo(questionId);

      if (question.tutoringId != null)
        return new Fail('이미 과외가 확정되었습니다.');

      const tutoring = await this.tutoringRepository.create(
        questionId,
        question.studentId,
        question.selectedTeacherId,
      );

      await this.questionRepository.setTutoringId(questionId, tutoring.id);

      await this.tutoringRepository.reserveTutoring(
        tutoring.id,
        startTime,
        endTime,
      );

      const reserveConfirmMessage = {
        startTime: startTime.toISOString(),
      };

      const chatRoomId =
        await this.chattingRepository.getIdByQuestionAndTeacher(
          questionId,
          question.selectedTeacherId,
        );
      await this.chattingRepository.changeStatus(
        chatRoomId,
        ChattingStatus.reserved,
      );

      await this.questionRepository.changeStatus(questionId, 'reserved');

      await this.socketRepository.sendMessageToBothUser(
        question.selectedTeacherId,
        question.studentId,
        chatRoomId,
        'reserve-confirm',
        JSON.stringify(reserveConfirmMessage),
      );

      return new Success('수업 시간이 확정되었습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async classroomInfo(tutoringId: string, userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const tutoring = await this.tutoringRepository.get(tutoringId);

      if (tutoring == null) {
        return new Fail('해당 과외 정보가 없습니다.');
      }

      if (userInfo.role == 'student' && tutoring.status == 'reserved') {
        return new Fail('수업 시작 전입니다.');
      }
      if (userInfo.role == 'student' && tutoring.status == 'finished') {
        return new Fail('수업이 종료되었습니다.');
      }
      const whiteBoardToken = await this.agoraService.makeWhiteBoardToken(
        tutoring.whiteBoardUUID,
      );
      const rtcToken = await this.agoraService.makeRtcToken(
        tutoring.questionId,
        userInfo.role == 'teacher' ? 1 : 2,
      );

      const accessInfo: ClassroomInfo = {
        boardAppId: tutoring.whiteBoardAppId,
        rtcAppId: tutoring.RTCAppId,
        boardUUID: tutoring.whiteBoardUUID,
        boardToken: whiteBoardToken,
        rtcToken: rtcToken.token,
        rtcChannel: rtcToken.channel,
        rtcUID: rtcToken.uid,
      };
      return new Success('강의실 정보를 가져왔습니다.', accessInfo);
    } catch (error) {
      return new Fail('강의실 정보를 가져오는데 실패했습니다.');
    }
  }

  async info(questionId: string, userId: string) {
    try {
      const question = await this.questionRepository.getInfo(questionId);
      if (
        question.studentId != userId &&
        question.selectedTeacherId != userId
      ) {
        return new Fail('해당 과외 정보를 볼 수 없습니다.');
      }
      const tutoring = await this.tutoringRepository.get(question.tutoringId);
      const tutoringInfo: TutoringInfo = {
        id: tutoring.id,
        questionId: tutoring.questionId,
        studentId: tutoring.studentId,
        teacherId: tutoring.teacherId,
        status: tutoring.status,
        reservedStart: tutoring.reservedStart,
        reservedEnd: tutoring.reservedEnd,
      };
      return new Success('과외 정보를 가져왔습니다.', tutoringInfo);
    } catch (e) {
      return new Fail('해당 과외 정보를 가져오는 데 실패했습니다.');
    }
  }

  async decline(chattingId: string, userId: string) {
    try {
      const chatRoomInfo = await this.chattingRepository.getChatRoomInfo(
        chattingId,
      );
      if (userId != chatRoomInfo.teacherId) {
        return new Fail('해당 과외를 거절할 수 없습니다.');
      }

      await this.questionRepository.changeStatus(chattingId, 'declined');

      await this.chattingRepository.changeStatus(
        chattingId,
        ChattingStatus.declined,
      );

      await this.socketRepository.sendMessageToBothUser(
        chatRoomInfo.teacherId,
        chatRoomInfo.studentId,
        chattingId,
        'request-decline',
        JSON.stringify({}),
      );

      return new Success('과외를 거절했습니다.');
    } catch (e) {
      console.log(e);
      return new Fail('과외 거절에 실패했습니다.');
    }
  }

  async startTutoring(teacherId: string, tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.get(tutoringId);
      if (tutoring.teacherId != teacherId) {
        return new Fail('해당 과외를 진행할 수 없습니다.');
      }
      if (tutoring.status == 'finished') {
        return new Fail('이미 종료된 과외입니다.');
      }

      await this.tutoringRepository.startTutoring(tutoringId);

      const startMessage = {
        text: '과외가 시작되었습니다.',
      };
      const chatRoomId =
        await this.chattingRepository.getIdByQuestionAndTeacher(
          tutoring.questionId,
          teacherId,
        );

      if (tutoring.status == 'reserved') {
        await this.socketRepository.sendMessageToBothUser(
          tutoring.teacherId,
          tutoring.studentId,
          chatRoomId,
          'text',
          JSON.stringify(startMessage),
        );
      }

      return await this.classroomInfo(tutoring.id, teacherId);
    } catch (error) {
      return new Fail('과외 시작에 실패했습니다.');
    }
  }

  async createReview(
    userId: string,
    tutoringId: string,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      return this.tutoringRepository.createReview(
        userId,
        tutoringId,
        createReviewDto,
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
