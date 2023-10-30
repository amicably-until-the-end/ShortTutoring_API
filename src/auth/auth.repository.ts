import { Auth, AuthKey } from './entities/auth.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as process from 'process';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth, AuthKey>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async signJwt(vendor: string, authId: string, userId: string, role: string) {
    try {
      return this.jwtService.sign(
        {
          vendor,
          authId,
          userId,
          role,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '1d',
        },
      );
    } catch (error) {
      throw new Error(`auth.repository > signJwt > ${error.message} > `);
    }
  }

  decodeJwt(jwt: string) {
    try {
      const decoded = this.jwtService.decode(jwt);
      return {
        vendor: decoded['vendor'],
        authId: decoded['authId'],
        userId: decoded['userId'],
        role: decoded['role'],
        iat: decoded['iat'],
        exp: decoded['exp'],
      };
    } catch (error) {
      throw new Error(`auth.repository > decodeJwt > ${error.message} > `);
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
        throw new Error(
          `auth.repository > getAccessToken > ${error.message} > `,
        );
      }
    } else {
      throw new Error(
        `auth.repository > getAccessToken > 지원하지 않는 벤더입니다.`,
      );
    }
  }

  async disconnect(vendor: string, authId: string) {
    if (vendor === 'kakao') {
      try {
        await firstValueFrom(
          this.httpService.post(
            'https://kapi.kakao.com/v1/user/unlink',
            {
              target_id_type: 'user_id',
              target_id: Number(authId),
            },
            {
              headers: {
                Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=utf-8',
              },
            },
          ),
        );
      } catch (error) {
        throw new Error(`auth.repository > disconnect > ${error.message} > `);
      }
    } else {
      throw new Error(
        `auth.repository > disconnect > 지원하지 않는 벤더입니다.`,
      );
    }
  }

  async getAuthIdFromAccessToken(vendor: string, accessToken: string) {
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
        throw new Error(
          `auth.repository > getAuthIdFromAccessToken > ${error.message} > `,
        );
      }
    }
  }

  async getUserIdFromAccessToken(vendor: string, accessToken: string) {
    try {
      const authId = await this.getAuthIdFromAccessToken(vendor, accessToken);
      const auth = await this.getAuth(vendor, authId);

      return auth.userId;
    } catch (error) {
      throw new Error(
        `auth.repository > getUserIdFromAccessToken > ${error.message} > `,
      );
    }
  }

  async createAuth(
    vendor: string,
    authId: string,
    userId: string,
    role: string,
  ) {
    try {
      return await this.authModel.create({
        vendor,
        authId,
        userId,
        role,
      });
    } catch (error) {
      throw new Error(`auth.repository > createAuth > ${error.message} > `);
    }
  }

  async getAuth(vendor: string, authId: string) {
    try {
      return await this.authModel.get({
        vendor,
        authId,
      });
    } catch (error) {
      throw new Error(`auth.repository > getAuth > ${error.message} > `);
    }
  }

  async delete(vendor: string, authId: string) {
    try {
      await this.authModel.delete({
        vendor,
        authId,
      });
      await this.disconnect(vendor, authId);
    } catch (error) {
      throw new Error(`auth.repository > delete > ${error.message} > `);
    }
  }
}
