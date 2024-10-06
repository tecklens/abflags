import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ILastSeenAtMetrics } from '@abflags/shared';

@Entity('last_seen_at_metrics')
export class LastSeenAtMetricsEntity implements ILastSeenAtMetrics {
  @PrimaryColumn({name: 'feature_name', length: 64})
  featureName: string;
  @PrimaryColumn({name: 'environment_id', length: 64})
  environmentId: string;
  @Column({name: 'last_seen_at', type: 'datetime'})
  lastSeenAt: Date;
}
