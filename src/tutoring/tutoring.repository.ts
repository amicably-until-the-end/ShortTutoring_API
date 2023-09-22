import { AgoraService, WhiteBoardData } from '../agora/agora.service';
import { Tutoring, TutoringKey } from './entities/tutoring.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TutoringRepository {
  constructor(
    @InjectModel('Tutoring')
    private readonly tutoringModel: Model<Tutoring, TutoringKey>,
    private readonly agoraService: AgoraService,
  ) {}

  async create(questionId: string, studentId: string, teacherId: string) {
    const tutoringId = uuid();

    const { whiteBoardAppId, whiteBoardUUID, whiteBoardToken }: WhiteBoardData =
      await this.agoraService.makeWhiteBoardChannel();

    const { teacherToken, studentToken } = await this.agoraService.makeRtcToken(
      tutoringId,
    );

    if (whiteBoardToken == undefined) {
      throw new Error('화이트보드 토큰을 생성할 수 없습니다');
    }

    const tutoringInfo = {
      id: tutoringId,
      questionId,
      studentId,
      teacherId,
      status: 'reserved',
      matchedAt: new Date().toISOString(),
      whiteBoardAppId,
      whiteBoardUUID,
      whiteBoardToken,
      teacherRTCToken: teacherToken,
      studentRTCToken: studentToken,
      RTCAppId: process.env.AGORA_RTC_APP_ID,
    };
    return await this.tutoringModel.create(tutoringInfo);
  }

  async reserveTutoring(tutoringId: string, startTime: Date, endTime: Date) {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      throw new Error('숏과외를 찾을 수 없습니다.');
    }
    if (tutoring.reservedStart != undefined) {
      throw new Error('이미 예약된 과외입니다.');
    }

    return await this.tutoringModel.update(
      { id: tutoringId },
      { reservedStart: startTime, reservedEnd: endTime },
    );
  }

  async get(tutoringId: string): Promise<Tutoring> {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      throw new Error('숏과외를 찾을 수 없습니다.');
    }

    return tutoring;
  }

  async finishTutoring(tutoringId: string): Promise<Tutoring> {
    let tutoring: Tutoring;
    try {
      tutoring = await this.tutoringModel.get({ id: tutoringId });
    } catch (error) {
      throw new Error('해당 과외를 찾을 수 없습니다.');
    }
    try {
      if (tutoring !== undefined) {
        return await this.tutoringModel.update(
          { id: tutoringId },
          { status: 'finished', endedAt: new Date().toISOString() },
        );
      }
    } catch (error) {
      throw new Error('과외 상태를 변경할 수 없습니다.');
    }
  }
}
