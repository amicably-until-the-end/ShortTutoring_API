import { webhook } from '../config.discord-webhook';
import { Fail, Success } from '../response';
import { AuthRepository } from './auth.repository';
import { GetAccessTokenDto } from './dto/get-accesstoken.dto';
import { Injectable } from '@nestjs/common';

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
  async callbackAuthorize(
    code: string,
    state: string,
    error: string,
    errorDescription: string,
  ) {
    return code;
  }

  async decodeJwt(jwt: string) {
    try {
      const decoded = this.authRepository.decodeJwt(jwt);
      return new Success('성공적으로 토큰을 디코딩했습니다.', decoded);
    } catch (error) {
      return new Fail('토큰을 디코딩하는데 실패했습니다.');
    }
  }

  /**
   * 발급받은 인가 코드로부터 엑세스 토큰을 가져옵니다.
   * @param getAccessTokenDto
   */
  async getAccessToken(getAccessTokenDto: GetAccessTokenDto) {
    try {
      const accessToken = await this.authRepository.getAccessToken(
        getAccessTokenDto.vendor,
        getAccessTokenDto.authorizationCode,
      );
      return new Success('성공적으로 토큰을 가져왔습니다.', accessToken);
    } catch (error) {
      await webhook.send(`auth.service > getAccessToken > ${error.message} > `);
      return new Fail('토큰을 가져오는데 실패했습니다.');
    }
  }

  // /**
  //  * 토큰 정보 보기
  //  * @param token OAuth2 토큰
  //  * @returns tokenInfo OAuth2 토큰 정보
  //  */
  // async accessTokenInfo(token: { vendor: string; authorization: string }) {
  //   try {
  //     const tokenInfo = await this.authRepository.getTokenInfo(
  //       token.vendor,
  //       token.authorization,
  //     );
  //     return new Success('성공적으로 토큰 정보를 가져왔습니다.', tokenInfo);
  //   } catch (error) {
  //     return new Fail(error.message);
  //   }
  // }
  //
  // /**
  //  * 토큰으로 카카오 사용자 정보 조회
  //  * @param vendor OAuth2 벤더
  //  * @param accessToken OAuth2 토큰
  //  * @returns userId 숏과외 사용자 ID
  //  */
  // async getUserIdFromAccessToken(vendor: string, accessToken: string) {
  //   try {
  //     const userId = await this.authRepository.getUserIdFromAccessToken(
  //       vendor,
  //       accessToken,
  //     );
  //     return new Success('성공적으로 사용자 ID를 가져왔습니다.', { userId });
  //   } catch (error) {
  //     return new Fail(error.message);
  //   }
  // }
  //
  // /**
  //  * 토큰으로 숏과외 사용자 조회
  //  * @param vendor OAuth2 벤더
  //  * @param accessToken OAuth2 토큰
  //  * @returns User 숏과외 사용자 정보
  //  */
  // async getUserFromAccessToken(vendor: string, accessToken: string) {
  //   try {
  //     const user = await this.authRepository.getUserFromAccessToken(
  //       vendor,
  //       accessToken,
  //     );
  //     return new Success('성공적으로 사용자를 가져왔습니다.', user);
  //   } catch (error) {
  //     return new Fail(error.message);
  //   }
  // }
}
