import {EncryptedSecret, IApiKey, IDnsSettings, IEnvironment, IWidgetSettings, ProjectId} from "@abflags/shared";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('environment')
export class EnvironmentEntity implements IEnvironment {
  @PrimaryGeneratedColumn('uuid')
  _id?: string;
  @Column({name: 'name', length: 64})
  name: string;
  @Column({name: 'project_id', type: 'varchar', length: 64})
  _projectId: string;
  @Column({name: 'identifier', length: 64})
  identifier: string;
  @Column({name: 'parent_id', length: 64, nullable: true})
  _parentId: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;
}
