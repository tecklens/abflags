import { ConditionGroupState } from '@client/components/condition/types/variable';
import ConditionGroup from '@client/components/condition/condition-group';
import { useProject } from '@client/lib/store/projectStore';
import { useAuth } from '@client/context/auth';
import { useEffect } from 'react';

interface StrategyConditionProps {
  value: ConditionGroupState,
  onChange: (value: ConditionGroupState) => void
}
export default function StrategyCondition({value, onChange}: StrategyConditionProps) {
  const {token} = useAuth()
  const {variables, fetchVariables} = useProject()

  useEffect(() => {
    fetchVariables({
      page: 0,
      limit: 50
    })
  }, [token])

  return (
    <ConditionGroup
      value={value}
      onChange={onChange}
      variables={variables.data.map((e) => ({
        type: e.type,
        label: e.name,
        id: e._id,
        props: {},
      }))}
    />
  )
}
