import { Test, TestingModule } from '@nestjs/testing';
import { BureauxController } from './bureaux.controller';

describe('BureauxController', () => {
  let controller: BureauxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BureauxController],
    }).compile();

    controller = module.get<BureauxController>(BureauxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
