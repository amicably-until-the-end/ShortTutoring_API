import { ApiProperty } from '@nestjs/swagger';
import { HttpResponse } from '../../http.response';
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

export class Success_CreateTutoringDto extends HttpResponse {
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
      whiteBoardAppId: 'test-white-board-app-id',
      whiteBoardToken: 'test-white-board-token',
      whiteBoardUUID: 'test-white-board-uuid',
      status: 'ongoing',
    },
  })
  data: Tutoring;

  constructor(data: Tutoring) {
    super('과외를 성공적으로 생성했습니다.', data);
  }
}

export class NotFound_CreateTutoringDto extends HttpResponse {
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
    super(message);
  }
}
