import { ApiProperty } from '@nestjs/swagger';

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

export class Success_CreateTutoringDto {
  @ApiProperty({
    default: 'Create tutoring successfully.',
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
      requestId: 'test-request-id',
      teacherId: 'test-teacher-id',
      matchedAt: '2021-01-01T00:00:00.000Z',
      createdAt: '2021-01-01T00:00:00.000Z',
      endedAt: null,
      status: 'ongoing',
    },
  })
  data: object;
}
