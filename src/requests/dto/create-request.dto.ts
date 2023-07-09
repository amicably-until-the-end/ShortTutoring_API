import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'The id of the student who created the request',
    type: String,
    required: true,
    example: '65183482-6c9d-44f8-8b54-953c329b13c1',
  })
  student_id;

  @ApiProperty({
    description: 'The description of the problem',
    type: String,
    example: 'I am having trouble with this problem',
  })
  problem_description;

  @ApiProperty({
    description: 'The base64 image data of the problem',
    type: String,
    required: true,
    example: 'insert base64 image data here',
  })
  problem_base64_image;

  @ApiProperty({
    description: 'The school level of the problem (e.g. 초, 중, 고)',
    type: String,
    example: 'HighSchool',
  })
  problem_school_level;

  @ApiProperty({
    description: 'The school subject of the problem (e.g. 수1, 수2)',
    type: String,
    example: 'Mathematics_1',
  })
  problem_school_subject;

  @ApiProperty({
    description: 'The school chapter of the problem (e.g. 미적, 확통, 기벡)',
    type: String,
    example: 'Chapter_1',
  })
  problem_school_chapter;

  @ApiProperty({
    description: 'The difficulty of the problem (e.g. 쉬움, 보통, 어려움)',
    type: String,
    example: 'Easy',
  })
  problem_difficulty;
}
