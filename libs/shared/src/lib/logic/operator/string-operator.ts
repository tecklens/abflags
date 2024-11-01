import {Operator} from "./index";
import {InOperator} from "./in-operator";
import {ConditionRuleState} from "../../types";

export const StringOperator = (constraint: ConditionRuleState, clientValue: string | undefined) => {
  const { operator, value } = constraint;

  if (operator === Operator.IN || operator === Operator.NOT_IN) {
    return InOperator(constraint, clientValue)
  }

  if (typeof clientValue !== 'string') {
    return false;
  }

  if (operator === Operator.IS_EQUAL_TO) {
    return clientValue === value;
  }
  if (operator === Operator.IS_NOT_EQUAL_TO) {
    return clientValue !== value;
  }

  if (operator === Operator.MORE_THAN) {
    return clientValue > (value ?? '');
  }
  if (operator === Operator.MORE_THAN_EQUAL) {
    return clientValue >= (value ?? '');
  }
  if (operator === Operator.LESS_THAN) {
    return clientValue < (value ?? '');
  }
  if (operator === Operator.LESS_THAN_EQUAL) {
    return clientValue <= (value ?? '');
  }
  return false;

  return false;
};
