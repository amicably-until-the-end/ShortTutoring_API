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
