import {ProjectId} from "../../types";

export interface IApplication {
  _id?: string;
  _projectId: ProjectId;

  appName: string;
  description?: string;

  strategies?: string[];
  url?: string;
  color?: string;
  icon?: string;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
