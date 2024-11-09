import {DataSource, Repository} from 'typeorm';
import {Injectable, Logger} from '@nestjs/common';
import {ClientMetricEntity} from '@repository/client-metric/client-metric.entity';
import {format} from "date-fns";
import {find} from "lodash";

@Injectable()
export class ClientMetricRepository extends Repository<ClientMetricEntity> {
  private readonly logger = new Logger(ClientMetricRepository.name);

  constructor(private dataSource: DataSource) {
    super(ClientMetricEntity, dataSource.createEntityManager());
  }

  async clearMetrics(hoursAgo: number) {
    await this.createQueryBuilder()
      .delete()
      .where(`created_at <= NOW() -  INTERVAL ${hoursAgo} hour`)
      .execute()
  }

  async countPreviousDayHourlyMetricsBuckets() {
    return 0;
  }

  async countPreviousDayMetricsBuckets() {
    return 0;
  }

  async analysisMetricsByFeatureId({
                                     featureName,
                                     period,
                                     limit,
                                   }: {
    featureName: string;
    period: string;
    limit: number;
  }) {
    const formatDateByPeriod =
      period == 'hour' ? '%Y-%m-%d %H' : period == 'day' ? '%Y-%m-%d' : '%Y-%m';
    const oneWeekAgo = new Date();
    oneWeekAgo.setMinutes(0);
    oneWeekAgo.setSeconds(0);

    const dates: string[] = [];
    const date = new Date();

    if (period == 'hour') {
      oneWeekAgo.setHours(oneWeekAgo.getHours() - limit);

      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd HH'));
        date.setHours(date.getHours() - 1);
      }
    } else if (period == 'day') {
      oneWeekAgo.setDate(oneWeekAgo.getDate() - limit);
      oneWeekAgo.setHours(0);

      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd'));
        date.setDate(date.getDate() - 1);
      }
    } else {
      oneWeekAgo.setMonth(oneWeekAgo.getMonth() - limit);
      oneWeekAgo.setDate(0);
      oneWeekAgo.setHours(0);
      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd'));
        date.setMonth(date.getMonth() - 1);
      }
    }

    const totalPerPeriod = await this.createQueryBuilder()
      .select([
        `date_format(created_at, '${formatDateByPeriod}') as label`,
        'sum(yes) as yes',
        'sum(no) as no',
      ])
      .where(`feature_name = '${featureName}'`)
      .groupBy(`date_format(created_at, '${formatDateByPeriod}')`)
      .getRawMany();

    const rlt = [];
    for (let i = dates.length - 1; i >= 0; i--) {
      rlt.push({
        yes: parseInt(
          find(totalPerPeriod, (e) => e.label == dates[i])?.yes ?? '0',
        ),
        no: parseInt(
          find(totalPerPeriod, (e) => e.label == dates[i])?.no ?? '0',
        ),
        label: dates[i],
      });
    }

    return rlt;
  }

  async analysisOsByEnvironmentId({
                                         environmentId,
                                       }: {
    environmentId: string;
  }) {
    return await this.createQueryBuilder('c')
      .select([
        'c.os as os',
        'count(c.os) as value',
      ])
      .where(`c.os is not null and c.environment_id = '${environmentId}'`)
      .groupBy(`c.os`)
      .getRawMany();
  }

  async analysisEnvByEnvironmentId({
                                    environmentId,
                                  }: {
    environmentId: string;
  }) {
    return await this.createQueryBuilder('c')
      .select([
        'c.environment as environment',
        'count(c.environment) as value',
      ])
      .where(`c.environment is not null and c.environment_id = '${environmentId}'`)
      .groupBy(`c.environment`)
      .getRawMany();
  }
}
