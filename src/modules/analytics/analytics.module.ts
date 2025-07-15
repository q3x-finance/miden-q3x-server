import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AnalyticsEventEntity,
  AnalyticsUserSessionEntity,
  AnalyticsEndpointStatsEntity,
  AnalyticsTransactionStatsEntity,
} from './analytics.entity';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyticsEventEntity,
      AnalyticsUserSessionEntity,
      AnalyticsEndpointStatsEntity,
      AnalyticsTransactionStatsEntity,
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [AnalyticsRepository, AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService, AnalyticsRepository],
})
export class AnalyticsModule {}
