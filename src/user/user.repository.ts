import {
  CreateStudentDto,
  CreateTeacherDto,
  CreateUserDto,
} from './dto/create-user.dto';
import { User, UserKey } from './entities/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User, UserKey>,
  ) {}

  async create(userId: string, createUserDto: CreateUserDto, role: string) {
    const user: User = {
      bio: createUserDto.bio,
      coin: {
        amount: 0,
        lastReceivedFreeCoinAt: new Date(0),
      },
      followers: [],
      following: [],
      id: userId,
      name: createUserDto.name,
      profileImage: `https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile-img/ic_profile_${createUserDto.profileImg}.png`,
      role: role,
      participatingChattingRooms: [],
    };

    if (role === 'student') {
      const createStudentDto = createUserDto as CreateStudentDto;
      user.school = {
        level: createStudentDto.schoolLevel,
        grade: createStudentDto.schoolGrade,
      };
    } else if (role === 'teacher') {
      const createTeacherDto = createUserDto as CreateTeacherDto;
      user.school = {
        name: createTeacherDto.schoolName,
        department: createTeacherDto.schoolDepartment,
      };
      user.rating = 0;
    }

    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw Error(`user.repository > create > ${error.message} > `);
    }
  }

  async get(userId: string): Promise<User> {
    return await this.userModel.get({ id: userId });
  }

  async update(userId: string, updateUser: User) {
    return await this.userModel.update(
      {
        id: userId,
      },
      updateUser,
    );
  }

  async usersInfo(userIds: string[]) {
    return await this.userModel.batchGet(userIds.map((id) => ({ id })));
  }

  async delete(userId: string) {
    await this.userModel.delete({ id: userId });
  }

  async follow(studentId: string, teacherId: string) {
    try {
      const teacher: User = await this.userModel.get({
        id: teacherId,
      });
      if (teacher === undefined) {
        return new Error('선생님을 찾을 수 없습니다.');
      } else if (teacher.role === 'student') {
        return new Error('학생을 팔로우할 수 없습니다.');
      } else if (teacher.followers.includes(studentId)) {
        return new Error('이미 팔로우 중입니다.');
      }

      const student: User = await this.userModel.get({
        id: studentId,
      });
      if (student === undefined) {
        return new Error('학생을 찾을 수 없습니다.');
      } else if (student.role === 'teacher') {
        return new Error('선생님은 팔로우할 수 없습니다.');
      }

      teacher.followers.push(studentId);
      await this.userModel.update(
        { id: teacherId },
        { followers: teacher.followers },
      );

      student.following.push(teacherId);
      await this.userModel.update(
        {
          id: studentId,
        },
        { following: student.following },
      );
    } catch (error) {
      throw Error(`user.repository > follow > ${error.message} > `);
    }
  }

  async unfollow(studentId: string, teacherId: string) {
    try {
      const teacher: User = await this.userModel.get({
        id: teacherId,
      });
      if (teacher === undefined) {
        throw Error(`user.repository > unfollow > 선생님을 찾을 수 없습니다.`);
      } else if (teacher.role !== 'teacher') {
        throw Error(
          `user.repository > unfollow > 학생을 팔로우할 수 없습니다.`,
        );
      } else if (teacher.followers.includes(studentId) === false) {
        throw Error(`user.repository > unfollow > 팔로우 중이 아닙니다.`);
      }

      const student: User = await this.userModel.get({
        id: studentId,
      });
      if (student === undefined) {
        throw Error(`user.repository > unfollow > 학생을 찾을 수 없습니다.`);
      } else if (student.role !== 'student') {
        throw Error(
          `user.repository > unfollow > 선생님은 팔로우할 수 없습니다.`,
        );
      }

      if (teacher.followers.includes(studentId) === false) {
        throw Error(`user.repository > unfollow > 팔로우 중이 아닙니다.`);
      }
      teacher.followers = teacher.followers.filter(
        (follower) => follower !== studentId,
      );
      await this.userModel.update(
        {
          id: teacherId,
        },
        { followers: teacher.followers },
      );

      student.following = student.following.filter(
        (following) => following !== teacherId,
      );
      await this.userModel.update(
        {
          id: studentId,
        },
        { following: student.following },
      );
    } catch (error) {
      throw Error(`user.repository > unfollow > ${error.message} > `);
    }
  }

  async following(studentId: string) {
    const student: User = await this.get(studentId);
    if (student === undefined) {
      throw Error(`user.repository > following > 학생을 찾을 수 없습니다.`);
    }

    try {
      const following = [];
      for (const followingId of student.following) {
        const user = await this.getOther(followingId);
        if (user !== undefined) {
          following.push(user);
        }
      }
      return following;
    } catch (error) {
      throw Error(`user.repository > following > ${error.message} > `);
    }
  }

  async followers(teacherId: string) {
    const teacher: User = await this.get(teacherId);
    if (teacher === undefined) {
      throw Error(`user.repository > followers > 선생님을 찾을 수 없습니다.`);
    }

    try {
      const followers = [];
      for (const followerId of teacher.followers) {
        const user = await this.getOther(followerId);
        if (user !== undefined) {
          followers.push(user);
        }
      }
      return followers;
    } catch (error) {
      throw Error(`user.repository > followers > ${error.message} > `);
    }
  }

  async getOther(userId: string) {
    const user: User = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return undefined;
    } else {
      return {
        id: user.id,
        name: user.name,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        school: user.school,
        followers: user.followers,
        followingCount: user.following.length,
        rating: undefined,
      };
    }
  }

  async joinChattingRoom(userId: string, chattingRoomId: string) {
    try {
      const user: User = await this.userModel.get({ id: userId });
      user.participatingChattingRooms.push(chattingRoomId);
      await this.userModel.update(
        { id: userId },
        { participatingChattingRooms: user.participatingChattingRooms },
      );
    } catch (error) {
      throw Error(`user.repository > joinChattingRoom > ${error.message}`);
    }
  }

  async removeAllChattingRooms() {
    return await this.userModel
      .scan()
      .exec()
      .then((users) => {
        users.forEach(async (user) => {
          user.participatingChattingRooms = [];
          await this.userModel.update(
            { id: user.id },
            { participatingChattingRooms: user.participatingChattingRooms },
          );
        });
      });
  }

  async receiveFreeCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw Error(
        `user.repository > receiveFreeCoin > 사용자를 찾을 수 없습니다.`,
      );
    }

    const now = new Date();
    if (
      now.getFullYear() == user.coin.lastReceivedFreeCoinAt.getFullYear() &&
      now.getMonth() == user.coin.lastReceivedFreeCoinAt.getMonth() &&
      now.getDate() == user.coin.lastReceivedFreeCoinAt.getDate()
    ) {
      throw Error(
        `user.repository > receiveFreeCoin > 오늘은 이미 받았습니다.`,
      );
    }

    try {
      user.coin.amount += 2;
      user.coin.lastReceivedFreeCoinAt = now;
      await this.userModel.update({ id: userId }, { coin: user.coin });
    } catch (error) {
      throw Error(`user.repository > receiveFreeCoin > ${error.message}`);
    }
  }

  /**
   * 보유 코인을 가져옵니다.
   * @param userId
   */
  async getCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw Error(`user.repository > getCoin > 사용자를 찾을 수 없습니다.`);
    }

    return user.coin.amount;
  }

  /**
   * 코인을 1개 사용합니다.
   * @param userId
   */
  async useCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw Error(`user.repository > useCoin > 사용자를 찾을 수 없습니다.`);
    }

    if (user.coin.amount < 1) {
      throw Error(`user.repository > useCoin > 코인이 부족합니다.`);
    }
    // TODO : 동시성 이슈 발생 가능
    try {
      user.coin.amount -= 1;
      await this.userModel.update({ id: userId }, { coin: user.coin });
    } catch (error) {
      throw Error(`user.repository > useCoin > ${error.message}`);
    }
  }

  /**
   * 코인을 1개 얻습니다.
   * @param userId
   */
  async earnCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw Error('사용자를 찾을 수 없습니다.');
    }
    // TODO : 동시성 이슈 발생 가능
    const coin = user.coin;
    try {
      coin.amount += 1;
      return await this.userModel.update({ id: userId }, { coin: coin });
    } catch (error) {
      throw Error(`user.repository > earnCoin > ${error.message}`);
    }
  }

  async getTeachers() {
    return await this.userModel
      .scan({
        role: {
          eq: 'teacher',
        },
      })
      .exec();
  }
}
