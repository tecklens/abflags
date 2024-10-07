import {EnvironmentId, FeatureId, ProjectId} from "../../types";

export interface IFeatureHealthInterface {
  errorId: string;
  featureId: FeatureId;
  projectId?: ProjectId;
  environmentId?: EnvironmentId;

  statusCode: number;
  message: string;

  createdAt: Date;
}
