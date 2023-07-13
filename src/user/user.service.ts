import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './entities/user.interface';
import {
  Success_CreateUserDto,
  Success_DeleteUserDto,
  Success_GetUserDto,
  Success_UpdateUserDto,
} from './dto/response-user.dto';
import { NotFoundDto } from '../HttpResponseDto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(user: User) {
    await this.userModel.create(user);
    const response = new Success_CreateUserDto(user);
    response.data = user;

    //TODO 인증 예외처리
    return response;
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findOne(userId: string) {
    const user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto('사용자를 찾을 수 없습니다.');
    }

    return new Success_GetUserDto(user);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto(null);
    }

    await this.userModel.update({ id: userId }, updateUserDto);
    return new Success_UpdateUserDto(await this.userModel.get({ id: userId }));
  }

  async remove(userId: string) {
    const user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto('사용자를 찾을 수 없습니다.');
    }

    await this.userModel.delete({ id: userId });
    return new Success_DeleteUserDto();
  }
}
