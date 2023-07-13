import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';

export class SelectResponseDto {
  @ApiProperty({
    description: '요청의 id',
    default: 'test-request-id',
  })
  requestId: string;

  @ApiProperty({
    description: '학생의 id',
    default: 'test-student-id',
  })
  studentId: string;

  @ApiProperty({
    description: '선생님의 id',
    default: 'test-teacher-id',
  })
  teacherId: string;
}

export class Success_SelectResponseDto extends ResponseDto {
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

export class Conflict_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: '이미 선생님을 선택했습니다.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 304,
  })
  statusCode: number;

  constructor() {
    super(304, '이미 선생님을 선택했습니다.', true);
  }
}

export class BadRequest_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Request not found.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 400,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: object;
}
