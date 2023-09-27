import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class AcceptOfferDto {
  @ApiProperty({
    description:
      '과외를 진행할 선생님이 있는 채팅방의 ID\n\n' +
      '질문의 `teacherIds`에 포함되어 있어야 합니다.',
  })
  chattingId: string;
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
