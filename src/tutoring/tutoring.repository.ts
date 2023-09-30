import { AgoraService, WhiteBoardChannelInfo } from '../agora/agora.service';
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

    const { whiteBoardAppId, whiteBoardUUID }: WhiteBoardChannelInfo =
      await this.agoraService.makeWhiteBoardChannel();

    const tutoringInfo = {
      id: tutoringId,
      questionId: questionId,
      studentId: studentId,
      teacherId: teacherId,
      status: 'reserved',
      matchedAt: new Date().toISOString(),
      whiteBoardAppId: whiteBoardAppId,
      whiteBoardUUID: whiteBoardUUID,
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
      {
        reservedStart: startTime,
        reservedEnd: endTime,
      },
    );
  }

  async startTutoring(tutoringId: string) {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      throw new Error('숏과외를 찾을 수 없습니다.');
    }
    if (tutoring.startedAt != undefined) {
      throw new Error('이미 시작된 과외입니다.');
    }

    return await this.tutoringModel.update(
      { id: tutoringId },
      { startedAt: new Date().toISOString(), status: 'going' },
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
