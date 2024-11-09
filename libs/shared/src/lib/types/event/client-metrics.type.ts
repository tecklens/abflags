export interface IClientMetricsEnvKey {
  featureName: string;
  appName: string;
  environmentId: string;
  createdAt: Date;
  os?: string;
  environment?: string;
}

export interface IClientMetricsEnv extends IClientMetricsEnvKey {
  yes: number;
  no: number;
}
