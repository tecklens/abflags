import {Operator} from "./index";
import {ConditionRuleState} from "../../types";

export const DateOperator = (constraint: ConditionRuleState, clientValue: string | Date | undefined) => {
  const {operator} = constraint;
  const value = new Date(constraint.value as string);
  const currentTime = new Date(clientValue as string);

  if (operator === Operator.MORE_THAN) {
    return currentTime > value;
  }
  if (operator === Operator.MORE_THAN_EQUAL) {
    return currentTime >= value;
  }
  if (operator === Operator.LESS_THAN) {
    return currentTime < value;
  }
  if (operator === Operator.LESS_THAN_EQUAL) {
    return currentTime <= value;
  }
  return false;
};
