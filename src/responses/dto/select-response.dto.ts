import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../dto';

export class PostSelectDto extends ResponseDto {
  @ApiProperty({
    description: '데이터',
    example: {
      student_id: 'test-student-id',
      request_id: 'test-request-id',
      teacher_id: 'test-teacher-id',
    },
  })
  data;
}

export class BadRequestDto extends ResponseDto {
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

export class RequestNotFoundDto extends ResponseDto {
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
