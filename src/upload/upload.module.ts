import { Module } from '@nestjs/common';
import { UploadRepository } from './upload.repository';

@Module({
  controllers: [],
  providers: [UploadRepository],
})
export class UploadModule {}
