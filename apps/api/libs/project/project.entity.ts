import {IBrand, IProject, ProjectMode} from "@abflags/shared";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {UserEntity} from "@repository/user";

@Entity('project')
export class ProjectEntity implements IProject {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column({name: 'branding', type: 'simple-json', nullable: true})
  branding: IBrand;
  @Column({name: 'default_locale', length: 64, nullable: true})
  defaultLocale: string;
  @Column({name: 'domain', length: 64, nullable: true})
  domain: string;
  @Column({name: 'external_id', length: 64, nullable: true})
  externalId: string;
  @Column({name: 'name', length: 64, unique: true})
  name: string;
  @Column({name: 'description', length: 64, nullable: true})
  description: string;
  @Column({name: 'mode', type: 'enum', enum: ProjectMode, nullable: true})
  mode: ProjectMode;

  @Column({name: 'archived_at', nullable: true, type: 'datetime'})
  archivedAt: Date;

  @Column({name: 'health', type: 'float', nullable: true, default: 0})
  health: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{name: 'created_by', referencedColumnName: '_id'}])
  owner: UserEntity;
}
