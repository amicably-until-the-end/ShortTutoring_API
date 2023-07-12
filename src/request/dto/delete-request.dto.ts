import { ResponseDto } from '../../responseDto';
import { ApiProperty } from '@nestjs/swagger';

export class Success_DeleteRequestDto extends ResponseDto {
  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: '과외 요청이 성공적으로 삭제되었습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: null,
  })
  data: object;

  constructor() {
    super(200, '과외 요청이 성공적으로 삭제되었습니다.', false, null);
  }
}

export class NotFound_DeleteRequestDto extends ResponseDto {
  @ApiProperty({
    default: 404,
  })
  statusCode: number;

  @ApiProperty({
    default: '과외 요청을 찾을 수 없습니다.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: null,
  })
  data: object;

  constructor() {
    super(404, '과외 요청을 찾을 수 없습니다.', true, null);
  }
}
