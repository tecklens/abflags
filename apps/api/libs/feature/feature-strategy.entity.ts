import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {ConditionGroupState, FeatureId, FeatureStrategyStatus, IFeatureStrategy,} from '@abflags/shared';
import {FeatureEntity} from "@repository/feature/feature.entity";

@Entity('feature_strategy')
export class FeatureStrategyEntity implements IFeatureStrategy {
  @PrimaryGeneratedColumn('uuid')
  _id: FeatureId;

  @Column({name: 'feature_id', type: 'varchar', length: 64})
  featureId: FeatureId;
  @Column({name: 'name', type: 'varchar', length: 64})
  name: string;
  @Column({name: 'conditions', type: 'simple-json', nullable: true})
  conditions: ConditionGroupState[];
  @Column({name: 'description', type: 'varchar', length: 128})
  description: string;
  @Column({name: 'sort_order', type: 'smallint', default: 0})
  sortOrder: number;
  @Column({name: 'status', enum: FeatureStrategyStatus, type: 'enum'})
  status: FeatureStrategyStatus;

  @Column({name: 'stickiness', type: 'varchar', length: 128, default: 'userId'})
  stickiness: string;
  @Column({name: 'group_id', type: 'varchar', length: 128, default: ''})
  groupId: string;
  @Column({name: 'percentage', type: 'float', default: 0})
  percentage: number;
  @Column({name: 'order', type: 'int', default: 0})
  order: number;

  @CreateDateColumn({name: 'created_at', type: 'datetime'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at', type: 'datetime'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;

  @ManyToOne(type => FeatureEntity, f => f.strategies)
  @JoinColumn({name: 'feature_id'})
  feature: FeatureEntity;
}
