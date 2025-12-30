import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestitutionModule } from './restitution/restitution.module';
import { TimeLogModule } from './time-log/time-log.module';

@Module({
  imports: [RestitutionModule, TimeLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
