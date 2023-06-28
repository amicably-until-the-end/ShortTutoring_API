import { Test, TestingModule } from '@nestjs/testing';
import { TutoringsService } from './tutorings.service';

describe('TutoringsService', () => {
  let service: TutoringsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutoringsService],
    }).compile();

    service = module.get<TutoringsService>(TutoringsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
