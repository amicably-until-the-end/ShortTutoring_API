import { Chatting, ChattingKey } from './entities/chatting.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ChattingRepository {
  constructor(
    @InjectModel('Chatting')
    private readonly chattingModel: Model<Chatting, ChattingKey>,
  ) {}

  /*

  async areConnected(senderId: string, receiverId: string) {
    const sender = await this.userRepository.get(senderId);

    return (
      sender.participatingChattingRooms.find((chattingRoom) => {
        return chattingRoom.chatWith === receiverId;
      }) !== undefined
    );
  }

  async create(senderId: string, receiverId: string) {
    const receiver = await this.userRepository.get(receiverId);
    const sender = await this.userRepository.get(senderId);

    try {
      const chattingRoomId = uuid();
      const chatting: Chatting = {
        id: chattingRoomId,
        participants: [senderId, receiverId],
        logs: [],
      };

      await this.chattingModel.create(chatting);
      await this.userRepository.addChatting(
        senderId,
        receiverId,
        chattingRoomId,
      );

      return {
        chattingRoomId,
        sender,
        receiver,
      };
    } catch (error) {
      throw new Fail('채팅방을 생성할 수 없습니다.' + error.message);
    }
  }*/

  /**
   * 채팅방에 메시지를 전송합니다.
   * @param roomId
   * @param senderId
   * @param format
   * @param message
   */
  async sendMessage(
    roomId: string,
    senderId: string,
    format: string,
    body?: any,
  ) {
    const newMessage = {
      sender: senderId,
      format: format,
      body: JSON.stringify(body),
      createdAt: new Date().toISOString(),
    };
    return await this.chattingModel.update(
      { id: roomId },
      { $ADD: { messages: [newMessage] } },
    );
  }

  async getChatRoomInfo(roomId: string) {
    return await this.chattingModel.get({
      id: roomId,
    });
  }

  async getIdByQuestionAndTeacher(questionId: string, teacherId: string) {
    const result = await this.chattingModel
      .scan({ questionId, teacherId })
      .exec();
    if (result.length > 0) {
      return result[0].id;
    }
    throw new Error('채팅방을 찾을 수 없습니다.');
  }

  async getChatRoomsInfo(roomIds: ChattingKey[]) {
    return await this.chattingModel.batchGet(roomIds);
  }

  /*
   * 채팅 객체를 생성 합니다
   * 이 함수는 user.participantingChattingRooms 에 추가 해주지 않음
   */
  async makeChatRoom(
    teacherId: string,
    studentId: string,
    questionId: string,
  ): Promise<string> {
    const chattingRoomId = uuid();
    const chatting: Chatting = {
      id: chattingRoomId,
      teacherId,
      studentId,
      questionId,
      messages: [],
    };
    await this.chattingModel.create(chatting);
    return chattingRoomId;
  }

  /*
    async sendMessage(senderId: string, receiverId: string, message: string) {
      try {
        const chattingRoom = await this.chattingModel.scan().exec();
        const chattingRoomId = chattingRoom.find((chatting) => {
          return (
            chatting.participants.includes(senderId) &&
            chatting.participants.includes(receiverId)
          );
        }).id;

        const chatting = await this.chattingModel.get({ id: chattingRoomId });
        chatting.logs.push({
          sender: senderId,
          message,
          createdAt: new Date().toISOString()
        });
        await this.chattingModel.update(
          { id: chattingRoomId },
          { logs: chatting.logs }
        );

        return {
          chattingRoomId,
          message
        };
      } catch (error) {
        throw new Fail("메시지를 전송할 수 없습니다." + error.message);
      }
    }

   */

  async findAll() {
    return await this.chattingModel.scan().exec();
  }

  async findOne(chattingRoomId: string) {
    return await this.chattingModel.get({ id: chattingRoomId });
  }

  async getTeachersId(chattingIds: string[]) {
    const chatRooms = await this.chattingModel.batchGet(
      chattingIds.map((id) => ({ id })),
    );
    return chatRooms.map((chatRoom) => chatRoom.teacherId);
  }
}
