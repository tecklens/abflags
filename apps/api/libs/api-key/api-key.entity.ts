import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BugReportId, EncryptedSecret, IApiKey} from "@abflags/shared";
import {UserEntity} from "@repository/user";
import {EnvironmentEntity} from "@repository/environment";

@Entity('api_key')
export class ApiKeyEntity implements IApiKey {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({name: 'user_id', length: 64})
  _userId: string;
  @Column({name: 'environment_id', length: 64})
  _environmentId: string;
  @Column({name: 'hash', length: 256, type: 'varchar'})
  hash: string;
  @Index({unique: true})
  @Column({name: 'key', length: 256, type: 'varchar'})
  key: EncryptedSecret | string;

  @ManyToOne(() => UserEntity)
  @JoinColumn([{ name: 'user_id', referencedColumnName: '_id' }])
  user: UserEntity;

  @ManyToOne(() => EnvironmentEntity)
  @JoinColumn([{ name: 'environment_id', referencedColumnName: '_id' }])
  environment: EnvironmentEntity;
}
