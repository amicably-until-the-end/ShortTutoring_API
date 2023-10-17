// agora.service.spec.ts
import { AgoraModule } from './agora.module';
import { AgoraService, WhiteBoardChannelInfo } from './agora.service';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

describe('AgoraService', () => {
  let agoraService: AgoraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AgoraModule, // AgoraModule을 import
        HttpModule.registerAsync({
          useFactory: () => ({ timeout: 4000000, maxRedirects: 5 }),
        }),
      ],
    }).compile();

    agoraService = module.get<AgoraService>(AgoraService);
  });

  it('should be defined', () => {
    expect(agoraService).toBeDefined();
  });

  it('should call someFunction', async () => {
    const voiceChannel = '77f15056-83ef-4702-b9d7-93afd2abd338';

    const boardChannel: WhiteBoardChannelInfo = {
      whiteBoardAppId: 'Rxin0CqBEe6G57e1KJqeHw/oPircsyuDTAGMg',
      whiteBoardUUID: '397662406b6611ee98b8c338f7b27d60',
    };

    const { resourceId, sid } = await agoraService.startRecord(
      boardChannel,
      voiceChannel,
    );
    console.log('resourceId', resourceId);
    console.log('sid', sid);
    console.log('uid', await agoraService.djb2Hash(voiceChannel));

    await agoraService.delayedStopRecord(resourceId, sid, voiceChannel);
  }, 1000000000);
});
