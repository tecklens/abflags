import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {IUser, IUserResetTokenCount, UserId, UserPlan, UserStatus} from '@abflags/shared';

@Entity('user')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  _id: UserId;

  @Column({name: 'first_name', length: 64, nullable: true})
  firstName: string;

  @Column({name: 'last_name', length: 64, nullable: true})
  lastName: string;

  @Column({name: 'email', length: 256})
  email: string;

  @Column({name: 'username', length: 64, nullable: true})
  username: string;

  @Column({name: 'profile_picture', length: 256, nullable: true})
  profilePicture: string;

  @Column({name: 'password', length: 256, nullable: true})
  password: string;

  @Column({name: 'job_title', length: 256, nullable: true})
  jobTitle: string;

  @Column({name: 'bio', length: 256, nullable: true})
  bio: string;

  @Column({name: 'urls', type: 'simple-array', nullable: true})
  urls: string[];

  @Column({name: 'plan', enum: UserPlan, type: 'enum', default: UserPlan.free})
  plan: UserPlan;
  @Column({name: 'status', enum: UserStatus, type: 'enum', default: UserStatus.ACTIVE})
  status: UserStatus;

  @Column({name: 'billing_code', length: 64, nullable: true})
  billingCode: string;

  @Column({name: 'phone_number', length: 64, nullable: true})
  phoneNumber: string;

  @Column({name: 'current_store_id', length: 64, nullable: true})
  currentStoreId: string;

  @Column({name: 'change_pass_tx_id', length: 64, nullable: true})
  changePassTxId: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column({name: 'reset_token', length: 64, nullable: true})
  resetToken?: string;

  @Column({name: 'reset_token_date', type: 'datetime', nullable: true})
  resetTokenDate?: Date;

  @Column({name: 'reset_token_count', type: 'simple-json', nullable: true})
  resetTokenCount?: IUserResetTokenCount;

  @Column({name: 'c_p_tx_id', length: 64, type: 'varchar', nullable: true})
  changePasswordTransactionId: string;
  @Column({name: 'show_on_boarding', type: 'boolean', nullable: true})
  showOnBoarding: boolean;
  @Column({name: 'show_on_boarding_tour', nullable: true})
  showOnBoardingTour: number;
  @Column({name: 'billing_guide', nullable: true})
  billingGuide: boolean;
  @Column({name: 'apiKey_guide', nullable: true})
  apiKeyGuide: boolean;
}

export const consumePoints = {
  [UserPlan.free]: 1000000,
  [UserPlan.silver]: 10000,
  [UserPlan.gold]: 1000,
  [UserPlan.diamond]: 100,
};

export const consumeSecondPoints = {
  [UserPlan.free]: 100,
  [UserPlan.silver]: 10,
  [UserPlan.gold]: 1,
  [UserPlan.diamond]: 1,
};
