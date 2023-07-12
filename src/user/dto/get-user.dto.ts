import { ResponseDto } from '../../responseDto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.interface';

export class Success_GetUserDto extends ResponseDto {
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

export class NotFound_GetUserDto extends ResponseDto {
  @ApiProperty({
    default: '사용자를 찾을 수 없습니다.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 404,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: User;

  constructor() {
    super(404, '사용자를 찾을 수 없습니다.', true, null);
  }
}
