import {IBrand, IProject} from "@abflags/shared";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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
  @Column({name: 'name', length: 64})
  name: string;
  @Column({name: 'description', length: 64, nullable: true})
  description: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;
}
