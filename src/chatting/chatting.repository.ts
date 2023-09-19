import { Chatting, ChattingKey } from './entities/chatting.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

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

  async getChatRoomInfo(roomId: string) {
    return await this.chattingModel.get({
      id: roomId,
    });
  }

  async getChatRoomsInfo(roomIds: ChattingKey[]) {
    return await this.chattingModel.batchGet(roomIds);
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
}
