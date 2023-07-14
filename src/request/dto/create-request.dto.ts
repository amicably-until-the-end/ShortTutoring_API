import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'The description of the problem',
    type: String,
    example: 'I am having trouble with this problem',
  })
  problemDescription;

  @ApiProperty({
    description: 'The base64 image data of the problem',
    type: String,
    required: true,
    example: 'insert base64 image data here',
  })
  problemBase64Image;

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
