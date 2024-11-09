import {Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ICustomer} from "@abflags/shared";

@Entity('customer_insights')
export class CustomerInsightsEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({name: 'project_id', length: 64})
  projectId: string;
  @Column({name: 'total_user', type: 'int'})
  totalUser: number;

  @Column({name: 'hour', length: 32})
  hour: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt?: Date;
}
