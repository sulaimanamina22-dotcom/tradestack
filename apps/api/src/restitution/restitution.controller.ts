import { Controller, Get, Patch, Param } from '@nestjs/common';
import { RestitutionService } from './restitution.service';

@Controller('restitution')
export class RestitutionController {
  constructor(private readonly restitutionService: RestitutionService) {}

  // Endpoint: GET http://localhost:3000/restitution
  @Get()
  findAll() {
    return this.restitutionService.findAll();
  }

  // Endpoint: PATCH http://localhost:3000/restitution/uuid-123
  @Patch(':id')
  markAsPaid(@Param('id') id: string) {
    return this.restitutionService.markAsPaid(id);
  }
}