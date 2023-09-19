import { UploadRepository } from './upload.repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [UploadRepository],
})
export class UploadModule {}
