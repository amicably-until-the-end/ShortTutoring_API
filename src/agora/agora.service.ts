import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import * as process from 'process';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgoraService {
  constructor(private readonly httpService: HttpService) {}

  async makeRtcToken(
    channelName: string,
    uid: number,
  ): Promise<{ token: string; channel: string; uid: number }> {
    const appID = process.env.AGORA_RTC_APP_ID;
    const appCertificate = process.env.AGORA_RTC_APP_CERTIFICATE;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
    );
    return { token, channel: channelName, uid };
  }

  async makeWhiteBoardChannel(): Promise<WhiteBoardChannelInfo> {
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
      whiteBoardAppId: `${data?.teamUUID}/${data?.appUUID}`,
      whiteBoardUUID: data?.uuid,
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

  async startRecord(boardChannel: WhiteBoardChannelInfo, voiceChannel: string) {
    try {
      const boardAppId = boardChannel.whiteBoardAppId;
      const boardChannelId = boardChannel.whiteBoardUUID;
      const boardRoomToken = await this.makeWhiteBoardToken(boardChannelId);
      const voiceAppId = process.env.AGORA_RTC_APP_ID;
      const voiceChannelId = voiceChannel;
      const voiceUid = 3;
      const voiceRoomToken = await this.makeRtcToken(voiceChannelId, voiceUid);
      const queryParams = new URLSearchParams();
      queryParams.append('bAppId', boardAppId);
      queryParams.append('bId', boardChannelId);
      queryParams.append('bToken', boardRoomToken);
      queryParams.append('vAppId', voiceAppId);
      queryParams.append('vChan', voiceChannelId);
      queryParams.append('vToken', voiceRoomToken.token);

      const { data } = await firstValueFrom(
        this.httpService.post(
          `https://api.netless.link/v1/apps/${process.env.AGORA_RECORDING_APP_ID}/cloud_recording/acquire`,
          {
            cname: process.env.AGORA_RECORDING_ACCESS_CHANNEL,
            uid: 3,
            clientRequest: {
              region: 'AP',
              resourceExpiredHour: 24,
              scene: 1,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      console.log(data);
      const acquiredResource = data;
      const startResult = await firstValueFrom(
        this.httpService.post(
          `https://api.netless.link/v1/apps/${process.env.AGORA_RECORDING_APP_ID}/cloud_recording${acquiredResource.resourceID}/mode/mix/start`,
          {
            cname: '{{AccessChannel}}',
            uid: '{{RecordingUID}}',
            clientRequest: {
              token:
                '007eJxTYNBoXvf+dJDb/vsdVtU8rp3PzRW0D3nmuG6/FPJ3jeSvQ/kKDMYGlqZGiSmWJuZGpiZplqmJKUapiamplqmmqSmmhimGjWoMqQ2BjAzXZsQzMTJAIIjPyJDGwAAAFYUeow==',
              recordingConfig: {
                maxIdleTime: 120,
                streamTypes: 0,
                audioProfile: 1,
                channelType: 1,
              },
              storageConfig: {
                vendor: process.env.AGORA_RECORDING_S3_VENDOR,
                region: process.env.AGORA_RECORDING_S3_REGION,
                bucket: process.env.AGORA_RECORDING_S3_BUCKET,
                accessKey: process.env.AGORA_RECORDING_S3_ACCESS_KEY,
                secretKey: process.env.AGORA_RECORDING_S3_SECRET_KEY,
              },
              extensionServiceConfig: {
                errorHandlePolicy: 'error_abort',
                extensionServices: [
                  {
                    serviceName: 'web_recorder_service',
                    errorHandlePolicy: 'error_abort',
                    serviceParam: {
                      url: `${
                        process.env.AROGA_RECORDING_SOURCE
                      }?${queryParams.toString()}`,
                      audioProfile: 0,
                      videoWidth: 720,
                      videoHeight: 1280,
                      maxRecordingHour: 3,
                      maxVideoDuration: 200,
                    },
                  },
                ],
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      console.log(startResult);
    } catch (error) {
      console.log(error);
    }
  }
}

export interface ClassRoomTicket {
  token: string | null;
}

export interface WhiteBoardChannelInfo {
  whiteBoardAppId: string;
  whiteBoardUUID: string;
}
