import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    example: 'kakao',
    description: '사용자 OAuth2.0 제공자',
  })
  vendor: string;

  @ApiProperty({
    example: 'test-student-id',
    description: '사용자 id',
  })
  id: string;

  @ApiProperty({
    example: '난 학생이야',
    description: '사용자 이름',
  })
  name: string;

  @ApiProperty({
    example: '안녕하세요',
    description: '사용자 소개',
  })
  bio?: string;

  @ApiProperty({
    example:
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
    description: '사용자 프로필 이미지',
  })
  profileImage?: string;
  @ApiProperty({
    example: 'student',
    description: '사용자 권한',
    enum: ['student', 'teacher', 'admin'],
  })
  role?: string;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: '사용자 생성일',
  })
  createdAt?: string;

  constructor(
    id: string,
    name: string,
    bio?: string,
    profileImage?: string,
    role?: string,
    createdAt?: string,
  ) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.profileImage = profileImage;
    this.role = role;
    this.createdAt = createdAt;
  }
}
