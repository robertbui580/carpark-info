import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CarparkModule } from '../carpark/carpark.module';
import { ScheduleTaskService } from './schedule-task.service';

@Module({
  imports: [ScheduleModule.forRoot(), CarparkModule],
  providers: [ScheduleTaskService],
})
export class ScheduleTaskModule {}
