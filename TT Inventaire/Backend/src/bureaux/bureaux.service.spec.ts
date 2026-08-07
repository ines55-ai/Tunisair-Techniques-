import { Test, TestingModule } from '@nestjs/testing';
import { BureauxService } from './bureaux.service';

describe('BureauxService', () => {
  let service: BureauxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BureauxService],
    }).compile();

    service = module.get<BureauxService>(BureauxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
