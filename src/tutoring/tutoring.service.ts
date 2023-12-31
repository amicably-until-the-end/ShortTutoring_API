import { AgoraService, WhiteBoardChannelInfo } from '../agora/agora.service';
import { ChattingRepository } from '../chatting/chatting.repository';
import { ChattingStatus } from '../chatting/entities/chatting.interface';
import { apiErrorWebhook } from '../config.discord-webhook';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { SocketRepository } from '../socket/socket.repository';
import { UploadRepository } from '../upload/upload.repository';
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
    private readonly uploadRepository: UploadRepository,
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

      this.agoraService
        .stopRecord(
          tutoring.recordingResourceId,
          tutoring.recordingSid,
          tutoringId,
        )
        .then(async (result) => {
          try {
            const files = await this.uploadRepository.findRecordFile(
              result.uid,
            );
            await this.tutoringRepository.setRecordingFilePath(
              result.tutoringId,
              files,
            );
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));

      return new Success('과외가 종료되었습니다.', { tutoringId });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > finish > ${error.message} > `,
      );
      return new Fail('과외를 종료하는데 실패했습니다.');
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
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > reserveTutoring > ${error.message} > `,
      );
      return new Fail('수업 시간을 확정하는데 실패했습니다.');
    }
  }

  async classroomChannel(tutoringId: string, userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const tutoring = await this.tutoringRepository.get(tutoringId);

      if (tutoring == null) {
        throw Error('존재하지 않는 과외입니다.');
      }

      if (userInfo.role == 'student' && tutoring.status == 'reserved') {
        throw Error('아직 수업이 시작되지 않았습니다.');
      }
      if (userInfo.role == 'student' && tutoring.status == 'finished') {
        throw Error('이미 종료된 수업입니다.');
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
      return accessInfo;
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > classroomChannel > ${error.message} > `,
      );
      return null;
    }
  }

  async classroomInfo(tutoringId: string, userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const tutoring = await this.tutoringRepository.get(tutoringId);

      if (tutoring == null) {
        return new Fail('존재하지 않는 과외입니다.', 100);
      }

      if (userInfo.role == 'student' && tutoring.status == 'reserved') {
        return new Fail('아직 수업이 시작되지 않았습니다.', 200);
      }
      if (userInfo.role == 'student' && tutoring.status == 'finished') {
        return new Fail('이미 종료된 수업입니다.', 300);
      }
      return new Success(
        '수업 정보를 가져왔습니다.',
        await this.classroomChannel(tutoringId, userId),
      );
    } catch (e) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > classroomInfo > ${e.message}`,
      );
      return new Fail('수업 정보를 가져오는데 실패했습니다.');
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
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > info > ${e.message}`,
      );
      return new Fail('과외 정보를 가져오는데 실패했습니다.');
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

      await this.questionRepository.changeStatus(
        chatRoomInfo.questionId,
        'declined',
      );

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
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > decline > ${e.message}`,
      );
      return new Fail('과외를 거절하는데 실패했습니다.');
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

      const roomInfo = await this.classroomChannel(tutoring.id, teacherId);

      const whiteBoardInfo: WhiteBoardChannelInfo = {
        whiteBoardAppId: roomInfo.boardAppId,
        whiteBoardUUID: roomInfo.boardUUID,
      };

      this.agoraService
        .startRecord(whiteBoardInfo, roomInfo.rtcChannel, tutoringId)
        .then((result) => {
          console.log(result, 'result', tutoringId, 'tutoringId');
          this.tutoringRepository.setRecordingInfo(
            result.tutoringId,
            result.resourceId,
            result.sid,
          );
        })
        .catch((e) => console.log(e));

      return new Success('과외가 시작되었습니다.', roomInfo);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > startTutoring > ${error.message} > `,
      );
      return new Fail('과외를 시작하는데 실패했습니다.');
    }
  }

  async createReview(
    userId: string,
    tutoringId: string,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      return new Success(
        '리뷰를 작성했습니다.',
        this.tutoringRepository.createReview(
          userId,
          tutoringId,
          createReviewDto,
        ),
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] tutoring.service > createReview > ${error.message} > `,
      );
      return new Fail('리뷰를 작성하는데 실패했습니다.');
    }
  }
}
