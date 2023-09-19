import { CreateReviewDto } from './create-review.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
