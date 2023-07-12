import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ResponseDto } from '../../responseDto';
import { User } from '../entities/user.interface';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class Success_UpdateUserDto extends ResponseDto {
  @ApiProperty({
    default: 'Updated successfully.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  status: number;

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
}

export class BadRequest_UpdateUserDto extends ResponseDto {
  @ApiProperty({
    default: 'Bad request.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 400,
  })
  status: number;

  @ApiProperty({
    default: null,
  })
  data: User;
}
