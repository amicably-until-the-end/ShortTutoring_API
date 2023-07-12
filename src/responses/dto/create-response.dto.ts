import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../dto';

export class SelectResponseDto {
  @ApiProperty({
    description: '요청의 id',
    default: 'test-request-id',
  })
  requestId: string;

  @ApiProperty({
    description: '학생의 id',
    default: 'test-student-id',
  })
  studentId: string;

  @ApiProperty({
    description: '선생님의 id',
    default: 'test-teacher-id',
  })
  teacherId: string;
}

export class NotModified_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Already selected.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 304,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: object;
}

export class Success_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Select response successfully.',
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
      tutoringId: 'test-tutoring-id',
    },
  })
  data: SelectResponseDto;
}

export class BadRequest_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Request not found.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 400,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: object;
}

export class NotFound_SelectResponseDto extends ResponseDto {
  @ApiProperty({
    default: 'Teacher not found.',
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

export class Success_CreateResponseDto extends ResponseDto {
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

export class NotFound_CreateResponseDto extends ResponseDto {
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
