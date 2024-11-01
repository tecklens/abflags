import {
  UserEntity,
} from './user';
import {BugReportEntity} from "./bug-report";
import {ApiKeyEntity} from "@repository/api-key";
import {EnvironmentEntity} from "@repository/environment";
import {MemberEntity} from "@repository/member";
import {ProjectEntity} from "@repository/project";
import {FeatureEntity, FeatureHealthEntity, FeatureStrategyEntity, FeatureVariantEntity} from "@repository/feature";
import {VariableEntity} from "@repository/variable";
import { EventEntity } from '@repository/event';
import { LastSeenAtMetricsEntity } from '@repository/last-seen-at-metrics';
import { ClientMetricDailyEntity, ClientMetricEntity } from '@repository/client-metric';
import {ProjectStatsEntity} from "@repository/project-stats";
import {ApplicationEntity} from "@repository/application";

export const entities = [
  UserEntity,
  BugReportEntity,
  ApiKeyEntity,
  EnvironmentEntity,
  MemberEntity,
  ProjectEntity,
  ProjectStatsEntity,
  FeatureEntity,
  VariableEntity,
  EventEntity,
  LastSeenAtMetricsEntity,
  ClientMetricEntity,
  ClientMetricDailyEntity,
  FeatureHealthEntity,
  ApplicationEntity,
  FeatureStrategyEntity,
  FeatureVariantEntity,
];
