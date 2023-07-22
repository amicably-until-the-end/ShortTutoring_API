import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'The base64 image data of the problem',
    type: Object,
    required: true,
    example: {
      data: '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',
      format: 'png',
    },
  })
  problemImage: {
    data: string;
    format: string;
  };

  @ApiProperty({
    description: 'The description of the problem',
    type: String,
    example: 'I am having trouble with this problem',
  })
  problemDescription;

  @ApiProperty({
    description: 'The school level of the problem (e.g. 초, 중, 고)',
    type: String,
    example: 'HighSchool',
  })
  problemSchoolLevel;

  @ApiProperty({
    description: 'The school subject of the problem (e.g. 수1, 수2)',
    type: String,
    example: 'Mathematics_1',
  })
  problemSchoolSubject;

  @ApiProperty({
    description: 'The school chapter of the problem (e.g. 미적, 확통, 기벡)',
    type: String,
    example: 'Chapter_1',
  })
  problemSchoolChapter;

  @ApiProperty({
    description: 'The difficulty of the problem (e.g. 쉬움, 보통, 어려움)',
    type: String,
    example: 'Easy',
  })
  problemDifficulty;
}
