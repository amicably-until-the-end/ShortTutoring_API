const QuestionEntity = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: '질문 아이디',
      example: 'test-question-id',
    },
    student: {
      type: 'object',
      properties: {
        vendor: {
          type: 'string',
          description: '학생의 OAuth 제공자',
          example: 'kakao',
        },
        id: {
          type: 'string',
          description: '학생의 아이디',
          example: 'test-student-id',
        },
      },
    },
    teacherIds: {
      type: 'array',
      description: '선생님들의 아이디',
      example: [],
    },
    problem: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          description: '문제 이미지',
          example:
            'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/problem.png',
        },
        description: {
          type: 'string',
          description: '문제 설명',
          example: 'test-problem-description',
        },
        schoolLevel: {
          type: 'string',
          description: '학교 단계',
          example: 'test-school-level',
        },
        schoolSubject: {
          type: 'string',
          description: '학교 과목',
          example: 'test-school-subject',
        },
        difficulty: {
          type: 'string',
          description: '문제 난이도',
          example: 'easy',
          enum: ['easy', 'normal', 'hard'],
        },
      },
    },
  },
};
export const QuestionResponse = {
  create: {
    success: {
      status: 201,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '질문 생성 성공',
          },
          data: QuestionEntity,
        },
      },
    },
  },
};
