import { VariableType } from '@abflags/shared';

export const variableDefault: {
  type: VariableType,
  isDefault: boolean,
  required: boolean,
  name: string,
}[] = [
  {
    type: 'string',
    isDefault: true,
    required: true,
    name: 'userId',
  },
  {
    type: 'date',
    isDefault: true,
    required: false,
    name: 'currentTime',
  },
];
