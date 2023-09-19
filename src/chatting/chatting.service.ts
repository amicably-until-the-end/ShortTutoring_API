import { Fail, Success } from '../response';
import { ChattingRepository } from './chatting.repository';
import { CreateChattingDto, SendMessageDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingService {
  constructor(private readonly chattingRepository: ChattingRepository) {}

  async create(senderId: string, createChattingDto: CreateChattingDto) {
    const receiverId = createChattingDto.receiverId;
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

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    const receiverId = sendMessageDto.receiverId;
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

  async findAll() {
    return await this.chattingRepository.findAll();
  }

  async findOne(chattingRoomId: string) {
    return await this.chattingRepository.findOne(chattingRoomId);
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  async removeAll() {
    return await this.chattingRepository.removeAll();
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
