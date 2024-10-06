import { Module } from '@nestjs/common';
import { MetricService } from './metric.service';
import { MetricController } from './metric.controller';
import { EventRepository } from '@repository/event';
import { LastSeenAtMetricsRepository } from '@repository/last-seen-at-metrics';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastSeenAtMetricService } from '@app/metric/last-seen-at-metric.service';
import { ClientMetricDailyRepository, ClientMetricRepository } from '@repository/client-metric';

const repositories = [EventRepository, LastSeenAtMetricsRepository, ClientMetricDailyRepository, ClientMetricRepository]

@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  providers: [MetricService, LastSeenAtMetricService, ...repositories],
  controllers: [MetricController],
})
export class MetricModule {}
