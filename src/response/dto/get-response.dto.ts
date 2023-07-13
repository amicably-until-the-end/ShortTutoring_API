import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.interface';
import { ResponseDto } from '../../responseDto';

export class Success_GetTeachersDTO extends ResponseDto {
  @ApiProperty({
    default: '응답한 선생님 목록을 성공적으로 가져왔습니다.',
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

  constructor(data: User[]) {
    super(200, '응답한 선생님 목록을 성공적으로 가져왔습니다.', false, data);
  }
}

export class NotFound_GetTeachersDTO extends ResponseDto {
  @ApiProperty({
    default: '과외 요청을 찾을 수 없습니다.',
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

  constructor() {
    super(404, '과외 요청을 찾을 수 없습니다.', true);
  }
}
