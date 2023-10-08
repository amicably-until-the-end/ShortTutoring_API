import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: '학생이 평가한 별점',
    example: '5',
  })
  rating: number;

  @ApiProperty({
    description: '학생이 남긴 코멘트',
    example: '좋았어요',
  })
  comment: string;
}
