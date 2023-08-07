export const TutoringEntity = {
  id: {
    type: 'string',
    description: '튜터링 ID',
    example: 'test-tutoring-id',
  },
  studentId: {
    type: 'string',
    description: '학생 ID',
    example: 'test-student-id',
  },
  teacherId: {
    type: 'string',
    description: '튜터 ID',
    example: 'test-teacher-id',
  },
  matchedAt: {
    type: 'string',
    description: '매칭된 시각',
    example: '2021-01-01T00:00:00.000Z',
  },
  startedAt: {
    type: 'string',
    description: '튜터링 시작 시각',
    example: '2021-01-01T00:00:00.000Z',
  },
  endedAt: {
    type: 'string',
    description: '튜터링 종료 시각',
    example: '2021-01-01T00:00:00.000Z',
  },
  status: {
    type: 'string',
    description: '튜터링 상태',
    example: 'matched',
    enum: ['matched', 'started', 'finished'],
  },
  whiteBoardUUID: {
    type: 'string',
    description: '화이트보드 UUID',
    example: 'test-whiteboard-uuid',
  },
  whiteBoardToken: {
    type: 'string',
    description: '화이트보드 토큰',
    example: 'test-whiteboard-token',
  },
  whiteBoardAppId: {
    type: 'string',
    description: '화이트보드 앱 ID',
    example: 'test-whiteboard-app-id',
  },
};
