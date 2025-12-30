import { Module } from '@nestjs/common';
import { RestitutionService } from './restitution.service';
import { RestitutionController } from './restitution.controller';

@Module({
  controllers: [RestitutionController],
  providers: [RestitutionService],
})
export class RestitutionModule {}
