import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { IClientMetric } from '@abflags/shared';

@Entity('client_metric_daily')
export class ClientMetricDailyEntity implements IClientMetric {
  @PrimaryColumn({ name: 'feature_name', length: 64 })
  featureName: string;
  @PrimaryColumn({ name: 'environment_id', length: 64 })
  environmentId: string;
  @Column({ name: 'app_name', length: 255 })
  appName: string;
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
  @Column({ name: 'count' })
  count: number;
  @Column({ name: 'yes' })
  yes: number;
  @Column({ name: 'no' })
  no: number;
}
