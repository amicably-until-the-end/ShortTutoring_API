import { ApiProperty } from '@nestjs/swagger';

export class CreateTutoringDto {
  @ApiProperty({
    description: '요청의 id',
    example: 'test-request-id',
  })
  request_id: string;

  @ApiProperty({
    description: '학생의 id',
    example: 'test-student-id',
  })
  student_id: string;

  @ApiProperty({
    description: '선생님의 id',
    example: 'test-teacher-id',
  })
  teacher_id: string;
}
