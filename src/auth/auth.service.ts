import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AccessToken } from './entities/auth.entity';
import * as process from 'process';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 토큰 정보 보기
   * @param accessToken OAuth2 토큰
   * @returns KakaoToken OAuth2 토큰 정보
   */
  async accessTokenInfo(accessToken: AccessToken) {
    if (accessToken.vendor === 'kakao') {
      const { data } = await firstValueFrom(
        this.httpService.get(
          'https://kapi.kakao.com/v1/user/access_token_info',
          {
            headers: {
              Authorization: accessToken.token,
            },
          },
        ),
      );
      return data;
    }

    return null;
  }

  /**
   * 토큰으로 카카오 사용자 정보 조회
   * @param accessToken OAuth2 토큰
   * @returns userId 숏과외 사용자 ID
   */
  async getUserIdFromAccessToken(accessToken: AccessToken): Promise<string> {
    if (accessToken.vendor === 'kakao') {
      const { data } = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: accessToken.token,
          },
        }),
      );

      return data.id.toString();
    }
  }

  /**
   * 토큰으로 숏과외 사용자 조회
   * @param accessToken OAuth2 토큰
   * @returns User 숏과외 사용자 정보
   */
  async getUserFromAccessToken(accessToken: AccessToken) {
    if (accessToken.vendor === 'kakao') {
      try {
        const userId = await this.getUserIdFromAccessToken(accessToken);

        return await this.userRepository.get({
          vendor: accessToken.vendor,
          userId,
        });
      } catch (error) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
    }
  }

  async kakaoCallbackAuthorize(
    code: string,
    state: string,
    error: string,
    errorDescription: string,
  ) {
    return code;
  }

  async kakaoToken(code: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: 'http://localhost:3000/auth/kakao/callback/authorize',
          code: code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      ),
    );

    return data;
  }
}
