export * from './variable-default'
import { ProjectId } from '../../types';

export type VariableType = 'number' | 'select' | 'string' | 'date';

export interface IVariable {
  _id: string;
  _projectId: ProjectId;

  type: VariableType;
  name: string;
  defaultValue: string;
  isDefault: boolean;
  required: boolean;

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
