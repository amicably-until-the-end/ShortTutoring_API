import { ChattingRepository } from '../chatting/chatting.repository';
import { apiErrorWebhook } from '../config.discord-webhook';
import { Fail, Success } from '../response';
import { SocketRepository } from '../socket/socket.repository';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UserRepository } from '../user/user.repository';
import {
  CreateNormalQuestionDto,
  CreateSelectedQuestionDto,
} from './dto/create-question.dto';
import { Question } from './entities/question.interface';
import { QuestionRepository } from './question.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
    private readonly socketRepository: SocketRepository,
    private readonly tutoringRepository: TutoringRepository,
  ) {}

  /**
   * 학생의 질문을 생성합니다.
   * @param userId
   * @param createQuestionDto 질문 생성 정보
   * @returns 생성된 질문의 ID
   */
  async createNormal(
    userId: string,
    createQuestionDto: CreateNormalQuestionDto,
  ) {
    try {
      const balance = await this.userRepository.getCoin(userId);
      if (balance < 1) {
        return new Fail('코인이 부족합니다.');
      }

      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question =
        await this.questionRepository.createNormalQuestion(
          questionId,
          userId,
          createQuestionDto,
          problemImages,
        );
      await this.userRepository.useCoin(userId);

      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > createNormal > ${error.message} > `,
      );
      return new Fail('질문을 생성하는데 실패했습니다.');
    }
  }

  async createSelected(
    userId: string,
    teacherId: string,
    createQuestionDto: CreateSelectedQuestionDto,
  ) {
    try {
      const balance = await this.userRepository.getCoin(userId);
      if (balance < 1) {
        return new Fail('코인이 부족합니다.');
      }

      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );

      try {
        await this.userRepository.get(teacherId);
      } catch (e) {
        return new Fail('해당 선생님을 찾을 수 없습니다.');
      }

      const question: Question =
        await this.questionRepository.createSelectedQuestion(
          questionId,
          userId,
          teacherId,
          createQuestionDto,
          problemImages,
        );

      const chatRoomId = await this.chattingRepository.makeChatRoom(
        teacherId,
        userId,
        questionId,
      );
      await this.userRepository.useCoin(userId); // TODO : transaction 으로 변경 고려

      await this.userRepository.joinChattingRoom(userId, chatRoomId);
      await this.userRepository.joinChattingRoom(teacherId, chatRoomId);

      const messageImage = problemImages[createQuestionDto.mainImageIndex];

      const problemMessage = {
        image: messageImage,
        description: createQuestionDto.description,
        questionId: questionId,
        subTitle: `${createQuestionDto.schoolLevel} ${createQuestionDto.schoolSubject}`,
      };
      const requestMessage = {
        startDateTime: createQuestionDto.requestTutoringStartTime.toISOString(),
      };

      await this.socketRepository.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'problem-image',
        JSON.stringify(problemMessage),
      );
      await this.socketRepository.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'appoint-request',
        JSON.stringify(requestMessage),
      );

      return new Success('질문이 생성되었습니다.', {
        ...question,
        chattingId: chatRoomId,
      });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > createSelected > ${error.message} > `,
      );
      return new Fail('질문을 생성하는데 실패했습니다.');
    }
  }

  async getQuestionInfo(questionId: string) {
    try {
      const info = await this.questionRepository.getInfo(questionId);
      return new Success('질문 정보를 가져왔습니다.', info);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > getQuestionInfo > ${error.message} > `,
      );
      return new Fail('질문 정보를 가져오는데 실패했습니다.');
    }
  }

  async delete(userId: string, questionId: string) {
    try {
      await this.questionRepository.cancelQuestion(userId, questionId);
      await this.userRepository.earnCoin(userId);
      return new Success('질문이 삭제되었습니다.', { questionId });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > delete > ${error.message} > `,
      );
      return new Fail('질문을 삭제하는데 실패했습니다.');
    }
  }

  async getPendingNormalQuestions() {
    try {
      const questions: Question[] =
        await this.questionRepository.getByStatusAndType('pending', false);
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > getPendingNormalQuestions > ${error.message} > `,
      );
      return new Fail('질문 목록을 불러오는데 실패했습니다.');
    }
  }

  async getMyQuestions(userId: string, status: string, type: string) {
    try {
      const user = await this.userRepository.get(userId);

      const chatRooms = (
        await Promise.all(
          user.participatingChattingRooms.map(async (chatRoomId) => {
            try {
              return await this.chattingRepository.getChatRoomInfo(chatRoomId);
            } catch (e) {
              await apiErrorWebhook.send(
                `[${process.env.NODE_ENV}] question.service > getMyQuestions > ${e.message}`,
              );
              return undefined;
            }
          }),
        )
      ).filter((chatRoom) => chatRoom != undefined);

      let questions: Question[] = (
        await Promise.all(
          chatRooms.map(async (chatRoom) => {
            return await this.questionRepository.getInfo(chatRoom.questionId);
          }),
        )
      ).filter(
        (question) =>
          (status != 'all' ? question.status === status : true) &&
          (type != 'all' ? question.isSelect === (type == 'selected') : true),
      );

      if (user.role == 'student') {
        const pendingNormalQuestions =
          await this.questionRepository.getMyQuestions(
            userId,
            'pending',
            'normal',
          );
        questions.push(...pendingNormalQuestions);
        questions = questions.filter((question, index) => {
          return (
            questions.findIndex((q) => {
              return q.id === question.id;
            }) === index
          );
        });
      }

      const result = await Promise.all(
        questions.map(async (question) => {
          const info: any = question;
          let chattingId = null;
          if (question.selectedTeacherId != undefined) {
            try {
              chattingId =
                await this.chattingRepository.getIdByQuestionAndTeacher(
                  question.id,
                  question.selectedTeacherId,
                );
            } catch (e) {}
          } else if (user.role == 'teacher') {
            chattingId =
              await this.chattingRepository.getIdByQuestionAndTeacher(
                question.id,
                userId,
              );
          }
          if (chattingId != null) {
            info.chattingId = chattingId;
          }
          if (question.status === 'reserved') {
            const tutoring = await this.tutoringRepository.get(
              question.tutoringId,
            );
            if (tutoring?.reservedStart) {
              info.reservedStart = tutoring.reservedStart;
            }
          }
          return question;
        }),
      );

      return new Success('질문 목록을 불러왔습니다.', result);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] question.service > getMyQuestions > ${error.message} > `,
      );
      return new Fail('질문 목록을 불러오는데 실패했습니다.');
    }
  }
}
