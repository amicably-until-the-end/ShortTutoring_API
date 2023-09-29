import { AgoraService } from '../agora/agora.service';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { UserRepository } from '../user/user.repository';
import { ClassroomInfo, TutoringInfo } from './entities/tutoring.entity';
import { TutoringRepository } from './tutoring.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TutoringService {
  constructor(
    private readonly tutoringRepository: TutoringRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly agoraService: AgoraService,
    private readonly userRepository: UserRepository,
  ) {}

  async finish(tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.finishTutoring(tutoringId);
      const { whiteBoardUUID } = tutoring;
      await this.agoraService.disableWhiteBoardChannel(whiteBoardUUID);

      await this.questionRepository.changeStatus(
        tutoring.questionId,
        'finished',
      );

      return new Success('과외가 종료되었습니다.', { tutoringId });
    } catch (error) {
      return new Fail(error.message);
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

      const result = await this.tutoringRepository.reserveTutoring(
        tutoring.id,
        startTime,
        endTime,
      );

      await this.questionRepository.changeStatus(questionId, 'reserved');

      return new Success('수업 시간이 확정되었습니다.', { result });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async classroomInfo(questionId: string, userId: string) {
    try {
      const question = await this.questionRepository.getInfo(questionId);
      console.log(question);

      if (question.tutoringId == null) return new Fail('과외 정보가 없습니다.');

      const userInfo = await this.userRepository.get(userId);

      const tutoring = await this.tutoringRepository.get(question.tutoringId);

      if (userInfo.role == 'student' && tutoring.status != 'going') {
        return new Fail('수업 시작 전입니다.');
      }
      const whiteBoardToken = await this.agoraService.makeWhiteBoardToken(
        tutoring.whiteBoardUUID,
      );
      const rtcToken = await this.agoraService.makeRtcToken(questionId);

      if (question.tutoringId == null) {
        return new Fail('강의실 정보가 없습니다.');
      }

      const accessInfo: ClassroomInfo = {
        boardAppId: tutoring.whiteBoardAppId,
        rtcAppId: tutoring.RTCAppId,
        boardUUID: tutoring.whiteBoardUUID,
        boardToken: whiteBoardToken,
        rtcToken: rtcToken,
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

  async startTutoring(teacherId: string, tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.get(tutoringId);
      if (tutoring.teacherId != teacherId) {
        return new Fail('해당 과외를 진행할 수 없습니다.');
      }
      await this.tutoringRepository.startTutoring(tutoringId);

      return await this.classroomInfo(tutoring.questionId, teacherId);
    } catch (error) {
      return new Fail('과외 시작에 실패했습니다.');
    }
  }
}
