import { Injectable } from '@nestjs/common';
import { Chatting, ChattingKey } from './entities/chatting.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserRepository } from '../user/user.repository';
import { v4 as uuid } from 'uuid';
import { Fail } from '../response';

@Injectable()
export class ChattingRepository {
  constructor(
    @InjectModel('Chatting')
    private readonly chattingModel: Model<Chatting, ChattingKey>,
    private readonly userRepository: UserRepository,
  ) {}

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
  }
}
