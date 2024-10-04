import {FeatureBehavior, FeatureStatus} from "@abflags/shared";

export class FeatureDto {
  _id: string;
  name: string;

  status: FeatureStatus;
  behavior: FeatureBehavior;
}
