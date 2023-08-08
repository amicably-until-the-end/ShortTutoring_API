import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import * as process from 'process';

@Injectable()
export class AgoraService {
  constructor(private readonly httpService: HttpService) {}

  async makeRtcToken(channelName: string) {
    const appID = process.env.AGORA_RTC_APP_ID;
    const appCertificate = process.env.AGORA_RTC_APP_CERTIFICATE;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const studentToken = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      2,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
    );
    const teacherToken = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      1,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
    );
    return { studentToken: studentToken, teacherToken: teacherToken };
  }

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
            isBan: true,
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
}

export interface WhiteBoardData {
  whiteBoardAppId: string | null;
  whiteBoardUUID: string | null;
  whiteBoardToken: string | null;
}
