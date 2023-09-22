import { AgoraService } from '../agora/agora.service';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { TutoringRepository } from './tutoring.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TutoringService {
  constructor(
    private readonly tutoringRepository: TutoringRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly agoraService: AgoraService,
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

  async info(questionId: string) {
    try {
      const question = await this.questionRepository.getInfo(questionId);
      if (question.tutoringId == null) return new Fail('과외 정보가 없습니다.');
      const tutoring = await this.tutoringRepository.get(question.tutoringId);
      return new Success('과외 정보를 가져왔습니다.', { tutoring });
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
