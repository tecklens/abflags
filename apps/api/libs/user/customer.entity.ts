import {Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ICustomer} from "@abflags/shared";

@Entity('customer')
export class CustomerEntity implements ICustomer {
  @PrimaryColumn({name: 'user_id', length: 64})
  userId: string;
  @Column({name: 'environment_id', length: 64})
  environmentId: string;
  @Column({name: 'project_id', length: 64})
  projectId: string;
  @Column({name: 'feature_name', length: 64, nullable: true})
  featureName: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
