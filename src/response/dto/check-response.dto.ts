import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';

export class Success_CheckResponseDto extends ResponseDto {
  @ApiProperty({
    default: '학생이 선생님을 선택했습니다. 과외를 시작하세요.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: {
      status: 'selected',
      tutoringId: 'test-tutoring-id',
    },
  })
  data: object;

  constructor(message: string, data: object) {
    super(200, message, false, data);
  }
}

export class NotFound_CheckResponseDto extends ResponseDto {
  @ApiProperty({
    default: '리소스를 찾을 수 없습니다.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 404,
  })
  statusCode: number;

  constructor(message: string) {
    super(404, message, true);
  }
}
