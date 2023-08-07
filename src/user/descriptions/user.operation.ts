export const UserOperation = {
  signup: {
    student: {
      summary: '학생 회원가입',
      description:
        '`USER`\n\n학생으로 회원가입합니다.\n\n' +
        '회원가입 성공 시, JWT 토큰 정보가 반환됩니다.',
    },
    teacher: {
      summary: '선생님 회원가입',
      description:
        '`USER`\n\n선생님으로 회원가입합니다.\n\n' +
        '회원가입 성공 시, JWT 토큰 정보가 반환됩니다.',
    },
  },
  login: {
    summary: '로그인',
    description:
      '`USER`\n\n로그인합니다.\n\n' +
      '로그인 성공 시, JWT 토큰 정보가 반환됩니다.\n\n' +
      '로그인 실패 시, 실패 메시지가 반환됩니다.',
  },
  me: {
    profile: {
      summary: '사용자 프로필 조회',
      description: '`USER`\n\n현재 로그인한 사용자의 프로필을 가져옵니다.',
    },
    updateProfile: {
      summary: '사용자 정보 업데이트',
      description: '`USER`\n\n사용자 정보를 업데이트합니다.',
    },
    withdraw: {
      summary: '회원 탈퇴',
      description: '`USER`\n\n숏과외 서비스를 탈퇴합니다.',
    },
  },
  otherProfile: {
    summary: '다른 사용자의 프로필 조회',
    description: '`USER`\n\n다른 사용자의 프로필을 가져옵니다.',
  },
};
