import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './entities/user.interface';
import {
  Success_CreateUserDto,
  Success_DeleteUserDto,
  Success_GetUserDto,
  Success_UpdateUserDto,
} from './dto/response-user.dto';
import { NotFoundDto } from '../HttpResponseDto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { UploadController } from '../upload/upload.controller';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  /*
  createdUserDto의 프로필 이미지를 S3에 업로드하고, URL을 반환합니다.
  @param userId 사용자 ID
  @param createdUserDto 사용자 정보
  @exception 프로필 이미지 데이터가 존재하지 않을 경우 기본 이미지 URL을 반환합니다.
  @return profileImage URL
   */
  async profileImage(userId: string, createUserDto: CreateUserDto) {
    if (createUserDto.profileImage.base64 === undefined) {
      return 'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png';
    }

    const uploadController = new UploadController();
    return await uploadController
      .uploadBase64(
        userId,
        `profile.${createUserDto.profileImage.format}`,
        createUserDto.profileImage.base64,
      )
      .then((res) => res.toString());
  }

  /*
  사용자를 생성합니다.
  @param createUserDto 사용자 정보
  @return 사용자 정보
   */
  async create(createUserDto: CreateUserDto) {
    const userId = uuid();

    const profileImage = await this.profileImage(userId, createUserDto);

    const user: User = {
      id: userId,
      name: createUserDto.name,
      bio: createUserDto.bio,
      role: createUserDto.role,
      profileImage,
      createdAt: new Date().toISOString(),
    };

    await this.userModel.create(user);
    //TODO 인증 예외처리

    return new Success_CreateUserDto(user);
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findOne(userId: string) {
    const user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto('사용자를 찾을 수 없습니다.');
    }

    return new Success_GetUserDto(user);
  }

  /*
  사용자 정보를 업데이트합니다.
  @param userId 사용자 ID
  @param updateUserDto 업데이트할 사용자 정보
  @return 업데이트된 사용자 정보
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    let user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto(null);
    }

    const profileImage = await this.profileImage(
      userId,
      updateUserDto as CreateUserDto,
    );

    const updateUser = {
      name: updateUserDto.name,
      bio: updateUserDto.bio,
      role: updateUserDto.role,
      profileImage,
    };

    user = await this.userModel.update({ id: userId }, updateUser);
    return new Success_UpdateUserDto(user);
  }

  async remove(userId: string) {
    const user = await this.userModel.get({ id: userId });
    if (user === undefined) {
      return new NotFoundDto('사용자를 찾을 수 없습니다.');
    }

    await this.userModel.delete({ id: userId });
    return new Success_DeleteUserDto();
  }
}
