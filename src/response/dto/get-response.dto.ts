import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.interface';
import { ResponseDto } from '../../ResponseDto';

export class Success_GetTeachersDTO extends ResponseDto {
  @ApiProperty({
    default: 'Get teachers successfully.',
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
    default: [
      {
        id: 'test-teacher-id',
        name: 'test-teacher-name',
        bio: 'test-teacher-bio',
        profileImageURL: 'test-teacher-profileImage-url',
        role: 'teacher',
        createdAt: 'test-teacher-created-at',
      },
    ],
  })
  data: User[];
}

export class NotFound_GetTeachersDTO extends ResponseDto {
  @ApiProperty({
    default: 'Request not found.',
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
}
