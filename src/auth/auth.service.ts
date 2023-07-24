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
