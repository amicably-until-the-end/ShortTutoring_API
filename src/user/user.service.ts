import { AuthRepository } from '../auth/auth.repository';
import { apiErrorWebhook, signupWebhook } from '../config.discord-webhook';
import { QuestionRepository } from '../question/question.repository';
import { RedisRepository } from '../redis/redis.repository';
import { Fail, Success } from '../response';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { UploadRepository } from '../upload/upload.repository';
import { CreateStudentDto, CreateTeacherDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  StudentListing,
  TeacherListing,
  TutoringHistory,
  UserListing,
} from './entities/user.entities';
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
    private readonly tutoringRepository: TutoringRepository,
    private readonly questionRepository: QuestionRepository,
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
        .setImage(
          `https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile-img/ic_profile_${user.profileImage}.png`,
        )
        .setDescription(`${user.name} ${user.role}이 회원가입했습니다.`);
      await signupWebhook.send(embed);

      return new Success('성공적으로 회원가입했습니다.', { token });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > signupStudent > ${error.message} > `,
      );
      return new Fail('회원가입에 실패했습니다.');
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
        .setImage(
          `https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile-img/ic_profile_${user.profileImage}.png`,
        )
        .setDescription(`${user.name} ${user.role}이 회원가입했습니다.`);
      await signupWebhook.send(embed);

      return new Success('성공적으로 회원가입했습니다.', { token });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > signupTeacher > ${error.message} > `,
      );
      return new Fail('회원가입에 실패했습니다.');
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
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > login > ${error.message} > `,
      );
      return new Fail('로그인에 실패했습니다.');
    }
  }

  /**
   * 내 프로필을 조회합니다.
   * @returns User 나의 프로필
   */
  async profile(userId: string) {
    try {
      const user: User = await this.userRepository.get(userId);
      if (user.role === 'teacher') {
        user.rating = await this.tutoringRepository.getTeacherRating(userId);
      }

      return new Success('나의 프로필을 성공적으로 조회했습니다.', user);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > profile > ${error.message} > `,
      );
      return new Fail('프로필을 조회하는데 실패했습니다.');
    }
  }

  /**
   updateUserDto 프로필 이미지를 S3에 업로드하고, URL을 반환합니다.
   @param userId 사용자 ID
   @param updateUserDto
   @return profileImage URL
   */
  async profileImage(userId: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.uploadRepository
        .uploadBase64(
          `user/${userId}`,
          `profile.${updateUserDto.profileImageFormat}`,
          updateUserDto.profileImageBase64,
        )
        .then((res) => res.toString());
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > profileImage > ${error.message} > `,
      );
      return new Fail('프로필 이미지 업로드에 실패했습니다.');
    }
  }

  /**
   사용자 정보를 업데이트합니다.
   @param userId
   @param updateUserDto 업데이트할 사용자 정보
   @return 업데이트된 사용자 정보
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const profileImage = await this.profileImage(userId, updateUserDto);
    if (profileImage instanceof Fail) {
      return new Fail('프로필 이미지 업로드에 실패했습니다.');
    }

    const updateUser = {
      name: updateUserDto.name,
      bio: updateUserDto.bio,
      profileImage,
    } as User;

    try {
      const user = await this.userRepository.update(userId, updateUser);
      return new Success('성공적으로 사용자 프로필을 업데이트했습니다.', user);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > update > ${error.message} > `,
      );
      return new Fail('사용자 프로필 업데이트에 실패했습니다.');
    }
  }

  /**
   * 사용자 정보를 조회합니다.
   * @param userId
   */
  async otherProfile(userId: string) {
    try {
      const user = await this.userRepository.getOther(userId);
      if (user.role === 'teacher') {
        user.rating = await this.tutoringRepository.getTeacherRating(userId);
      }

      return new Success('사용자 프로필을 성공적으로 가져왔습니다.', user);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > otherProfile > ${error.message} > `,
      );
      return new Fail('사용자 프로필을 가져오는데 실패했습니다.');
    }
  }

  async withdraw(userId: string, token: string) {
    const stToken = token.split(' ')[1];
    const decoded = this.authRepository.decodeJwt(stToken);

    try {
      await this.userRepository.get(userId);
      await this.userRepository.delete(userId);
      await this.authRepository.delete(decoded.vendor, decoded.authId);
      return new Success('회원 탈퇴가 성공적으로 진행되었습니다.', null);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > withdraw > ${error.message} > `,
      );
      return new Fail('회원 탈퇴에 실패했습니다.');
    }
  }

  async follow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.follow(studentId, teacherId);
      return new Success('성공적으로 팔로우했습니다.');
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > follow > ${error.message} > `,
      );
      return new Fail('팔로우에 실패했습니다.');
    }
  }

  async unfollow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.unfollow(studentId, teacherId);
      return new Success('성공적으로 언팔로우했습니다.');
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > unfollow > ${error.message} > `,
      );
      return new Fail('언팔로우에 실패했습니다.');
    }
  }

  /**
   * 내가 팔로우한 선생님들을 가져옵니다.
   */
  async following(studentId: string) {
    try {
      return new Success(
        '성공적으로 팔로잉한 선생님들을 가져왔습니다.',
        await this.userRepository.following(studentId),
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > following > ${error.message} > `,
      );
      return new Fail('팔로잉한 선생님들을 가져오는데 실패했습니다.');
    }
  }

  async otherFollowers(userId: string) {
    try {
      const user = await this.userRepository.get(userId);
      const userList = await Promise.all(
        user.followers.map(async (id) => await this.getOther(id)),
      );
      return new Success(
        '해당 사용자를 팔로우하는 사용자들의 정보를 성공적으로 가져왔습니다.',
        userList,
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > otherFollowers > ${error.message} > `,
      );
      return new Fail('팔로워 정보를 가져오는데 실패했습니다.');
    }
  }

  async followers(teacherId: string) {
    try {
      const teacher: User = await this.userRepository.get(teacherId);
      const followers = [];
      for (const followerId of teacher.followers) {
        followers.push(await this.getOther(followerId));
      }
      return new Success(
        '성공적으로 팔로워 학생들을 가져왔습니다.',
        await this.userRepository.followers(teacherId),
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > followers > ${error.message} > `,
      );
      return new Fail('팔로워 학생들을 가져오는데 실패했습니다.');
    }
  }

  /**
   * 특정 사용자의 정보를 가져옵니다.
   * @param userId 조회할 사용자 ID
   * @returns User 사용자 정보, 민감한 정보는 포함되지 않습니다.
   */
  async getOther(userId: string): Promise<UserListing> {
    const user: User = await this.userRepository.get(userId);
    if (user === undefined) {
      return undefined;
    } else {
      if (user.role == 'teacher') {
        const accTutoring =
          await this.tutoringRepository.getTutoringCntOfTeacher(userId);
        const teacher: TeacherListing = {
          id: user.id,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          univ: user.school.name,
          major: user.school.department,
          followerIds: user.followers,
          reserveCnt: accTutoring.length,
          bio: user.bio,
          rating: 5,
        };
        return teacher;
      } else if (user.role == 'student') {
        const student: StudentListing = {
          id: user.id,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          schoolLevel: user.school.level,
          grade: user.school.grade,
        };
        return student;
      }
    }
  }

  async getBestTeachers(userId: string) {
    try {
      await this.userRepository.get(userId);
      const bestTeachers = await this.userRepository.getTeachers();
      for (const teacher of bestTeachers) {
        teacher.rating = await this.tutoringRepository.getTeacherRating(
          teacher.id,
        );
      }

      bestTeachers.sort((a, b) => b.rating - a.rating);

      return new Success(
        '성공적으로 최고의 선생님들을 가져왔습니다.',
        bestTeachers,
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > getBestTeachers > ${error.message} > `,
      );
      return new Fail('최고의 선생님들을 가져오는데 실패했습니다.');
    }
  }

  async getOnlineTeachers(userId: string) {
    try {
      const users = await this.redisRepository.getAllKeys();
      const userState = await Promise.all(
        users.map(async (user) => {
          try {
            return {
              id: user,
              online: (await this.redisRepository.getSocketId(user)) != null,
            };
          } catch (error) {
            return null;
          }
        }),
      );
      const onlineUsers = userState.filter(
        (user) => user != null && user.online,
      );
      if (onlineUsers.length == 0)
        return new Success('현재 온라인 선생님이 없습니다.', []);
      const userIds = onlineUsers.map((teacher) => teacher.id);
      const userInfos = await this.userRepository.usersInfo(userIds);
      const teacherInfos = userInfos.filter((user) => user.role == 'teacher');
      //TODO: rating 수정
      const result: TeacherListing[] = await Promise.all(
        teacherInfos.map(async (teacher) => {
          return {
            id: teacher.id,
            name: teacher.name,
            profileImage: teacher.profileImage,
            role: teacher.role,
            univ: teacher.school.name,
            major: teacher.school.department,
            followerIds: teacher.followers,
            reserveCnt: (
              await this.tutoringRepository.getTutoringCntOfTeacher(teacher.id)
            ).length,
            bio: teacher.bio,
            rating: 5,
          };
        }),
      );
      return new Success(
        '현재 온라인 선생님들을 성공적으로 가져왔습니다.',
        result,
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > getOnlineTeachers > ${error.message} > `,
      );
      return new Fail('현재 온라인 선생님들을 가져오는데 실패했습니다.');
    }
  }

  async otherFollowing(userId: string) {
    try {
      const user = await this.userRepository.get(userId);
      const userList = await Promise.all(
        user.following.map(async (id) => await this.getOther(id)),
      );
      return new Success(
        '해당 사용자가 팔로잉하는 사용자들의 정보를 성공적으로 가져왔습니다.',
        userList,
      );
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > otherFollowing > ${error.message} > `,
      );
      return new Fail('팔로잉 정보를 가져오는데 실패했습니다.');
    }
  }

  async setFCMToken(userId: any, fcmToken: string) {
    try {
      await this.redisRepository.setFCMToken(userId, fcmToken);
      return new Success('성공적으로 FCM 토큰을 저장했습니다.');
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > setFCMToken > ${error.message} > `,
      );
      return new Fail('FCM 토큰을 저장하는데 실패했습니다.');
    }
  }

  async receiveFreeCoin(userId: string) {
    try {
      await this.userRepository.receiveFreeCoin(userId);
      return new Success('성공적으로 무료 코인을 지급받았습니다.');
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > receiveFreeCoin > ${error.message} > `,
      );
      return new Fail('무료 코인을 지급받는데 실패했습니다.');
    }
  }

  async tutoringList(userId: any) {
    try {
      const user = await this.userRepository.get(userId);
      const role = user.role;

      const tutoringHistory = await this.tutoringRepository.history(
        userId,
        role,
      );
      const result = await Promise.all(
        tutoringHistory.map(async (tutoring) => {
          const question = await this.questionRepository.getInfo(
            tutoring.questionId,
          );
          const opponent = await this.userRepository.get(
            role == 'teacher' ? tutoring.studentId : tutoring.teacherId,
          );
          const history: TutoringHistory = {
            tutoringId: tutoring.id,
            description: question.problem.description,
            schoolLevel: question.problem.schoolLevel,
            schoolSubject: question.problem.schoolSubject,
            tutoringDate: tutoring.startedAt,
            questionId: tutoring.questionId,
            opponentName: opponent.name,
            opponentProfileImage: opponent.profileImage,
            opponentId: opponent.id,
            questionImage: question.problem.mainImage,
            recordFileUrl: tutoring.recordingFilePath,
          };
          return history;
        }),
      );

      return new Success('과외 내역을 가져왔습니다.', result);
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > tutoringList > ${error.message} > `,
      );
      return new Fail('과외 내역을 가져오는데 실패했습니다.');
    }
  }

  async reviewList(userId: any) {
    const user = await this.userRepository.get(userId);
    if (user.role === 'student') {
      return new Fail('선생님의 리뷰 내역만 볼 수 있습니다.');
    }

    try {
      const reviewHistory = await this.tutoringRepository.reviewHistory(userId);

      for (const review of reviewHistory) {
        review.student = await this.userRepository.getOther(review.studentId);
      }

      return new Success('리뷰 내역을 가져왔습니다.', {
        count: reviewHistory.length,
        history: reviewHistory,
      });
    } catch (error) {
      await apiErrorWebhook.send(
        `[${process.env.NODE_ENV}] user.service > reviewList > ${error.message} > `,
      );
      return new Fail('리뷰 내역을 가져오는데 실패했습니다.');
    }
  }
}
