import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EnvironmentId,
  FeatureBehavior,
  FeatureId,
  FeatureStatus,
  FeatureType,
  IFeature,
  ProjectId,
} from '@abflags/shared';

@Entity('feature')
export class FeatureEntity implements IFeature {
  @PrimaryGeneratedColumn('uuid')
  _id: FeatureId;
  @Column({name: 'environment_id', type: 'varchar', length: 64})
  _environmentId: EnvironmentId;
  @Index()
  @Column({name: 'project_id', type: 'varchar', length: 64})
  _projectId: ProjectId;
  @Column({name: 'name', type: 'varchar', length: 64})
  name: string;
  @Column({name: 'description', type: 'varchar', length: 128, nullable: true})
  description?: string;
  @Column({
    name: 'status',
    type: 'enum',
    enum: FeatureStatus,
    default: FeatureStatus.ACTIVE,
  })
  status: FeatureStatus;
  @Column({
    name: 'type',
    type: 'enum',
    enum: FeatureType,
    default: FeatureType.RELEASE,
  })
  type: FeatureType;
  @Column({
    name: 'behavior',
    type: 'enum',
    enum: FeatureBehavior,
    default: FeatureBehavior.SIMPLE,
  })
  behavior: FeatureBehavior;

  @Column({name: 'tags', type: 'simple-array', nullable: true})
  tags: string[];

  @Column({name: 'archived_at', nullable: true, type: 'datetime'})
  archivedAt: Date;

  @CreateDateColumn({name: 'created_at', type: 'datetime'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at', type: 'datetime'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;
}
