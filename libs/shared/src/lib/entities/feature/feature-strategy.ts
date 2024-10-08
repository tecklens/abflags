import {FeatureId, FeatureStrategyId, FeatureStrategyStatus} from "../../types";

export interface IFeatureStrategy {
  _id: FeatureStrategyId;
  name: string;
  description?: string;
  status: FeatureStrategyStatus;
  featureId: FeatureId;

  percentage: number;

  sortOrder: number;

  conditions?: any;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
