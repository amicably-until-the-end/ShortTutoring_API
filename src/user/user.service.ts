import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './entities/user.interface';
import {
  NotFound_UpdateUserDto,
  Success_UpdateUserDto,
} from './dto/update-user.dto';
import { Success_CreateUserDto } from './dto/create-user.dto';
import { NotFound_GetUserDto, Success_GetUserDto } from './dto/get-user.dto';
import {
  NotFound_DeleteUserDto,
  Success_DeleteUserDto,
  UpdateUserDto,
} from './dto/delete-user.dto';

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

  async findOne(id: string) {
    const user = await this.userModel.get({ id });
    if (user === undefined) {
      return new NotFound_GetUserDto();
    }

    return new Success_GetUserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.get({ id });
    if (user === undefined) {
      return new NotFound_UpdateUserDto(null);
    }

    await this.userModel.update({ id }, updateUserDto);
    return new Success_UpdateUserDto(await this.userModel.get({ id }));
  }

  async remove(id: string) {
    const user = await this.userModel.get({ id });
    if (user === undefined) {
      return new NotFound_DeleteUserDto();
    }

    await this.userModel.delete({ id });
    return new Success_DeleteUserDto();
  }
}
