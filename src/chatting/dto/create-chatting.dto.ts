import { ApiProperty } from '@nestjs/swagger';

export class CreateChattingDto {
  @ApiProperty({
    description: '채팅 받는 사람의 아이디',
    example: 'test-teacher-id',
  })
  readonly receiverId: string;

  @ApiProperty({
    description: '채팅 내용',
    example: '안녕하세요',
  })
  readonly message: string;
}
