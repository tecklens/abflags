import {IFeature} from "@abflags/shared";
import {formatCreatedDate} from "@client/lib/utils";
import {IconArrowsExchange, IconEdit} from "@tabler/icons-react";
import {Card, CardContent, CardHeader} from "@client/components/ui/card";
import {FEATURE_TYPES} from "./feature-types";

interface FeatureTypeProps {
  className?: string;
  feature: IFeature;
}

export default function FeatureType(props: FeatureTypeProps) {
  const type = FEATURE_TYPES.find(e => e.id === props.feature.type)

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
          <span></span>
        </div>
        <div className="flex justify-between w-full">
          <span>Description:</span>
          <div className="inline-flex gap-1 items-center">
            <span>{props.feature?.description}</span>
            <IconEdit className="cursor-pointer" size={15}/>
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
