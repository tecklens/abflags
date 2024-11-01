import { Injectable, Logger } from '@nestjs/common';
import { IClientMetricsEnv, LastSeenInput } from '@abflags/shared';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LastSeenAtMetricsRepository } from '@repository/last-seen-at-metrics';

@Injectable()
export class LastSeenAtMetricService {
  private readonly logger = new Logger(LastSeenAtMetricService.name);
  private lastSeenToggles: Map<string, LastSeenInput> = new Map();

  constructor(private readonly lastSeenAtMetricRepository: LastSeenAtMetricsRepository) {
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.debug('Scan last seen at metric with second is 10');

    const count = this.lastSeenToggles.size;
    if (count > 0) {
      const lastSeenToggles = Array.from(
        this.lastSeenToggles.values(),
      ).filter((lastSeen) => lastSeen.featureName.length <= 255);
      if (lastSeenToggles.length < this.lastSeenToggles.size) {
        this.logger.warn(
          `Toggles with long names ${JSON.stringify(
            Array.from(this.lastSeenToggles.values())
              .filter(
                (lastSeen) => lastSeen.featureName.length > 255,
              )
              .map((lastSeen) => lastSeen.featureName),
          )}`,
        );
      }
      this.logger.debug(
        `Updating last seen for ${lastSeenToggles.length} toggles`,
      );
      this.lastSeenToggles = new Map<string, LastSeenInput>();

      await this.lastSeenAtMetricRepository.setLastSeen(lastSeenToggles);
    }
    return count;
  }

  updateLastSeen(clientMetrics: IClientMetricsEnv[]): void {
    clientMetrics
      .filter(
        (clientMetric) =>
          !this.lastSeenToggles.has(
            `${clientMetric.featureName}:${clientMetric.environmentId}`,
          ),
      )
      .filter(
        (clientMetric) => clientMetric.yes > 0 || clientMetric.no > 0,
      )
      .forEach((clientMetric) => {
        const key = `${clientMetric.featureName}:${clientMetric.environmentId}`;
        this.lastSeenToggles.set(key, {
          featureName: clientMetric.featureName,
          environmentId: clientMetric.environmentId,
        });
      });
  }

  async cleanLastSeen() {
    // await this.lastSeenAtMetricRepository.cleanLastSeen();
  }
}
