import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';
import { Tutoring } from '../entities/tutoring.interface';

export class CreateTutoringDto {
  @ApiProperty({
    description: '요청의 id',
    example: 'test-request-id',
  })
  requestId: string;

  @ApiProperty({
    description: '학생의 id',
    example: 'test-student-id',
  })
  studentId: string;

  @ApiProperty({
    description: '선생님의 id',
    example: 'test-teacher-id',
  })
  teacherId: string;
}

export class Success_CreateTutoringDto extends ResponseDto {
  @ApiProperty({
    default: '과외를 성공적으로 생성했습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 201,
  })
  statusCode: number;

  @ApiProperty({
    default: {
      id: 'test-tutoring-id',
      studentId: 'test-student-id',
      teacherId: 'test-teacher-id',
      status: 'ongoing',
    },
  })
  data: Tutoring;

  constructor(data: Tutoring) {
    super(201, '과외를 성공적으로 생성했습니다.', false, data);
  }
}

export class NotFound_CreateTutoringDto extends ResponseDto {
  @ApiProperty({
    default: '리소스를 찾을 수 없습니다.',
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

  constructor(message: string) {
    super(404, message, true);
  }
}
