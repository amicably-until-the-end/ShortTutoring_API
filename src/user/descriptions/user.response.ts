export const StudentEntity = {
  id: {
    type: 'string',
    description: '사용자 id',
    example: 'test-student-id',
  },
  name: {
    type: 'string',
    description: '사용자 이름',
    example: '난 학생이야',
  },
  bio: {
    type: 'string',
    description: '사용자 소개',
    example: '안녕하세요',
  },
  role: {
    type: 'string',
    description: '사용자 권한',
    example: 'student',
    enum: ['student', 'teacher', 'admin'],
  },
  profileImage: {
    type: 'string',
    description: '사용자 프로필 이미지',
    example:
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  },
  createdAt: {
    type: 'string',
    description: '사용자 생성일',
    example: '2021-08-01T00:00:00.000Z',
  },
};

export const TeacherEntity = {
  id: {
    type: 'string',
    description: '사용자 id',
    example: 'test-teacher-id',
  },
  name: {
    type: 'string',
    description: '사용자 이름',
    example: '난 선생이야',
  },
  bio: {
    type: 'string',
    description: '사용자 소개',
    example: '안녕하세요',
  },
  role: {
    type: 'string',
    description: '사용자 권한',
    example: 'teacher',
    enum: ['student', 'teacher', 'admin'],
  },
  profileImage: {
    type: 'string',
    description: '사용자 프로필 이미지',
    example:
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  },
  createdAt: {
    type: 'string',
    description: '사용자 생성일',
    example: '2021-08-01T00:00:00.000Z',
  },
};

export const JwtEntity = {
  token: {
    type: 'string',
    description: 'JWT 토큰',
    example: 'jwt-token-string',
  },
};

export const UserResponse = {
  signup: {
    student: {
      status: 201,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '성공적으로 회원가입했습니다.',
          },
          success: {
            type: 'boolean',
            description: '성공 여부',
            example: true,
          },
          data: {
            properties: {
              token: {
                type: 'string',
                description: 'JWT 토큰',
                example: 'jwt-token-string',
              },
            },
          },
        },
      },
    },
    teacher: {
      status: 201,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '성공적으로 회원가입했습니다.',
          },
          success: {
            type: 'boolean',
            description: '성공 여부',
            example: true,
          },
          data: {
            properties: {
              token: {
                type: 'string',
                description: 'JWT 토큰',
                example: 'jwt-token-string',
              },
            },
          },
        },
      },
    },
  },
  login: {
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '디버깅 메시지',
          example: '로그인 성공',
        },
        success: {
          type: 'boolean',
          description: '성공 여부',
          example: true,
        },
        data: {
          properties: JwtEntity,
        },
      },
    },
  },
  me: {
    profile: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '내 프로필 조회 성공',
          },
          success: {
            type: 'boolean',
            description: '성공 여부',
            example: true,
          },
          data: {
            type: 'object',
            properties: StudentEntity,
          },
        },
      },
    },
    updateProfile: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '내 프로필 수정 성공',
          },
          success: {
            type: 'boolean',
            description: '성공 여부',
            example: true,
          },
          data: {
            type: 'object',
            properties: StudentEntity,
          },
        },
      },
    },
    withdraw: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '회원 탈퇴 성공',
          },
          success: {
            type: 'boolean',
            description: '성공 여부',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              vendor: {
                type: 'string',
                description: '회원 탈퇴한 사용자의 소셜 로그인 벤더',
                example: 'kakao',
                enum: ['kakao', 'naver', 'google'],
              },
              userId: {
                type: 'string',
                description: '회원 탈퇴한 사용자의 소셜 로그인 id',
                example: 'test-user-id',
              },
            },
          },
        },
      },
    },
  },
  profile: {
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '디버깅 메시지',
          example: '사용자 프로필을 성공적으로 가져왔습니다.',
        },
        success: {
          type: 'boolean',
          description: '성공 여부',
          example: true,
        },
        data: {
          type: 'object',
          properties: StudentEntity,
        },
      },
    },
  },
};
