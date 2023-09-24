import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { ChattingRepository } from './chatting.repository';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import {
  ChatList,
  ChatRoom,
  ChattingStatus,
  NestedChatRoomInfo,
} from './items/chat.list';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingService {
  constructor(
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async getChatList(userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const chatRooms: ChatRoom[] = await Promise.all(
        //Join Chatting & Question
        userInfo.participatingChattingRooms.map(async (roomId) => {
          const roomInfo = await this.chattingRepository.getChatRoomInfo(
            roomId,
          );
          const questionInfo = await this.questionRepository.getInfo(
            roomInfo.questionId,
          );
          return this.makeChatItem({ roomInfo, questionInfo }, userInfo);
        }),
      );

      const chatLists = this.groupChatRoomByState(chatRooms);
      if (userInfo.role == 'student') {
        const questions =
          await this.questionRepository.getStudentPendingQuestions(userId);
        chatLists.normalProposed = await this.groupNormalProposedForStudent(
          chatLists.normalProposed,
          questions.map((q) => q.id),
        );
      }

      return new Success('채팅방 목록을 불러왔습니다.', chatLists);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async groupNormalProposedForStudent(
    chatRooms: ChatRoom[],
    pendingQuestionIds: string[],
  ): Promise<ChatRoom[]> {
    const result = {};
    chatRooms.forEach((chatRoom) => {
      if (chatRoom.questionId in result) {
        result[chatRoom.questionId].teachers.push(chatRoom);
      } else {
        const questionRoom: ChatRoom = {
          teachers: [chatRoom],
          isTeacherRoom: false,
          roomImage: chatRoom.problemImage,
          title: chatRoom.questionInfo.problem.description,
          schoolSubject: chatRoom.schoolSubject,
          schoolLevel: chatRoom.schoolLevel,
          status: ChattingStatus.pending,
          questionId: chatRoom.questionId,
          problemImage: chatRoom.problemImage,
          isSelect: false,
        };
        result[chatRoom.questionId] = questionRoom;
      }
    });

    for (const questionId of pendingQuestionIds) {
      if (!(questionId in result)) {
        const questionInfo = await this.questionRepository.getInfo(questionId);
        result[questionId] = {
          teachers: [],
          isTeacherRoom: false,
          roomImage: questionInfo.problem.mainImage,
          title: questionInfo.problem.description,
          isSelect: false,
          status: ChattingStatus.pending,
          questionId: questionId,
          problemImage: questionInfo.problem.mainImage,
        };
      }
    }

    return Object.values(result);
  }

  groupChatRoomByState(chatRooms: ChatRoom[]): ChatList {
    const result: ChatList = {
      normalProposed: [],
      normalReserved: [],
      selectedProposed: [],
      selectedReserved: [],
    };

    chatRooms.forEach((chatRoom) => {
      if (chatRoom.isSelect) {
        if (chatRoom.status == ChattingStatus.pending) {
          result.selectedProposed.push(chatRoom);
        }
        if (chatRoom.status == ChattingStatus.reserved) {
          result.selectedReserved.push(chatRoom);
        }
      } else {
        if (chatRoom.status == ChattingStatus.pending) {
          result.normalProposed.push(chatRoom);
        }
        if (chatRoom.status == ChattingStatus.reserved) {
          result.normalReserved.push(chatRoom);
        }
      }
    });
    return result;
  }

  async makeChatItem(nestChatRoom: NestedChatRoomInfo, userInfo: User) {
    //DB의 질문 정보와 채팅 정보를 API를 호출 한 사람에 맞게 가공한다.

    const { roomInfo, questionInfo } = nestChatRoom;

    let status: ChattingStatus;
    if (questionInfo.status == 'pending') {
      status = ChattingStatus.pending;
    } else if (questionInfo.status == 'reserved') {
      status =
        roomInfo.teacherId == questionInfo.selectedTeacherId
          ? ChattingStatus.reserved
          : ChattingStatus.pending;
    }
    let roomImage: string;
    let opponentInfo: User | undefined;

    try {
      if (userInfo.role == 'student') {
        opponentInfo = await this.userRepository.get(roomInfo.teacherId);
      } else {
        opponentInfo = await this.userRepository.get(roomInfo.studentId);
      }
    } catch (error) {
      //유저 정보를 가져오는데 실패한 경우.
    }

    const chatRoom: ChatRoom = {
      id: roomInfo.id,
      messages: roomInfo.messages.map((message) => {
        const { body, ...rest } = message;
        const isMyMsg = message.sender == userInfo.id;
        try {
          return { body: JSON.parse(body), ...rest, isMyMsg: isMyMsg };
        } catch (e) {
          return {
            body: { text: body },
            ...rest,
            isMyMsg: isMyMsg,
            format: 'text',
          };
        }
      }),
      status: status,
      roomImage: opponentInfo.profileImage,
      questionId: questionInfo.id,
      schoolSubject: questionInfo.problem.schoolSubject,
      schoolLevel: questionInfo.problem.schoolLevel,
      problemImage: questionInfo.problem.mainImage,
      isSelect: questionInfo.isSelect,
      opponentId: opponentInfo?.id,
      isTeacherRoom: true,
      questionInfo: questionInfo,
      title: opponentInfo?.name,
    };
    return chatRoom;
  }

  /*
  async create(senderId: string, createChattingDto: CreateChattingDto) {
    const receiverId = createChattingDto.roomId;
    const areConnected = await this.chattingRepository.areConnected(
      senderId,
      receiverId,
    );

    if (areConnected) {
      return new Fail('이미 채팅방이 존재합니다.');
    } else {
      return await this.chattingRepository.create(senderId, receiverId);
    }
  }

   */

  /*
    async sendMessage(senderId: string, roomId:string, sendMessageDto: SendMessageDto) {
      const receiverId = sendMessageDto.roomId;
      const areConnected = await this.chattingRepository.areConnected(
        senderId,
        receiverId,
      );

      if (areConnected) {
        return new Success(
          '성공적으로 메시지를 보냈습니다.',
          await this.chattingRepository.sendMessage(
            senderId,
            receiverId,
            sendMessageDto.message,
          ),
        );
      } else {
        return new Fail('채팅방이 존재하지 않습니다.');
      }
    }
    */

  async findAll() {
    return await this.chattingRepository.findAll();
  }

  async findOne(chattingRoomId: string) {
    return await this.chattingRepository.findOne(chattingRoomId);
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
