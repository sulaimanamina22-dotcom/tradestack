import { Test, TestingModule } from '@nestjs/testing';
import { RestitutionController } from './restitution.controller';
import { RestitutionService } from './restitution.service';

describe('RestitutionController', () => {
  let controller: RestitutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestitutionController],
      providers: [RestitutionService],
    }).compile();

    controller = module.get<RestitutionController>(RestitutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
