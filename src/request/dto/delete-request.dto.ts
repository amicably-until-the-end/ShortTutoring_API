import { ApiProperty } from '@nestjs/swagger';

export class DeleteRequestDto {
  @ApiProperty({
    description: '과외를 요청한 학생의 ID',
    example: 'test-student-id',
  })
  studentId: string;
}
