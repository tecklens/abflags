import { EnvironmentId } from '../../types';

export interface IClientMetric {
  id: string;
  featureName: string;
  appName: string;
  environmentId: EnvironmentId;
  start: Date;
  end: Date;
  createdAt: Date;
  yes: number;
  no: number;
}
