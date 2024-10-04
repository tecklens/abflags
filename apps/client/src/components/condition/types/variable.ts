export type ConditionRuleType = 'text' | 'email' | 'password' | 'number' | 'select';
export type ConditionVariable = {
  id: string;
  label: string;
  type: 'number',
  props: ConditionNumberProps;
} | {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password',
  props: ConditionStringProps;
} | {
  id: string;
  label: string;
  type: 'select',
  props: ConditionSelectProps;
}

export type ConditionNumberProps = {
  min?: number;
  max?: number;
  placeholder?: string;
  defaultValue?: number;
  errorMessage?: string;
}

export type ConditionStringProps = {
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
}

export type ConditionSelectValueProps = {
  value: string;
  label: string;
}

export type ConditionSelectProps = {
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
  options: ConditionSelectValueProps[];
}

export type ConditionRuleState = {
  variable: string;
  operator: string;
  value?: string;
  id: string;
}

export type ConditionGroupState = {
  id?: string;
  operator: 'and' | 'or',
  rules: ConditionRuleState[],
  groups: ConditionGroupState[]
}