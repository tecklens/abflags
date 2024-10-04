import {EnvironmentId, FeatureBehavior, FeatureId, FeatureStatus, ProjectId} from "../../types";

export interface IFeature {
  _id: FeatureId;
  name: string;
  description?: string;

  status: FeatureStatus;
  behavior: FeatureBehavior;
  _environmentId: EnvironmentId;
  _projectId: ProjectId;

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
