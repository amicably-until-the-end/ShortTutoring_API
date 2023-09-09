import { Injectable } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { ChattingRepository } from './chatting.repository';
import { Fail } from '../response';

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
