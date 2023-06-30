import { Test, TestingModule } from '@nestjs/testing';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';

describe('ResponsesController', () => {
  let controller: ResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsesController],
      providers: [ResponsesService],
    }).compile();

    controller = module.get<ResponsesController>(ResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
