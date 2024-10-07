export * from './event-base'
export * from './last-seen-at-metrics'
import { IEventType } from '../../types';
import { EnvironmentId, ProjectId } from '@abflags/shared';

export interface IEvent {
  _id: string;
  type: IEventType;

  data?: any;
  preData?: any;
  featureId?: string;

  _projectId: ProjectId;

  _environmentId: EnvironmentId;

  tags?: string[];

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
