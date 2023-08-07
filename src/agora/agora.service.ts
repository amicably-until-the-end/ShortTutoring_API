import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';

@Injectable()
export class AgoraService {
  constructor(private readonly httpService: HttpService) {}

  async makeWhiteBoardChannel(): Promise<WhiteBoardData> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://api.netless.link/v5/rooms',
        {
          isRecord: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: process.env.AGORA_WHITEBOARD_SDK_TOKEN,
            region: 'us-sv',
          },
        },
      ),
    );
    console.log('whiteboard token ', data);
    if (data?.uuid === undefined) {
      return null;
    }
    const token = await this.makeWhiteBoardToken(data.uuid);
    return {
      whiteBoardAppId: data?.appUUID,
      whiteBoardUUID: data?.uuid,
      whiteBoardToken: token,
    };
  }

  async makeWhiteBoardToken(whiteBoardUUID: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://api.netless.link/v5/tokens/rooms/${whiteBoardUUID}`,
          {
            lifespan: 36000000,
            role: 'admin',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              token: process.env.AGORA_WHITEBOARD_SDK_TOKEN,
              region: 'us-sv',
            },
          },
        ),
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  async disableWhiteBoardChannel(whiteBoardUUID: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(
          `https://api.netless.link/v5/rooms/${whiteBoardUUID}`,
          {
            headers: {
              'Content-Type': 'application/json',
              token: process.env.AGORA_WHITEBOARD_SDK_TOKEN,
              region: 'us-sv',
            },
            body: {
              isBan: true,
            },
          },
        ),
      );
      return data;
    } catch (error) {
      return null;
    }
  }
}

export interface WhiteBoardData {
  whiteBoardAppId: string | null;
  whiteBoardUUID: string | null;
  whiteBoardToken: string | null;
}
