export const ChattingListEntity = {
  type: 'object',
  properties: {
    normalProposed: {
      type: 'array',
      description: '제안된 일반 질문 채팅방',
      example: [
        {
          roomImage:
            'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
          id: '067e02cd-57dd-4bb4-9654-d467bef97d1e',
          messages: [
            {
              message: {
                type: 'text',
                body: '안녕하세요',
              },
              createdAt: '2023-09-11T03:59:08.121Z',
              sender: 'test-student-id',
            },
            {
              message: {
                type: 'question_image',
                body: {
                  questionImage: 'url',
                  questionDescription: '설명',
                },
              },
              createdAt: '2023-09-11T11:44:46.865Z',
              sender: 'test-student-id',
            },
          ],
          questionState: 'pending',
          opponentId: 'test-student-id',
          isSelect: false,
          isTeacherRoom: false,
          questionId: '2397c9a0-9ea7-4584-8d02-e6509ea22aba',
          schoolSubject: '기하',
          schoolLevel: '고등학교',
          title: 'test-student',
          status: 'pending',
        },
      ],
    },
    normalReserved: {
      type: 'array',
      description: '예약된 일반 질문 채팅방',
      example: [],
    },
    selectedProposed: {
      type: 'array',
      description: '제안된 선택 질문 채팅방',
      example: [],
    },
    selectedReserved: {
      type: 'array',
      description: '예약된 선택 질문 채팅방',
      example: [],
    },
  },
};

export const ChattingResponse = {
  list: {
    success: {
      status: 200,
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '디버깅 메시지',
            example: '채팅방 목록을 불러왔습니다',
          },
          data: ChattingListEntity,
        },
      },
    },
  },
};
