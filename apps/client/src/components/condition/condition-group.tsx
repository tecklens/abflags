import {DragDropContext} from "react-beautiful-dnd";
import ConditionRule from "./condition-rule";
import {ConditionGroupState, ConditionRuleType, ConditionVariable} from "./types/variable";
import ConditionNav from "./condition-nav";
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';

const defaultRule = {
  variable: '',
  value: undefined,
  operator: 'is equal to',
}

interface ConditionGroupProps {
  value?: ConditionGroupState,
  onChange: (v: ConditionGroupState) => void,
  variables: ConditionVariable[],
  isValidTree?: boolean;
}

export default function ConditionGroup({
                                         value = {
                                           operator: 'and',
                                           rules: [{
                                             ...defaultRule,
                                             id: 'abd',
                                           }],
                                           groups: [],
                                         },
                                         onChange,
                                         variables,
                                         isValidTree = true,
                                       }: ConditionGroupProps) {

  const rulesSchema = z.array(
    z.object({
      variable: z.custom<ConditionRuleType>(),
      value: z.any(),
      operator: z.string(),
    })
  ).optional();

  const checkValid = (v: ConditionGroupState) => {
    const valid = rulesSchema.safeParse(v?.rules)

    return valid.success
  }
  const onDragEnd = () => {
    console.log('drag end');
  }

  const prevOnChange = (v: ConditionGroupState) => {
    if (checkValid(v))
      onChange(v)
  }

  return (
    <div className={'w-full border p-2 flex flex-col gap-2 rounded'}>
      <ConditionNav
        operator={value.operator}
        onChangeOperator={(o) => {
          prevOnChange({
            ...value,
            operator: o,
          })
        }}
        addRule={() => {
          prevOnChange({
            ...value,
            rules: [...(value.rules ?? []), {
              ...defaultRule,
              id: uuidv4()
            }]
          })
        }}
        addGroup={() => {
          prevOnChange({
            ...value,
            groups: [...(value.groups ?? []), {
              id: uuidv4(),
              operator: 'and',
              rules: [{
                ...defaultRule,
                id: uuidv4(),
              }],
              groups: []
            }]
          })
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {value?.rules?.map(e => (
          <ConditionRule
            isValidTree={isValidTree}
            variables={variables}
            key={e.id}
            rule={e}
            onChange={(newRule) => {
              prevOnChange({
                ...value,
                rules: value?.rules?.map(f => f.id === e.id ? newRule : f)
              })
            }}/>
        ))}
        {value?.groups?.map((e, idx) => (
          <ConditionGroup variables={variables} value={e} onChange={(v) => {
            prevOnChange({
              ...value,
              groups: value?.groups ? value.groups.map(e => e.id === v.id ? v : e) : []
            })
          }} key={idx}/>
        ))}
      </DragDropContext>
    </div>
  )
}
