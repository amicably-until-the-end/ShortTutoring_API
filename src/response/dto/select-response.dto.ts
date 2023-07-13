import { ApiProperty } from '@nestjs/swagger';

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
