import {
  UserEntity,
} from './user';
import {BugReportEntity} from "./bug-report";
import {ApiKeyEntity} from "@repository/api-key";
import {EnvironmentEntity} from "@repository/environment";
import {MemberEntity} from "@repository/member";
import {ProjectEntity} from "@repository/project";
import {FeatureEntity} from "@repository/feature";
import {VariableEntity} from "@repository/variable";

export const entities = [
  UserEntity,
  BugReportEntity,
  ApiKeyEntity,
  EnvironmentEntity,
  MemberEntity,
  ProjectEntity,
  FeatureEntity,
  VariableEntity,
];
