import { EnvironmentId } from '../../types';

export interface IClientMetric {
  featureName: string;
  appName: string;
  environmentId: EnvironmentId;
  createdAt: Date;
  count: number;
  yes: number;
  no: number;
}
