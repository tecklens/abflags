import {FeatureBehavior, FeatureStatus, FeatureType} from "@abflags/shared";

export class FeatureDto {
  _id: string;
  name: string;

  status: FeatureStatus;
  behavior: FeatureBehavior;

  tags?: string[];

  _projectId?: string;

  type?: FeatureType;
}
