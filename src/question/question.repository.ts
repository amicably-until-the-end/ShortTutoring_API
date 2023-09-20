import { UploadRepository } from '../upload/upload.repository';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question, QuestionKey } from './entities/question.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectModel('Question')
    private readonly questionModel: Model<Question, QuestionKey>,
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async create(
    questionId: string,
    userId: string,
    createQuestionDto: CreateQuestionDto,
    problemImages: string[],
    isSelect: boolean,
  ): Promise<Question> {
    const user: User = await this.userRepository.get(userId);
    if (user.role === 'teacher') {
      throw new Error('선생님은 질문을 생성할 수 없습니다.');
    }

    try {
      return await this.questionModel.create({
        createdAt: new Date().toISOString(),
        hopeTutoringTime: createQuestionDto.hopeTutoringTime,
        hopeImmediately: createQuestionDto.hopeImmediately,
        id: questionId,
        problem: {
          mainImage: problemImages[createQuestionDto.mainImageIndex],
          images: problemImages,
          description: createQuestionDto.description,
          schoolLevel: createQuestionDto.schoolLevel,
          schoolSubject: createQuestionDto.schoolSubject,
        },
        selectedTeacherId: '',
        status: 'pending',
        studentId: userId,
        teacherIds: [],
        tutoringId: '',
        isSelect: isSelect,
      });
    } catch (error) {
      throw new Error('질문을 생성할 수 없습니다.');
    }
  }

  async getByStatus(status: string) {
    let questions: Question[];
    if (status === 'all') {
      questions = await this.questionModel.scan().exec();
    } else {
      questions = await this.questionModel.scan('status').eq(status).exec();
    }

    return await Promise.all(
      questions.map(async (question) => {
        const student = await this.userRepository.getOther(question.studentId);
        return {
          ...question,
          student,
        };
      }),
    );
  }

  async getInfo(questionId: string) {
    return await this.questionModel.get({ id: questionId });
  }

  async delete(userId: string, questionId: string) {
    const user: User = await this.userRepository.get(userId);
    if (user.role === 'teacher') {
      throw new Error('선생님은 질문을 삭제할 수 없습니다.');
    }

    const question: Question = await this.questionModel.get({
      id: questionId,
    });
    if (question.studentId !== userId) {
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

  /**
   createdRequestDto의 문제 이미지들을 S3에 업로드하고, URL 목록을 반환합니다.
   문제 이미지 데이터가 존재하지 않을 경우 기본 이미지 URL을 반환합니다.
   @param questionId 과외 요청 ID
   @param createQuestionDto
   @return problemImages 문제 이미지 URL 목록
   */
  async problemImages(
    questionId: string,
    createQuestionDto: CreateQuestionDto,
  ) {
    if (createQuestionDto.images === undefined) {
      return [
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/problem.png',
      ];
    }

    const images = [];
    let index = 0;
    for (const image of createQuestionDto.images) {
      const imageFormat = image.split(';')[0].split('/')[1];
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const url = await this.uploadRepository.uploadBase64(
        `question/${questionId}`,
        `problem_${index++}.${imageFormat}`,
        base64Data,
      );
      images.push(url.toString());
    }

    return images;
  }
}
