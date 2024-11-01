import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import { IClientMetric } from '@abflags/shared';

@Entity('client_metric_daily')
export class ClientMetricDailyEntity implements IClientMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Index()
  @Column({ name: 'feature_name', length: 64 })
  featureName: string;
  @Column({ name: 'environment_id', length: 64, nullable: true })
  environmentId: string;
  @Column({ name: 'app_name', length: 255 })
  appName: string;
  @Column({ name: 'start', type: 'datetime', nullable: true })
  start: Date;
  @Column({ name: 'end', type: 'datetime', nullable: true })
  end: Date;
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
  @Column({ name: 'yes' })
  yes: number;
  @Column({ name: 'no' })
  no: number;
}
