import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Question, QuestionKey } from './entities/question.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { User, UserKey } from '../user/entities/user.interface';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel('Question')
    private readonly questionModel: Model<Question, QuestionKey>,
    @InjectModel('User')
    private readonly userModel: Model<User, UserKey>,
  ) {}

  async create(
    questionId: string,
    userKey: { vendor: string; userId: string },
    createQuestionDto: CreateQuestionDto,
    problemImage: string,
  ): Promise<Question> {
    const user: User = await this.userModel.get({ id: userKey.userId });
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    } else if (user.role === 'teacher') {
      throw new Error('선생님은 질문을 생성할 수 없습니다.');
    }

    try {
      return await this.questionModel.create({
        id: questionId,
        status: 'pending',
        student: {
          vendor: userKey.vendor,
          id: userKey.userId,
        },
        teacherIds: [],
        problem: {
          image: problemImage,
          description: createQuestionDto.description,
          schoolLevel: createQuestionDto.schoolLevel,
          schoolSubject: createQuestionDto.schoolSubject,
          difficulty: createQuestionDto.difficulty,
        },
        selectedTeacherId: '',
        tutoringId: '',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error('질문을 생성할 수 없습니다.');
    }
  }

  async getByStatus(status: string) {
    if (status === 'all') {
      const questions: Question[] = await this.questionModel.scan().exec();
      return questions;
    }

    const questions: Question[] = await this.questionModel
      .scan('status')
      .eq(status)
      .exec();
    return questions;
  }

  async delete(
    userKey: { vendor: string; userId: string },
    questionId: string,
  ) {
    const user: User = await this.userModel.get({ id: userKey.userId });
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    } else if (user.role === 'teacher') {
      throw new Error('선생님은 질문을 삭제할 수 없습니다.');
    }

    const question: Question = await this.questionModel.get({
      id: questionId,
    });
    if (
      question.student.id !== userKey.userId ||
      question.student.vendor !== userKey.vendor
    ) {
      return new Error('질문을 삭제할 권한이 없습니다.');
    }

    try {
      return await this.questionModel.delete({
        id: questionId,
      });
    } catch (error) {
      throw new Error('질문을 삭제할 수 없습니다.');
    }
  }
}
