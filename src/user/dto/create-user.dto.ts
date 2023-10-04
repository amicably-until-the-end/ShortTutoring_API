import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'OAuth 인가 코드를 발급받은 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  vendor: string;

  @ApiProperty({
    description: '발급받은 OAuth 액세스 토큰',
    default: 'OAUTH_ACCESS_TOKEN',
  })
  accessToken: string;

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
    description: '사용자 프로필 이미지',
    enum: ['dog', 'duck', 'fox', 'lion', 'penguin', 'polar_bear', 'tiger'],
  })
  profileImg: string;

  // @ApiProperty({
  //   description: 'The review list of the user.',
  //   default: ['review1', 'review2'],
  // })
  // review_list: string[];
}

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty({
    description: '학생이 속한 학교의 단계',
    example: 'high',
    enum: ['elementary', 'middle', 'high'],
  })
  schoolLevel: string;

  @ApiProperty({
    description: '학생의 학년',
    example: 3,
  })
  schoolGrade: number;
}

export class CreateTeacherDto extends CreateUserDto {
  @ApiProperty({
    description: '사용자 이름',
    default: 'test-teacher',
  })
  name: string;

  @ApiProperty({
    description: '사용자 소개',
    default: 'lets study!',
  })
  bio: string;

  @ApiProperty({
    description: '선생님이 속한 학교의 이름',
    example: '한양대학교',
  })
  schoolName: string;

  @ApiProperty({
    description: '선생님의 학과',
    example: '수학교육과',
  })
  schoolDepartment: string;

  /*  @ApiProperty({
      description: '선생님의 소속 단과대',
      example: '사범대학',
    })
    schoolDivision: string;
  

  @ApiProperty({
    description: '선생님의 학년',
    example: 3,
  })
  schoolGrade: number;*/
}
