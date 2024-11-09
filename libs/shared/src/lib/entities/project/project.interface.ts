import {ProjectId, ProjectMode, UserId} from "../../types";
import {IUser} from "../user";

export interface IBrand {
  color: string;
  logo: string;
  fontColor?: string;
  fontFamily?: string;
  contentBackground?: string;
}

export interface IProject {
  _id: ProjectId;
  name: string;
  description?: string;
  branding?: IBrand;
  defaultLocale?: string;
  domain?: string;

  archivedAt: Date;
  health: number;
  mode?: ProjectMode;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  externalId?: string;

  owner?: IUser;

  totalFlags?: number;
}

export interface IProjectStats {
  _projectId?: ProjectId;
  avgTimeToProdCurrentWindow?: number;
  featuresCreatedCurrentWindow: number;
  featuresCreatedPastWindow: number;
  featuresArchivedCurrentWindow: number;
  featuresArchivedPastWindow: number;
  projectChangesCurrentWindow: number;
  projectChangesPastWindow: number;
  projectMembersAddedCurrentWindow: number;
}

export interface ICalculateStatus {
  projectId: string;
  updates: IProjectStats;
}

export interface ICreateEnabledDates {
  created: Date;
  enabled: Date;
}

export interface IProjectInsight {
  stats: IProjectStats;
  name: string;
  description: string;
  mode: ProjectMode;
  health: number;
  updatedAt: Date;
  archivedAt: Date;
  createdAt: Date;
  onboardingStatus: {status: string},
  featureTypeCounts: {type: string; cnt: string}[],
  version: number;
}
