import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import React, {memo} from 'react';
import {IconCopy, IconTrash} from '@tabler/icons-react';
import {Button} from '@client/components/custom/button';
import {Input} from '@client/components/ui/input';
import {ConditionRuleState, ConditionRuleType, ConditionVariable, Operator,} from '@abflags/shared';
import {isNaN} from 'lodash';
import {DateTimePicker} from '@client/components/ui/datetime-picker';
import {TagInput} from 'emblor';
import {Badge} from "@client/components/ui/badge";
import {useToast} from "@client/components/ui/use-toast";
import copy from "copy-to-clipboard";

const operators: { type: ConditionRuleType; value: string[] }[] = [
  {
    type: 'number',
    value: [
      Operator.IS_EQUAL_TO,
      Operator.IS_NOT_EQUAL_TO,
      Operator.IN,
      Operator.NOT_IN,
      Operator.MORE_THAN,
      Operator.LESS_THAN,
      Operator.MORE_THAN_EQUAL,
      Operator.LESS_THAN_EQUAL,
    ],
  },
  {
    type: 'select',
    value: [
      Operator.IS_EQUAL_TO,
      Operator.IS_NOT_EQUAL_TO,
      Operator.MORE_THAN,
      Operator.LESS_THAN,
      Operator.MORE_THAN_EQUAL,
      Operator.LESS_THAN_EQUAL
    ],
  },
  {
    type: 'string',
    value: [
      Operator.IS_EQUAL_TO,
      Operator.IS_NOT_EQUAL_TO,
      Operator.IN,
      Operator.MORE_THAN,
      Operator.LESS_THAN,
      Operator.MORE_THAN_EQUAL,
      Operator.LESS_THAN_EQUAL
    ],
  },
  {
    type: 'date',
    value: [
      Operator.IS_EQUAL_TO,
      Operator.IS_NOT_EQUAL_TO,
      Operator.MORE_THAN,
      Operator.LESS_THAN,
      Operator.MORE_THAN_EQUAL,
      Operator.LESS_THAN_EQUAL
    ],
  }
];

interface ConditionRuleProps {
  rule: ConditionRuleState;
  onChange: (rule: ConditionRuleState) => void;
  variables: ConditionVariable[];
  isValidTree: boolean;
  readonly?: boolean;
  onRemove: () => void
}

const ConditionRuleErrorMessage = ({
                                     isValidTree,
                                     rule,
                                   }: {
  isValidTree: boolean;
  rule: ConditionRuleState;
}) => {
  return (
    <div className={`${isValidTree ? 'flex' : 'hidden'} text-xs text-red-500`}>
      {!rule?.variable
        ? 'Please select variable'
        : !rule.value
          ? 'Please input value'
          : null}
    </div>
  );
};

interface ConditionRuleValueProps {
  value: any;
  onChange: (v: any) => void;
  inputProps?: ConditionVariable;
  operator?: string;
  readonly?: boolean;
}

