export const QuestionQuery = {
  list: {
    name: 'status',
    description: '질문 상태를 기준으로 필터링하여 목록을 조회합니다.',
    enum: ['all', 'pending', 'matched', 'canceled', 'expired', 'completed'],
    required: true,
  },
  getMyQuestions: {
    status: {
      name: 'status',
      description: '질문 상태를 기준으로 필터링하여 목록을 조회합니다.',
      enum: ['all', 'pending', 'reserved', 'canceled', 'finished'],
    },
    type: {
      name: 'type',
      description: '질문 타입을 기준으로 필터링하여 목록을 조회합니다.',
      enum: ['all', 'normal', 'selected'],
    },
  },
};
