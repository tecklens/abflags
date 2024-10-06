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
  FeatureId,
  IEvent,
  IEventType,
  IEventTypes,
  ProjectId,
} from '@abflags/shared';

@Entity('event')
export class EventEntity implements IEvent {
  @PrimaryGeneratedColumn('uuid')
  _id: FeatureId;
  @Column({ name: 'environment_id', type: 'varchar', length: 64 })
  _environmentId: EnvironmentId;
  @Index()
  @Column({ name: 'project_id', type: 'varchar', length: 64 })
  _projectId: ProjectId;

  @Column({ name: 'data', type: 'simple-json', nullable: true })
  data?: any;
  @Column({ name: 'pre_data', type: 'simple-json', nullable: true })
  preData: any;
  @Column({ name: 'feature_name', type: 'varchar', length: 64 })
  featureName: string;
  @Column({ name: 'type', type: 'enum', enum: IEventTypes })
  type: IEventType;

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @Column({ name: 'created_by', nullable: true, length: 64 })
  createdBy: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Column({ name: 'updated_by', nullable: true, length: 64 })
  updatedBy: string;
}
