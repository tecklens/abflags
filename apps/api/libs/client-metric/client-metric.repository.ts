import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ClientMetricEntity } from '@repository/client-metric/client-metric.entity';

@Injectable()
export class ClientMetricRepository extends Repository<ClientMetricEntity> {
  private readonly logger = new Logger(ClientMetricRepository.name);
  constructor(private dataSource: DataSource) {
    super(ClientMetricEntity, dataSource.createEntityManager());
  }

  async clearMetrics(hoursAgo: number) {
    await this.createQueryBuilder('m')
      .delete()
      .where(`m.created_at <= INTERVAL ${hoursAgo} hour`)
      .execute()
  }

  async countPreviousDayHourlyMetricsBuckets() {
    return 0;
  }

  async countPreviousDayMetricsBuckets() {
    return 0;
  }
}
