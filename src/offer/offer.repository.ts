import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { Question, QuestionKey } from '../question/entities/question.interface';
import { TutoringRepository } from '../tutoring/tutoring.repository';

@Injectable()
export class OfferRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User, UserKey>,
    @InjectModel('Question')
    private readonly questionModel: Model<Question, QuestionKey>,
    private readonly tutoringRepository: TutoringRepository,
  ) {}

  async append(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    try {
      const teacher = await this.userModel.get({
        vendor: userKey.vendor,
        id: userKey.userId,
      });

      if (teacher.role !== 'teacher') {
        return new Error('선생님만 질문 대기열에 추가할 수 있습니다.');
      }
    } catch (error) {
      throw new Error('선생님을 찾을 수 없습니다.');
    }

    const teacherId = `${userKey.vendor}#${userKey.userId}`;
    const question = await this.questionModel.get({ id: questionId });
    if (question.teacherIds.includes(teacherId)) {
      throw new BadRequestException('이미 질문 대기열에 추가되었습니다.');
    }
    question.teacherIds.push(teacherId);
    await this.questionModel.update(
      { id: questionId },
      { teacherIds: question.teacherIds },
    );
  }

  async getTeachers(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    const user = await this.userModel.get({
      vendor: userKey.vendor,
      id: userKey.userId,
    });
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const question = await this.questionModel.get({ id: questionId });
    if (question === undefined) {
      throw new Error('질문을 찾을 수 없습니다.');
    }

    if (question.student.id !== userKey.userId) {
      throw new Error('본인의 질문이 아닙니다.');
    }

    const teachers = question.teacherIds.map(async (teacherId) => {
      const vendor = teacherId.split('#')[0];
      const id = teacherId.split('#')[1];
      return await this.userModel.get({
        vendor,
        id,
      });
    });
    return await Promise.all(teachers);
  }

  async remove(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    const teacherId = `${userKey.vendor}#${userKey.userId}`;
    const question = await this.questionModel.get({ id: questionId });
    if (!question.teacherIds.includes(teacherId)) {
      throw new BadRequestException('질문 대기열에 존재하지 않습니다.');
    }
    question.teacherIds = question.teacherIds.filter((id) => id !== teacherId);
    await this.questionModel.update(
      { id: questionId },
      { teacherIds: question.teacherIds },
    );
  }

  async getStatus(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    const question = await this.questionModel.get({ id: questionId });
    if (question === undefined) {
      throw new Error('질문을 찾을 수 없습니다.');
    }

    const teacherId = `${userKey.vendor}#${userKey.userId}`;
    if (!question.teacherIds.includes(teacherId)) {
      throw new Error('질문 대기열에 존재하지 않습니다.');
    }

    if (question.status === 'pending') {
      return {
        status: question.status,
      };
    }

    if (question.selectedTeacherId === teacherId) {
      return {
        status: 'selected',
        tutoringId: question.tutoringId,
      };
    } else {
      return {
        status: 'rejected',
      };
    }
  }

  async accept(
    userKey: { vendor: string; userId: string },
    questionId: string,
    teacherId: string,
  ) {
    const user: User = await this.userModel.get({
      vendor: userKey.vendor,
      id: userKey.userId,
    });
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    } else if (user.role === 'teacher') {
      throw new Error('선생님은 질문을 수락할 수 없습니다.');
    }

    const question = await this.questionModel.get({ id: questionId });
    if (question === undefined) {
      throw new Error('질문을 찾을 수 없습니다.');
    } else if (question.student.id !== userKey.userId) {
      throw new Error('본인의 질문이 아닙니다.');
    } else if (!question.teacherIds.includes(teacherId)) {
      throw new Error('질문 대기열에 존재하지 않는 선생님입니다.');
    }

    const tutoringId = await this.tutoringRepository.create(
      questionId,
      userKey.userId,
      question.selectedTeacherId,
    );

    await this.questionModel.update(
      { id: questionId },
      {
        status: 'matched',
        selectedTeacherId: teacherId,
        tutoringId,
      },
    );

    return tutoringId;
  }
}
