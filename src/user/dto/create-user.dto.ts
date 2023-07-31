import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'OAuth 인가 코드를 발급받은 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  vendor: string;

  @ApiProperty({
    description: '발급받은 OAuth 인가 코드',
    default: 'OAUTH_AUTHORIZATION_CODE',
  })
  authorizationCode: string;

  @ApiProperty({
    description: '사용자 이름',
    default: 'test-student',
  })
  name: string;

  @ApiProperty({
    description: '사용자 소개',
    default: 'lets study!',
  })
  bio: string;

  @ApiProperty({
    description: '사용자의 역할',
    default: 'student',
    enum: ['admin', 'student', 'teacher'],
  })
  role: string;

  // @ApiProperty({
  //   description: 'The information of the student user.',
  //   default: {
  //     school_level: 'high',
  //     school_grade: 3,
  //   },
  // })
  // student_info: StudentInfo;
  //
  // @ApiProperty({
  //   description: 'The information of the teacher user.',
  //   default: {
  //     school_name: 'hanyang',
  //     division: '3',
  //     department: 'math',
  //     year: 3,
  //   },
  // })
  // teacher_info: TeacherInfo;
  //
  // @ApiProperty({
  //   description: 'The review list of the user.',
  //   default: ['review1', 'review2'],
  // })
  // review_list: string[];
}
