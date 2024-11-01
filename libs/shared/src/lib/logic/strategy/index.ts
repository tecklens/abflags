import {DateOperator, NumberOperator, StringOperator} from "../operator";
import {IFeature, IFeatureStrategy, IVariable} from "../../entities";
import {Context} from "../context";
import {TinyEmitter} from "tiny-emitter";
import {EVENTS} from "../util";
import {ConditionGroupState, ConditionRuleState, ConditionRuleType} from "../../types";
import {get, reduce} from "lodash";

export type StrategyResult = { enabled: true; } | { enabled: false };

export class Strategy extends TinyEmitter {
  public name: string;

  private readonly returnValue: boolean;
  private warnedStrategies: Record<string, boolean>;

  constructor(name: string, returnValue: boolean = false) {
    super();
    this.name = name || 'unknown';
    this.returnValue = returnValue;
    this.warnedStrategies = {};
  }

  checkRule(rule: ConditionRuleState, type: ConditionRuleType, clientValue: string | undefined) {
    let evaluator;
    if (type === 'string' || type === 'select') {
      evaluator = StringOperator
    } else if (type === 'number') {
      evaluator = NumberOperator
    } else if (type === 'date') {
      evaluator = DateOperator
    } else {
      return false;
    }

    if (!evaluator) {
      return false;
    }

    return evaluator(rule, clientValue);
  }

  checkConstraints(variables: IVariable[], conditions: ConditionGroupState, clientValue: any): boolean {
    if (!conditions) {
      return true;
    }

    if (!clientValue) return false;

    const {operator, rules, groups} = conditions;

    const ruleCheck = reduce(rules, (rlt, e) => {
      const variable = variables.find(f => f.name === e.variable);
      if (variable) {
        const value = get(clientValue, variable.name)
        return operator === 'and'
          ? (rlt && this.checkRule(e, variable.type, value))
          : (rlt || this.checkRule(e, variable.type, value))
      } else return rlt
    }, operator === 'and')

    const groupCheck = reduce(groups, (rlt, e) => {
        return operator === 'and'
          ? (rlt && this.checkConstraints(variables, clientValue, e))
          : (rlt || this.checkConstraints(variables, clientValue, e))
    }, operator === 'and')

    return operator === 'and' ? (ruleCheck && groupCheck) : (ruleCheck || groupCheck);
  }

  isFeatureEnabled(
    variables: IVariable[],
    feature: IFeature | undefined,
    context: Context,
    fallback: Function,
  ): StrategyResult {
    if (!feature) {
      return {enabled: fallback()};
    }

    if (!Array.isArray(feature.strategies)) {
      const msg = `Malformed feature, strategies not an array, is a ${typeof feature.strategies}`;
      this.emit(EVENTS.ERROR, new Error(msg));
      return {enabled: false};
    }

    /**
     * if feature not have strategy is always true
     */
    if (feature.strategies.length === 0) {
      return {enabled: true} as StrategyResult;
    }

    let strategyResult: StrategyResult = {enabled: false};

    const clientValue = {
      ...context,
      ...context.properties
    }

    delete clientValue.properties;
    feature.strategies?.some((strategy): boolean => {
      const enabled = this.checkConstraints(variables, strategy.conditions, clientValue);

      if (enabled) {
        strategyResult = {enabled: true};
        return true;
      }
      return false;
    })

    return strategyResult;
  }

  warnStrategyOnce(
    missingStrategy: string,
    name: string,
    strategies: IFeatureStrategy[],
  ) {
    if (!this.warnedStrategies[missingStrategy + name]) {
      this.warnedStrategies[missingStrategy + name] = true;
      this.emit(
        EVENTS.WARN,
        `Missing strategy "${missingStrategy}" for toggle "${name}". Ensure that "${strategies
          .map(({name: n}) => n)
          .join(', ')}" are supported before using this toggle`,
      );
    }
  }
}
