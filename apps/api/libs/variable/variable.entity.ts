import {
  Column,
  CreateDateColumn,
  Entity, Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { FeatureId, IVariable, ProjectId, VariableType } from '@abflags/shared';

@Entity('variable')
export class VariableEntity implements IVariable {
  @PrimaryGeneratedColumn('uuid')
  _id: FeatureId;

  @Index()
  @Column({ name: 'project_id', type: 'varchar', length: 64 })
  _projectId: ProjectId;
  @Column({
    name: 'default_value',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  defaultValue: string;
  @Column({ name: 'is_default', type: 'boolean', nullable: true })
  isDefault: boolean;
  @Column({ name: 'name', type: 'varchar', length: 32 })
  name: string;
  @Column({ name: 'required', type: 'boolean', nullable: true })
  required: boolean;
  @Column({ name: 'type', type: 'varchar', length: 16 })
  type: VariableType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @Column({ name: 'created_by', nullable: true, length: 64 })
  createdBy: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Column({ name: 'updated_by', nullable: true, length: 64 })
  updatedBy: string;
}
