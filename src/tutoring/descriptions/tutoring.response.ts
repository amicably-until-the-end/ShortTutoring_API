export const TutoringResponse = {
  classroomInfo: {
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            boardAppId: {
              type: 'string',
              description: 'whiteboard sdk 앱 아이디',
            },
            boardUUID: {
              type: 'string',
              description: 'whiteboard sdk uuid',
            },
            boardToken: {
              type: 'string',
              description: 'whiteboard sdk 토큰',
            },
            rtcAppId: {
              type: 'string',
              description: '음성 채널 앱 아이디',
            },
            rtcToken: {
              type: 'string',
              description: '음성 채널 토큰',
            },
          },
        },
      },
    },
  },
};
