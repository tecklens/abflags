import { Injectable, Logger } from '@nestjs/common';
import { IClientMetricsEnv, IJwtPayload } from '@abflags/shared';
import { ClientMetricRepository } from '@repository/client-metric';
import { LastSeenAtMetricService } from '@app/metric/last-seen-at-metric.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientMetricDto } from '@app/metric/dtos/client-metric.dto';

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);
  private unsavedMetrics: IClientMetricsEnv[] = [];

  constructor(
    private readonly clientMetricRepository: ClientMetricRepository,
    private readonly lastSeenAtMetricService: LastSeenAtMetricService,
  ) {}

  async registerBulkMetrics(
    u: IJwtPayload,
    metrics: ClientMetricDto[],
  ): Promise<void> {
    const transformMetrics = metrics.map((e) => ({
      appName: e.appName,
      featureId: e.featureId,
      yes: e.yes,
      no: e.no,
      environmentId: u.environmentId,
      createdAt: e.createdAt,
    }));
    this.unsavedMetrics = [...this.unsavedMetrics, ...transformMetrics];
    this.lastSeenAtMetricService.updateLastSeen(transformMetrics);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  bulkAdd() {
    this.logger.debug('Scan client metric with second is 10');
    if (this.unsavedMetrics.length > 0) {
      const copy = [...this.unsavedMetrics];
      this.unsavedMetrics = [];
      this.batchInsertMetrics(copy);
      // this.config.eventBus.emit(CLIENT_METRICS_ADDED, copy);
    }
  }

  async batchInsertMetrics(metrics: IClientMetricsEnv[]): Promise<void> {
    if (!metrics || metrics.length === 0) {
      return;
    }
    await this.clientMetricRepository.save(metrics);
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async aggregateDailyMetrics() {
  //   const { enabledCount: hourlyEnabledCount } =
  //     await this.clientMetricRepository.countPreviousDayHourlyMetricsBuckets();
  //   const { enabledCount: dailyEnabledCount } =
  //     await this.clientMetricRepository.countPreviousDayMetricsBuckets();
  //
  //   const limit = 3600000;
  //
  //   const totalHourlyCount = hourlyEnabledCount;
  //   const previousDayDailyCountCalculated =
  //     dailyEnabledCount > totalHourlyCount / 24; // heuristic
  //
  //   if (previousDayDailyCountCalculated) {
  //     return;
  //   }
  //   if (totalHourlyCount > limit) {
  //     this.logger.warn(
  //       `Skipping previous day metrics aggregation. Too many results. Expected max value: ${limit}, Actual value: ${totalHourlyCount}`,
  //     );
  //     return;
  //   }
  //   await this.clientMetricRepository.aggregateDailyMetrics();
  // }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async clearMetrics() {
    return this.clientMetricRepository.clearMetrics(48);
  }
}
