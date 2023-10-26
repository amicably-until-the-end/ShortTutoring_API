export const OfferOperations = {
  schedule: {
    summary: '일반 질문의 과외 시간 제안',
    description: '선생님이 일반 질문에 과외를 시작할 시간을 제안합니다.',
  },
  append: {
    summary: '숏과외 제안',
    description:
      '과외 제안을 기다리고 있는 학생에게 숏과외를 제안합니다. 해당 질문의 상태가 **pending**이 아니면 제안할 수 없습니다.\n\n' +
      '질문의 `teacherIds`에 자신의 ID를 추가합니다.',
  },
  remove: {
    summary: '제안 철회',
    description: '숏과외 제안을 철회합니다.',
  },
  getStatus: {
    summary: '제안 상태 조회',
    description:
      '숏과외 제안 상태를 조회합니다.\n\n' +
      '- `pending`: 학생의 수락 대기 중\n\n' +
      '- `selected`: 학생이 수락한 상태\n\n' +
      '- `rejected`: 학생이 거절한 상태\n\n',
  },
  getTeachers: {
    summary: '제안한 선생님 목록 조회',
    description: '자신의 질문에 과외를 제안한 선생님들의 목록을 조회합니다.',
  },
  accept: {
    summary: '제안 수락',
    description: '숏과외 제안을 수락합니다.',
  },
};
