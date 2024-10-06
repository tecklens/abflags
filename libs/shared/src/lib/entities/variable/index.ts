import { ProjectId } from '../../types';

export type VariableType = 'string' | 'number' | 'text' | 'email' | 'password' | 'select' | 'date';

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
