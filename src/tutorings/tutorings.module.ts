import { Module } from '@nestjs/common';
import { TutoringsService } from './tutorings.service';
import { TutoringsController } from './tutorings.controller';

@Module({
  controllers: [TutoringsController],
  providers: [TutoringsService],
})
export class TutoringsModule {}
