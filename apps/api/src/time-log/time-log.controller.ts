import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { TimeLogService } from './time-log.service';

@Controller('time-log')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  // GET http://localhost:3000/time-log/context
  @Get('context')
  getContext() {
    return this.timeLogService.getContext();
  }

  // POST http://localhost:3000/time-log/in
  @Post('in')
  clockIn(@Body() body: { userId: string; projectId: string; lat: number; long: number }) {
    return this.timeLogService.clockIn(body.userId, body.projectId, body.lat, body.long);
  }

  // PATCH http://localhost:3000/time-log/out/log-123
  @Patch('out/:id')
  clockOut(@Param('id') id: string) {
    return this.timeLogService.clockOut(id);
  }
}