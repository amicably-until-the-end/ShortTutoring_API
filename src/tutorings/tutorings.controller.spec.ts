import { Test, TestingModule } from '@nestjs/testing';
import { TutoringsController } from './tutorings.controller';
import { TutoringsService } from './tutorings.service';

describe('TutoringsController', () => {
  let controller: TutoringsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutoringsController],
      providers: [TutoringsService],
    }).compile();

    controller = module.get<TutoringsController>(TutoringsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
