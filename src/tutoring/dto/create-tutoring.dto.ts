import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

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

export class AppointTutoringDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: '수업 시작 날짜,시간',
    example: '2023-11-30T18:00:00+09:00',
  })
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: '수업 종료 날짜,시간',
    example: '2023-11-30T19:00:00+09:00',
  })
  endTime: Date;
}
