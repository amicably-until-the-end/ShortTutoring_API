import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';

export class NotFound_SelectResponseDto extends ResponseDto {
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

export class Created_CreateResponseDto extends ResponseDto {
  @ApiProperty({
    default: '응답을 성공적으로 추가했습니다.',
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
      requestId: 'test-request-id',
    },
  })
  data: object;

  constructor(data: object) {
    super(200, '응답을 성공적으로 추가했습니다.', false, data);
  }
}

export class NotFound_CreateResponseDto extends ResponseDto {
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

export class Conflict_CreateResponseDto extends ResponseDto {
  @ApiProperty({
    default: '이미 답변이 존재합니다.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 409,
  })
  statusCode: number;

  constructor(message: string) {
    super(409, message, true);
  }
}
