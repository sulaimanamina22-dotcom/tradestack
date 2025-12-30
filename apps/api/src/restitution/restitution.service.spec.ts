import { Test, TestingModule } from '@nestjs/testing';
import { RestitutionService } from './restitution.service';

describe('RestitutionService', () => {
  let service: RestitutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestitutionService],
    }).compile();

    service = module.get<RestitutionService>(RestitutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
