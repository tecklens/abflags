import {FeatureId, ProjectId} from "../../types";

export interface IVariable {
  _id: string
  _projectId: ProjectId;
  _featureId: FeatureId;


  type: string;
  name: string;
  defaultValue: string;
  isDefault: boolean
  required: boolean;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
