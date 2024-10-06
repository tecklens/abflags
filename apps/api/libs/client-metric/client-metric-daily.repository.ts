import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ClientMetricDailyEntity } from '@repository/client-metric/client-metric-daily.entity';

@Injectable()
export class ClientMetricDailyRepository extends Repository<ClientMetricDailyEntity> {
  private readonly logger = new Logger(ClientMetricDailyRepository.name);
  constructor(private dataSource: DataSource) {
    super(ClientMetricDailyEntity, dataSource.createEntityManager());
  }
}
