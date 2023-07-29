import { Injectable } from '@nestjs/common';
import { User, UserKey } from './entities/user.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User, UserKey>,
  ) {}

  async create(
    userKey: {
      vendor: string;
      userId: string;
    },
    createUserDto: CreateUserDto,
    profileImage: string,
  ) {
    const user: User = {
      vendor: userKey.vendor,
      id: userKey.userId,
      name: createUserDto.name,
      bio: createUserDto.bio,
      role: createUserDto.role,
      profileImage,
      createdAt: new Date().toISOString(),
    };

    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw new Error('사용자를 생성할 수 없습니다.');
    }
  }

  async get(userKey: { vendor: string; userId: string }): Promise<User> {
    const user: User = await this.userModel.get({
      vendor: userKey.vendor,
      id: userKey.userId,
    });

    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async update(userKey: { userId: string; vendor: string }, updateUser: User) {
    try {
      const user: User = await this.userModel.get({
        vendor: userKey.vendor,
        id: userKey.userId,
      });
    } catch (error) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    try {
      return await this.userModel.update(
        {
          vendor: userKey.vendor,
          id: userKey.userId,
        },
        updateUser,
      );
    } catch (error) {
      throw new Error('사용자를 수정할 수 없습니다.');
    }
  }

  async delete(userKey: { userId: string; vendor: string }) {
    const user: User = await this.userModel.get({
      vendor: userKey.vendor,
      id: userKey.userId,
    });

    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return await this.userModel.delete({
      vendor: userKey.vendor,
      id: userKey.userId,
    });
  }
}
