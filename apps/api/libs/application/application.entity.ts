import {IApplication, ProjectId} from "@abflags/shared";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";

@Entity('application')
@Unique(["_projectId", "appName"])
export class ApplicationEntity implements IApplication {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({name: 'project_id', type:'varchar', length: 64})
  _projectId: ProjectId;

  @Column({name: 'app_name', length: 32, type: 'varchar'})
  appName: string;
  @Column({name: 'color', length: 16, type: 'varchar', nullable: true})
  color?: string;
  @Column({name: 'description', length: 128, type: 'varchar', nullable: true})
  description?: string;
  @Column({name: 'icon', length: 128, type: 'varchar', nullable: true})
  icon?: string;
  @Column({name: 'strategies', type: 'simple-array', nullable: true})
  strategies?: string[];
  @Column({name: 'url', length: 128, type: 'varchar', nullable: true})
  url?: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'created_by', nullable: true, length: 64})
  createdBy: string;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
  @Column({name: 'updated_by', nullable: true, length: 64})
  updatedBy: string;
}
