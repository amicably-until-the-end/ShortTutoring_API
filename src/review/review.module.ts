import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
