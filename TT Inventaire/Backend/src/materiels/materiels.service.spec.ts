import { Test, TestingModule } from '@nestjs/testing';
import { MaterielsService } from './materiels.service';

describe('MaterielsService', () => {
  let service: MaterielsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterielsService],
    }).compile();

    service = module.get<MaterielsService>(MaterielsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
