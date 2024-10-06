import { EnvironmentId } from '@abflags/shared';

export interface ILastSeenAtMetrics {
  featureName: string;
  environmentId: EnvironmentId;
  lastSeenAt: Date;
}
