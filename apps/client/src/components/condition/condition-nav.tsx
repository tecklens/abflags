import {Tabs, TabsList, TabsTrigger} from "@client/components/ui/tabs";
import {Button} from "@client/components/custom/button";
import {IconPlus} from "@tabler/icons-react";

interface ConditionNavProps {
  operator: 'and' | 'or';
  onChangeOperator: (o: 'and' | 'or') => void;
  addRule: () => void;
  addGroup: () => void;
  readonly?: boolean;
}

export default function ConditionNav({operator, onChangeOperator, addRule, addGroup, readonly}: ConditionNavProps) {
  return (
    <div className={'flex justify-between items-center'}>
      <Tabs value={operator} onValueChange={(v: any) => onChangeOperator(v)}
            className={'flex flex-col space-y-1 text-xs h-7'}>
        <TabsList className={'py-0'}>
          <TabsTrigger value='and' className={'flex-1 text-xs py-0.5'}>AND</TabsTrigger>
          <TabsTrigger value='or' className={'flex-1 text-xs py-0.5'}>OR</TabsTrigger>
        </TabsList>
      </Tabs>

      {readonly
        ? null
        : <div className={'flex gap-2'}>
        <Button size={'sm'} type={'button'} className={'py-0 h-6'} onClick={() => addRule()}>
          <IconPlus size={14}/>
          <span>Add rule</span>
        </Button>
        <Button size={'sm'} type={'button'} className={'py-0 h-6'} onClick={() => addGroup()}>
          <IconPlus size={14}/>
          <span>Add group</span>
        </Button>
      </div>}
    </div>
  )
}
