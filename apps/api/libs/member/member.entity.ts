import {IMember, IMemberInvite, MemberRoleEnum, MemberStatusEnum, ProjectId} from "@abflags/shared";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('member')
export class MemberEntity implements IMember {
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  @Column({name: 'user_id', length: 64})
  _userId: string;

  @Column({name: 'user', length: 64, nullable: true})
  user?: string;

  @Column({name: 'roles', type: 'simple-array', nullable: true})
  roles: string[];

  @Column({name: 'invite', type: 'simple-json', nullable: true})
  invite?: IMemberInvite;

  @Column({name: 'member_status', type: 'enum', enum: MemberStatusEnum})
  memberStatus: MemberStatusEnum;
  @Column({name: 'project_id', length: 64})
  _projectId: string;
  @Column({name: 'is_default', type: "boolean", nullable: true})
  isDefault: boolean;

  @CreateDateColumn({name: 'created_at', type: 'datetime'})
  createdAt: Date;
  @UpdateDateColumn({name: 'updated_at', type: 'datetime'})
  updatedAt: Date;
}
