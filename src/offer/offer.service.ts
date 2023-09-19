import { Fail, Success } from '../response';
import { OfferRepository } from './offer.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferService {
  constructor(private readonly offerRepository: OfferRepository) {}

  async append(userId: string, questionId: string) {
    try {
      await this.offerRepository.append(userId, questionId);
      return new Success('질문 대기열에 추가되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async remove(userId: string, questionId: string) {
    try {
      await this.offerRepository.remove(userId, questionId);
      return new Success('질문 대기열에서 삭제되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getStatus(userId: string, questionId: string) {
    try {
      const status = await this.offerRepository.getStatus(userId, questionId);
      return new Success('질문 대기열 상태를 불러왔습니다.', status);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async accept(userId: string, questionId: string, teacherId: string) {
    try {
      const tutoring = await this.offerRepository.accept(
        userId,
        questionId,
        teacherId,
      );
      return new Success('튜터링을 시작합니다.', tutoring);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getTeachers(userId: string, questionId: string) {
    try {
      const teachers = await this.offerRepository.getTeachers(
        userId,
        questionId,
      );
      return new Success('선생님 목록을 불러왔습니다.', { teachers });
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
