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
          properties: {
            decoded: {
              type: 'object',
              description: '디코딩된 토큰',
              example: {
                vendor: 'kakao',
                userId: 'sample-user-id',
                iat: 1625241600,
                exp: 1625245200,
              },
            },
          },
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
          properties: {
            decoded: {
              type: 'object',
              description: '디코딩된 토큰',
              example: {
                vendor: 'kakao',
                userId: 'sample-user-id',
                iat: 1625241600,
                exp: 1625245200,
              },
            },
          },
        },
      },
    },
  },
};
