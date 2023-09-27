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
import { v4 as uuid } from 'uuid';

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

      const insertedQuestions = new Set<string>();

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

      if (userInfo.role == 'student') {
        const questions =
          await this.questionRepository.getStudentPendingQuestions(userId);
        for (let i = 0; i < questions.count; i++) {
          if (insertedQuestions.has(questions[i].id)) continue;
          const question = questions[i];
          const questionRoom: ChatRoom = {
            id: uuid(),
            roomImage: question.problem.mainImage,
            title: question.problem.description,
            questionInfo: question,
            status: ChattingStatus.pending,
            isSelect: false,
            questionId: question.id,
          };
          chatRooms.push(questionRoom);
        }
      }
      console.log(chatRooms);

      return new Success('채팅방 목록을 불러왔습니다.', chatRooms);
    } catch (error) {
      return new Fail(error.message);
    }
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
      isSelect: questionInfo.isSelect,
      opponentId: opponentInfo?.id,
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

  async findOne(chattingRoomId: string, userId: string) {
    const room = await this.chattingRepository.findOne(chattingRoomId);
    if (room.studentId == userId || room.teacherId == userId) {
      return new Success('채팅방 정보를 불러왔습니다.', room);
    } else {
      return new Fail('해당 채팅방에 대한 권한이 없습니다.');
    }
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
