import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {CustomerInsightsEntity} from "./customer-insights.entity";

@Injectable()
export class CustomerInsightsRepository extends Repository<CustomerInsightsEntity> {
  constructor(private dataSource: DataSource) {
    super(CustomerInsightsEntity, dataSource.createEntityManager());
  }
}
