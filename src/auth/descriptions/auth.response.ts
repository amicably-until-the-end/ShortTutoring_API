export const jwtEntity = {
  vendor: {
    type: 'string',
    description: 'OAuth2 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  },
  userId: {
    type: 'string',
    description: '사용자 ID',
    example: 'sample-user-id',
  },
  iat: {
    type: 'number',
    description: '토큰 발급 시간',
    example: 1625241600,
  },
  exp: {
    type: 'number',
    description: '토큰 만료 시간',
    example: 1625245200,
  },
};

export const AuthResponse = {
  generateJwt: {
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '디버깅 메시지',
          example: '성공적으로 토큰을 발급했습니다.',
        },
        success: {
          type: 'boolean',
          description: '성공 여부',
          example: true,
        },
        data: {
          type: 'object',
          properties: {
            jwt: {
              type: 'string',
              description: 'JWT 토큰',
              example: 'sample-jwt-token',
            },
          },
        },
      },
    },
  },
  decodeJwt: {
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '디버깅 메시지',
          example: '성공적으로 토큰을 디코딩했습니다.',
        },
        success: {
          type: 'boolean',
          description: '성공 여부',
          example: true,
        },
        data: {
          type: 'object',
          properties: jwtEntity,
        },
      },
    },
  },
  verifyJwt: {
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: '디버깅 메시지',
          example: '성공적으로 토큰을 검증했습니다.',
        },
        success: {
          type: 'boolean',
          description: '성공 여부',
          example: true,
        },
        data: {
          type: 'object',
          properties: jwtEntity,
        },
      },
    },
  },
};
