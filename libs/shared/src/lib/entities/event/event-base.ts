import { EnvironmentId, IEventType, ProjectId } from '../../types';

export interface IBaseEvent {
  type: IEventType;
  data?: any;
  preData?: any;
  featureName: string;
  _projectId: ProjectId;
  _environmentId: EnvironmentId;

  tags: string[];
}
