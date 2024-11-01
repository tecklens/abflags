import {ConditionRuleState, Operator} from "@abflags/shared";
import {cleanValues} from "../util";

export const InOperator = (constraint: ConditionRuleState, clientValue: string | undefined) => {
  const field = constraint.variable;

  if (!Array.isArray(constraint.value)) return false;

  const values = cleanValues(constraint.value);

  const isIn = values.some((val) => val === clientValue);

  return constraint.operator === Operator.IN ? isIn : !isIn;
};
