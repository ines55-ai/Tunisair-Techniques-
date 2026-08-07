import { Test, TestingModule } from '@nestjs/testing';
import { MouvementsService } from './mouvements.service';

describe('MouvementsService', () => {
  let service: MouvementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MouvementsService],
    }).compile();

    service = module.get<MouvementsService>(MouvementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
