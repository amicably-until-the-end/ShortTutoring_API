import { Injectable } from '@nestjs/common';
import { AgoraService } from '../agora/agora.service';
import { TutoringRepository } from './tutoring.repository';
import { Fail, Success } from '../response';

@Injectable()
export class TutoringService {
  constructor(
    private readonly tutoringRepository: TutoringRepository,
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

  async info(tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.get(tutoringId);
      return new Success('과외 정보를 가져왔습니다.', { tutoring });
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
