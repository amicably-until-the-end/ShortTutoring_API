export const AuthResponse = {
  jwt: {
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
};
