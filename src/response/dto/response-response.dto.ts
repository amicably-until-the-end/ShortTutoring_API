import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.interface';
import { HttpResponseDto } from '../../HttpResponseDto';

export class Created_CreateResponseDto extends HttpResponseDto {
  @ApiProperty({
    default: '응답을 성공적으로 추가했습니다.',
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
      requestId: 'test-request-id',
    },
  })
  data: object;

  constructor(data: object) {
    super(200, '응답을 성공적으로 추가했습니다.', false, data);
  }
}

export class Success_GetTeachersDto extends HttpResponseDto {
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

export class Success_SelectResponseDto extends HttpResponseDto {
  @ApiProperty({
    default: '선생님을 선택했습니다.',
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
      tutoringId: 'test-tutoring-id',
    },
  })
  data: object;

  constructor(data: object) {
    super(200, '선생님을 선택했습니다.', false, data);
  }
}

export class Success_CheckResponseDto extends HttpResponseDto {
  @ApiProperty({
    default: '학생이 선생님을 선택했습니다. 과외를 시작하세요.',
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
      status: 'selected',
      tutoringId: 'test-tutoring-id',
    },
  })
  data: object;

  constructor(message: string, data: object) {
    super(200, message, false, data);
  }
}

export class Success_DeleteResponseDto extends HttpResponseDto {
  @ApiProperty({
    default: '응답을 성공적으로 삭제했습니다.',
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

  constructor() {
    super(200, '응답을 성공적으로 삭제했습니다.', false);
  }
}
