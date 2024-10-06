import { Control, Controller, useFieldArray } from 'react-hook-form';
import StrategyCondition from '@client/pages/feature/strategy/strategy-condition';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { Button } from '@client/components/custom/button';

interface StrategyTargetsProps {
  control: Control<any>;
  register: UseFormRegister<any>;
}

export function StrategyTargets({ control, register }: StrategyTargetsProps) {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: 'targets', // unique name for your Field Array
    },
  );

  const addTarget = () => {
    append({
      operator: 'and',
      rules: [],
      groups: [],
    })
  }
  return (
    <div className={'grid gap-2'}>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`fieldArray.${index}`}
          render={({ field }) => (
            <StrategyCondition value={field.value} onChange={field.onChange} />
          )}
        />
      ))}

      <Button type={'button'} onClick={addTarget}>Add target</Button>
    </div>
  );
}
