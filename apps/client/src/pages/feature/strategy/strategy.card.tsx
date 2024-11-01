import {FeatureStrategyStatus, IFeatureStrategy} from "@abflags/shared";
import {Card, CardContent, CardFooter, CardHeader} from "@client/components/ui/card";
import {
  IconArrowRampRight,
  IconCopyPlus,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconTrash
} from "@tabler/icons-react";
import {Button} from "@client/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@client/components/ui/dropdown-menu";
import {RepositoryFactory} from "@client/api/repository-factory";
import {AxiosResponse, HttpStatusCode} from "axios";
import {useToast} from "@client/components/ui/use-toast";
import {useNavigate} from "react-router-dom";
import PieChartMini from "@client/components/custom/pie-chart-mini";
import {Badge} from "@client/components/ui/badge";
import ConditionGroup from "@client/components/condition/condition-group";
import React, {memo} from "react";

const FeatureRepository = RepositoryFactory.get('feature')

const StrategyCard = memo(React.forwardRef(({strategy, onReload, isDragging, onEdit, ...props}: any, ref) => {
  const {toast} = useToast()
  const navigate = useNavigate()
  const disable = () => {
    FeatureRepository.disableStrategy(strategy.featureId, strategy._id)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          toast({
            title: 'Disable strategy successful'
          })

          onReload()
        } else {
          toast({
            title: 'Disable strategy failed'
          })
        }
      })
      .catch(() => {
        toast({
          title: 'Disable strategy failed'
        })
      })
  }

  const enable = () => {
    FeatureRepository.enableStrategy(strategy.featureId, strategy._id)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          toast({
            title: 'Enable strategy successful'
          })

          onReload()
        } else {
          toast({
            title: 'Enable strategy failed'
          })
        }
      })
      .catch(() => {
        toast({
          title: 'Enable strategy failed'
        })
      })
  }

  const deleteStrategy = () => {
    FeatureRepository.deleteStrategy(strategy.featureId, strategy._id)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          toast({
            title: 'Delete strategy successful'
          })

          onReload()
        } else {
          toast({
            variant: 'destructive',
            title: 'Delete strategy failed'
          })
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Delete strategy failed'
        })
      })
  }

  const disabled = strategy.status === FeatureStrategyStatus.INACTIVE

  return (
    <Card ref={ref} {...props} className={`${disabled ? 'bg-gray-100 dark:bg-transparent' : 'bg-white dark:bg-gray-900'}
    ${isDragging ? 'bg-primary/20' : ''}`}>
      <CardHeader className={'p-2'}>
        <div className={'w-full flex gap-3 items-center'}>
          <IconArrowRampRight/>
          <div className={'flex flex-col flex-1'}>
            <span className={'font-semibold'}>Gradual Rollout</span>
            <span>{strategy.name}</span>
          </div>
          {disabled && <Badge variant={'outline'}>disabled</Badge>}
          <div className={'inline-flex gap-1 items-start'}>
            <Button variant={'ghost'} size={'icon'}>
              <IconCopyPlus size={20}/>
            </Button>
            <Button variant={'ghost'} size={'icon'} onClick={onEdit}>
              <IconEdit size={20}/>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                  <IconDotsVertical size={20}/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px]"
              >
                {strategy.status === FeatureStrategyStatus.ACTIVE
                  ? <DropdownMenuItem className={'gap-2'} onClick={disable}>
                    <IconEyeOff size={18}/>
                    <span>Disable</span>
                  </DropdownMenuItem>
                  : <DropdownMenuItem className={'gap-2'} onClick={enable}>
                    <IconEye size={18}/>
                    <span>Enable</span>
                  </DropdownMenuItem>}
                <DropdownMenuItem className={'gap-2'} onClick={deleteStrategy}>
                  <IconTrash size={18}/>
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className={'border-t p-2 flex flex-col gap-2'}>
        <div className={'flex gap-3 items-center w-full border p-2 rounded'}>
          <PieChartMini/>
          <div className={'flex-1 inline-flex gap-2'}>
            <Badge>{strategy.percentage}%</Badge>
            <span>of your base with <b>userId</b> is included</span>
          </div>
        </div>
        <div className={'flex gap-3 items-center w-full'}>
          <ConditionGroup
            value={strategy.conditions ? strategy.conditions[0] : {}}
            onChange={(v) => {
            }}
            variables={[]}
            readonly={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}))

export default StrategyCard
