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

export const UserResponse = {
  signup: {
    success: {
      status: 201,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '사용자 생성 성공',
          },
          data: {
            properties: StudentEntity,
          },
        },
      },
    },
  },
  login: {
    success: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '로그인 성공',
          },
          data: {
            properties: StudentEntity,
          },
        },
      },
    },
    notFound: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '사용자를 찾을 수 없습니다',
          },
        },
      },
    },
  },
  me: {
    profile: {
      success: {
        status: 200,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '디버깅 메시지',
              example: '내 프로필 조회 성공',
            },
            data: {
              type: 'object',
              properties: StudentEntity,
            },
          },
        },
      },
      notFound: {
        status: 404,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '사용자를 찾을 수 없습니다.',
              example: '사용자를 찾을 수 없습니다.',
            },
          },
        },
      },
    },
    updateProfile: {
      success: {
        status: 200,
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: StudentEntity,
            },
          },
        },
      },
      notFound: {
        status: 404,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '사용자를 찾을 수 없습니다.',
              example: '사용자를 찾을 수 없습니다.',
            },
          },
        },
      },
    },
    withdraw: {
      success: {
        status: 200,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '디버깅 메시지',
              example: '회원 탈퇴 성공',
            },
          },
        },
      },
      notFound: {
        status: 404,
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '사용자를 찾을 수 없습니다.',
              example: '사용자를 찾을 수 없습니다.',
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
        data: {
          type: 'object',
          properties: StudentEntity,
        },
      },
    },
  },
};
