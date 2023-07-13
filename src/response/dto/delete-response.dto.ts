import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';

export class Success_DeleteResponseDto extends ResponseDto {
  @ApiProperty({
    default: '응답을 성공적으로 삭제했습니다.',
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

  constructor() {
    super(200, '응답을 성공적으로 삭제했습니다.', false);
  }
}

export class NotFound_DeleteResponseDto extends ResponseDto {
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
