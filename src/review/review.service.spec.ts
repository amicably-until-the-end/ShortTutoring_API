import { ReviewService } from './review.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ReviewsService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
