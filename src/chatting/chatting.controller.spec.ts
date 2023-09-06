import { Test, TestingModule } from '@nestjs/testing';
import { ChattingController } from './chatting.controller';
import { ChattingService } from './chatting.service';

describe('ChattingController', () => {
  let controller: ChattingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChattingController],
      providers: [ChattingService],
    }).compile();

    controller = module.get<ChattingController>(ChattingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
