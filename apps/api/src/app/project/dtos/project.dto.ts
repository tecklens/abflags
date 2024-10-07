import {IBrand, IProject, IUser, ProjectId, ProjectMode} from "@abflags/shared";

export class ProjectDto implements IProject{
  _id: ProjectId;
  archivedAt: Date;
  branding: IBrand;
  createdAt: Date;
  createdBy: string;
  defaultLocale: string;
  description: string;
  domain: string;
  externalId: string;
  health: number;
  mode: ProjectMode;
  name: string;
  owner: IUser;
  updatedAt: Date;
  updatedBy: string;
}
