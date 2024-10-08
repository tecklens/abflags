export * from './feature-health.interface'
export * from './feature-strategy'
import {EnvironmentId, FeatureBehavior, FeatureId, FeatureStatus, FeatureType, ProjectId} from "../../types";

export interface IFeature {
  _id: FeatureId;
  name: string;
  description?: string;

  status: FeatureStatus;
  type: FeatureType;
  behavior: FeatureBehavior;
  _environmentId: EnvironmentId;
  _projectId: ProjectId;

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  archivedAt?: Date;
}
