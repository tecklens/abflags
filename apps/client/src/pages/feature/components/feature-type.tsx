import {IFeature} from "@abflags/shared";
import {formatCreatedDate} from "@client/lib/utils";
import {IconEdit} from "@tabler/icons-react";
import {Card, CardContent, CardHeader} from "@client/components/ui/card";
import {FEATURE_TYPES} from "./feature-types";
import {Popover, PopoverContent, PopoverTrigger} from "@client/components/ui/popover";
import {Label} from "@client/components/ui/label";
import {Textarea} from "@client/components/ui/textarea";
import {Button} from "@client/components/custom/button";
import {PopoverClose} from "@radix-ui/react-popover";
import {RepositoryFactory} from "@client/api/repository-factory";
import {useState} from "react";
import {useToast} from "@client/components/ui/use-toast";
import {AxiosResponse, HttpStatusCode} from "axios";
import {NumberParam, useQueryParam, useQueryParams, withDefault} from "use-query-params";

const FeatureRepository = RepositoryFactory.get('feature')

interface FeatureTypeProps {
  className?: string;
  feature: IFeature;
}

export default function FeatureType(props: FeatureTypeProps) {
  const {toast} = useToast()
  const [v, setV] = useQueryParam('v', withDefault(NumberParam, 1));
  const type = FEATURE_TYPES.find(e => e.id === props.feature.type)
  const [text, setText] = useState<string>(props.feature.description ?? '')

  const updateDescription = () => {
    FeatureRepository.updateDescription(props.feature._id, {
      description: text
    })
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          setV(v + 1)
        } else {
          toast({
            variant: 'destructive',
            title: 'Update feature description failed'
          })
        }
      })
  }

  return (
    <Card className={`shadow-lg dark:border rounded-lg flex flex-col gap-2 ${props.className ?? ''}`}>
      <CardHeader className="p-3">
        <div className={'flex gap-3 items-center'}>
          {type?.icon}
          <span className="font-semibold">{type?.label}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm p-3 border-t">
        <div className="flex justify-between w-full">
          <span>Project:</span>
          <span></span>
        </div>
        <div className="flex justify-between w-full">
          <span>Lifecycle:</span>
          <span>Coming Soon</span>
        </div>
        <div className="flex justify-between w-full">
          <span>Description:</span>
          <div className="inline-flex gap-1 items-center">
            <span>{props.feature?.description}</span>
            <Popover>
              <PopoverTrigger asChild>
                <IconEdit className="cursor-pointer" size={15}/>
              </PopoverTrigger>
              <PopoverContent className={'w-80'}>
                <div>
                  <Label>Edit Description</Label>
                  <Textarea value={text} onChange={e => setText(e.target.value)}/>
                  <PopoverClose asChild>
                    <Button className={'w-full mt-2'} onClick={updateDescription}>Update</Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <span>Created at:</span>
          <span>{formatCreatedDate(props.feature?.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
