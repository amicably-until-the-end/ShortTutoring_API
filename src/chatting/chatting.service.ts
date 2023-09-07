import { Injectable } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Chatting, ChattingKey } from './entities/chatting.interface';
import { UserRepository } from '../user/user.repository';
import { v4 as uuid } from 'uuid';
import { Fail } from '../response';

@Injectable()
export class ChattingService {
  constructor(
    @InjectModel('Chatting')
    private readonly chattingModel: Model<Chatting, ChattingKey>,
    private readonly userRepository: UserRepository,
  ) {}

  async create(senderId: string, createChattingDto: CreateChattingDto) {
    const receiverId = createChattingDto.receiverId;
    const receiver = await this.userRepository.get(receiverId);
    const sender = await this.userRepository.get(senderId);

    const chattingRoomId = uuid();
    const chatting: Chatting = {
      id: chattingRoomId,
      participants: [senderId, receiverId],
      logs: [],
    };

    await this.chattingModel.create(chatting);
    try {
      await this.userRepository.addChatting(
        senderId,
        receiverId,
        chattingRoomId,
      );
    } catch (error) {
      return new Fail('채팅방을 생성할 수 없습니다.');
    }

    return {
      chattingRoomId,
      sender,
      receiver,
    };
  }

  findAll() {
    return `This action returns all chatting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatting`;
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
