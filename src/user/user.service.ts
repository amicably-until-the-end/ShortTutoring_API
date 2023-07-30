import { Injectable } from '@nestjs/common';
import { User } from './entities/user.interface';
import { Fail, Success } from '../response';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   createdUserDto의 프로필 이미지를 S3에 업로드하고, URL을 반환합니다.
   @param userId 사용자 ID
   @param createUserDto 사용자 정보
   @return profileImage URL
   */
  async profileImage(userId: string, createUserDto: CreateUserDto) {
    return await this.uploadRepository
      .uploadBase64(
        `user/${userId}`,
        `profile.${createUserDto.profileImageFormat}`,
        createUserDto.profileImageBase64,
      )
      .then((res) => res.toString());
  }

  /**
   사용자를 생성합니다.
   @param userKey
   @param createUserDto 사용자 정보
   @return 사용자 정보
   */
  async signup(
    userKey: { vendor: string; userId: string },
    createUserDto: CreateUserDto,
  ) {
    const profileImage = await this.profileImage(userKey.userId, createUserDto);

    try {
      const user: User = await this.userRepository.create(
        userKey,
        createUserDto,
        profileImage,
      );
      return new Success('성공적으로 회원가입했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 로그인합니다.
   * 로그인 성공 시, 사용자 정보를 반환합니다.
   * 로그인 실패 시, NotFound 예외를 반환합니다.
   * @param userKey
   */
  async login(userKey: { vendor: string; userId: string }) {
    try {
      const user: User = await this.userRepository.get(userKey);
      return new Success('성공적으로 로그인했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 내 프로필을 조회합니다.
   * @returns User 나의 프로필
   */
  async profile(userKey: { vendor: string; userId: string }) {
    try {
      const user: User = await this.userRepository.get(userKey);
      return new Success('나의 프로필을 성공적으로 조회했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   사용자 정보를 업데이트합니다.
   @param userKey 업데이트할 사용자의 키
   @param updateUserDto 업데이트할 사용자 정보
   @return 업데이트된 사용자 정보
   */
  async update(
    userKey: { vendor: string; userId: string },
    updateUserDto: UpdateUserDto,
  ) {
    const profileImage = await this.profileImage(
      userKey.userId,
      updateUserDto as CreateUserDto,
    );

    const updateUser = {
      name: updateUserDto.name,
      bio: updateUserDto.bio,
      role: updateUserDto.role,
      profileImage,
    } as User;

    try {
      const user = await this.userRepository.update(userKey, updateUser);
      return new Success('성공적으로 사용자 프로필을 업데이트했습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 사용자 정보를 조회합니다.
   * @param userKey
   */
  async otherProfile(userKey: { userId: string; vendor: string }) {
    try {
      return new Success(
        '사용자 프로필을 성공적으로 가져왔습니다.',
        await this.userRepository.get(userKey),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async withdraw(userKey: { userId: string; vendor: string }) {
    try {
      await this.userRepository.get(userKey);
      await this.userRepository.delete(userKey);
      return new Success('회원 탈퇴가 성공적으로 진행되었습니다.', userKey);
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
