import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import React, { memo } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Button } from '@client/components/custom/button';
import { Input } from '@client/components/ui/input';
import {
  ConditionNumberProps,
  ConditionRuleState,
  ConditionRuleType,
  ConditionVariable,
} from './types/variable';
import { isNaN } from 'lodash';
import { DateTimePicker } from '@client/components/ui/datetime-picker';
import { Tag, TagInput } from 'emblor';

const operators: { type: ConditionRuleType; value: string[] }[] = [
  {
    type: 'number',
    value: [
      'is equal to',
      'is not equal to',
      'contains',
      'not contain',
      'is empty',
      'is not empty',
      '>',
      '<',
      '>=',
      '<=',
    ],
  },
  {
    type: 'select',
    value: ['is equal to', 'is not equal to', '>', '<', '>=', '<='],
  },
  {
    type: 'text',
    value: ['is equal to', 'is not equal to', 'contains', '>', '<', '>=', '<='],
  },
  {
    type: 'string',
    value: ['is equal to', 'is not equal to', 'contains', '>', '<', '>=', '<='],
  },
  {
    type: 'date',
    value: ['is equal to', 'is not equal to', '>', '<', '>=', '<='],
  },
];

interface ConditionRuleProps {
  rule: ConditionRuleState;
  onChange: (rule: ConditionRuleState) => void;
  variables: ConditionVariable[];
  isValidTree: boolean;
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
}

const ConditionRuleValue = memo(
  ({ value, onChange, inputProps, operator }: ConditionRuleValueProps) => {
    const props: any = inputProps?.props;

    if (inputProps?.type === 'number') {
      if (operator === 'contains') {
        return (
          <TagInput
            maxTags={10}
            activeTagIndex={0}
            setActiveTagIndex={() => {}}
            placeholder="Enter a value"
            tags={value ?? []}
            className="w-full"
            size={'md'}
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
            placeholder={inputProps?.props?.placeholder ?? 'Please enter input'}
            value={value}
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
        <Select key={value} value={value} onValueChange={onChange}>
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
          value={value}
          onChange={onChange}
          className={'py-0 h-7 w-fit'}
        />
      );
    }

    if (inputProps?.type === 'string' || inputProps?.type === 'text') {
      if (operator === 'contains') {
        return (
          <TagInput
            maxTags={10}
            activeTagIndex={0}
            setActiveTagIndex={() => {}}
            placeholder="Enter a value"
            tags={value ?? []}
            className="w-full"
            size={'sm'}
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
            placeholder={props?.placeholder ?? 'Please enter input'}
            className={'h-7'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }

    return <div />;
  },
);

export default function ConditionRule({
  rule,
  onChange,
  variables,
  isValidTree = true,
}: ConditionRuleProps) {
  const variable = variables.find((f) => f.id === rule?.variable);

  const ops = operators.find((f) => f.type === variable?.type);

  return (
    <div className={'p-1 flex flex-col gap-0.5 rounded shadow ml-2'}>
      <div className={'flex items-center gap-2 w-full'}>
        <div className={'flex-1 flex gap-2'}>
          <Select
            value={rule?.variable}
            onValueChange={(v) => {
              onChange({
                ...rule,
                variable: v,
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
                  <SelectItem key={e.id} value={e.id}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
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
                <SelectLabel>contains</SelectLabel>
                {ops?.value?.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <ConditionRuleValue
            operator={rule.operator}
            inputProps={variable}
            onChange={(v) => {
              onChange({
                ...rule,
                value: v,
              });
            }}
            value={rule.value}
          />
        </div>
        <Button size={'icon'} className={'py-0 h-7 w-7'}>
          <IconTrash color={'red'} size={15} />
        </Button>
      </div>
      <ConditionRuleErrorMessage rule={rule} isValidTree={isValidTree} />
    </div>
  );
}
