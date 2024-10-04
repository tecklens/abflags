import {ProjectId} from "../../types";

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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  externalId?: string;
}
