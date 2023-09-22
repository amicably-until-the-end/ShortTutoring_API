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
      console.log(
        'rooms',
        chatRooms.map((room) => {
          room.id, room.questionId;
        }),
      );

      const chatLists = this.groupChatRoomByState(chatRooms);
      if (userInfo.role == 'student') {
        chatLists.normalProposed = this.groupNormalProposedForStudent(
          chatLists.normalReserved,
        );
      }
      console.log('chatLists', chatLists);

      return new Success('채팅방 목록을 불러왔습니다.', chatLists);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  groupNormalProposedForStudent(chatRooms: ChatRoom[]): ChatRoom[] {
    const result = {};
    chatRooms.forEach((chatRoom) => {
      if (chatRoom.questionId in result) {
        result[chatRoom.questionId].teachers.push(chatRoom);
      } else {
        const questionRoom: ChatRoom = {
          teachers: [chatRoom],
          isTeacherRoom: false,
          roomImage: chatRoom.problemImage,
          title: chatRoom.problemImage,
          schoolSubject: chatRoom.schoolSubject,
          schoolLevel: chatRoom.schoolLevel,
          status: ChattingStatus.pending,
          questionId: chatRoom.questionId,
          isSelect: false,
        };
        result[chatRoom.questionId] = questionRoom;
      }
    });
    return Object.values(result);
  }

  groupChatRoomByState(chatRooms: ChatRoom[]): ChatList {
    console.log('chatRooms function', chatRooms.length);
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

  makeChatItem(nestChatRoom: NestedChatRoomInfo, userInfo: User): ChatRoom {
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

    const chatRoom: ChatRoom = {
      id: roomInfo.id,
      messages: roomInfo.messages,
      opponentId: undefined,
      status: status,
      roomImage: questionInfo.problem.mainImage,
      questionId: questionInfo.id,
      schoolSubject: questionInfo.problem.schoolSubject,
      schoolLevel: questionInfo.problem.schoolLevel,
      isSelect: questionInfo.isSelect,
      isTeacherRoom: true,
      title: undefined,
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
