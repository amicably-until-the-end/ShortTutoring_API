import { AgoraService } from './agora.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule.register({ timeout: 100000, maxRedirects: 5 })],
  providers: [AgoraService],
  exports: [AgoraService],
})
export class AgoraModule {}
