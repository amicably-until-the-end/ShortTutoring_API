import { apiErrorWebhook } from '../config.discord-webhook';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { ChattingRepository } from './chatting.repository';
import { ChatRoom, NestedChatRoomInfo } from './items/chat.list';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingService {
  constructor(
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly tutoringRepository: TutoringRepository,
  ) {}

  async makeChatItem(nestChatRoom: NestedChatRoomInfo, userInfo: User) {
    //DB의 질문 정보와 채팅 정보를 API를 호출 한 사람에 맞게 가공한다.

    const { roomInfo, questionInfo } = nestChatRoom;

    let opponentInfo: User | undefined;

    try {
      if (userInfo.role == 'student') {
        opponentInfo = await this.userRepository.get(roomInfo.teacherId);
      } else {
        opponentInfo = await this.userRepository.get(roomInfo.studentId);
      }
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] chatting.service > makeChatItem > ${error.message} > `,
      );
      return new Fail('채팅 상대방 정보를 불러오는데 실패했습니다.');
    }

    const chatRoom: ChatRoom = {
      id: roomInfo.id,
      status: roomInfo.status,
      roomImage: opponentInfo.profileImage,
      questionId: questionInfo.id,
      isSelect: questionInfo.isSelect,
      opponentId: opponentInfo?.id,
      questionInfo: questionInfo,
      title: opponentInfo?.name,
    };

    try {
      if (questionInfo.tutoringId != null) {
        const tutoringInfo = await this.tutoringRepository.get(
          questionInfo.tutoringId,
        );
        chatRoom.reservedStart = tutoringInfo.reservedStart;
      }
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] chatting.service > makeChatItem > ${error.message} > `,
      );
      return new Fail('채팅방 정보를 불러오는데 실패했습니다.');
    }

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
    try {
      const room = await this.chattingRepository.findOne(chattingRoomId);
      if (room.studentId == userId || room.teacherId == userId) {
        const userInfo = await this.userRepository.get(userId);
        const questionInfo = await this.questionRepository.getInfo(
          room.questionId,
        );
        const roomInfo = await this.makeChatItem(
          { roomInfo: room, questionInfo },
          userInfo,
        );
        return new Success('채팅방 정보를 불러왔습니다.', roomInfo);
      } else {
        return new Fail('해당 채팅방에 대한 권한이 없습니다.');
      }
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] chatting.service > findOne > ${error.message} > `,
      );
      return new Fail('채팅방 정보를 불러오는데 실패했습니다.');
    }
  }
}
