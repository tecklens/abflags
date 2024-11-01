import {Operator} from "./index";
import {InOperator} from "./in-operator";
import {ConditionRuleState} from "../../types";

export const NumberOperator = (constraint: ConditionRuleState, clientValue: string | undefined) => {
  const field = constraint.variable;
  const { operator } = constraint;

  if (operator === Operator.IN || operator === Operator.NOT_IN) {
    return InOperator(constraint, clientValue)
  }

  const value = Number(constraint.value);
  const contextValue = Number(clientValue);

  if (Number.isNaN(value) || Number.isNaN(contextValue)) {
    return false;
  }

  if (operator === Operator.IS_EQUAL_TO) {
    return contextValue === value;
  }
  if (operator === Operator.IS_NOT_EQUAL_TO) {
    return contextValue !== value;
  }
  if (operator === Operator.MORE_THAN) {
    return contextValue > value;
  }
  if (operator === Operator.MORE_THAN_EQUAL) {
    return contextValue >= value;
  }
  if (operator === Operator.LESS_THAN) {
    return contextValue < value;
  }
  if (operator === Operator.LESS_THAN_EQUAL) {
    return contextValue <= value;
  }
  return false;
};
