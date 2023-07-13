import { HttpResponseDto } from '../../HttpResponseDto';
import { ApiProperty } from '@nestjs/swagger';
import { RequestSchema } from '../entities/request.schema';

export class Created_CreateRequestDto extends HttpResponseDto {
  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: '과외 요청이 성공적으로 생성되었습니다.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  constructor() {
    super(200, '과외 요청이 성공적으로 생성되었습니다.', false);
  }
}

export class Success_GetRequestsDto extends HttpResponseDto {
  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: '과외 요청 목록을 성공적으로 가져왔습니다.',
  })
  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    type: RequestSchema,
    default: {
      requests: [
        {
          id: 'test-request-id',
          studentId: 'test-student-id',
          problem: {
            description: 'test-description',
            base64Image: 'test-base64-image',
            schoolLevel: 'test-school-level',
            schoolSubject: 'test-school-subject',
            schoolChapter: 'test-school-chapter',
            difficulty: 'test-difficulty',
          },
          status: 'pending',
          tutoringId: null,
          createdAt: '2021-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  data: typeof RequestSchema;

  constructor(data: object[]) {
    super(200, '과외 요청 목록을 성공적으로 가져왔습니다.', false, data);
  }
}

export class Success_DeleteRequestDto extends HttpResponseDto {
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

  constructor() {
    super(200, '과외 요청이 성공적으로 삭제되었습니다.', false);
  }
}
