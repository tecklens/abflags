import { EnvironmentId, ProjectId } from '../types';

export type EnforceProjId = { _projectId: ProjectId };
export type EnforceEnvId = { _environmentId: EnvironmentId };
export type EnforceEnvOrProjIds = EnforceEnvId | EnforceProjId;
