import { AgoraService, WhiteBoardChannelInfo } from '../agora/agora.service';
import { CreateReviewDto } from './dto/create-review.dto';
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

  async setRecordingInfo(tutoringId: string, resourceId: string, sid: string) {
    return await this.tutoringModel.update(
      { id: tutoringId },
      { recordingResourceId: resourceId, recordingSid: sid },
    );
  }

  async setRecordingFilePath(tutoringId: string, filePath: string[]) {
    return await this.tutoringModel.update(
      { id: tutoringId },
      { recordingFilePath: filePath },
    );
  }

  async startTutoring(tutoringId: string) {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      return null;
    }
    if (tutoring.startedAt != undefined) {
      return tutoring;
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

  async createReview(
    userId: string,
    tutoringId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const tutoring = await this.tutoringModel.get({ id: tutoringId });
    if (tutoring === undefined) {
      throw new Error('해당 과외를 찾을 수 없습니다.');
    }
    if (tutoring.studentId != userId) {
      throw new Error('해당 과외를 평가할 수 없습니다.');
    }

    try {
      return await this.tutoringModel.update(
        { id: tutoringId },
        {
          reviewRating: createReviewDto.rating,
          reviewComment: createReviewDto.comment,
        },
      );
    } catch (error) {
      throw new Error('과외 평가를 저장할 수 없습니다.');
    }
  }

  async getTutoringCntOfTeacher(teacherId: string) {
    try {
      const result = await this.tutoringModel
        .scan({
          teacherId: {
            eq: teacherId,
          },
        })
        .exec();
      return result.map((a) => a);
    } catch (error) {
      throw new Error('과외를 찾을 수 없습니다.');
    }
  }

  async getTeacherRating(teacherId: string) {
    try {
      const tutoringList = await this.tutoringModel
        .scan({
          teacherId: {
            eq: teacherId,
          },
        })
        .exec();

      let reviewRatingSum = 0;
      let reviewRatingCnt = 0;
      for (const tutoring of tutoringList) {
        if (tutoring.reviewRating != undefined) {
          reviewRatingSum += tutoring.reviewRating;
          reviewRatingCnt += 1;
        }
      }

      return reviewRatingCnt ? reviewRatingSum / reviewRatingCnt : 0;
    } catch (error) {
      throw new Error('선생님의 평점을 가져올 수 없습니다.');
    }
  }

  async history(userId: string, role: string) {
    try {
      const history: Tutoring[] = await this.tutoringModel
        .scan({
          [role + 'Id']: { eq: userId },
        })
        .exec();

      return history;
    } catch (error) {
      return new Error('과외 내역을 가져올 수 없습니다.');
    }
  }

  async reviewHistory(userId: any) {
    try {
      const tutoringHistory: Tutoring[] = await this.tutoringModel
        .scan({
          teacherId: { eq: userId },
        })
        .exec();
      const history = tutoringHistory
        .filter((tutoring) => tutoring.reviewRating != undefined)
        .sort((a, b) => {
          return new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime();
        });

      return history.map((tutoring) => {
        return {
          questionId: tutoring.questionId,
          studentId: tutoring.studentId,
          tutoringId: tutoring.id,
          student: undefined,
          reviewRating: tutoring.reviewRating,
          reviewComment: tutoring.reviewComment,
          startedAt: tutoring.startedAt,
          endedAt: tutoring.endedAt,
        };
      });
    } catch (error) {
      throw new Error('과외 내역을 가져올 수 없습니다.');
    }
  }
}
