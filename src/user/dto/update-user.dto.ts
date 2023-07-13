import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { HttpResponseDto } from '../../HttpResponseDto';
import { User } from '../entities/user.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

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

export class NotFound_UpdateUserDto extends HttpResponseDto {
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

  constructor(data?: UpdateUserDto) {
    super(404, '사용자를 찾을 수 없습니다.', true, data);
  }
}
