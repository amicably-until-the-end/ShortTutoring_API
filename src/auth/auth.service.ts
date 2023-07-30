import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Fail, Success } from '../response';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * 카카오 인가코드 콜백
   * @param code
   * @param state
   * @param error
   * @param errorDescription
   */
  async kakaoCallbackAuthorize(
    code: string,
    state: string,
    error: string,
    errorDescription: string,
  ) {
    return code;
  }

  /**
   * 인가코드로부터 숏과외 토큰 발급하기
   * @param vendor OAuth2 벤더
   * @param code OAuth2 인가코드
   */
  async jwtToken(vendor: string, code: string) {
    try {
      const { jwtToken } = await this.authRepository.jwtToken(vendor, code);
      return new Success('성공적으로 토큰을 가져왔습니다.', { jwtToken });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 토큰 정보 보기
   * @param token OAuth2 토큰
   * @returns tokenInfo OAuth2 토큰 정보
   */
  async accessTokenInfo(token: { vendor: string; accessToken: string }) {
    try {
      const tokenInfo = await this.authRepository.getTokenInfo(
        token.vendor,
        token.accessToken,
      );
      return new Success('성공적으로 토큰 정보를 가져왔습니다.', tokenInfo);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 토큰으로 카카오 사용자 정보 조회
   * @param vendor OAuth2 벤더
   * @param accessToken OAuth2 토큰
   * @returns userId 숏과외 사용자 ID
   */
  async getUserIdFromAccessToken(vendor: string, accessToken: string) {
    try {
      const userId = await this.authRepository.getUserIdFromAccessToken(
        vendor,
        accessToken,
      );
      return new Success('성공적으로 사용자 ID를 가져왔습니다.', userId);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 토큰으로 숏과외 사용자 조회
   * @param vendor OAuth2 벤더
   * @param accessToken OAuth2 토큰
   * @returns User 숏과외 사용자 정보
   */
  async getUserFromAccessToken(vendor: string, accessToken: string) {
    try {
      const user = await this.authRepository.getUserFromAccessToken(
        vendor,
        accessToken,
      );
      return new Success('성공적으로 사용자를 가져왔습니다.', user);
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
