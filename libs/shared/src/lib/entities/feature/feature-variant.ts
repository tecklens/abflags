import {FeatureId, FeatureStrategyId, FeatureStrategyStatus} from "../../types";

export interface IFeatureVariant {
  _id: FeatureStrategyId;
  name: string;
  description?: string;
  featureId: FeatureId;
  percentage: number;

  conditions?: any;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
