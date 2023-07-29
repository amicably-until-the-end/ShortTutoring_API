import { ApiProperty } from '@nestjs/swagger';

export class RemoveQuestionDto {
  @ApiProperty({
    description: '질문의 상태',
    example: 'pending',
    enum: ['pending', 'matched', 'canceled', 'expired', 'completed'],
  })
  questionStatus: string;
}
