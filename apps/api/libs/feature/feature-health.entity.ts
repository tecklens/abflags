import {
  Column,
  CreateDateColumn,
  Entity,
  Index, PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EnvironmentId,
  FeatureBehavior,
  FeatureId,
  FeatureStatus, FeatureType,
  IFeature, IFeatureHealthInterface,
  ProjectId,
} from '@abflags/shared';

@Entity('feature_health')
export class FeatureHealthEntity implements IFeatureHealthInterface {
  @PrimaryColumn({name: 'error_id', length: 64})
  errorId: string;
  @PrimaryColumn({name: 'feature_id', type: 'varchar', length: 64})
  featureId: FeatureId;
  @Column({name: 'environment_id', type: 'varchar', length: 64})
  environmentId: EnvironmentId;
  @Column({name: 'message', type: 'text'})
  message: string;
  @Column({name: 'project_id', type: 'varchar', length: 64})
  projectId: ProjectId;
  @Column({name: 'status_code'})
  statusCode: number;
  @Column({name: 'created_at', type: 'datetime'})
  createdAt: Date;
}
