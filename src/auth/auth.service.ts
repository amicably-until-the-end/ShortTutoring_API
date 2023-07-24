import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel('User')
    private readonly userService: Model<User, UserKey>,
  ) {}

  /*
   * 토큰 정보 보기
   * @param vendor OAuth2 제공자
   * @param token OAuth2 토큰
   * @returns OAuth2 토큰 정보
   */
  async accessTokenInfo(vendor: string, token: string) {
    if (vendor === 'kakao') {
      const { data } = await firstValueFrom(
        this.httpService.get(
          'https://kapi.kakao.com/v1/user/access_token_info',
          {
            headers: {
              Authorization: token,
            },
          },
        ),
      );
      return data;
    }

    return 'Not implemented';
  }

  /*
   * 토큰으로 카카오 사용자 정보 조회
   * @param vendor OAuth2 제공자
   * @param token OAuth2 토큰
   * @returns 카카오 사용자 정보
   */
  async accessTokenUser(vendor: string, token: string) {
    if (vendor === 'kakao') {
      const { data } = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: token,
          },
        }),
      );

      return data;
    }
  }

  /*
   * 토큰으로 숏과외 사용자 조회
   * @param vendor OAuth2 제공자
   * @param token OAuth2 토큰
   * @returns 숏과외 사용자 정보
   */
  async getUserFromAccessToken(vendor: string, token: string) {
    if (vendor === 'kakao') {
      const { data } = await firstValueFrom(
        this.httpService.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: token,
          },
        }),
      );

      const userId = data.properties.shorttutoring_id;

      const user = await this.userService.get({ id: userId });
      if (user === undefined) {
        return null;
      }

      return user;
    }
  }
}
