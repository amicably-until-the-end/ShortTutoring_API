import { Injectable } from '@nestjs/common';
import { User, UserKey } from './entities/user.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User, UserKey>,
  ) {}

  async create(userId: string, createUserDto: CreateUserDto, role: string) {
    const user: User = {
      id: userId,
      name: createUserDto.name,
      bio: createUserDto.bio,
      role,
      profileImage:
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      createdAt: new Date().toISOString(),
    };

    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw new Error('사용자를 생성할 수 없습니다.');
    }
  }

  async get(userId: string): Promise<User> {
    const user: User = await this.userModel.get({
      id: userId,
    });

    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async update(userId: string, updateUser: User) {
    try {
      await this.userModel.get({
        id: userId,
      });
    } catch (error) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    try {
      return await this.userModel.update(
        {
          id: userId,
        },
        updateUser,
      );
    } catch (error) {
      throw new Error('사용자를 수정할 수 없습니다.');
    }
  }

  async delete(userId: string) {
    const user: User = await this.userModel.get({
      id: userId,
    });

    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return await this.userModel.delete({
      id: userId,
    });
  }
}
