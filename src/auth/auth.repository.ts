import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserRepository } from '../user/user.repository';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async generateJwt(vendor: string, code: string) {
    if (vendor === 'kakao') {
      try {
        const accessToken = await this.getAccessToken(vendor, code);

        const userId = await this.getUserIdFromAccessToken(vendor, accessToken);

        const jwt = this.jwtService.sign(
          {
            vendor,
            userId,
          },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: '1d',
          },
        );

        return { jwt, userId };
      } catch (error) {
        throw new Error('카카오 인가코드를 가져오는데 실패했습니다.');
      }
    } else {
      throw new Error('지원하지 않는 벤더입니다.');
    }
  }

  async signJwt(vendor: string, userId: string) {
    try {
      return this.jwtService.sign(
        {
          vendor,
          userId,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '1d',
        },
      );
    } catch (error) {
      throw new Error('JWT를 생성하는데 실패했습니다.');
    }
  }

  async decodeJwt(jwt: string) {
    try {
      const decoded = this.jwtService.decode(jwt);
      return {
        vendor: decoded['vendor'],
        userId: decoded['userId'],
        iat: decoded['iat'],
        exp: decoded['exp'],
      };
    } catch (error) {
      throw new Error('JWT를 읽는데 실패했습니다.');
    }
  }

  async verifyJwt(jwt: string) {
    try {
      const verified = await this.jwtService.verify(jwt, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return {
        vendor: verified['vendor'],
        userId: verified['userId'],
        iat: verified['iat'],
        exp: verified['exp'],
      };
    } catch (error) {
      throw new Error('JWT를 검증하는데 실패했습니다.');
    }
  }

  async getAccessToken(vendor: string, code: string) {
    if (vendor === 'kakao') {
      try {
        const { data } = await firstValueFrom(
          this.httpService.post(
            'https://kauth.kakao.com/oauth/token',
            {
              grant_type: 'authorization_code',
              client_id: process.env.KAKAO_REST_API_KEY,
              redirect_uri:
                'http://shorttutoring-493721324.ap-northeast-2.elb.amazonaws.com/auth/callback/authorize',
              code,
            },
            {
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=utf-8',
              },
            },
          ),
        );

        return data['access_token'];
      } catch (error) {
        throw new Error('카카오 인가코드를 가져오는데 실패했습니다.');
      }
    } else {
      throw new Error('지원하지 않는 벤더입니다.');
    }
  }

  async getTokenInfo(vendor: string, accessToken: string) {
    if (vendor === 'kakao') {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get(
            'https://kapi.kakao.com/v1/user/access_token_info',
            {
              headers: {
                Authorization: `${accessToken}`,
              },
            },
          ),
        );

        return data;
      } catch (error) {
        throw new Error('토큰 정보를 가져올 수 없습니다.');
      }
    }
  }

  async getUserIdFromAccessToken(vendor: string, accessToken: string) {
    if (vendor === 'kakao') {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
              Authorization: accessToken,
            },
          }),
        );

        return data.id.toString();
      } catch (error) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
    }
  }

  async getUserFromAccessToken(vendor: string, accessToken: string) {
    if (vendor === 'kakao') {
      try {
        const userId = await this.getUserIdFromAccessToken(vendor, accessToken);

        return await this.userRepository.get({
          vendor,
          userId,
        });
      } catch (error) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
    }
  }
}
