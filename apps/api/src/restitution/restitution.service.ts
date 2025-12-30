import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RestitutionService {
  
  // 1. GET ALL PENDING RESTITUTIONS
  // This fetches the "Audit Trap" data to show the Admin
  async findAll() {
    return prisma.restitutionRecord.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        time_log: {
          include: {
            user: true,      // Get Worker Name (Mike Hammer)
            project: true,   // Get Project Name (Library Retrofit)
            trade_rate: true // Get the "Wrong" rate used
          }
        }
      }
    });
  }

  // 2. MARK AS PAID
  // The Admin clicks "Process Check" to trigger this
  async markAsPaid(id: string) {
    return prisma.restitutionRecord.update({
      where: { id },
      data: {
        status: 'PROCESSED',
        paid_date: new Date()
      }
    });
  }
  
  // Placeholder methods required by NestJS generation
  create(createRestitutionDto: any) { return 'This action adds a new restitution'; }
  findOne(id: number) { return `This action returns a #${id} restitution`; }
  update(id: number, updateRestitutionDto: any) { return `This action updates a #${id} restitution`; }
  remove(id: number) { return `This action removes a #${id} restitution`; }
}