import {Injectable, Logger} from '@nestjs/common';
import {FeatureId, IClientMetricsEnv, IJwtPayload} from '@abflags/shared';
import {ClientMetricRepository} from '@repository/client-metric';
import {LastSeenAtMetricService} from '@app/metric/last-seen-at-metric.service';
import {Cron, CronExpression} from '@nestjs/schedule';
import {AnalysisMetricDto, ClientBucketMetricDto} from "@app/metric/dtos";
import {get, reduce} from "lodash";

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);
  private unsavedMetrics: IClientMetricsEnv[] = [];

  constructor(
    private readonly clientMetricRepository: ClientMetricRepository,
    private readonly lastSeenAtMetricService: LastSeenAtMetricService,
  ) {
  }

  async registerBulkMetrics(
    u: IJwtPayload,
    metrics: ClientBucketMetricDto,
  ): Promise<void> {
    if (!metrics || !metrics.bucket) return;
    const transformMetrics = Object.entries(metrics.bucket.features).map((e) => ({
      appName: metrics.appName,
      featureName: e[0],
      yes: e[1].yes,
      no: e[1].no,
      environmentId: u.environmentId,
      start: metrics.bucket.start,
      end: metrics.bucket.end,
      createdAt: metrics.createdAt,
      os: metrics.os,
      environment: metrics.environment,
    }));
    this.unsavedMetrics = [...this.unsavedMetrics, ...transformMetrics];
    this.lastSeenAtMetricService.updateLastSeen(transformMetrics);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async bulkAdd() {
    this.logger.debug('Scan client metric with second is 30');
    if (this.unsavedMetrics.length > 0) {
      const copy = [...this.unsavedMetrics];
      this.unsavedMetrics = [];
      await this.batchInsertMetrics(copy);
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

  async analysisMetrics(u: IJwtPayload, payload: AnalysisMetricDto) {
    return this.clientMetricRepository.analysisMetricsByFeatureId({
      featureName: payload.featureName,
      limit: 48,
      period: payload.period,
    });
  }

  async analysisMetricsProject(u: IJwtPayload) {
    const rlt =  await this.clientMetricRepository.analysisOsByEnvironmentId({
      environmentId: u.environmentId,
    });

    const map = reduce(rlt, (r ,v) => ({
      ...rlt,
      [v.os]: v.value,
    }), {})

    return {
      'mac-os': get(map, 'mac-os') ? parseInt(get(map, 'mac-os')) : 0,
      'android': get(map, 'android') ? parseInt(get(map, 'android')) : 0,
      'window': get(map, 'window') ? parseInt(get(map, 'window')) : 0,
      'linux': get(map, 'linux') ? parseInt(get(map, 'linux')) : 0,
      'ios': get(map, 'ios') ? parseInt(get(map, 'ios')) : 0,
    }
  }

  async analysisEnvMetricProject(u: IJwtPayload) {
    const rlt =  await this.clientMetricRepository.analysisEnvByEnvironmentId({
      environmentId: u.environmentId,
    });

    const map = reduce(rlt, (r ,v) => ({
      ...rlt,
      [v.environment]: v.value,
    }), {})

    return {
      'browser': get(map, 'browser') ? parseInt(get(map, 'browser')) : 0,
      'backend': get(map, 'backend') ? parseInt(get(map, 'backend')) : 0,
      'web-worker': get(map, 'web-worker') ? parseInt(get(map, 'web-worker')) : 0,
    }
  }
}
