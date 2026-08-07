import { Test, TestingModule } from '@nestjs/testing';
import { MaterielsController } from './materiels.controller';

describe('MaterielsController', () => {
  let controller: MaterielsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterielsController],
    }).compile();

    controller = module.get<MaterielsController>(MaterielsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
