import { Injectable } from '@nestjs/common';
import { User } from './entities/user.interface';
import { Fail, Success } from '../response';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from './user.repository';
import { AuthRepository } from '../auth/auth.repository';
import { MessageBuilder } from 'discord-webhook-node';
import { webhook } from '../config.discord-webhook';

@Injectable()
export class UserService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   사용자를 생성합니다.
   @param createUserDto 사용자 생성 DTO
   @return 사용자 정보
   */
  async signup(createUserDto: CreateUserDto) {
    const vendor = createUserDto.vendor;
    const code = createUserDto.authorizationCode;

    try {
      const { jwt, userId } = await this.authRepository.generateJwt(
        vendor,
        code,
      );

      const user = await this.userRepository.create(
        {
          vendor,
          userId,
        },
        createUserDto,
      );

      const embed = new MessageBuilder()
        .setTitle('회원가입')
        .setColor(Number('#00ff00'))
        .setImage(user.profileImage)
        .setDescription(`${user.name}님이 회원가입했습니다.`);
      await webhook.send(embed);

      return new Success('성공적으로 회원가입했습니다.', { jwt });
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
   @param userKey 업데이트할 사용자의 키
   @param updateUserDto 업데이트할 사용자 정보
   @return 업데이트된 사용자 정보
   */
  async update(
    userKey: { vendor: string; userId: string },
    updateUserDto: UpdateUserDto,
  ) {
    const profileImage = await this.profileImage(userKey.userId, updateUserDto);

    const updateUser = {
      name: updateUserDto.name,
      bio: updateUserDto.bio,
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
