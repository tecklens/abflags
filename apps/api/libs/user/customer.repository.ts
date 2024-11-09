import {Between, DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {CustomerEntity} from "@repository/user/customer.entity";

@Injectable()
export class CustomerRepository extends Repository<CustomerEntity> {
  constructor(private dataSource: DataSource) {
    super(CustomerEntity, dataSource.createEntityManager());
  }

  async clearAfter(monthAgo) {
    await this.createQueryBuilder()
      .delete()
      .where(`created_at <= NOW() -  INTERVAL ${monthAgo} MONTH`)
      .execute();
  }

  async countByProjectInHours(projectId: string, start: Date, end: Date) {
    return this.countBy({
      projectId: projectId,
      updatedAt: Between(start, end)
    })
  }
}
