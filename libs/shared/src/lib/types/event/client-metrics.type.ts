export interface IClientMetricsEnvKey {
  featureName: string;
  appName: string;
  environmentId: string;
  createdAt: Date;
}

export interface IClientMetricsEnv extends IClientMetricsEnvKey {
  yes: number;
  no: number;
}
