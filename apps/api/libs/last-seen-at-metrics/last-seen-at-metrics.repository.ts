import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { LastSeenAtMetricsEntity } from '@repository/last-seen-at-metrics/last-seen-at-metrics.entity';
import { LastSeenInput } from '@abflags/shared';

@Injectable()
export class LastSeenAtMetricsRepository extends Repository<LastSeenAtMetricsEntity> {
  private readonly logger = new Logger(LastSeenAtMetricsRepository.name);
  constructor(private dataSource: DataSource) {
    super(LastSeenAtMetricsEntity, dataSource.createEntityManager());
  }

  private prepareLastSeenInput = (data: LastSeenInput[]) => {
    const now = new Date();

    const sortedData = data.sort(
      (a, b) =>
        a.featureName.localeCompare(b.featureName) ||
        a.environmentId.localeCompare(b.environmentId),
    );

    return sortedData.map((item) => {
      return {
        featureName: item.featureName,
        environmentId: item.environmentId,
        lastSeenAt: now,
      };
    });
  };

  async setLastSeen(data: LastSeenInput[]): Promise<void> {
    try {
      const inserts = this.prepareLastSeenInput(data);
      const batchSize = 200;

      for (let i = 0; i < inserts.length; i += batchSize) {
        const batch = inserts.slice(i, i + batchSize);
        await this.save(batch);
      }
    } catch (err) {
      this.logger.error('Could not update lastSeen, error: ', err);
    }
  }
}
