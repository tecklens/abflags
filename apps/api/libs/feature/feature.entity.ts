import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {EnvironmentId, FeatureBehavior, FeatureId, FeatureStatus, IFeature, ProjectId} from "@abflags/shared";

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
  @Column({name: 'status', type: 'enum', enum: FeatureStatus, default: FeatureStatus.ACTIVE})
  status: FeatureStatus;
  @Column({name: 'behavior', type: 'enum', enum: FeatureBehavior, default: FeatureBehavior.SIMPLE})
  behavior: FeatureBehavior;

  @Column({name: 'tags', type: 'simple-array'})
  tags: string[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;
}
