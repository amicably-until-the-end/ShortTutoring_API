export const UserOperation = {
  onlineTeacher: {
    summary: '온라인 선생님 조회',
    description: '현재 접속해있는 선생님을 조회합니다.',
  },
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
  follow: {
    summary: '선생님 팔로우',
    description: '`STUDENT`\n\n선생님을 팔로우합니다.',
  },
  unfollow: {
    summary: '선생님 언팔로우',
    description: '`STUDENT`\n\n선생님을 언팔로우합니다.',
  },
  following: {
    summary: '팔로잉 목록 조회',
    description: '`STUDENT`\n\n팔로잉 목록을 조회합니다.',
  },
  otherFollowing: {
    summary: '다른 사용자의 팔로잉 목록 조회',
    description: '`USER`\n\n다른 사용자의 팔로잉 목록을 조회합니다.',
  },
  followers: {
    summary: '팔로워 목록 조회',
    description: '`TEACHER`\n\n팔로워 목록을 조회합니다.',
  },
  otherFollowers: {
    summary: '다른 사용자의 팔로워 목록 조회',
    description: '`USER`\n\n다른 사용자의 팔로워 목록을 조회합니다.',
  },
  tutoringList: {
    summary: '과외 내역 조회',
    description: '`USER`\n\n과외 내역을 조회합니다.',
  },
};

export const TeacherOperation = {
  reviewList: {
    summary: '선생님 리뷰 목록 조회',
    description: '`USER`\n\n선생님의 리뷰 목록을 조회합니다.',
  },
};
