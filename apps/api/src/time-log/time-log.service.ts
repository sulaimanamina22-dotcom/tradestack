import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, LogStatus } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TimeLogService {

  // 0. GET CONTEXT (Dropdown Data)
  async getContext() {
    return {
      users: await prisma.user.findMany(),
      projects: await prisma.project.findMany()
    };
  }

  // 1. CLOCK IN (The "Smart Punch")
  async clockIn(userId: string, projectId: string, lat: number, long: number) {
    
    // A. Verify Project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { wage_sheet: true } 
    });
    if (!project) throw new NotFoundException("Project not found");

    // B. Verify User & Trade
    const user = await prisma.user.findUnique({ where: { id: userId }});
    if (!user) throw new NotFoundException("User not found");
    if (!user.default_trade) throw new NotFoundException("User has no trade assigned");

    // C. Geofence Check
    const isInsideFence = Math.abs(project.geo_lat - lat) < 0.01 && 
                          Math.abs(project.geo_long - long) < 0.01;

    // D. Find Rate
    const rate = await prisma.tradeRate.findFirst({
      where: {
        determination_id: project.wage_sheet_id,
        classification: { contains: user.default_trade }
      }
    });

    if (!rate) throw new NotFoundException(`No rate found for trade: ${user.default_trade}`);

    // E. Create Log
    return prisma.timeLog.create({
      data: {
        user_id: userId,
        project_id: projectId,
        trade_rate_id: rate.id,
        clock_in: new Date(),
        gps_lat_in: lat,
        gps_long_in: long,
        is_flagged: !isInsideFence,
        status: LogStatus.PENDING
      }
    });
  }

  // 2. CLOCK OUT
  async clockOut(logId: string) {
    const log = await prisma.timeLog.findUnique({ where: { id: logId }});
    if (!log) throw new NotFoundException("Time Log not found");
    
    const now = new Date();
    const durationMs = now.getTime() - new Date(log.clock_in).getTime();
    const durationHrs = durationMs / (1000 * 60 * 60);

    return prisma.timeLog.update({
      where: { id: logId },
      data: {
        clock_out: now,
        duration_hrs: durationHrs,
        status: LogStatus.APPROVED
      }
    });
  }
  
  // Boilerplate
  create(dto: any) { return 'Adds a new timeLog'; }
  findAll() { return `Returns all timeLog`; }
  findOne(id: number) { return `Returns #${id} timeLog`; }
  update(id: number, dto: any) { return `Updates #${id} timeLog`; }
  remove(id: number) { return `Removes #${id} timeLog`; }
}