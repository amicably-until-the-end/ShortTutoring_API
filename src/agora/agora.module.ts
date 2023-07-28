import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AgoraService } from './agora.service';
@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [AgoraService],
  exports:[AgoraService]
})
export class AgoraModule {}