const ConditionRuleValue = memo(
  ({value, onChange, inputProps, operator, readonly}: ConditionRuleValueProps) => {
    const props: any = inputProps?.props;

    if (inputProps?.type === 'number') {
      if (operator === Operator.IN || operator === Operator.NOT_IN) {
        return (
          <TagInput
            maxTags={20}
            activeTagIndex={0}
            setActiveTagIndex={() => {
            }}
            placeholder="Enter a value"
            tags={value ?? []}
            className="w-full"
            size={'md'}
            disabled={readonly}
            setTags={(newTags) => {
              onChange(newTags ?? []);
            }}
          />
        );
      }
      return (
        <div>
          <Input
            size={15}
            className={'h-7 min-w-40'}
            type={'number'}
            placeholder={inputProps?.props?.placeholder ?? 'Please enter value'}
            value={value}
            disabled={readonly}
            onChange={(e) => {
              const val = e.target.valueAsNumber;
              if (!e.target.value && e.target.value !== '' && isNaN(val))
                return;
              const min = props?.min ?? Number.MIN_SAFE_INTEGER;
              const max = props?.max ?? Number.MAX_SAFE_INTEGER;
              if (val > max) return;
              if (!e.target.value && e.target.value !== '' && val < min) return;
              onChange(val);
            }}
          />
        </div>
      );
    }

    if (inputProps?.type === 'select') {
      const val = props?.options?.find((f: any) => f.value === value)?.label;
      return (
        <Select key={value} value={value} onValueChange={onChange} disabled={readonly}>
          <SelectTrigger value={value} className="py-0 h-7 w-fit min-w-28">
            <SelectValue placeholder="Select a value">{val}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select one variable</SelectLabel>
              {props?.options?.map((e: any) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    if (inputProps?.type === 'date') {
      return (
        <DateTimePicker
          disabled={readonly}
          value={value}
          onChange={onChange}
          className={'py-0 h-7 w-fit'}
        />
      );
    }

    if (inputProps?.type === 'string') {
      if (operator === Operator.IN) {
        return (
          <TagInput
            maxTags={10}
            activeTagIndex={0}
            setActiveTagIndex={() => {
            }}
            placeholder="Enter a value"
            tags={value ?? []}
            className="w-full"
            size={'sm'}
            disabled={readonly}
            setTags={(newTags) => {
              onChange(newTags ?? []);
            }}
          />
        );
      }
      return (
        <div>
          <Input
            type={inputProps?.type ?? 'text'}
            size={15}
            placeholder={props?.placeholder ?? 'Please enter value'}
            className={'h-7'}
            value={value}
            disabled={readonly}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }

    return <div/>;
  },
);

export default function ConditionRule({
                                        rule,
                                        onChange,
                                        variables,
                                        isValidTree = true,
                                        readonly,
                                        onRemove
                                      }: ConditionRuleProps) {
  const {toast} = useToast()

  const onCopyToClipboard = (url: string) => {
    copy(url);
    toast({
      title: 'Copied to clipboard',
    });
  };
  const variable = variables.find((f) => f.label === rule?.variable);

  const ops = operators.find((f) => f.type === variable?.type);

  return (
    <div className={'p-1 flex flex-col gap-0.5 rounded shadow ml-2'}>
      <div className={'flex items-center gap-2 w-full'}>
        <div className={'flex-1 flex gap-2'}>
          {readonly ?
            <Badge variant={'outline'}>{rule?.variable}</Badge>
            : <Select
              disabled={readonly}
              value={rule?.variable}
              onValueChange={(v) => {
                const variable = variables.find((f) => f.label === v);
                if (variable)
                  onChange({
                    ...rule,
                    variable: v,
                    variableType: variable.type,
                    value: undefined,
                  });
              }}
            >
              <SelectTrigger className="py-0 h-7 w-fit min-w-36">
                <SelectValue placeholder="Select a variable">
                  {variable?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select one variable</SelectLabel>
                  {variables.map((e) => (
                    <SelectItem key={e.id} value={e.label}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>}

          {readonly ?
            <Badge>{rule.operator}</Badge>
            : <Select
              disabled={readonly}
              value={rule.operator}
              onValueChange={(v) => {
                onChange({
                  ...rule,
                  operator: v,
                });
              }}
            >
              <SelectTrigger className="py-0 h-7 w-fit min-w-24">
                <SelectValue placeholder="Select a operator">
                  {rule.operator}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Operator</SelectLabel>
                  {ops?.value?.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>}

          {readonly ?
            <div className={'inline-flex gap-2 items-center'}>
              <Badge
                variant={'secondary'}>{Array.isArray(rule.value) ? rule.value?.map(e => typeof e !== "string" ? e?.text : '')?.toString() : rule.value?.toString()}</Badge>
              <Button
                size={'smallicon'}
                variant={'outline'}
                onClick={() => onCopyToClipboard(
                  (Array.isArray(rule.value)
                    ? rule.value?.map(e => typeof e !== "string" ? e?.text : '')?.toString()
                    : rule.value?.toString()) ?? ''
                )}>
                <IconCopy size={10}/>
              </Button>
            </div>
            : <ConditionRuleValue
              operator={rule.operator}
              readonly={readonly}
              inputProps={variable}
              onChange={(v) => {
                onChange({
                  ...rule,
                  value: v,
                });
              }}
              value={rule.value}
            />}
        </div>
        {readonly ?
          null
          : <Button size={'icon'} className={'py-0 h-7 w-7'} type={'button'} onClick={onRemove}>
            <IconTrash color={'red'} size={15}/>
          </Button>
        }
      </div>
      <ConditionRuleErrorMessage rule={rule} isValidTree={isValidTree}/>
    </div>
  );
}
