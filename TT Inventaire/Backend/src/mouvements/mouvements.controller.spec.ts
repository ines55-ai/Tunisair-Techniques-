import { Test, TestingModule } from '@nestjs/testing';
import { MouvementsController } from './mouvements.controller';

describe('MouvementsController', () => {
  let controller: MouvementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MouvementsController],
    }).compile();

    controller = module.get<MouvementsController>(MouvementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
