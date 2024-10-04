import {UserPlan} from "./user-plan.enum";
import {UserId, UserRateLimitId} from "../../types";

export interface IUser {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  username?: string | null;
  profilePicture?: string | null;
  showOnBoarding?: boolean;
  showOnBoardingTour?: number;
  jobTitle?: string;
  externalId?: string;
  bio?: string | null;
  urls?: string[] | null;

  plan: UserPlan;

  billingGuide?: boolean;
  apiKeyGuide?: boolean;

  resetToken?: string;
  resetTokenDate?: Date;
  resetTokenCount?: IUserResetTokenCount,

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRateLimit {
  _id?: UserRateLimitId;
  _userId: UserId;
  key: string;
  policyId?: string;
  requestCount: number;
  windowStart: Date;

  createdAt?: Date;
}

export interface IUserResetTokenCount {
  reqInMinute: number;
  reqInDay: number;
}
