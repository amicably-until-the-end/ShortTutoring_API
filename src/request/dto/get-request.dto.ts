import { ResponseDto } from '../../responseDto';
import { ApiProperty } from '@nestjs/swagger';

export class Success_GetRequestsDto extends ResponseDto {
  @ApiProperty({
    default: 'Get requests list successfully.',
  })
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
  data: object;
}
