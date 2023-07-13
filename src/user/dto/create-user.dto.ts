import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user.',
    default: 'test-student',
  })
  name: string;

  @ApiProperty({
    description: 'The bio of the user.',
    default: 'lets study!',
  })
  bio: string;

  @ApiProperty({
    description: 'base64 encoded image',
    default: 'base64',
  })
  profileImageBase64: string;

  @ApiProperty({
    description: 'The role of the user.',
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
