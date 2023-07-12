import { ResponseDto } from '../../ResponseDto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.interface';

export class Success_GetUserDto extends ResponseDto {
  @ApiProperty({
    default: 'Get user successfully.',
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
      createdAt: 'test-created-at',
    },
  })
  data: User;
}
