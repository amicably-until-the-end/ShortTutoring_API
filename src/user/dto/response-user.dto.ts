import { HttpResponseDto } from '../../HttpResponseDto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.interface';

export class Success_CreateUserDto extends HttpResponseDto {
  @ApiProperty({
    default: 201,
  })
  statusCode: number;

  @ApiProperty({
    example: '유저 생성이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: {
      id: 'test-id',
      name: 'test-name',
      bio: 'test-bio',
      profileImageURL: 'test-profileImage-url',
      role: 'student',
    },
  })
  data: User;

  constructor(data: User) {
    super(201, '사용자 생성이 성공적으로 처리되었습니다.', false, data);
  }
}

export class Success_GetUserDto extends HttpResponseDto {
  @ApiProperty({
    default: '사용자 정보를 성공적으로 가져왔습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: {
      id: 'test-id',
      name: 'test-name',
      bio: 'test-bio',
      profileImageURL: 'test-profileImage-url',
      role: 'student',
      createdAt: 'test-created-at',
    },
  })
  data: User;

  constructor(data: User) {
    super(200, '사용자 정보를 성공적으로 가져왔습니다.', false, data);
  }
}

export class Success_UpdateUserDto extends HttpResponseDto {
  @ApiProperty({
    default: '사용자 정보를 성공적으로 업데이트했습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: {
      id: 'test-id',
      name: 'test-name',
      bio: 'test-bio',
      profileImageURL: 'test-profileImage-url',
      role: 'student',
    },
  })
  data: User;

  constructor(data: User) {
    super(200, '사용자 정보를 성공적으로 업데이트했습니다.', false, data);
  }
}

export class Success_DeleteUserDto extends HttpResponseDto {
  @ApiProperty({
    default: '사용자 정보를 성공적으로 삭제했습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: {
      id: 'test-id',
      name: 'test-name',
      bio: 'test-bio',
      profileImageURL: 'test-profileImage-url',
      role: 'student',
    },
  })
  data: User;

  constructor() {
    super(200, '사용자 정보를 성공적으로 삭제했습니다.', false, null);
  }
}
