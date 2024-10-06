export interface IClientMetricsEnvKey {
    featureId: string;
    appName: string;
    environmentId: string;
    createdAt: Date;
}

export interface IClientMetricsEnv extends IClientMetricsEnvKey {
    yes: number;
    no: number;
}
