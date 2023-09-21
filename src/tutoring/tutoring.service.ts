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
    //TODO: 과외에 참여한 사람이 맞는지 확인해야할까?
    try {
      const tutoring = await this.tutoringRepository.finishTutoring(tutoringId);
      const { whiteBoardUUID } = tutoring;
      await this.agoraService.disableWhiteBoardChannel(whiteBoardUUID);

      return new Success('과외가 종료되었습니다.', { tutoringId });
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
