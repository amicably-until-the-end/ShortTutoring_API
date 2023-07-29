import { ApiProperty } from '@nestjs/swagger';

export class AcceptOfferDto {
  @ApiProperty({
    description:
      '과외를 진행할 선생님의 ID\n\n' +
      '질문의 `teacherIds`에 포함되어 있어야 합니다.',
    example: '#test-teacher-id',
  })
  teacherId: string;
}
