import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../responseDto';

export class Success_CheckDto extends ResponseDto {
  @ApiProperty({
    default: 'Get selected successfully.',
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
      student_id: 'test-student-id',
      status: 'selected',
      tutoring_id: 'test-tutoring-id',
    },
  })
  data: object;
}

export class Not_checkDto extends ResponseDto {
  @ApiProperty({
    default: 'Get selected successfully.',
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
      status: 'not selected',
    },
  })
  data: object;
}

export class Yet_checkDto extends ResponseDto {
  @ApiProperty({
    default: 'Get selected successfully.',
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
      status: 'pending',
    },
  })
  data: object;
}

export class NotFound_checkDto extends ResponseDto {
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
}
