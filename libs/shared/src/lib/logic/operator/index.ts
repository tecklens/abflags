import {ConditionRuleType} from "../../types";

export * from './number-operator'
export * from './string-operator'
export * from './date-operator'
export * from './in-operator'
export enum Operator {
  IS_EQUAL_TO = 'is equal to',
  IS_NOT_EQUAL_TO = 'is not equal to',
  IN = 'in',
  NOT_IN = 'not in',
  MORE_THAN = '>',
  MORE_THAN_EQUAL = '>=',
  LESS_THAN = '<',
  LESS_THAN_EQUAL = '<=',
}
