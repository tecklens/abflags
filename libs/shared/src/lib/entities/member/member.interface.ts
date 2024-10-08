import {ProjectId, UserId} from "../../types";
import {IUser} from "../user";

export enum MemberStatusEnum {
  NEW = 'new',
  ACTIVE = 'active',
  INVITED = 'invited',
}

export interface IMemberInvite {
  email: string;
  token: string;
  invitationDate: Date;
  answerDate?: Date;
  _inviterId: string;
}

export interface IMember {
  _id: string;

  _userId: UserId;

  user?: IUser;

  roles: string[];

  invite?: IMemberInvite;

  memberStatus: MemberStatusEnum;

  _projectId: ProjectId;

  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}
