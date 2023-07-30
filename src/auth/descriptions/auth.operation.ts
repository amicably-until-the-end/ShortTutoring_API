export const AuthOperation = {
  generateJwt: {
    summary: 'JWT 토큰 발급',
    description: 'OAuth 인가코드로 JWT 토큰을 발급합니다.',
  },
  decodeJwt: {
    summary: 'JWT 토큰 디코딩',
    description: 'JWT 토큰을 디코딩합니다.',
  },
  verifyJwt: {
    summary: 'JWT 토큰 검증',
    description: 'JWT 토큰의 유효성을 검증합니다.',
  },
  accessTokenInfo: {
    summary: '액세스 토큰 정보',
    description: '액세스 토큰의 정보를 조회합니다.',
  },
  getUserIdFromAccessToken: {
    summary: '액세스 토큰으로부터 User ID 조회',
    description: '액세스 토큰으로부터 User ID를 조회합니다.',
  },
  getUserFromAccessToken: {
    summary: '액세스 토큰으로부터 User 조회',
    description: '액세스 토큰으로부터 User를 조회합니다.',
  },
};
