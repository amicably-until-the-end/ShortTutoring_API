import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './entities/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(user: User) {
    return await this.userModel.create(user);
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findOne(id: string) {
    return this.userModel.get({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.update({ id }, updateUserDto);
  }

  async removeAll() {
    let ret = 'This action removes all users\n';

    await this.userModel
      .scan()
      .exec()
      .then((users) => {
        users.forEach((user) => {
          ret += user.id + ' removed\n';
          this.userModel.delete(user);
        });
      });
    return ret;
  }

  remove(id: string) {
    return this.userModel.delete({ id });
  }
}
