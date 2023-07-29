export const OfferResponse = {
  getStatus: {
    success: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '질문 대기열 상태를 불러왔습니다.',
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                description: '제안 상태',
                example: 'accepted',
                enum: ['accepted', 'rejected', 'pending'],
              },
              tutoringId: {
                type: 'string',
                description: '과외 ID',
                example: 'test-tutoring-id',
              },
            },
          },
        },
      },
    },
  },
};
