import { ApiProperty } from '@nestjs/swagger';

export class PostSelectDto {
  @ApiProperty({
    description: '학생의 id',
    example: 'test-student-id',
  })
  student_id: string;

  @ApiProperty({
    description: '요청의 id',
    example: 'test-request-id',
  })
  request_id: string;

  @ApiProperty({
    description: '선생님의 id',
    example: 'test-teacher-id',
  })
  teacher_id: string;
}

export class ResponseDto {
  @ApiProperty({
    description: '메세지',
    example: '선택이 완료되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '오류',
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: '데이터',
    type: PostSelectDto,
  })
  data: PostSelectDto;
}

class ForbiddenDto {
  @ApiProperty({
    description: '메세지',
  })
  message: string;

  @ApiProperty({
    description: '오류',
  })
  error: boolean;

  @ApiProperty({
    description: '오류코드',
  })
  status: number;
}

export class BadRequestDto extends ForbiddenDto {
  @ApiProperty({
    description: '메세지',
    example: '요청이 잘못되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '오류',
    example: true,
  })
  error: boolean;

  @ApiProperty({
    description: '오류코드',
    example: 400,
  })
  status: number;
}

export class RequestNotFoundDto extends ForbiddenDto {
  @ApiProperty({
    description: '메세지',
    example: '요청이 존재하지 않습니다.',
  })
  message: string;

  @ApiProperty({
    description: '오류',
    example: true,
  })
  error: true;

  @ApiProperty({
    description: '오류코드',
    example: 404,
  })
  status: 404;
}
