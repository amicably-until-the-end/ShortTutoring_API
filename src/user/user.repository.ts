import { Injectable } from '@nestjs/common';
import { User, UserKey } from './entities/user.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import {
  CreateStudentDto,
  CreateTeacherDto,
  CreateUserDto,
} from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User, UserKey>,
  ) {}

  async create(userId: string, createUserDto: CreateUserDto, role: string) {
    const user: User = {
      bio: createUserDto.bio,
      createdAt: new Date().toISOString(),
      followers: [],
      following: [],
      id: userId,
      name: createUserDto.name,
      profileImage:
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      role,
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
        division: createTeacherDto.schoolDivision,
        department: createTeacherDto.schoolDepartment,
        grade: createTeacherDto.schoolGrade,
      };
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
      await this.update(teacherId, teacher);

      student.following.push(teacherId);
      await this.update(studentId, student);
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
      await this.update(teacherId, teacher);

      student.following = student.following.filter(
        (following) => following !== teacherId,
      );
      await this.update(studentId, student);
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
      const following: User[] = [];
      for (const followingId of student.following) {
        following.push(await this.get(followingId));
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
      const followers: User[] = [];
      for (const followerId of teacher.followers) {
        followers.push(await this.get(followerId));
      }
      return followers;
    } catch (error) {
      throw new Error('팔로워 목록을 가져올 수 없습니다.');
    }
  }
}
