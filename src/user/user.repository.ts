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
    const user: User = await this.userModel.get({
      id: userId,
    });
    if (user === undefined) {
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

  async usersInfo(userIds: string[]) {
    const users = await this.userModel.batchGet(userIds.map((id) => ({ id })));
    if (users === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return users;
  }

  async delete(userId: string) {
    const user: User = await this.userModel.get({
      id: userId,
    });
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    try {
      return await this.userModel.delete({
        id: userId,
      });
    } catch (error) {
      throw new Error('사용자를 삭제할 수 없습니다.');
    }
  }

  async follow(studentId: string, teacherId: string) {
    const teacher: User = (await this.userModel.get({
      id: teacherId,
    })) as User;
    if (teacher === undefined) {
      throw new Error('선생님을 찾을 수 없습니다.');
    } else if (teacher.role !== 'teacher') {
      throw new Error('학생을 팔로우할 수 없습니다.');
    } else if (teacher.followers.includes(studentId)) {
      throw new Error('이미 팔로우 중입니다.');
    }

    const student: User = (await this.userModel.get({
      id: studentId,
    })) as User;
    if (student === undefined) {
      throw new Error('학생을 찾을 수 없습니다.');
    } else if (student.role !== 'student') {
      throw new Error('선생님은 팔로우할 수 없습니다.');
    }

    try {
      teacher.followers.push(studentId);
      await this.userModel.update(
        { id: teacherId },
        { followers: teacher.followers },
      );
      console.log('follower', teacher.followers);

      student.following.push(teacherId);
      await this.userModel.update(
        {
          id: studentId,
        },
        { following: student.following },
      );
    } catch (error) {
      throw new Error('팔로우를 할 수 없습니다.');
    }
  }

  async unfollow(studentId: string, teacherId: string) {
    const teacher: User = (await this.userModel.get({
      id: teacherId,
    })) as User;
    if (teacher === undefined) {
      throw new Error('선생님을 찾을 수 없습니다.');
    } else if (teacher.role !== 'teacher') {
      throw new Error('학생을 팔로우할 수 없습니다.');
    } else if (teacher.followers.includes(studentId) === false) {
      throw new Error('팔로우 중이 아닙니다.');
    }

    const student: User = (await this.userModel.get({
      id: studentId,
    })) as User;
    if (student === undefined) {
      throw new Error('학생을 찾을 수 없습니다.');
    } else if (student.role !== 'student') {
      throw new Error('선생님은 팔로우할 수 없습니다.');
    }

    if (teacher.followers.includes(studentId) === false) {
      throw new Error('팔로우 중이 아닙니다.');
    }
    try {
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
      throw new Error('언팔로우를 할 수 없습니다.');
    }
  }

  async following(studentId: string) {
    const student: User = await this.get(studentId);
    if (student === undefined) {
      throw new Error('학생을 찾을 수 없습니다.');
    }

    try {
      const following = [];
      for (const followingId of student.following) {
        following.push(await this.getOther(followingId));
      }
      return following;
    } catch (error) {
      throw new Error('팔로잉 목록을 가져올 수 없습니다.');
    }
  }

  async followers(teacherId: string) {
    const teacher: User = await this.get(teacherId);
    if (teacher === undefined) {
      throw new Error('선생님을 찾을 수 없습니다.');
    }

    try {
      const followers = [];
      for (const followerId of teacher.followers) {
        followers.push(await this.getOther(followerId));
      }
      return followers;
    } catch (error) {
      throw new Error('팔로워 목록을 가져올 수 없습니다.');
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
      throw new Error('채팅방을 추가할 수 없습니다.');
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
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const now = new Date();
    if (
      now.getFullYear() == user.coin.lastReceivedFreeCoinAt.getFullYear() &&
      now.getMonth() == user.coin.lastReceivedFreeCoinAt.getMonth() &&
      now.getDate() == user.coin.lastReceivedFreeCoinAt.getDate()
    ) {
      throw new Error('오늘은 이미 무료 코인을 받았습니다.');
    }

    try {
      user.coin.amount += 2;
      user.coin.lastReceivedFreeCoinAt = now;
      await this.userModel.update({ id: userId }, { coin: user.coin });
    } catch (error) {
      throw new Error('무료 코인을 받을 수 없습니다.');
    }
  }

  /**
   * 보유 코인을 가져옵니다.
   * @param userId
   */
  async getCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
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
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (user.coin.amount < 1) {
      throw new Error('코인이 부족합니다.');
    }
    // TODO : 동시성 이슈 발생 가능
    try {
      user.coin.amount -= 1;
      await this.userModel.update({ id: userId }, { coin: user.coin });
    } catch (error) {
      throw new Error('코인을 사용할 수 없습니다.');
    }
  }

  /**
   * 코인을 1개 얻습니다.
   * @param userId
   */
  async earnCoin(userId: string) {
    const user: User = await this.get(userId);
    if (user === undefined) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    // TODO : 동시성 이슈 발생 가능
    const coin = user.coin;
    coin.amount += 1;
    return await this.userModel.update({ id: userId }, { coin: coin });
  }

  async getTeachers() {
    try {
      return await this.userModel
        .scan({
          role: {
            eq: 'teacher',
          },
        })
        .exec();
    } catch (error) {
      throw new Error('선생님 목록을 가져올 수 없습니다.');
    }
  }
}
