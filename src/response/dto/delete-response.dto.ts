import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../ResponseDto';

export class Success_DeleteResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Append response successfully.',
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
      id: 'test-request-id',
    },
  })
  data: object;
}

export class NotFound_DeleteResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Request not found.',
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

  @ApiProperty({
    default: null,
  })
  data: object;
}
