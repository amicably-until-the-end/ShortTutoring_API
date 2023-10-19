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

  async startRecord(
    boardChannel: WhiteBoardChannelInfo,
    voiceChannel: string,
    tutoringId: string,
  ): Promise<{ resourceId: string; sid: string; tutoringId: string }> {
    try {
      const boardAppId = boardChannel.whiteBoardAppId;
      const boardChannelId = boardChannel.whiteBoardUUID;
      const boardRoomToken = await this.makeWhiteBoardToken(boardChannelId);
      const voiceAppId = process.env.AGORA_RTC_APP_ID;
      const voiceChannelId = tutoringId; //agora 에서 voice Channel은 questionId와 동일
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
          `https://api.agora.io/v1/apps/${process.env.AGORA_RECORDING_APP_ID}/cloud_recording/acquire`,
          {
            cname: process.env.AGORA_RECORDING_ACCESS_CHANNEL,
            uid: await this.djb2Hash(tutoringId),
            clientRequest: {
              region: 'AP',
              resourceExpiredHour: 24,
              scene: 1,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${process.env.AGORA_RECORDING_AUTHORIZATION}`,
            },
          },
        ),
      );
      const { cname, uid, resourceId } = data;
      console.log(
        'url',
        `${process.env.AGORA_RECORDING_SOURCE}?${queryParams.toString()}`,
      );
      const startResult = await firstValueFrom(
        this.httpService.post(
          `https://api.agora.io/v1/apps/${process.env.AGORA_RECORDING_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/web/start`,
          {
            cname: cname,
            uid: await this.djb2Hash(tutoringId),
            clientRequest: {
              token: process.env.AGORA_RECORDING_TOKEN,
              recordingConfig: {
                maxIdleTime: 120,
                streamTypes: 0,
                audioProfile: 1,
                channelType: 1,
                maxRecordingHour: 2,
              },
              storageConfig: {
                vendor: Number(process.env.AGORA_RECORDING_S3_VENDOR),
                region: Number(process.env.AGORA_RECORDING_S3_REGION),
                bucket: process.env.AGORA_RECORDING_S3_BUCKET_NAME,
                accessKey: process.env.AGORA_RECORDING_S3_ACCESS_KEY,
                secretKey: process.env.AGORA_RECORDING_S3_SECRET_KEY,
                fileNamePrefix: [`${await this.djb2Hash(tutoringId)}`],
              },
              extensionServiceConfig: {
                errorHandlePolicy: 'error_abort',
                extensionServices: [
                  {
                    serviceName: 'web_recorder_service',
                    errorHandlePolicy: 'error_abort',
                    serviceParam: {
                      url: `${
                        process.env.AGORA_RECORDING_SOURCE
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
              Authorization: `Basic ${process.env.AGORA_RECORDING_AUTHORIZATION}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return {
        sid: startResult.data.sid,
        resourceId: startResult.data.resourceId,
        tutoringId: tutoringId,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async delayedStopRecord(
    resourceId: string,
    sid: string,
    voiceChannel: string,
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        await this.stopRecord(resourceId, sid, voiceChannel);
        resolve('');
      }, 10000);
    });
  }

  /**
   *
   * @param resourceId - agora record acquire 할 때 받은 resourceId : tutoring table에 저장
   * @param sid - agora record acquire 할 때 받은 sid : tutoring table에 저장
   * @param tutoringId - tutoringId : recording의 uid로 활용
   */

  async stopRecord(
    resourceId: string,
    sid: string,
    tutoringId: string,
  ): Promise<{ uid: string; tutoringId: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://api.agora.io/v1/apps/${process.env.AGORA_RECORDING_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/web/stop`,
          {
            cname: process.env.AGORA_RECORDING_ACCESS_CHANNEL,
            uid: `${await this.djb2Hash(tutoringId)}`,
            clientRequest: {},
          },
          {
            headers: {
              Authorization: `Basic ${process.env.AGORA_RECORDING_AUTHORIZATION}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return {
        uid: `${await this.djb2Hash(tutoringId)}`,
        tutoringId: tutoringId,
      };
    } catch (error) {
      console.log(error);
      return {
        uid: `${await this.djb2Hash(tutoringId)}`,
        tutoringId: tutoringId,
      };
    }
  }

  async djb2Hash(str: string): Promise<string> {
    let hash = 1255; // Initial hash value

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash * 33) ^ char; // DJB2 hash formula
    }

    return String(hash >>> 0); // Ensure it's a positive 32-bit integer
  }
}

export interface ClassRoomTicket {
  token: string | null;
}

export interface WhiteBoardChannelInfo {
  whiteBoardAppId: string;
  whiteBoardUUID: string;
}
