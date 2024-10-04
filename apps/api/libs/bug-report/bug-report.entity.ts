import {BugReportId, IBugReport, UserId} from '@abflags/shared';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('bug-report')
export class BugReportEntity implements IBugReport {
  @PrimaryGeneratedColumn('uuid')
  id?: BugReportId;
  @Column({name: 'title', length: 128})
  title: string;
  @Column({name: 'description', length: 128})
  description: string;
  @Column({name: 'ip', length: 64})
  ip: string;
  @Column({name: 'user_id', type: 'varchar', length: 64})
  _userId: UserId;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
}
