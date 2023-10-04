import { AuthRepository } from '../auth/auth.repository';
import { webhook } from '../config.discord-webhook';
import { RedisRepository } from '../redis/redis.repository';
import { Fail, Success } from '../response';
import { UploadRepository } from '../upload/upload.repository';
import { CreateStudentDto, CreateTeacherDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.interface';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { MessageBuilder } from 'discord-webhook-node';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly redisRepository: RedisRepository,
  ) {}

  /**
   학생 사용자를 생성합니다.
   @param createStudentDto 학생 사용자 생성 DTO
   @return token 학생 사용자 토큰
   */
  async signupStudent(createStudentDto: CreateStudentDto) {
    const vendor = createStudentDto.vendor;
    const accessToken = `Bearer ${createStudentDto.accessToken}`;

    try {
      const authId = await this.authRepository.getAuthIdFromAccessToken(
        vendor,
        accessToken,
      );

      const userId = uuid();
      await this.authRepository.createAuth(vendor, authId, userId, 'student');
      const token = await this.authRepository.signJwt(
        vendor,
        authId,
        userId,
        'student',
      );
      const user = await this.userRepository.create(
        userId,
        createStudentDto,
        'student',
      );

      const embed = new MessageBuilder()
        .setTitle('회원가입')
        .setColor(Number('#00ff00'))
        .setImage(user.profileImage)
        .setDescription(`${user.name}님이 회원가입했습니다.`);
      await webhook.send(embed);

      return new Success('성공적으로 회원가입했습니다.', { token });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   선생님 사용자를 생성합니다.
   @return token 학생 사용자 토큰
   * @param createTeacherDto
   */
  async signupTeacher(createTeacherDto: CreateTeacherDto) {
    const vendor = createTeacherDto.vendor;
    const accessToken = `Bearer ${createTeacherDto.accessToken}`;

    try {
      const oauthId = await this.authRepository.getAuthIdFromAccessToken(
        vendor,
        accessToken,
      );

      const userId = uuid();
      await this.authRepository.createAuth(vendor, oauthId, userId, 'teacher');
      const token = await this.authRepository.signJwt(
        vendor,
        oauthId,
        userId,
        'teacher',
      );
      const user = await this.userRepository.create(
        userId,
        createTeacherDto,
        'teacher',
      );

      const embed = new MessageBuilder()
        .setTitle('회원가입')
        .setColor(Number('#00ff00'))
        .setImage(user.profileImage)
        .setDescription(`${user.name}님이 회원가입했습니다.`);
      await webhook.send(embed);

      return new Success('성공적으로 회원가입했습니다.', { token });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 로그인합니다.
   * 로그인 성공 시, JWT 토큰을 반환합니다.
   * 로그인 실패 시, 실패 메시지를 반환합니다.
   * @param loginUserDto
   */
  async login(loginUserDto: LoginUserDto) {
    try {
      const authId = await this.authRepository.getAuthIdFromAccessToken(
        loginUserDto.vendor,
        `Bearer ${loginUserDto.accessToken}`,
      );
      const userId = await this.authRepository.getUserIdFromAccessToken(
        loginUserDto.vendor,
        `Bearer ${loginUserDto.accessToken}`,
      );

      const user = await this.userRepository.get(userId);

      const token = await this.authRepository.signJwt(
        loginUserDto.vendor,
        authId,
        userId,
        user.role,
      );

      return new Success('성공적으로 로그인했습니다.', {
        role: user.role,
        token,
      });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 내 프로필을 조회합니다.
   * @returns User 나의 프로필
   */
  async profile(userId: string) {
    try {
      const user: User = await this.userRepository.get(userId);
      return new Success('나의 프로필을 성공적으로 조회했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   updateUserDto 프로필 이미지를 S3에 업로드하고, URL을 반환합니다.
   @param userId 사용자 ID
   @param updateUserDto
   @return profileImage URL
   */
  async profileImage(userId: string, updateUserDto: UpdateUserDto) {
    return await this.uploadRepository
      .uploadBase64(
        `user/${userId}`,
        `profile.${updateUserDto.profileImageFormat}`,
        updateUserDto.profileImageBase64,
      )
      .then((res) => res.toString());
  }

  /**
   사용자 정보를 업데이트합니다.
   @param userId
   @param updateUserDto 업데이트할 사용자 정보
   @return 업데이트된 사용자 정보
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const profileImage = await this.profileImage(userId, updateUserDto);

    const updateUser = {
      name: updateUserDto.name,
      bio: updateUserDto.bio,
      profileImage,
    } as User;

    try {
      const user = await this.userRepository.update(userId, updateUser);
      return new Success('성공적으로 사용자 프로필을 업데이트했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 사용자 정보를 조회합니다.
   * @param userId
   */
  async otherProfile(userId: string) {
    try {
      return new Success(
        '사용자 프로필을 성공적으로 가져왔습니다.',
        await this.userRepository.getOther(userId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async withdraw(userId: string, token: string) {
    const stToken = token.split(' ')[1];
    const decoded = await this.authRepository.decodeJwt(stToken);

    try {
      await this.userRepository.get(userId);
      await this.userRepository.delete(userId);
      await this.authRepository.delete(decoded.vendor, decoded.authId);
      return new Success('회원 탈퇴가 성공적으로 진행되었습니다.', null);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async follow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.follow(studentId, teacherId);
      return new Success('성공적으로 팔로우했습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async unfollow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.unfollow(studentId, teacherId);
      return new Success('성공적으로 언팔로우했습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async following(studentId: string) {
    try {
      return new Success(
        '성공적으로 팔로잉한 선생님들을 가져왔습니다.',
        await this.userRepository.following(studentId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async otherFollowers(userId: string) {
    try {
      return new Success(
        '성공적으로 팔로워 학생들을 가져왔습니다.',
        await this.userRepository.followers(userId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async followers(teacherId: string) {
    try {
      return new Success(
        '성공적으로 팔로워 학생들을 가져왔습니다.',
        await this.userRepository.followers(teacherId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getOnlineTeachers() {
    const users = await this.redisRepository.getAllKeys();
    console.log(users);
    if (users.length == 0)
      return new Success('현재 온라인 선생님이 없습니다.', []);
    const userInfos = await this.userRepository.usersInfo(users);
    const onlineTeachers = userInfos.filter((user) => user.role == 'teacher');
    const result = onlineTeachers.map((teacher) => {
      const { id, name, profileImage, followers } = teacher;
      return { id, name, profileImage, followers: followers.length };
    });
    return new Success(
      '현재 온라인 선생님들을 성공적으로 가져왔습니다.',
      result,
    );
  }

  async otherFollowing(userId: string) {
    try {
      return new Success(
        '성공적으로 팔로잉한 선생님들을 가져왔습니다.',
        await this.userRepository.following(userId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async setFCMToken(userId: any, fcmToken: string) {
    try {
      await this.redisRepository.setFCMToken(userId, fcmToken);
      return new Success('성공적으로 FCM 토큰을 저장했습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async receiveFreeCoin(userId: string) {
    try {
      await this.userRepository.receiveFreeCoin(userId);
      return new Success('성공적으로 무료 코인을 지급받았습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
