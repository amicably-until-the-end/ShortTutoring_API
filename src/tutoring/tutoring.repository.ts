import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Tutoring, TutoringKey } from './entities/tutoring.interface';
import { v4 as uuid } from 'uuid';
import { AgoraService, WhiteBoardData } from '../agora/agora.service';

@Injectable()
export class TutoringRepository {
  constructor(
    @InjectModel('Tutoring')
    private readonly tutoringModel: Model<Tutoring, TutoringKey>,
    private readonly agoraService: AgoraService,
  ) {}

  async create(
    questionId: string,
    studentId: string,
    teacherId: string,
  ): Promise<Tutoring> {
    const { whiteBoardAppId, whiteBoardUUID, whiteBoardToken }: WhiteBoardData =
      await this.agoraService.makeWhiteBoardChannel();

    if (whiteBoardToken == undefined) {
      throw new Error('화이트보드 토큰을 생성할 수 없습니다');
    }

    const tutoring = {
      id: uuid(),
      questionId,
      studentId,
      teacherId,
      status: 'matched',
      matchedAt: new Date().toISOString(),
      startedAt: '',
      endedAt: '',
      whiteBoardAppId,
      whiteBoardUUID,
      whiteBoardToken,
    };
    await this.tutoringModel.create(tutoring);
    return tutoring;
  }

  async get(tutoringId: string): Promise<Tutoring> {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      throw new Error('숏과외를 찾을 수 없습니다.');
    }

    return tutoring;
  }
}
